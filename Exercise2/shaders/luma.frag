precision mediump float;

uniform bool grey_scale;
uniform bool component_average;
uniform bool texture_tinting;
uniform sampler2D texture;

varying vec2 texcoords2;

float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

float componentAverage(vec3 texel) {
  return 0.333 * texel.r + 0.333 * texel.g + 0.333 * texel.b;
}

vec3 textureTinting(vec3 texel, vec2 texcoords2) {
  float cut_point = 0.5;
  float red_modifier = texcoords2.x < cut_point ? texcoords2.x / cut_point : 1.0;
  float green_modifier = texcoords2.y < cut_point ? texcoords2.y / cut_point : 1.0;
  float blue_modifier = texcoords2.x > cut_point ? (texcoords2.x - cut_point) / cut_point : 1.0;
  float all_modifier = texcoords2.y > cut_point ? 1.0 - (texcoords2.y - cut_point) / cut_point : 1.0;
  return vec3(
    all_modifier * red_modifier * texel.r,
    all_modifier * green_modifier * texel.g,
    all_modifier * blue_modifier * texel.b
  );
}

void main() {
  vec4 texel = texture2D(texture, texcoords2);
  if (grey_scale) {
    gl_FragColor = vec4((vec3(luma(texel.rgb))), 1.0);
  } else if (component_average) {
    gl_FragColor = vec4((vec3(componentAverage(texel.rgb))), 1.0);
  } else if (texture_tinting) {
    gl_FragColor = vec4(textureTinting(texel.rgb, texcoords2), 0.3);
  } else {
    gl_FragColor = texel;
  }
}