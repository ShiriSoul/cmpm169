// sketch.js - all code for live camera drawing
// Author: Tony Pau
// Date: 2/03/2025

// constants and globals
const NOISE_INTENSITY = 50; // brush spread
const BRUSH_STEP = 15; // brush speed
const LINE_THICKNESS = 1; // stroke size
const SCAN_DENSITY = 20; // distance between scan points

let video;
let canvasContainer;
let centerHorz, centerVert;
let streamReady = false;
let lines = [];
let scanPositions = [];
let initialized = false;
let drawIndex = 0;

// stained glass pattern
let drawStainedGlass = false; // toggle stained glass filter
let glassPattern = []; // store stained glass pattern

// drawing line class
class DrawingLine {
    constructor(x, y, color) {
        this.points = [{ x, y }];
        this.color = color;
    }

    // adds new point to the line
    update(x, y) {
        this.points.push({ x, y });
    }

    // draws line
    draw() {
        if (this.points.length < 2) return;
        stroke(this.color);
        strokeWeight(LINE_THICKNESS);
        noFill();
        beginShape();
        for (let p of this.points) {
            curveVertex(p.x, p.y);
        }
        endShape();
    }
}

// resize canvas
function resizeScreen() {
  let size = Math.min(canvasContainer.width(), canvasContainer.height());
  centerHorz = size / 2;
  centerVert = size / 2;
  resizeCanvas(size, size); // resize to square canvas
}

// canvas and video feed setup
function setup() {
  canvasContainer = $("#canvas-container");
  let size = Math.min(canvasContainer.width(), canvasContainer.height()); // square canvas
  let canvas = createCanvas(size, size);
  canvas.parent("canvas-container");
  
  video = createCapture(VIDEO, () => streamReady = true);
  video.size(width, height);
  video.hide();
  
  $(window).resize(resizeScreen);
  resizeScreen();
  initialized = true;
  
  // initialize scan positions in square pattern
  for (let x = 0; x < size; x += SCAN_DENSITY) {
    for (let y = 0; y < size; y += SCAN_DENSITY) {
        scanPositions.push({ x, y });
    }
  }

  // generate initial stained glass pattern
  createStainedGlassPattern();
}

// create stained glass pattern
function createStainedGlassPattern() {
    glassPattern = [];
    let size = width;
    let numShapes = 50; // number of shapes

    // create interconnected polygons (simulate stained glass)
    for (let i = 0; i < numShapes; i++) {
        let x1 = random(size);
        let y1 = random(size);
        let x2 = random(size);
        let y2 = random(size);
        let x3 = random(size);
        let y3 = random(size);
        let x4 = random(size);
        let y4 = random(size);

        // stained glass colors with transparency
        let colorFill = color(random(255), random(255), random(255), 15);
        
        // create shapes that fills the canvas
        glassPattern.push({ x1, y1, x2, y2, x3, y3, x4, y4, color: colorFill });
    }
}

// draws stained glass pattern with overall opacity
function applyStainedGlassOverlay() {
    // sets opacity for entire stained glass layer
    push();
    fill(255, 255, 255, 10); // light opacity for entire stained glass layer
    noStroke();
    
    for (let shape of glassPattern) {
        fill(shape.color); // use the shape's own color
        beginShape();
        vertex(shape.x1, shape.y1);
        vertex(shape.x2, shape.y2);
        vertex(shape.x3, shape.y3);
        vertex(shape.x4, shape.y4);
        endShape(CLOSE);
    }
    pop();
}

// drawing loop
function draw() {
    if (!streamReady || !initialized) return;

    // clears canvas first to draw strokes
    background(220, 20);

    // draws brush strokes
    for (let i = 0; i < 100; i++) { // draws multiple strokes per frame
        if (scanPositions.length === 0) return;
        
        let { x, y } = scanPositions[drawIndex % scanPositions.length];
        let c = video.get(x, y);
        
        let newLine = new DrawingLine(x, y, c);
        for (let j = 0; j < 12; j++) { // adds more points to stroke
            let stepX = constrain(x + random(-NOISE_INTENSITY, NOISE_INTENSITY), 0, width);
            let stepY = constrain(y + random(-NOISE_INTENSITY, NOISE_INTENSITY), 0, height);
            newLine.update(stepX, stepY);
        }
        lines.push(newLine);
        drawIndex++;
    }
    
    // draws all strokes
    for (let line of lines) {
        line.draw();
    }

    // applies stained glass overlay if enabled
    if (drawStainedGlass) {
        applyStainedGlassOverlay(); // draws stained glass on canvas as background
    }
}

// handle key presses
function keyPressed() {
  // save png
  if (key === 's' || key === 'S') {
      saveCanvas('drawing', 'png');
  }

  // stained glass filter toggle
  if (key === 'd' || key === 'D') {
      drawStainedGlass = !drawStainedGlass;
  }

  // regenerate stained glass pattern
  if (key === 'r' || key === 'R') {
      createStainedGlassPattern();
  }
}
