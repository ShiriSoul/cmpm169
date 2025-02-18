// sketch.js - all code for live camera drawing
// Author: Tony Pau
// Date: 2/03/2025

'use strict';

// constants and globals
var joinedText;
var alphabet = 'ABCDEFGHIJKLMNORSTUVWYZÄÖÜß,.;!? ';
var counters = [];
var posX, posY;
var drawAlpha = true; // transparency toggle
var useRainbow = false; // rgb color toggle
var canvasContainer;
var centerHorz, centerVert;
var myInstance;
var letterSize = 18; // default letter size
var baseLetterSize = 18; // resets when mouse is released

// text to show on design
function preload() {
  joinedText = [
    "If you know the enemy and know yourself,",
    "You need not fear the result of a hundred battles.",
    "If you know yourself but not the enemy,",
    "For every victory gained you will also suffer a defeat.",
    "If you know neither the enemy nor yourself,",
    "You will succumb in every battle."
  ];
}

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    posX = 20;
    posY = 40;

    for (var i = 0; i < joinedText.length; i++) {
      var upperCaseChar = joinedText.charAt(i).toUpperCase();
      var index = alphabet.indexOf(upperCaseChar);
      if (index < 0) continue;

      let alphaValue = drawAlpha ? counters[index] * 10 : 255; // handles transparency

      // rgb effect
      if (useRainbow) {
        let rainbowColor = color(
          sin(frameCount * 0.05) * 127 + 128, 
          sin(frameCount * 0.05 + TWO_PI / 3) * 127 + 128, 
          sin(frameCount * 0.05 + TWO_PI * 2 / 3) * 127 + 128,
          alphaValue // applies transparency if 'A' pressed
        );
        fill(rainbowColor);
      } else {
        fill(214, 51, 184, alphaValue);
      }

      var sortY = index * 20 + 40;
      var m = map(mouseX, 50, width - 50, 0, 1);
      m = constrain(m, 0, 1);
      var interY = lerp(posY, sortY, m);

      textSize(letterSize); // applies dynamic text size
      text(joinedText.charAt(i), posX, interY);

      posX += textWidth(joinedText.charAt(i));
      if (posX >= width - 200 && upperCaseChar == ' ') {
        posY += 60;
        posX = 20;
      }
    }
  }
}

// resize canvas
function resizeScreen() {
  centerHorz = width / 2;
  centerVert = height / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// canvas setup
function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-container");

  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  noStroke();
  textFont('monospace', baseLetterSize);

  if (Array.isArray(joinedText)) {
    joinedText = joinedText.join(' ');
  }

  for (var i = 0; i < alphabet.length; i++) {
    counters[i] = 0;
  }

  countCharacters();
}

// draw loop
function draw() {
  background(220);
  myInstance.myMethod();
}

// count character occurrences
function countCharacters() {
  for (var i = 0; i < joinedText.length; i++) {
    var c = joinedText.charAt(i);
    var upperCaseChar = c.toUpperCase();
    var index = alphabet.indexOf(upperCaseChar);
    if (index >= 0) counters[index]++;
  }
}

// allows modifying text when mouse pressed
function mouseDragged() {
  letterSize = baseLetterSize + (mouseY / 10);
}

// reset text size when mouse released
function mouseReleased() {
  letterSize = baseLetterSize;
}

// keys
function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas('text_visual', 'png');
  if (key == 'a' || key == 'A') drawAlpha = !drawAlpha; // transparency
  if (key == 'r' || key == 'R') useRainbow = !useRainbow; // rgb lights
}