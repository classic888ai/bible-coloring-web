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
uniform float u_stampSeed;        // per-stamp randomness; varies for sparkle/spray/stars

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

// Star-shape coverage in local UV. r0..1 from center. Returns 1 inside the
// 5-point star silhouette, 0 outside. Used by the stamp brush.
float starCoverage(vec2 localUV) {
  vec2 p = localUV;
  float angle = atan(p.y, p.x);
  float rad = length(p);
  // 5-point star: r(theta) = a + b*cos(5*theta) gives a flower; we sharpen
  // by raising to a power. Inner radius 0.4, outer 1.0.
  float pulse = 0.65 + 0.35 * cos(5.0 * angle - 1.5708);
  // pulse in [0.30, 1.00]; star is where rad < pulse * threshold.
  return smoothstep(pulse * 1.02, pulse * 0.94, rad);
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
    // FLAT marker — uniform coverage, no grain.
    coverage = 1.0;
  } else if (mode == 4) {
    // PENCIL — colored pencil distinct from crayon. Key differences:
    //   - NO skip mask (pencil doesn't skip; it lays a continuous fine line)
    //   - Grain is sampled at much higher frequency for fine fibre detail
    //   - Anisotropic stretch simulates paper-fiber direction
    //   - Tight, hard stamp edge (pencil makes a SHARP narrow mark)
    //
    // This is why pencil should never look like crayon: crayon BREAKS where
    // wax skips bumps; pencil glides over the bumps but reveals the paper
    // tooth as a fine speckle inside the mark.
    vec2 stretched = vec2(v_pageUV.x * 1.0, v_pageUV.y * 2.5);
    float coarse = paperGrainAt(stretched);
    float fine = paperGrainAt(v_pageUV * 2.8);
    float fiber = coarse * 0.55 + fine * 0.45;
    // grainFloor for pencil starts higher than crayon — even paper "dips"
    // still pick up SOME pigment (because the pencil tip is hard).
    float grainFloor = 1.0 - u_grainStrength * 0.55;
    coverage = mix(grainFloor, 1.0, fiber);
  } else if (mode == 5) {
    // GLITTER — sparkle stamps. Bright disc + bursts at random sub-positions.
    // The stamp seed varies per emit so each stamp's sparkle pattern shifts.
    vec2 p = v_localUV;
    float starShape = starCoverage(p * 1.4);
    // Small inner brilliant core, larger faint halo.
    float core = 1.0 - smoothstep(0.10, 0.55, r);
    float halo = (1.0 - smoothstep(0.40, 1.0, r)) * 0.55;
    // Inject some sparkle "speckle" — tiny stars off-center.
    float sparkle = step(0.94, proceduralGrain(p * 18.0 + u_stampSeed));
    coverage = max(max(starShape, core), max(halo, sparkle));
  } else if (mode == 6) {
    // SPRAY PAINT — sparse fine dots scattered across the stamp. Soft edge.
    // Stamp seed shifts the dot pattern each emit so a drag scatters paint
    // organically rather than tiling identical stamps.
    vec2 p = v_localUV;
    float spray1 = proceduralGrain(p * 14.0 + u_stampSeed * 7.13);
    float spray2 = proceduralGrain(p * 30.0 + u_stampSeed * 13.31);
    float dots = step(0.60, spray1) * 0.5 + step(0.78, spray2) * 0.5;
    // Density falls off toward edge so the spray reads as "centered cloud."
    float density = (1.0 - smoothstep(0.15, 0.95, r));
    coverage = dots * density;
  } else if (mode == 7) {
    // WATERCOLOR — very soft edge, paper grain visible, low coverage that
    // builds with overlap. Mimics wet pigment bleeding into paper.
    float paper = paperGrainAt(v_pageUV * 4.0);
    float softEdge = 1.0 - smoothstep(0.0, 1.0, r);
    coverage = softEdge * mix(0.25, 1.0, paper);
  } else if (mode == 8) {
    // STAR STAMP — discrete 5-point star shapes. Each stamp is a tiny star.
    // Bigger spacing in the brush so individual stars are visible (not
    // overlapping into a blob).
    coverage = starCoverage(v_localUV);
  } else {
    // CRAYON (mode 0) and chalk (mode 2) and bristle (mode 3):
    // shape × paper × skip-mask. The classic stamp+grain recipe.

    float shape = 1.0;
    if (u_hasShape > 0.5) {
      vec2 texUV = v_localUV * 0.5 + 0.5;
      vec4 s = texture(u_shapeTex, texUV);
      shape = (s.a < 0.99) ? s.a : (1.0 - dot(s.rgb, vec3(0.333)));
    } else if (mode == 2) {
      // Chalk procedural speckle (when no shape texture).
      float n1 = proceduralGrain(v_localUV * 38.0);
      float n2 = proceduralGrain(v_localUV * 15.0);
      shape = step(0.30 + u_grainStrength * 0.18 + r * 0.22,
                   n1 * 0.65 + n2 * 0.35);
    } else if (mode == 3) {
      // Bristle procedural fallback.
      float stripe = 0.5 + 0.5 * sin(v_localUV.x * 26.0);
      shape = mix(0.35, 1.0,
                  stripe * 0.55 + proceduralGrain(v_localUV * 6.0) * 0.45);
    }

    // Page-anchored paper grain.
    float paper = paperGrainAt(v_pageUV);
    float grainFloor = 1.0 - u_grainStrength * 0.85;
    float grainMod = mix(grainFloor, 1.0, paper);
    // Skip threshold: this is the wax-break behavior that makes crayon
    // visibly different from a soft marker.
    float skipT = 0.20 + u_grainStrength * 0.18;
    float skipMask = smoothstep(skipT, skipT + 0.10, paper);

    coverage = shape * grainMod * skipMask;
  }

  float effectivePressure = mix(0.55, 1.0, u_pressure);
  float alpha = disc * coverage * u_color.a * effectivePressure;
  fragColor = vec4(u_color.rgb * alpha, alpha);
}
