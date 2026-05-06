// Raycaster Game --- CS30 Capstone Final Project
// Marius Linklater
// April 21 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let cellSize = 20;
let map = 
  [[1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,1],
    [1,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,1]];
class Ray {
  constructor(x, y, angle){
    
  }
  cast(){

  }
}
class Wall {
  constructor(){
  }
}

class Player {
  constructor(x, y, fov) {
    this.x = x;
    this.y = y;
    this. viewAngle = 0;
    this.fov = 45;
    this.viewfield = [];
    for (let i = 0; i < this.fov; i++) {
      this.viewfield.push(new Ray(this.x, this.y, i));
    }
  }
  move(){
    if (keyIsDown(68)) {
      this.x++;
    }
    if (keyIsDown(65)) {
      this.x--; 
    }
    if (keyIsDown(87)) {
      this.y++;
    }
    if (keyIsDown(83)) {
      this.y--;  
    }
  }
  rotate(){
  
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}