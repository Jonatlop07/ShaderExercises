let maskShader;
let img;
let ridges;
let blur;
let sharpen;
let emboss;
let luma;
let hsv;

function preload() {
  maskShader = readShader('shaders/mask.frag', { varyings: Tree.texcoords2 });
  //img = loadImage('images/fire_breathing.jpg');
  img = loadImage('images/lupin.png');
}

function setup() {
  createCanvas(650, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);

  ridges = createCheckbox('ridges', false);
  ridges.position(10, 10);
  ridges.style('color', 'white');
  ridges.input(() => maskShader.setUniform('apply_convolution', ridges.checked()));

  blur = createCheckbox('blur', false);
  blur.position(10, 30);
  blur.style('color', 'white');
  blur.input(() => maskShader.setUniform('apply_convolution', blur.checked()));

  sharpen = createCheckbox('sharpen', false);
  sharpen.position(10, 50);
  sharpen.style('color', 'white');
  sharpen.input(() => maskShader.setUniform('apply_convolution', sharpen.checked()));

  emboss = createCheckbox('emboss', false);
  emboss.position(10, 70);
  emboss.style('color', 'white');
  emboss.input(() => maskShader.setUniform('apply_convolution', emboss.checked()));

  luma = createCheckbox('luma', false);
  luma.position(10, 90);
  luma.style('color', 'white');
  luma.input(() => maskShader.setUniform('apply_luma', luma.checked()));

  hsv = createCheckbox('hsv', false);
  hsv.position(10, 110);
  hsv.style('color', 'white');
  hsv.input(() => maskShader.setUniform('apply_hsv', hsv.checked()));

  hsv_v = createCheckbox('hsv_v', false);
  hsv_v.position(10, 130);
  hsv_v.style('color', 'white');
  hsv_v.input(() => maskShader.setUniform('apply_hsv_v', hsv_v.checked()));

  hsl = createCheckbox('hsl', false);
  hsl.position(10, 150);
  hsl.style('color', 'white');
  hsl.input(() => maskShader.setUniform('apply_hsl', hsl.checked()));

  hsl_l = createCheckbox('hsl_l', false);
  hsl_l.position(10, 170);
  hsl_l.style('color', 'white');
  hsl_l.input(() => maskShader.setUniform('apply_hsl_l', hsl_l.checked()));

  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
}

function draw() {
  background(0);
  if (ridges.checked()) {
    maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
    //maskShader.setUniform('mask', [0, -1, 0, -1, 5, -1, 0, -1, 0]);
  } else if (blur.checked()) {
    maskShader.setUniform('mask', [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
  } else if (sharpen.checked()) {
    maskShader.setUniform('mask', [0, -1, 0, -1, 5, -1, 0, -1, 0]);
  } else if (emboss.checked()) {
    maskShader.setUniform('mask', [-2, -1, 0, -1, 1, 1, 0, 1, 2]);
  } else if (luma.checked() || hsv.checked() || hsv_v.checked() || hsl.checked() || hsl_l.checked()) {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  } else {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
    const mx = map(mouseX, 0, width, 0.0, 1.0);
    const my = map(mouseY, 0, height, 0.0, 1.0);
    maskShader.setUniform('uMouse', [mx, my]);
    maskShader.setUniform('uResolution', [width, height]);
  }
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}