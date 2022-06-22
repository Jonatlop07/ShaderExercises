precision mediump float;

uniform sampler2D texture;
uniform vec2 texOffset;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float mask[9];
uniform bool apply_convolution;

uniform bool apply_luma;
uniform bool apply_hsv;
uniform bool apply_hsv_v;
uniform bool apply_hsl;
uniform bool apply_hsl_l;

varying vec2 texcoords2;

const float radius = 1.0;
const float depth = radius / 2.0;

float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

vec3 hsv(vec3 texel) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(texel.bg, K.wz), vec4(texel.gb, K.xy), step(texel.b, texel.g));
  vec4 q = mix(vec4(p.xyw, texel.r), vec4(texel.r, p.yzx), step(p.x, texel.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

float hsvV(vec3 texel) {
  return max(max(texel.r, texel.g), texel.b);
}

vec3 hsl(vec3 texel){
  float h = 0.0;
	float s = 0.0;
	float l = 0.0;
	float r = texel.r;
	float g = texel.g;
	float b = texel.b;
	float cMin = min( r, min( g, b ) );
	float cMax = max( r, max( g, b ) );

	l = (cMax + cMin) / 2.0;
	if (cMax > cMin) {
		float cDelta = cMax - cMin;
		s = l < .0 ? cDelta / (cMax + cMin) : cDelta / (2.0 - (cMax + cMin));
        
		if (r == cMax) {
			h = (g - b) / cDelta;
		} else if (g == cMax) {
			h = 2.0 + (b - r) / cDelta;
		} else {
			h = 4.0 + (r - g) / cDelta;
		}

		if (h < 0.0) {
			h += 6.0;
		}
		h = h / 6.0;
	}
	return vec3(h, s, l);
}

float hslL(vec3 texel) {
  return 0.21 * texel.r + 0.72 * texel.g + 0.07 * texel.b;
}

vec4 magnify(vec2 frag_coord) {
  vec2 uv = frag_coord / (uResolution.xy * radius);
  vec2 center = vec2(uMouse.x, 1.0 - uMouse.y);
  float diff_x_sq = (uv.x - center.x) * (uv.x - center.x);
  float diff_y_sq = (uv.y - center.y) * (uv.y - center.y);
  float ax = diff_x_sq / (0.2 * 0.2) + (diff_y_sq / 0.1) * (uResolution.x / uResolution.y);
  float ax_sq = ax * ax;
  float radius_sq = radius * radius;
  float dx = (-depth / radius) * ax + (depth / radius_sq) * ax_sq;
  float f = ax + dx;
  if (ax > radius)
    f = ax;
  vec2 magnifier_area = center + (uv - center) * f / ax;
  vec2 magnifier_r = vec2(magnifier_area.x, 1.0 - magnifier_area.y);
  return texture2D(texture, magnifier_r);
}

vec4 convolute() {
  vec2 tc0 = texcoords2 + vec2(-texOffset.s, -texOffset.t);
  vec2 tc1 = texcoords2 + vec2(         0.0, -texOffset.t);
  vec2 tc2 = texcoords2 + vec2(+texOffset.s, -texOffset.t);
  vec2 tc3 = texcoords2 + vec2(-texOffset.s,          0.0);
  vec2 tc4 = texcoords2 + vec2(         0.0,          0.0);
  vec2 tc5 = texcoords2 + vec2(+texOffset.s,          0.0);
  vec2 tc6 = texcoords2 + vec2(-texOffset.s, +texOffset.t);
  vec2 tc7 = texcoords2 + vec2(         0.0, +texOffset.t);
  vec2 tc8 = texcoords2 + vec2(+texOffset.s, +texOffset.t);

  vec4 rgba[9];
  rgba[0] = texture2D(texture, tc0);
  rgba[1] = texture2D(texture, tc1);
  rgba[2] = texture2D(texture, tc2);
  rgba[3] = texture2D(texture, tc3);
  rgba[4] = texture2D(texture, tc4);
  rgba[5] = texture2D(texture, tc5);
  rgba[6] = texture2D(texture, tc6);
  rgba[7] = texture2D(texture, tc7);
  rgba[8] = texture2D(texture, tc8);

  vec4 convolution;
  for (int i = 0; i < 9; i++) {
    convolution += rgba[i] * mask[i];
  }

  return convolution;
}

void main() {
  vec4 texel = texture2D(texture, texcoords2);

  if (apply_luma) {
    gl_FragColor = vec4(vec3(luma(texel.rgb)), 1.0);
  } else if (apply_hsv) {
    gl_FragColor = vec4(hsv(texel.rgb), 1.0);
  } else if (apply_hsv_v) {
    gl_FragColor = vec4(vec3(hsvV(texel.rgb)), 1.0);
  } else if (apply_hsl) {
    gl_FragColor = vec4(hsl(texel.rgb), 1.0);
  } else if (apply_hsl_l) {
    gl_FragColor = vec4(vec3(hslL(texel.rgb)), 1.0);
  } else if (apply_convolution) {
    vec4 convolution = convolute();
    gl_FragColor = vec4(convolution.rgb, 1.0);
  } else {
    vec4 color = magnify(gl_FragCoord.xy);
    gl_FragColor = vec4(color.rgb, 1.0);
  }
}