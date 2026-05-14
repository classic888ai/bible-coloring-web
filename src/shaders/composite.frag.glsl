#version 300 es
precision highp float;

// Composite fragment shader. Renders the layered page to the screen:
//   1. Cream paper background with subtle grain
//   2. Paint texture (the user's coloring) — premultiplied alpha
//   3. Lineart (region outlines) — drawn on top so paint never escapes visually
//
// All three are sampled in page UV (0..1).

in vec2 v_pageUV;

uniform sampler2D u_paintTex;
uniform sampler2D u_lineartTex;
uniform vec3 u_paperColor;
uniform float u_paperGrain;  // 0..1 — how visible the paper texture is

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

void main() {
  // Paper base with subtle high-frequency grain for warmth.
  float n = hash21(v_pageUV * 1600.0);
  vec3 paper = u_paperColor * (1.0 - u_paperGrain * 0.12 * (1.0 - n));

  // Paint sample (premultiplied).
  vec4 paint = texture(u_paintTex, v_pageUV);

  // Composite paint over paper.
  vec3 afterPaint = paint.rgb + paper * (1.0 - paint.a);

  // Lineart on top — sample as straight RGBA, premultiply at use time.
  vec4 line = texture(u_lineartTex, v_pageUV);
  vec3 finalRGB = line.rgb * line.a + afterPaint * (1.0 - line.a);

  fragColor = vec4(finalRGB, 1.0);
}
