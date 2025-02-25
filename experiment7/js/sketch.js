// sketch.js - Bubble Chart of Top 10 Highest Fire Rate Guns in Valorant
// Author: Tony Pau
// Date: 2/24/2025

let canvasWidth = 800;
let canvasHeight = 600;
let weaponData = []; // array for weapon data
let dataReady = false; // checks if data is ready
let circles = []; // array for hold circle positions and sizes

function setup() {
    let canvasContainer = select("#canvas-container");
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(canvasContainer);
    
    // fetch weapon data from Valorant API
    fetchWeaponData().then(() => {
        console.log("Weapon data fetched successfully:", weaponData); // logs weapon data
        dataReady = true; // sets flag to true when data is ready
        noLoop(); // stops draw loop after data is ready
    }).catch(err => {
        console.error("Error fetching weapon data: ", err); // debug
    });
}

async function fetchWeaponData() {
    const url = 'https://valorant-api.com/v1/weapons'; // API URL
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    weaponData = data.data;

    // sort weapons by fire rate and get top 10
    weaponData.sort((a, b) => (b.fireRate || 0) - (a.fireRate || 0)); // use 0 for undefined fireRate
    weaponData = weaponData.slice(0, 10);
}

function draw() {
    background(0);
    
    // draw if weaponData is ready
    if (dataReady) {
        // define circle sizes
        const sizes = [150, 140, 130, 120, 110, 100, 90, 80, 70, 60];

        // draw circles
        circles = []; // reset circles array
        for (let i = 0; i < weaponData.length; i++) {
            const diameter = sizes[i]; // use predefined sizes

            // find non-overlapping position for circle (prevents covering each other)
            let xPos, yPos, overlaps;
            do {
                overlaps = false; // reset overlap flag
                xPos = random(diameter / 2, width - diameter / 2); // random x pos
                yPos = random(diameter / 2, height - diameter / 2); // random y pos

                // checks for overlaps with existing circles
                for (let j = 0; j < circles.length; j++) {
                    const other = circles[j];
                    const distance = dist(xPos, yPos, other.x, other.y);
                    if (distance < (diameter / 2 + other.size / 2)) {
                        overlaps = true; // sets overlap flag if circles overlap
                        break;
                    }
                }
            } while (overlaps); // repeat until a non-overlapping position is found

            // stores position and size of the circle
            circles.push({ x: xPos, y: yPos, size: diameter });

            // assigns fixed color for each circle based on index
            fill(100 + i * 15, 100, 255 - i * 25); // colors based on index
            ellipse(xPos, yPos, diameter, diameter); // draws the circle

            // displays weapon name in circle
            fill(255); // change text color to white for visibility
            textAlign(CENTER, CENTER);
            textSize(16);
            text(weaponData[i].displayName, xPos, yPos); // use displayName for weapon name
        }
    }
}

// keys
function keyPressed() {
    if (key === 's' || key === 'S') { // save png
        saveCanvas('valorant_bubble_chart', 'png');
    } else if (key === 'r' || key === 'R') { // regenerate bubble chart
        dataReady = false; // resets dataReady flag
        fetchWeaponData().then(() => {
            dataReady = true; // sets flag to true when data is ready
            redraw(); // redraws canvas
        }).catch(err => {
            console.error("Error fetching weapon data: ", err); // debug
        });
    }
}
