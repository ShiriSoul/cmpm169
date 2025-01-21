// sketch.js - all code for grid creation and animation and interactivity
// Author: Tony Pau
// Date: 1/20/2025

// constants and globals
const Star_GRID_SPACING = 50;
const CIRCLE_SPACING = 100;

const COMET_NUM = 5; // comet limit
const COMET_SPEED = 3; // comet speed

let comets = [];
let shiningComets = []; // To track the comets that are shining
let waveOffsetX = 0;
let waveOffsetY = 0;
let hashRotation = 0;

// Comet class definition
class Comet {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(10, 20);
    this.alpha = 255;
    this.trail = [];
    this.angle = random(TWO_PI);
    this.speed = random(2, 5);
  }

  update() {
    // move comet
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    // add position to trail
    this.trail.push(createVector(this.x, this.y));
    if (this.trail.length > 10) {
      this.trail.shift(); // remove old trail position
    }

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.x = random(width);
      this.y = random(height);
    }

    // draw comet trail
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 0, 150);
      fill(255, alpha);
      noStroke();
      ellipse(this.trail[i].x, this.trail[i].y, this.size);
    }

    // draw comet
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  // checks for comet clicks
  checkClicked(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    if (d < this.size / 2) {
      return true;
    }
    return false;
  }
}

// create comets on start
function createComets() {
  for (let i = 0; i < COMET_NUM; i++) {
    comets.push(new Comet());
  }
}

// canvas set up and resize
function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  createComets();
}

function draw() {
  // clears background and updates visuals
  background(30);

  // handles user input for movement and rotation of grids
  handleInput();

  // draws dynamic spiral
  drawDynamicCircle();

  // draws hash grid
  drawStarGrid();

  // draws comets
  for (let comet of comets) {
    comet.update();
  }
}

// checks for comet clicks
function mousePressed() {
  for (let i = comets.length - 1; i >= 0; i--) {
    if (comets[i].checkClicked(mouseX, mouseY)) {
      comets[i].shine(); // trigger the shine effect
    }
  }
}

// calculates the center of canvas and adjusts canvas size to match container size
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;

  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// draw dynamic circle
function drawDynamicCircle() {
  // sets stroke color and style for circle
  stroke(96, 22, 224);
  noFill();

  const maxRadius = dist(0, 0, width / 4, height / 4); // maximum radius
  const circleResolution = 80; // number of segments per circle
  const angleStep = TAU / circleResolution;

  // loops through different radius to draw circles
  for (let r = maxRadius; r > 0; r -= 10) {
    let opacity = map(r, 0, maxRadius, 255, 50);
    stroke(96, 22, 224, opacity);
    strokeWeight(4); // circle line thickness

    beginShape();
    for (let i = 0; i < circleResolution; i++) {
      let angle = angleStep * i;

      // mouse follow
      let lineLength = map(dist(mouseX, mouseY, width / 2, height / 2), 0, maxRadius, 0, r);

      let x = cos(angle) * lineLength + width / 2;
      let y = sin(angle) * lineLength + height / 2;
      vertex(x, y);
    }
    endShape(CLOSE); // complete circular path
  }
}

// draw star grid
function drawStarGrid() {
  // sets origin for grid drawing to center of canvas
  push();
  translate(centerHorz, centerVert);
  rotate(hashRotation); // applies rotation to grid

  stroke(255, 255, 0); // set grid color
  strokeWeight(1); // set line thickness

  // draws grid with stars
  for (let x = -width * 2; x <= width * 2; x += Star_GRID_SPACING) {
    for (let y = -height * 2; y <= height * 2; y += Star_GRID_SPACING) {
      // draws horizontal and vertical lines
      line(x - 10, y, x + 10, y);
      line(x, y - 10, x, y + 10);
    }
  }
  pop();
}

function handleInput() {
  if (keyIsDown(65)) { // 'A' key to rotate counterclockwise
    hashRotation -= 0.05;
  } else if (keyIsDown(68)) { // 'D' key to rotate clockwise
    hashRotation += 0.05;
  }
}

// checks for comet clicks
function mousePressed() {
  for (let i = comets.length - 1; i >= 0; i--) {
    if (comets[i].checkClicked(mouseX, mouseY)) {
      comets.splice(i, 1); // remove comet from array
    }
  }
}