// Raycaster Game --- CS30 Capstone Final Project
// Marius Linklater
// April 21 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let cellSize = 20;
let theWalls = [];
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
  collide(Ray, wall) {
    let collisionTrue = collideLineLine(this.Ray.x1, this.Ray.x2, this.wall.x1, this.wall.x2);
    if (collisionTrue) {
      return collideLineLine(this.Ray.x1, this.Ray.x2, this.wall.x1, this.wall.x2, true);
    }
  }
}

class Wall {
  constructor(ay, ax, by, bx){
    this.ay = ay;
    this.ax = ax;
    this.by = by;
    this.bx = bx;
  }

  draw() {
    strokeWeight(5);
    stroke('black');
    line(this.ax, this.ay, this.bx, this.by);
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
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  makeMapWalls(map);
  let wall = new Wall(random(0, height), random(0, width), random(0, height), random(0, width));
  theWalls.push(wall);
}

function draw() {
  background(220);  
  drawWalls(theWalls);
}

function drawWalls(theWalls) {
  for (let i = 0; i < theWalls.length; i++) {
    theWalls[0].draw();
  }
}

function makeMapWalls(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === 1) {
        console.log('wall here!');
      }
    }
  }
}