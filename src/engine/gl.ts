// Low-level WebGL2 helpers — shader compilation, program linking, VAOs.

export function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
  label: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error(`Failed to create shader: ${label}`);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed (${label}): ${log}`);
  }
  return shader;
}

export function linkProgram(
  gl: WebGL2RenderingContext,
  vert: WebGLShader,
  frag: WebGLShader,
  label: string,
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error(`Failed to create program: ${label}`);
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed (${label}): ${log}`);
  }
  return program;
}

export function buildProgram(
  gl: WebGL2RenderingContext,
  vsrc: string,
  fsrc: string,
  label: string,
): WebGLProgram {
  const v = compileShader(gl, gl.VERTEX_SHADER, vsrc, `${label}.vert`);
  const f = compileShader(gl, gl.FRAGMENT_SHADER, fsrc, `${label}.frag`);
  return linkProgram(gl, v, f, label);
}

// Cache uniform locations to avoid per-frame gl.getUniformLocation calls.
export function makeUniformGetter(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): (name: string) => WebGLUniformLocation | null {
  const cache = new Map<string, WebGLUniformLocation | null>();
  return (name: string) => {
    if (cache.has(name)) return cache.get(name) ?? null;
    const loc = gl.getUniformLocation(program, name);
    cache.set(name, loc);
    return loc;
  };
}

// Build a VAO + VBO for a unit-quad in [0,1]×[0,1], two triangles.
export function buildUnitQuad(gl: WebGL2RenderingContext): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();
  if (!vao) throw new Error("Failed to create VAO");
  gl.bindVertexArray(vao);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  // CCW: (0,0)-(1,0)-(0,1) and (1,0)-(1,1)-(0,1)
  const data = new Float32Array([
    0, 0, 1, 0, 0, 1,
    1, 0, 1, 1, 0, 1,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
  return vao;
}

// Create an empty RGBA texture suitable as an FBO color target.
export function createTexture2D(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat: number,
  format: number,
  type: number,
  data: ArrayBufferView | null = null,
): WebGLTexture {
  const tex = gl.createTexture();
  if (!tex) throw new Error("Failed to create texture");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export function createFramebuffer(
  gl: WebGL2RenderingContext,
  colorTex: WebGLTexture,
): WebGLFramebuffer {
  const fb = gl.createFramebuffer();
  if (!fb) throw new Error("Failed to create framebuffer");
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTex, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error(`Framebuffer incomplete: 0x${status.toString(16)}`);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return fb;
}
