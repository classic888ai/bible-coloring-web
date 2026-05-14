#version 300 es
precision highp float;

// Flood-fill fragment shader — the color-by-number mechanic.
// Renders a full-page quad over the paint texture; outputs the fill color
// where the region ID matches; discards otherwise.

in vec2 v_pageUV;

uniform sampler2D u_regionTex;
uniform float u_targetID;     // normalized region index (id / 255)
uniform float u_idTolerance;  // typically 0.5 / 255
uniform vec4 u_fillColor;     // rgb + alpha; shader premultiplies

out vec4 fragColor;

void main() {
  float id = texture(u_regionTex, v_pageUV).r;
  if (abs(id - u_targetID) > u_idTolerance) discard;
  float a = u_fillColor.a;
  fragColor = vec4(u_fillColor.rgb * a, a);
}
