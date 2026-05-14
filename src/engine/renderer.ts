// WebGL2 renderer — owns the paint texture, brush stamp pipeline, flood-fill
// pipeline, and composite pass. Ports the Metal `CanvasRenderer.swift` model
// to WebGL2.
//
// Resources:
//   paintTex   — RGBA texture at page.size, FBO-rendered, premultiplied alpha
//   regionTex  — R-channel texture (uploaded as RGBA, sampled by .r) marking
//                which region each pixel belongs to
//   lineartTex — RGBA texture drawn ON TOP of the paint at composite time
//
// Pipelines:
//   stamp     — single brush stamp, blended into paint FBO (SRC_ALPHA + ONE_MINUS_SRC_ALPHA, premultiplied)
//   flood     — fills a target region in the paint FBO
//   composite — draws paper + paint + lineart to the visible canvas

import quadVert from "../shaders/quad.vert.glsl?raw";
import stampFrag from "../shaders/stamp.frag.glsl?raw";
import floodFrag from "../shaders/flood.frag.glsl?raw";
import compositeFrag from "../shaders/composite.frag.glsl?raw";

import {
  buildProgram,
  buildUnitQuad,
  createFramebuffer,
  createTexture2D,
  makeUniformGetter,
} from "./gl.js";
import { type ColoringPage, hexToRgba } from "./page.js";
import { type Brush, hsvToRgb } from "./brush.js";
import { rasterizeLineart, rasterizeRegionIDs } from "./rasterize.js";

export class Renderer {
  readonly gl: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement;

  // Programs
  private stampProgram!: WebGLProgram;
  private floodProgram!: WebGLProgram;
  private compositeProgram!: WebGLProgram;
  private stampU!: (name: string) => WebGLUniformLocation | null;
  private floodU!: (name: string) => WebGLUniformLocation | null;
  private compositeU!: (name: string) => WebGLUniformLocation | null;

  private quad!: WebGLVertexArrayObject;

  // Page resources
  private page!: ColoringPage;
  private paintTex!: WebGLTexture;
  private paintFbo!: WebGLFramebuffer;
  private regionTex!: WebGLTexture;
  private regionCanvas!: HTMLCanvasElement;
  private lineartTex!: WebGLTexture;

  // Brush textures (loaded once, shared across pages)
  private paperGrainTex: WebGLTexture | null = null;
  private shapeTextures = new Map<string, WebGLTexture>();
  private shapeLoadPromises = new Map<string, Promise<WebGLTexture>>();
  private grainTextures = new Map<string, WebGLTexture>();
  private grainLoadPromises = new Map<string, Promise<WebGLTexture>>();

