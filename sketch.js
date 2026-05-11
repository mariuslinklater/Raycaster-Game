// Raycaster Game --- CS30 Capstone Final Project
// Marius Linklater
// April 21 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let cellSize = 20;
let walls = [];
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
  constructor(ay, ax, by, bx){
    this.a = createVector(ay, ax);
    this.b = createVector(by, bx);
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
  for (let x = 0; x < map.length; x++){ // loops through the map to see where the walls are, if a point on the map is in a wall it checks its neighbors to make actual walls
    for (let y = 0; x < map[x].length; y++){
      if (map[x][y] === 1){
        if (map[x][y - 1] === 1) {
          let wall = new Wall(map[x], map[y], map[x], map[y - 1]);
          walls.push(wall);
        }
        if (map[x][y + 1] === 1){
          let wall = new Wall(map[x], map[y], map[x], map[y + 1]);
          walls.push(wall);
        }
        if (map[x + 1][y] === 1){
          let wall = new Wall(map[x], map[y], map[x + 1], map[y]);
          walls.push(wall);
        }
        if (map[x - 1][y] === 1) {
          let wall = new Wall(map[x], map[y], map[x - 1], map[y]);
          walls.push(wall);
        }
      }
    }
  }
}