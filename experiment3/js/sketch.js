// sketch.js - all code for branch and leaf creation
// Author: Tony Pau
// Date: 1/27/2025

// constants and globals
const MAX_BRANCHES = 5000; // max circles
const INITIAL_RADIUS = 10; // circle radius
const LEAF_PROBABILITY = 0.1; // chance to generate a leaf (10% = 0.1)
const LEAF_RADIUS = 5; // leaf fixed radius

let x = [];
let y = [];
let r = [];
let leafPositions = [];
let currentCount = 1;
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let backgroundAudio;

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    // placeholder
  }
}

// resize
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// canvas set up and resize
function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  strokeWeight(0.5);

  // first circle is on center of canvas
  x[0] = width / 2;
  y[0] = height / 2;
  r[0] = INITIAL_RADIUS;

  // creates instance of class
  myInstance = new MyClass("VALUE1", "VALUE2");

  // load and play audio
  soundsPlay = loadSound('./assets/tree-snap.mp3', () => {
    soundsPlay.loop();
  });

  // screen resizing
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
}

function draw() {
  // clears background and updates visuals
  background(220);

  // instance call method
  myInstance.myMethod();

  // generates circles (branches)
  if (currentCount < MAX_BRANCHES) {
    let newR = random(1, 7);
    let newX = random(newR, width - newR);
    let newY = random(newR, height - newR);

    let closestDist = Number.MAX_VALUE;
    let closestIndex = 0;

    // finds closest existing circle
    for (let i = 0; i < currentCount; i++) {
      let distToCircle = dist(newX, newY, x[i], y[i]);
      if (distToCircle < closestDist) {
        closestDist = distToCircle;
        closestIndex = i;
      }
    }

    // aligns new circle with closest circle
    let angle = atan2(newY - y[closestIndex], newX - x[closestIndex]);
    x[currentCount] = x[closestIndex] + cos(angle) * (r[closestIndex] + newR);
    y[currentCount] = y[closestIndex] + sin(angle) * (r[closestIndex] + newR);
    r[currentCount] = newR;
    currentCount++;

    // checks for adding a leaf after a branch is created
    if (random() < LEAF_PROBABILITY) {
      // makes leaf directly adjacent to branch
      let leafX = x[closestIndex] + cos(angle) * (r[closestIndex] + LEAF_RADIUS);
      let leafY = y[closestIndex] + sin(angle) * (r[closestIndex] + LEAF_RADIUS);

      // stores leaf positions
      leafPositions.push({ x: leafX, y: leafY });
    }
  }

  // draw branches (black circles)
  for (let i = 0; i < currentCount; i++) {
    fill(89, 57, 51); // branch color (gray)
    noStroke();
    ellipse(x[i], y[i], r[i] * 2, r[i] * 2);
  }

  // draw leaves (green circles)
  drawLeaves();

  // stop drawing when maximum circle limit is reached
  if (currentCount >= MAX_BRANCHES) noLoop();
}

// draws green leaves
function drawLeaves() {
  for (let i = 0; i < leafPositions.length; i++) {
    let leaf = leafPositions[i];
    // fill(0, 255, 0); // leaf color (green)
    fill(227, 116, 151) // sakura verison
    noStroke();
    ellipse(leaf.x, leaf.y, LEAF_RADIUS * 2, LEAF_RADIUS * 2);
  }
}

// mouse press resets generation and resets audio
function mousePressed() {
  // reset branches and leaves
  x = [];
  y = [];
  r = [];
  leafPositions = [];
  currentCount = 1;

  // sets initial position of first circle at mouse click
  x[0] = width / 2;
  y[0] = height / 2;
  r[0] = INITIAL_RADIUS;

  // resets audio
  if (soundsPlay.isPlaying()) {
    soundsPlay.stop();
  }
  soundsPlay.play();

  loop(); // starts generating branches and leaves again
}



// Below is standard tree branch generation with leaves. Made before audio implementation so no sound.
/**

// constants and globals
const MAX_BRANCHES = 5000; // max circles
const INITIAL_RADIUS = 10; // circle radius
const LEAF_PROBABILITY = 0.1; // chance to generate a leaf (10% = 0.1)
const LEAF_RADIUS = 5; // leaf fixed radius

let x = [];
let y = [];
let r = [];
let leafPositions = [];
let currentCount = 1;
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    // placeholder
  }
}

// resize
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// canvas set up and resize
function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  strokeWeight(0.5);

  // creates instance of class
  myInstance = new MyClass("VALUE1", "VALUE2");

  // screen resizing
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
}

function draw() {
  // clears background and updates visuals
  background(220);

  // instance call method
  myInstance.myMethod();

  // generates circles (branches)
  if (currentCount < MAX_BRANCHES) {
    let newR = random(1, 7);
    let newX = random(newR, width - newR);
    let newY = random(newR, height - newR);

    let closestDist = Number.MAX_VALUE;
    let closestIndex = 0;

    // finds closest existing circle
    for (let i = 0; i < currentCount; i++) {
      let distToCircle = dist(newX, newY, x[i], y[i]);
      if (distToCircle < closestDist) {
        closestDist = distToCircle;
        closestIndex = i;
      }
    }

    // aligns new circle with closest circle
    let angle = atan2(newY - y[closestIndex], newX - x[closestIndex]);
    x[currentCount] = x[closestIndex] + cos(angle) * (r[closestIndex] + newR);
    y[currentCount] = y[closestIndex] + sin(angle) * (r[closestIndex] + newR);
    r[currentCount] = newR;
    currentCount++;

    // checks for adding a leaf after a branch is created
    if (random() < LEAF_PROBABILITY) {
      // makes leaf directly adjacent to branch
      let leafX = x[closestIndex] + cos(angle) * (r[closestIndex] + LEAF_RADIUS);
      let leafY = y[closestIndex] + sin(angle) * (r[closestIndex] + LEAF_RADIUS);

      // stores leaf positions
      leafPositions.push({ x: leafX, y: leafY });
    }
  }

  // draw branches (black circles)
  for (let i = 0; i < currentCount; i++) {
    fill(89, 57, 51); // branch color (brown)
    noStroke();
    ellipse(x[i], y[i], r[i] * 2, r[i] * 2);
  }

  // draw leaves (green circles)
  drawLeaves();

  // stop drawing when maximum circle limit is reached
  if (currentCount >= MAX_BRANCHES) noLoop();
}

// draws green leaves
function drawLeaves() {
  for (let i = 0; i < leafPositions.length; i++) {
    let leaf = leafPositions[i];
    fill(227, 116, 151); // sakura version (pinkish)
    noStroke();
    ellipse(leaf.x, leaf.y, LEAF_RADIUS * 2, LEAF_RADIUS * 2);
  }
}

// mouse press resets generation and starts from clicked position
function mousePressed() {
  // Start branching from clicked location
  x = [];
  y = [];
  r = [];
  leafPositions = [];
  currentCount = 1;

  // Set initial position of the first circle at mouse click
  x[0] = mouseX;
  y[0] = mouseY;
  r[0] = INITIAL_RADIUS;

  loop(); // Start generating branches and leaves
}

**/