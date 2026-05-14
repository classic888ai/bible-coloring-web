#version 300 es
precision highp float;

// Generic full-quad vertex shader.
// Vertex positions are unit-quad corners in [0, 1].
// Uniforms remap them into clip-space at the desired location/size.

layout(location = 0) in vec2 a_unitPos;

uniform vec2 u_centerUV;    // stamp center in paint-texture UV (0..1) for stamps;
                            // ignored (set to 0.5,0.5) for fullscreen composite.
uniform vec2 u_radiusUV;    // half-width/half-height in UV units; 0.5 for fullscreen.
uniform float u_angle;      // rotation in radians, for brush stamp rotation.
uniform bool u_yFlip;       // true when rendering to default framebuffer (display);
                            // false when rendering to offscreen FBO (paint texture).

out vec2 v_localUV;         // [-1, 1] from quad center — for stamp falloff.
out vec2 v_pageUV;          // (0..1) in paint-texture coordinate space.

void main() {
  // Local position: -1..1 from quad center.
  vec2 local = a_unitPos * 2.0 - 1.0;

  // Rotate the local vec by u_angle.
  float c = cos(u_angle);
  float s = sin(u_angle);
  vec2 rotated = vec2(c * local.x - s * local.y,
                      s * local.x + c * local.y);

  // Compute page UV = center + rotated * radius.
  vec2 uv = u_centerUV + rotated * u_radiusUV;

  // Convert to clip space. For display: y is flipped because gl-Y is up but
  // we treat texture-UV-Y as down. For FBO: don't flip — the FBO's coordinate
  // system already matches our UV convention.
  float clipY = u_yFlip ? (1.0 - uv.y) * 2.0 - 1.0 : uv.y * 2.0 - 1.0;
  gl_Position = vec4(uv.x * 2.0 - 1.0, clipY, 0.0, 1.0);

  v_localUV = local;
  v_pageUV = uv;
}
