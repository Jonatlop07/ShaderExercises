let uvShader;

function preload() {
  uvRGShader = readShader('shaders/uv_rg.frag', { matrices: Tree.pmvMatrix, varyings: Tree.texcoords2 });
  uvRBShader = readShader('shaders/uv_rb.frag', { matrices: Tree.pmvMatrix, varyings: Tree.texcoords2 });
  uvGBShader = readShader('shaders/uv_gb.frag', { matrices: Tree.pmvMatrix, varyings: Tree.texcoords2 });
}

function setup() {
  createCanvas(300, 300, WEBGL);
  noStroke();
  textureMode(NORMAL);
}

function draw() {
  background(0);
  //quad(-1,-1,1,-1,1,1,-1,1);
  shader(uvRGShader);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  shader(uvRBShader);
  triangle(width / 2, height / 2, -width / 2, height / 2, 0 , 0);
  //rect(-width / 4, -height / 4, width / 2, height / 4);
  shader(uvGBShader);
  circle(0, -height / 4, width / 2, height / 2);
}

