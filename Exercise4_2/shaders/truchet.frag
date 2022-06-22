precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_zoom;

float circle(in vec2 _st, in float _radius){
  vec2 l = _st - vec2(0.5);
  return 1. - smoothstep(_radius - _radius * 0.2, _radius + _radius * 0.2, dot(l, l) * 8.0);
}

vec3 hsv(vec3 texel) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(texel.bg, K.wz), vec4(texel.gb, K.xy), step(texel.b, texel.g));
  vec4 q = mix(vec4(p.xyw, texel.r), vec4(texel.r, p.yzx), step(p.x, texel.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

void main (void) {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec3 color = vec3(0.0);

  st *= u_zoom;      // Scale up the space by 3
  st = fract(st); // Wrap around 1.0

  // Now we have 9 spaces that go from 0-1

  color = vec3(st, 1.0);
  //color = vec3(circle(st, 1.0));

	gl_FragColor = vec4(hsv(color.rgb), 1.0);
}
