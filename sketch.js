// Raycaster Game --- CS30 Capstone Final Project
// Marius Linklater
// April 21 2026
//
// Extra for Experts:
// a lot of this uses collide2d to work, so i had to use a different library, 

let player;
let viewAngleValue = 0;
let rays  = [];
let cellSize = 20;
let theWalls = [];
let firstMap = 
  [[1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,0,0,1,0,1],
    [1,0,1,0,0,1,0,1],
    [1,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,1]];

let secondMap = 
  [[1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]];
class Ray {
  constructor(x, y, angle){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = 800;
    this.x2 = this.length * cos(this.angle);
    this.y2 = this.length * sin(this.angle);
  }
  update(){
    this.x = player.x;
    this.y = player.y;

    let currentAngle = viewAngleValue + this.angle;
    this.x2 = this.x + this.length * cos(currentAngle);
    this.y2 = this.y + this.length * sin(currentAngle);  
  }

  cast() {
    let currentAngle = viewAngleValue + this.angle;
    let x2 = this.x + this.length * cos(currentAngle);
    let y2 = this.y + this.length * sin(currentAngle);
    let closestPoint;
    let smallestDistance = Infinity;

    for (let wall of theWalls) {
      let collisionPoint = collideLineLine(this.x, this.y, x2, y2, wall.x1, wall.y1, wall.x2, wall.y2, true);      
      let theDistance = dist(this.x, this.y, collisionPoint.x, collisionPoint.y);
      if (theDistance < smallestDistance) {
        smallestDistance = theDistance;
        closestPoint = collisionPoint;
      }
    }
    return closestPoint;
  }

  draw() {
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
      viewAngleValue-= 0.05;
    }
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
      viewAngleValue+= 0.05;
    }
    push();

    translate(this.x, this.y);
    rotate(viewAngleValue);
    let x2 = this.length * cos(this.angle);
    let y2 = this.length * sin(this.angle);

    pop();
  }
}


class Wall {
  constructor(x1, y1 , x2, y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  draw() {
    strokeWeight(3);
    stroke('white');
    line(this.x1, this.y1, this.x2, this.y2);
  }
}


class Player {
  constructor(x, y, fov) {
    this.health = 100;
    this.radius = 8;
    this.x = x;
    this.y = y;
    this.viewAngle = 0;
    this.fov = fov;
    this.speed = 1;

    for (let i = 0; i < this.fov; i++) {
      rays.push(new Ray(this.x, this.y, i));
    }
  }

  draw() {
    if (keyIsDown(87)) {
      let nextX = this.x + cos(viewAngleValue + this.fov/2) * this.speed;
      let nextY = this.y + sin(viewAngleValue + this.fov/2) * this.speed;
      if (collideWithWalls(nextX, this.y) === false) {
        this.x = nextX;
      }
      if (collideWithWalls(this.x, nextY) === false) {
        this.y = nextY;
      }
    }
    if (keyIsDown(83)) {
      let nextX = this.x - cos(viewAngleValue + this.fov/2) * this.speed;
      let nextY = this.y - sin(viewAngleValue + this.fov/2) * this.speed;
      if (collideWithWalls(nextX, this.y) === false) {
        this.x = nextX;
      }
      if (collideWithWalls(this.x, nextY) === false) {
        this.y = nextY;
      }
    }
    strokeWeight(2);
    fill('red');
    circle(this.x, this.y, this.radius);
  }
}


function preload(){

}


function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight); 
  makeMapWalls(secondMap);
  player = new Player(30, 50, 100);

}


function draw() {
  background(0); 
  make3d();  
  drawWalls(theWalls);
 
  player.draw();

  for (let ray of rays) {
    ray.update();
    ray.draw();
  }

  for(let ray = 0; ray < rays.length; ray++){
    for(let wall = 0; wall < theWalls.length; wall++){
      rays[ray].cast;
    }
  }
}


function drawWalls(theWalls) {
  for (let i = 0; i < theWalls.length; i++) {
    theWalls[i].draw();
  }
}


function makeMapWalls(map) {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === 1) {
        let x = col * cellSize;
        let y = row * cellSize;

        if (row === 0 || map[row - 1][col] === 0) {
          theWalls.push(new Wall(x, y, x + cellSize, y));
        }

        if (row === map.length - 1 || map[row + 1][col] === 0) {
          theWalls.push(new Wall(x, y + cellSize, x + cellSize, y + cellSize));
        }

        if (col === 0 || map[row][col - 1] === 0) {
          theWalls.push(new Wall(x, y, x, y + cellSize));
        }

        if (col === map[row].length - 1 || map[row][col + 1] === 0) {
          theWalls.push(new Wall(x + cellSize, y, x + cellSize, y + cellSize));

        }
      }
    }
  }
}


function collideWithWalls(x, y) {
  for (let wall of theWalls) {
    if  (collideLineCircle(wall.x1, wall.y1, wall.x2, wall.y2, x, y, player.radius * 2)) {
      return true;
    }
  }
  return false;
}


function make3d() {
  let wallSliceWidth = width/rays.length;
  for (let i = 0; i < rays.length; i++) {
    let collisionPoint = rays[i].cast();
    let theRayDistance = dist(player.x, player.y, collisionPoint.x, collisionPoint.y);
    let wallHeight = 1/theRayDistance * 7000;
    noStroke();
    
    fill( 1/theRayDistance * 4000, 1/theRayDistance * 4000, 1/theRayDistance * 4000);
    
    rect(i * wallSliceWidth, height / 2 - wallHeight / 2, wallSliceWidth, wallHeight);
  }
}