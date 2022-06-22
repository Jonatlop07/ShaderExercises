precision mediump float;

varying vec2 texcoords2;

void main() {
  gl_FragColor = vec4(texcoords2.x, 0.0, texcoords2.y, 1.0);
}