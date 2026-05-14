#version 300 es
precision highp float;

// =====================================================================
// Brush stamp fragment — the Procreate-style dual-texture model:
//
//   coverage = shape(stampUV)            // organic stamp silhouette
//            * grainMask(pageUV)         // paper-anchored wax skips
//
// The paper-grain texture is sampled in PAGE UV (not stamp-local), so as
// the brush drags across the page, the grain stays put on the paper —
// which is exactly what makes a real crayon stroke skip on raised paper
// fibers. This is the key change from the procedural-noise approach.
// =====================================================================

in vec2 v_localUV;          // [-1, 1] from stamp center
in vec2 v_pageUV;           // (0..1) in paint-texture coords

uniform vec4 u_color;
uniform float u_pressure;
uniform float u_hardness;
uniform float u_grainStrength;
uniform int u_textureMode;
uniform float u_clipRegionID;

uniform sampler2D u_regionTex;    // texture unit 0 — region IDs
uniform sampler2D u_paperGrainTex;// texture unit 1 — tileable paper texture
uniform sampler2D u_shapeTex;     // texture unit 2 — per-brush stamp shape
uniform float u_hasShape;         // 1.0 if shape texture is bound, else 0
uniform float u_hasPaperGrain;    // 1.0 if paper texture is bound, else 0
uniform float u_paperTile;        // page-UV multiplier for grain frequency

out vec4 fragColor;

// Cheap hash-based value noise — fallback when paper texture isn't loaded.
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float proceduralGrain(vec2 uv) {
  vec2 f = fract(uv);
  vec2 i = floor(uv);
  vec2 w = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i),                hash21(i + vec2(1, 0)), w.x),
             mix(hash21(i + vec2(0, 1)),   hash21(i + vec2(1, 1)), w.x), w.y);
}

float paperGrainAt(vec2 pageUV) {
  if (u_hasPaperGrain > 0.5) {
    // Sample the paper texture, tiled. Use the luminance — the paper
    // texture is a warm cream image, so luminance ≈ how "raised" the
    // paper fiber is at that point. High luminance = bumpy fiber that
    // catches wax. Low luminance = dip that wax skips.
    vec3 c = texture(u_paperGrainTex, pageUV * u_paperTile).rgb;
    return dot(c, vec3(0.2126, 0.7152, 0.0722));
  }
  // Fallback procedural multi-octave noise.
  float g1 = proceduralGrain(pageUV * 280.0);
  float g2 = proceduralGrain(pageUV * 850.0);
  float g3 = proceduralGrain(pageUV * 160.0);
  return g1 * 0.45 + g2 * 0.30 + g3 * 0.25;
}

void main() {
  float r = length(v_localUV);
  if (r > 1.0) discard;

  if (u_clipRegionID > 0.5 / 255.0) {
    float id = texture(u_regionTex, v_pageUV).r;
    if (abs(id - u_clipRegionID) > 0.5 / 255.0) discard;
  }

  // Soft disc falloff.
  float edgeStart = u_hardness * 0.95;
  float disc = 1.0 - smoothstep(edgeStart, 1.0, r);

  float coverage;
  int mode = u_textureMode;

  if (mode == 1) {
    // FLAT marker — uniform coverage, no grain. The "confident" brush.
    coverage = 1.0;
  } else {
    // All textured modes share the same recipe — different tuning per brush.

    // Step 1: shape mask (organic stamp silhouette).
    float shape = 1.0;
    if (u_hasShape > 0.5) {
      // Stamp-local UV: localUV is [-1, 1]; map to [0, 1] for the shape texture.
      vec2 texUV = v_localUV * 0.5 + 0.5;
      // Use alpha channel (Deevad stamps are white-on-transparent).
      vec4 s = texture(u_shapeTex, texUV);
      // Some textures have alpha; some are luminance-on-white. Use either:
      // alpha if it's meaningful (< 1.0 anywhere), else invert luminance.
      shape = (s.a < 0.99) ? s.a : (1.0 - dot(s.rgb, vec3(0.333)));
    } else if (mode == 2) {
      // Procedural chalk speckle fallback (when no shape texture).
      float n1 = proceduralGrain(v_localUV * 38.0);
      float n2 = proceduralGrain(v_localUV * 15.0);
      shape = step(0.30 + u_grainStrength * 0.18 + r * 0.22, n1 * 0.65 + n2 * 0.35);
    } else if (mode == 3) {
      // Procedural bristle fallback.
      float stripe = 0.5 + 0.5 * sin(v_localUV.x * 26.0);
      shape = mix(0.35, 1.0, stripe * 0.55 + proceduralGrain(v_localUV * 6.0) * 0.45);
    }

    // Step 2: paper grain — page-anchored. This is the WAX-SKIP effect.
    // As the brush drags across the page, this stays put. Stamps overlap
    // and reveal the SAME paper bumps each time — exactly like real wax.
    float paper = paperGrainAt(v_pageUV);

    // The grain modulates coverage with a configurable floor. A grainFloor
    // of 1.0 = paper has no effect; 0.0 = paper completely gates the stamp.
    float grainFloor = 1.0 - u_grainStrength * 0.85;
    float grainMod = mix(grainFloor, 1.0, paper);

    // Hard "skip threshold" — below this, the wax skipped that paper bump
    // entirely. This is what creates the visible breaks that distinguish
    // crayon from marker.
    float skipT = 0.20 + u_grainStrength * 0.18;
    float skipMask = smoothstep(skipT, skipT + 0.10, paper);

    coverage = shape * grainMod * skipMask;
  }

  float effectivePressure = mix(0.55, 1.0, u_pressure);
  float alpha = disc * coverage * u_color.a * effectivePressure;
  fragColor = vec4(u_color.rgb * alpha, alpha);
}
