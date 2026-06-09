// Raycaster Game --- CS30 Capstone Final Project
// Marius Linklater
// April 21 2026
//
// Extra for Experts:
// a lot of this uses collide2d to work, so i had to use a different library, it also uses p5.party to allow multiplayer

let playerColors = ['red', 'green', 'yellow', 'orange', 'white', 'pink'];
let yourPlayer;
let playerColor;
let playerDiameter = 8;

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
    this.x2 = this.x + this.length * cos(this.angle);
    this.y2 = this.y + this.length * sin(this.angle);
  }



  update(){
    this.x = yourPlayer.x;
    this.y = yourPlayer.y;

    let currentAngle = viewAngleValue + this.angle;
    this.x2 = this.x + this.length * cos(currentAngle);
    this.y2 = this.y + this.length * sin(currentAngle);  
  }



  cast() {
    let closestPoint;
    let smallestDistance = Infinity;

    for (let wall of theWalls) {
      let collisionPoint = collideLineLine(this.x, this.y, this.x2, this.y2, wall.x1, wall.y1, wall.x2, wall.y2, true);   
      if (!collisionPoint.x && !collisionPoint.y) {
        continue;   
      }
      let theDistance = dist(this.x, this.y, collisionPoint.x, collisionPoint.y);
      if (theDistance < smallestDistance) {
        smallestDistance = theDistance;
        closestPoint = collisionPoint;  
      }
    }
      
    return {point :closestPoint, distance: smallestDistance};
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
    this.x = x;
    this.y = y;
    this.fov = fov;
    this.speed = 1;
    this.color = 'red';

    for (let i = 0; i < this.fov; i++) {
      rays.push(new Ray(this.x, this.y, i));
    }
  }



  draw() {

    if(keyIsDown(LEFT_ARROW)){
      viewAngleValue -= 2;
    }

    if(keyIsDown(RIGHT_ARROW)){
      viewAngleValue += 2;
    }

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

    if (keyIsDown(65)) {
      let nextX = this.x - cos(viewAngleValue + this.fov/2 + 90) * this.speed;
      let nextY = this.y - sin(viewAngleValue + this.fov/2 + 90) * this.speed;
      if (collideWithWalls(nextX, this.y) === false) {
        this.x = nextX;
      }
      if (collideWithWalls(this.x, nextY) === false) {
        this.y = nextY;
      }
    }

    if (keyIsDown(68)) {
      let nextX = this.x + cos(viewAngleValue + this.fov/2 + 90) * this.speed;
      let nextY = this.y + sin(viewAngleValue + this.fov/2 + 90) * this.speed;
      if (collideWithWalls(nextX, this.y) === false) {
        this.x = nextX;
      }
      if (collideWithWalls(this.x, nextY) === false) {
        this.y = nextY;
      }
    }

    strokeWeight(2);
    fill(this.color);
    circle(this.x, this.y, playerDiameter);
  }
}




function preload(){
  partyConnect("wss://demoserver.p5party.org", "raycaster_battle_cs30");
  shared = partyLoadShared('shared');
  enemyImg = loadImage('someGuy.jpg');
}




function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight); 
  makeMapWalls(secondMap);

  if (partyIsHost()) {
    shared.playerCount = 0;
  }

  yourPlayer = new Player(30, 50, 100);
  playerNumber = shared.playerCount;
  shared.playerCount++;

  playerColor = playerColors[shared.playerCount - 1];

  shared[playerNumber] = {x: yourPlayer.x, y: yourPlayer.y, color: playerColor};

  yourPlayer.color = playerColor;
}




function draw() {

  shared[playerNumber].x = yourPlayer.x;
  shared[playerNumber].y = yourPlayer.y;
  shared[playerNumber].color = yourPlayer.color;


  background(0);   

  make3d();  

  for (let ray of rays) {
    ray.update();
  }
  
  drawWalls(theWalls);

  yourPlayer.draw();

  for (let guest = 0; guest < shared.playerCount; guest++){

    let somePlayer = shared[guest];
    fill(somePlayer.color);
    circle(somePlayer.x, somePlayer.y, playerDiameter);    
  }

  drawPlayers();
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
    if  (collideLineCircle(wall.x1, wall.y1, wall.x2, wall.y2, x, y, playerDiameter * 2)) {
      return true;
    }
  }
  for (let player = 0; player < shared.playerCount; player++) {
    if (player === playerNumber) {
      continue;
    }
    if  (collideCircleCircle(x, y, playerDiameter, shared[player].x, shared[player].y, playerDiameter)) {
      return true;
    }
  }
  return false;
}




function make3d() {

  let wallSliceWidth = width/rays.length;
  for (let i = 0; i < rays.length; i++) {

    let theRay = rays[i].cast();
    let theRayDistance = dist(yourPlayer.x, yourPlayer.y, theRay.point.x, theRay.point.y);  

    let wallHeight = 1/theRayDistance * 7000;

    noStroke();
    fill(1/ theRayDistance * 4000 - 400, 1/theRayDistance * 4000 - 400, 1/theRayDistance * 4000);
    rect(i * wallSliceWidth, height / 2 - wallHeight / 2, wallSliceWidth, wallHeight);
  }
}




function drawPlayers() {

  for (let enemy = 0; enemy < shared.playerCount; enemy++) {

    if (enemy === playerNumber || !shared[enemy]) {
      continue;
    }

    let theRayDistance = dist(yourPlayer.x, yourPlayer.y, shared[enemy].x, shared[enemy].y);

    let closestRay = 0;
    let smallestDistance = Infinity;

    for (let i = 0; i < yourPlayer.fov; i++) {

      let x2 = yourPlayer.x + cos(viewAngleValue + rays[i].angle) * theRayDistance;
      let y2 = yourPlayer.y + sin(viewAngleValue + rays[i].angle) * theRayDistance;

      let distanceToRay = dist(x2, y2, shared[enemy].x, shared[enemy].y
      );

      if (distanceToRay < smallestDistance) {
        smallestDistance = distanceToRay;
        closestRay = i;
      }
    }
    if (closestRay !== 0 && closestRay !== yourPlayer.fov - 1) {
      let imageX = map( closestRay, 0, rays.length, 0, width );
      let size = 7000 / theRayDistance;

      image(enemyImg, imageX - size/2, height/2 - size/2, size, size * 2); 
    }
  }
}
