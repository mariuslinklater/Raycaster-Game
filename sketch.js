// Raycaster Game --- CS30 Capstone Final Project
// Marius Linklater
// April 21 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let player;
let viewAngleValue = 0;
let rays  = [];
let cellSize = 100;
let theWalls = [];
let map = 
  [[1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,1],
    [1,0,0,0,0,1,0,1],
    [1,0,1,0,0,1,0,1],
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
    let collisionPoint = collideLineLine(Ray.x1, Ray.x2, wall.x1, wall.x2, true);
    fill('red');
    circle(collisionPoint.x, collisionPoint.y, 15);

  }
  draw() {
    if(keyIsDown(LEFT_ARROW)){
      viewAngleValue-= 0.1;
    }
    if(keyIsDown(RIGHT_ARROW)){
      viewAngleValue+= 0.1;
    }
    push();

    translate(this.x, this.y);
    rotate(viewAngleValue, this.startPoint);
    
    let xVector = this.length * cos(this.angle);
    let yVector = this.length * sin(this.angle);

    line(0, 0, xVector, yVector);
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
    stroke('black');
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

class Player {
  constructor(x, y, fov) {
    this.x = x;
    this.y = y;
    this. viewAngle = 0;
    this.fov = fov;
    this.speed = 5;
    for (let i = 0; i < this.fov; i++) {
      rays.push(new Ray(this.x, this.y, i));
    }
  }
  
  draw() {
    if (keyIsDown(87)) {
      player.y -= this.speed;
    }
    if (keyIsDown(83)) {
      player.y += this.speed;
    }
    if (keyIsDown(68)) {
      player.x += this.speed;
    }
    if (keyIsDown(65)) {
      player.x -= this.speed;
    }
    fill('red');
    circle(this.x, this.y, 5);
  }
  
}

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight); 
  makeMapWalls(map);
  player = new Player(random(0, width), random(0, height), 60);

}

function draw() {
  background(220);  
  drawWalls(theWalls);

  player.draw();

  for(let ray of rays) {
    ray.x = player.x;
    ray.y = player.y;
    ray.draw();
  }


  for(let ray = 0; ray < rays.length; ray++){
    for(let wall = 0; wall < theWalls.length; wall++){
      rays[ray].collide(rays[ray], theWalls[wall]);
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
