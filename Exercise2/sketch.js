let lumaShader;
let img;
let grey_scale;
let component_average;
let texture_tinting;

function preload() {
  lumaShader = readShader('shaders/luma.frag', { varyings: Tree.texcoords2 });
  img = loadImage('images/fire_breathing.jpg');
}

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(IMAGE);
  shader(lumaShader);
  
  grey_scale = createCheckbox('luma', false);
  grey_scale.position(10, 10);
  grey_scale.style('color', 'white');
  grey_scale.input(() => lumaShader.setUniform('grey_scale', grey_scale.checked()));

  component_average = createCheckbox('component average', false);
  component_average.position(10, 30);
  component_average.style('color', 'white');
  component_average.input(() => lumaShader.setUniform('component_average', component_average.checked()));

  texture_tinting = createCheckbox('texture tinting', false);
  texture_tinting.position(10, 50);
  texture_tinting.style('color', 'white');
  texture_tinting.input(() => lumaShader.setUniform('texture_tinting', texture_tinting.checked()));

  lumaShader.setUniform('texture', img);
}

function draw() {
  background(0);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}