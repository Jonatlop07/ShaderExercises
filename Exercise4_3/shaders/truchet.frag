precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_zoom;

vec2 brickTile(vec2 _st, float _zoom){
  _st *= _zoom;

  // Here is where the offset is happening
  _st.x += step(1., mod(_st.y, 2.0)) * 0.5;

  return fract(_st);
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

float box(vec2 _st, vec2 _size){
  _size = vec2(0.5) - _size * 0.5;
  vec2 uv = smoothstep(_size, _size + vec2(1e-4), _st);
  uv *= smoothstep(_size, _size + vec2(1e-4), vec2(1.0) - _st);
  return uv.x * uv.y;
}

void main(void){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(0.0);

  // Modern metric brick of 215mm x 102.5mm x 65mm
  // http://www.jaharrison.me.uk/Brickwork/Sizes.html
  // st /= vec2(2.15,0.65)/1.5;

  // Apply the brick tiling
  st = brickTile(st, u_zoom);

  color = vec3(box(st, vec2(0.9)));

  // Uncomment to see the space coordinates
  color = vec3(st, 0.5);

  gl_FragColor = vec4(vec3(hsl(color.rgb)), 1.0);
}
