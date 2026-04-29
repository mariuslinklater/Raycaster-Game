// Raycaster Game --- CS30 Capstone Final Project
// Marius Linklater
// April 21 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

console.log('diddy')
const TILE_SIZE = 10;
let map = [[1,1,1,1,1]
           [1,0,0,0,1]
           [1,0,1,0,1]
           [1,0,1,0,1]
           [1,1,1,1,1]];

class Ray(x, y) {
  constructor(){
    this.x = x;
    this.y = y;

  }
}  

class Wall(x, y) {
  constructor(x, y) {
  this.x = x;
  this.y = y;  
  }

}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}

function makeFlatMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 1) {
        square(x * TILE_SIZE,y * TILE_SIZE, TILE_SIZE);  
      }
    }
  }
}