  // Stroke state
  private dragLastX = 0;
  private dragLastY = 0;
  private dragAccumulated = 0;
  private hueCycle = 0;
  private rngState = 0;
  private onRedraw: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: false,
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;
    this.initPrograms();
    this.quad = buildUnitQuad(gl);
    // Load the global paper grain (used as the page-anchored wax-skip
    // mask in every brush). Fire-and-forget; brushes work without it but
    // look procedural until it arrives.
    void this.loadImageTexture("/textures/paper.jpg").then((tex) => {
      this.paperGrainTex = tex;
      this.onRedraw?.();
    });
  }

  /** Set a callback fired when a deferred texture finishes loading so the
   *  caller can re-draw without that brush's first stroke missing texture. */
  setRedrawCallback(cb: () => void): void {
    this.onRedraw = cb;
  }

  private initPrograms(): void {
    const gl = this.gl;
    this.stampProgram = buildProgram(gl, quadVert, stampFrag, "stamp");
    this.floodProgram = buildProgram(gl, quadVert, floodFrag, "flood");
    this.compositeProgram = buildProgram(gl, quadVert, compositeFrag, "composite");
    this.stampU = makeUniformGetter(gl, this.stampProgram);
    this.floodU = makeUniformGetter(gl, this.floodProgram);
    this.compositeU = makeUniformGetter(gl, this.compositeProgram);
  }

  // -------------------------------------------------------------
  // TEXTURE LOADING
  // -------------------------------------------------------------

  private loadImageTexture(url: string): Promise<WebGLTexture> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const gl = this.gl;
        const tex = gl.createTexture();
        if (!tex) return reject(new Error("createTexture failed"));
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // REPEAT so the paper texture tiles seamlessly when sampled with
        // u_paperTile > 1.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);
        resolve(tex);
      };
      img.onerror = () => reject(new Error(`Texture load failed: ${url}`));
      img.src = url;
    });
  }

  /** Get-or-load a brush shape texture. Returns null if still loading. */
  private getShapeTexture(filename: string): WebGLTexture | null {
    const cached = this.shapeTextures.get(filename);
    if (cached) return cached;
    if (!this.shapeLoadPromises.has(filename)) {
      this.shapeLoadPromises.set(filename, this.loadImageTexture(`/textures/${filename}`)
        .then((tex) => {
          this.shapeTextures.set(filename, tex);
          this.onRedraw?.();
          return tex;
        }));
    }
    return null;
  }

  /** Get-or-load a brush grain texture (alternative to global paper.jpg). */
  private getGrainTexture(filename: string): WebGLTexture | null {
    const cached = this.grainTextures.get(filename);
    if (cached) return cached;
    if (!this.grainLoadPromises.has(filename)) {
      this.grainLoadPromises.set(filename, this.loadImageTexture(`/textures/${filename}`)
        .then((tex) => {
          this.grainTextures.set(filename, tex);
          this.onRedraw?.();
          return tex;
        }));
    }
    return null;
  }

  loadPage(page: ColoringPage): void {
    const gl = this.gl;
    this.page = page;

    // Paint texture + FBO.
    this.paintTex = createTexture2D(
      gl, page.size, page.size,
      gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE,
      null,
    );
    this.paintFbo = createFramebuffer(gl, this.paintTex);
    this.clearPaint();

    // Region ID texture.
    this.regionCanvas = rasterizeRegionIDs(page);
    this.regionTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.regionTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, this.regionCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Lineart texture.
    const lineartCanvas = rasterizeLineart(page);
    this.lineartTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.lineartTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, lineartCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  clearPaint(): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.paintFbo);
    gl.viewport(0, 0, this.page.size, this.page.size);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // -------------------------------------------------------------
  // STROKE INPUT
  // -------------------------------------------------------------

  /** Begin a stroke. uv is (0..1) in page coordinates. */
  startStroke(uv: { x: number; y: number }): void {
    this.dragLastX = uv.x;
    this.dragLastY = uv.y;
    this.dragAccumulated = 0;
  }

  /**
   * Continue a stroke. Emits stamps along the segment from the previous point
   * to (uv.x, uv.y), spaced by brush.spacing * brush.radius (in paint pixels).
   * `clipRegionID` is 1-based (matches what the shader compares against the
   * region texture). 0 = no clip.
   */
  continueStroke(
    brush: Brush,
    color: [number, number, number],
    uv: { x: number; y: number },
    pressure: number,
    clipRegionID: number,
  ): void {
    const radiusPx = brush.radius;
    const stepPx = Math.max(1.0, radiusPx * brush.spacing);
    const stepUV = stepPx / this.page.size;

    const dx = uv.x - this.dragLastX;
    const dy = uv.y - this.dragLastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return;

    let remaining = dist + this.dragAccumulated;
    let cursorX = this.dragLastX - (dx / dist) * this.dragAccumulated;
    let cursorY = this.dragLastY - (dy / dist) * this.dragAccumulated;

    while (remaining >= stepUV) {
      cursorX += (dx / dist) * stepUV;
      cursorY += (dy / dist) * stepUV;
      remaining -= stepUV;
      this.emitStamp(brush, color, cursorX, cursorY, pressure, clipRegionID);
    }
    this.dragAccumulated = remaining;
    this.dragLastX = uv.x;
    this.dragLastY = uv.y;
  }

  /** End a stroke. Reserved for future undo-snapshot hooks. */
  endStroke(): void {
    this.dragAccumulated = 0;
  }

  private emitStamp(
    brush: Brush,
    color: [number, number, number],
    cx: number,
    cy: number,
    pressure: number,
    clipRegionID: number,
  ): void {
    const gl = this.gl;
    const angle = (this.rand() * 2 - 1) * brush.angleJitter;
    const sizeMul = 1.0 + (this.rand() * 2 - 1) * brush.sizeJitter;
    const radiusUV = (brush.radius * sizeMul) / this.page.size;

    let r = color[0], g = color[1], b = color[2];
    if (brush.hueStep > 0) {
      const [hr, hg, hb] = hsvToRgb(this.hueCycle, 1, 1);
      r = hr; g = hg; b = hb;
      this.hueCycle = (this.hueCycle + brush.hueStep) % 1;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.paintFbo);
    gl.viewport(0, 0, this.page.size, this.page.size);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.stampProgram);
    gl.bindVertexArray(this.quad);

    gl.uniform2f(this.stampU("u_centerUV"), cx, cy);
    gl.uniform2f(this.stampU("u_radiusUV"), radiusUV, radiusUV);
    gl.uniform1f(this.stampU("u_angle"), angle);
    gl.uniform1i(this.stampU("u_yFlip"), 0);
    gl.uniform4f(this.stampU("u_color"), r, g, b, brush.baseAlpha);
    gl.uniform1f(this.stampU("u_pressure"), pressure);
    gl.uniform1f(this.stampU("u_hardness"), brush.hardness);
    gl.uniform1f(this.stampU("u_grainStrength"), brush.grainStrength);
    gl.uniform1i(this.stampU("u_textureMode"), brush.textureMode);
    gl.uniform1f(this.stampU("u_clipRegionID"), clipRegionID / 255);
    gl.uniform1f(this.stampU("u_paperTile"), brush.paperTile);
    gl.uniform1f(this.stampU("u_stampSeed"), this.rand() * 100);

    // Texture unit 0 — region IDs.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.regionTex);
    gl.uniform1i(this.stampU("u_regionTex"), 0);

    // Texture unit 1 — paper/grain. Use the brush's grain-override if it
    // specifies one (e.g. crayon's real wax-on-paper photo); otherwise the
    // shared paper.jpg.
    gl.activeTexture(gl.TEXTURE1);
    const grainOverride = brush.grainTexture
      ? this.getGrainTexture(brush.grainTexture)
      : null;
    const grainTex = grainOverride ?? this.paperGrainTex;
    if (grainTex) {
      gl.bindTexture(gl.TEXTURE_2D, grainTex);
      gl.uniform1f(this.stampU("u_hasPaperGrain"), 1);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, this.regionTex);  // dummy
      gl.uniform1f(this.stampU("u_hasPaperGrain"), 0);
    }
    gl.uniform1i(this.stampU("u_paperGrainTex"), 1);

    // Texture unit 2 — per-brush stamp shape.
    gl.activeTexture(gl.TEXTURE2);
    const shapeTex = brush.shapeTexture ? this.getShapeTexture(brush.shapeTexture) : null;
    if (shapeTex) {
      gl.bindTexture(gl.TEXTURE_2D, shapeTex);
      gl.uniform1f(this.stampU("u_hasShape"), 1);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, this.regionTex);  // dummy
      gl.uniform1f(this.stampU("u_hasShape"), 0);
    }
    gl.uniform1i(this.stampU("u_shapeTex"), 2);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // Deterministic-ish pseudo-random per stamp; not crypto, just for visual variation.
  private rand(): number {
    this.rngState = (this.rngState * 9301 + 49297) % 233280;
    return this.rngState / 233280;
  }

  // -------------------------------------------------------------
  // FLOOD FILL (color-by-number tap)
  // -------------------------------------------------------------

  /**
   * Fill a region with the given color. regionID is the original 0-based
   * id; this method handles the +1 normalization the shader expects.
   */
  floodFill(regionID: number, hex: string, alpha = 1): void {
    if (regionID < 0) return;
    const gl = this.gl;
    const [r, g, b, a] = hexToRgba(hex, alpha);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.paintFbo);
    gl.viewport(0, 0, this.page.size, this.page.size);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.floodProgram);
    gl.bindVertexArray(this.quad);

    // Cover the entire page UV: center=(0.5, 0.5), radius=(0.5, 0.5).
    gl.uniform2f(this.floodU("u_centerUV"), 0.5, 0.5);
    gl.uniform2f(this.floodU("u_radiusUV"), 0.5, 0.5);
    gl.uniform1f(this.floodU("u_angle"), 0);
    gl.uniform1i(this.floodU("u_yFlip"), 0);

    gl.uniform1f(this.floodU("u_targetID"), (regionID + 1) / 255);
    gl.uniform1f(this.floodU("u_idTolerance"), 0.5 / 255);
    gl.uniform4f(this.floodU("u_fillColor"), r, g, b, a);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.regionTex);
    gl.uniform1i(this.floodU("u_regionTex"), 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /**
   * Return the region ID at a paint-page UV (0..1). -1 = background.
   * Synchronous CPU lookup against the cached region canvas.
   */
  regionAt(uv: { x: number; y: number }): number {
    const ctx = this.regionCanvas.getContext("2d")!;
    const px = Math.floor(uv.x * this.regionCanvas.width);
    const py = Math.floor(uv.y * this.regionCanvas.height);
    if (px < 0 || py < 0 || px >= this.regionCanvas.width || py >= this.regionCanvas.height) {
      return -1;
    }
    const data = ctx.getImageData(px, py, 1, 1).data;
    const r = data[0] ?? 0;
    return r === 0 ? -1 : r - 1;
  }

  // -------------------------------------------------------------
  // COMPOSITE (display)
  // -------------------------------------------------------------

  draw(): void {
    const gl = this.gl;
    const w = this.canvas.width;
    const h = this.canvas.height;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.disable(gl.BLEND);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.compositeProgram);
    gl.bindVertexArray(this.quad);

    gl.uniform2f(this.compositeU("u_centerUV"), 0.5, 0.5);
    gl.uniform2f(this.compositeU("u_radiusUV"), 0.5, 0.5);
    gl.uniform1f(this.compositeU("u_angle"), 0);
    gl.uniform1i(this.compositeU("u_yFlip"), 1);  // y-flip for display

    gl.uniform3f(this.compositeU("u_paperColor"), 1.0, 0.99, 0.95);
    gl.uniform1f(this.compositeU("u_paperGrain"), 0.6);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.paintTex);
    gl.uniform1i(this.compositeU("u_paintTex"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.lineartTex);
    gl.uniform1i(this.compositeU("u_lineartTex"), 1);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // Export the current composite as a PNG dataURL. Renders into a freshly
  // sized framebuffer then reads pixels.
  exportPNG(): string {
    this.draw();
    return this.canvas.toDataURL("image/png");
  }

  /**
   * Export ONLY the paint texture (no page background, no line art) as a
   * dataURL. Used for save/resume — we re-render the page chrome from code
   * each time, but the user's brush strokes need to be persisted.
   */
  exportPaintPNG(): string {
    const gl = this.gl;
    const size = this.page.size;
    const px = new Uint8Array(size * size * 4);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.paintFbo);
    gl.readPixels(0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, px);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Stash to a temp 2D canvas → toDataURL.
    const tmp = document.createElement("canvas");
    tmp.width = size;
    tmp.height = size;
    const ctx = tmp.getContext("2d")!;
    const imageData = ctx.createImageData(size, size);
    // GL reads bottom-up; flip rows.
    for (let y = 0; y < size; y++) {
      const srcRow = (size - 1 - y) * size * 4;
      const dstRow = y * size * 4;
      for (let x = 0; x < size * 4; x++) {
        imageData.data[dstRow + x] = px[srcRow + x] ?? 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return tmp.toDataURL("image/png");
  }

  /**
   * Restore the paint texture from a previously-exported dataURL. Used on
   * page open to resume an in-progress coloring.
   */
  importPaintPNG(dataURL: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const gl = this.gl;
        // Flip Y on upload because the dataURL was authored top-down, but
        // our paint FBO expects bottom-up.
        gl.bindTexture(gl.TEXTURE_2D, this.paintTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        resolve();
      };
      img.onerror = () => reject(new Error("paint load failed"));
      img.src = dataURL;
    });
  }
}
