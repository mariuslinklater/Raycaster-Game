// Raycaster Game --- CS30 Capstone Final Project
// Marius Linklater
// April 21 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let harjot;
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
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = 800;
  }
  cast(){
  }
  collide(Ray, wall) {
    let collisionTrue = collideLineLine(this.Ray.x1, this.Ray.x2, this.wall.x1, this.wall.x2);
    if (collisionTrue) {
      return collideLineLine(this.Ray.x1, this.Ray.x2, this.wall.x1, this.wall.x2, true);
    }
  }
  draw() {
    let xVector = this.length * cos(this.angle);
    let yVector = this.length * sin(this.angle);

    line(this.x, this.y, this.x + xVector, this.y + yVector);
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
    this.fov = fov;
    this.viewfield = [];
    for (let i = 0; i < this.fov; i++) {
      this.viewfield.push(new Ray(this.x, this.y, i));
    }
  }
  
  drawHarjot(x, y) {
    fill('red');
    circle(x, y, 5);
  }
  
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  let harjot = new Player(width/2, height/2, 360);
  let wall = new Wall(random(0, height), random(0, width), random(0, height), random(0, width));
  theWalls.push(wall);

}

function draw() {
  background(220);  
  drawWalls(theWalls);
  runPlayer();harjot.drawHarjot();
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
        if (map[i][j + 1] === 1 && !map[i][j] === undefined) {
          let wall = new Wall (i * cellSize);
          theWalls.push(wall);
        }
      }
    }
  }
}

function runPlayer() {
  drawHarjot(mouseX, mouseY);  
}
