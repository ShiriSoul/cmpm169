// sketch.js - code for impossible geometry
// Author: Tony Pau
// Date: 2/10/2025

// constants and globals
const TILE_COUNT = 20;
let actRandomSeed = 0;
let actStrokeCap;

let myInstance;
let canvasContainer;
let centerHorz, centerVert;
let color2 = 'blue'; // default line color

let circleColor = 'blue'; // default circle color
let circleRadius = 50; // initial circle radius

class LinePattern {
  constructor() {
    this.tileCount = TILE_COUNT;
    this.strokeCap = ROUND;
  }

  // line pattern generation
  drawPattern() {
    randomSeed(actRandomSeed);

    for (let gridY = 0; gridY < this.tileCount; gridY++) {
      for (let gridX = 0; gridX < this.tileCount; gridX++) {
        let posX = width / this.tileCount * gridX;
        let posY = height / this.tileCount * gridY;

        let toggle = int(random(0, 2));

        stroke(color2); // use color for strokes (blue or red)
        
        if (toggle == 0) {
          strokeWeight(mouseX / 60);
          line(posX, posY, posX + width / this.tileCount, posY + height / this.tileCount);
        }
        if (toggle == 1) {
          strokeWeight(mouseY / 30);
          line(posX, posY + width / this.tileCount, posX + height / this.tileCount, posY);
        }
      }
    }
  }
}

// canvas resizing logic
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// set up
function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  myInstance = new LinePattern();

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
}

// main animation loop
function draw() {
  background(220);
  strokeCap(actStrokeCap); // sets stroke cap for lines

  // calls drawPattern method to render lines
  myInstance.drawPattern();

  // Draw dynamic circle
  drawDynamicCircle();
}

// keys function
function keyReleased() {
  if (key === 's' || key === 'S') {
    saveCanvas('drawing', 'png');
  }

  if (key == 'r' || key == 'R') {
    actRandomSeed = random(100000); // regenerate pattern
  }

  // keys to change line type
  if (key == '1') actStrokeCap = ROUND;
  if (key == '2') actStrokeCap = SQUARE;
  if (key == '3') actStrokeCap = PROJECT;
}

function mousePressed() {
  color2 = 'red'; // line color when mouse pressed
  circleColor = 'red'; // circle color when mouse pressed
}

function mouseReleased() {
  color2 = 'blue'; // line color when mouse released
  circleColor = 'blue'; // circle color when mouse released
}

// draw dynamic circle
function drawDynamicCircle() {
  let maxRadius = width / 4; // max radius size
  let dynamicRadius = map(mouseX, 0, width, 50, maxRadius); // map mouseX position to radius size

  // draws dynamic circle
  fill(circleColor);
  noStroke();
  ellipse(width / 2, height / 2, dynamicRadius * 2, dynamicRadius * 2); // center circle
}
