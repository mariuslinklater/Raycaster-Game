// Raycaster Game --- CS30 Capstone Final Project
// Marius Linklater
// April 21 2026
//
// Extra for Experts:
// a lot of this uses collide2d to work, so i had to use a different library, it also uses p5.party to allow multiplayer

let shared;

let playerColors = ['red', 'green', 'yellow', 'orange', 'white', 'pink', 'purple', 'lightgreen', 'gray'];
let yourPlayer;
let playerColor;
let playerNumber;
let playerDiameter = 8;
let viewAngleValue = 0;

let rays  = [];
let cellSize = 20;
let theWalls = [];

let lastSwitch;
const WAIT_TIME = 200;

//--------- classes --------------------------------------------------------------------------------//




// just a line really, but very important as this is what the rays actually hit
class Wall {
  constructor(x1, y1 , x2, y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }


  // draws the minimap at the top of the screen
  draw() {
    strokeWeight(3);
    stroke('white');
    line(this.x1, this.y1, this.x2, this.y2);
  }
}



// send out a line from the players coordinates at whatever angle, the ray then hits a wall and the distance returned is how we can make it 3d
class Ray {
  constructor(x, y, angle){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = 800;
    this.x2 = this.x + this.length * cos(this.angle);
    this.y2 = this.y + this.length * sin(this.angle);
  }


  // makes it so the ray shoots out your coordinate and at the right angle relative to where youre looking
  update(){
    this.x = yourPlayer.x;
    this.y = yourPlayer.y;

    let currentAngle = viewAngleValue + this.angle;
    this.x2 = this.x + this.length * cos(currentAngle);
    this.y2 = this.y + this.length * sin(currentAngle);  
  }


  // goes through each point of intersection with the walls and then finds the shortest one and returns that
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



// the point of view for your camera, where the rays shoot out from 
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


  // this is just regular old movement, but it needs some trig to work at different angles of movement
  draw() {
    // changes viewing angle
    if(keyIsDown(LEFT_ARROW)){
      viewAngleValue -= 2;
    }

    if(keyIsDown(RIGHT_ARROW)){
      viewAngleValue += 2;
    }

    // moves player with WASD, but first it checks to see if that would lead to a collision, it does not allow movement in that direction if so
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
// connects you to the p5.party server and loads the image used for other players
  partyConnect("wss://demoserver.p5party.org", "raycaster_battle_cs30");
  shared = partyLoadShared('shared');
  enemyImg = loadImage('someGuy.jpg');
}




function setup() {
// creates your player and the map for the game
  lastSwitch = millis();
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight); 
  makeMapWalls(theMap);

  if (partyIsHost()) {
    shared.playerCount = 0;
  }

  yourPlayer = new Player(cellSize * (shared.playerCount + 2), cellSize * 2, 100);
  playerNumber = shared.playerCount;
  shared.playerCount++;

  playerColor = playerColors[shared.playerCount - 1];

  shared[playerNumber] = {x: yourPlayer.x, y: yourPlayer.y, color: playerColor, health: 100};

  yourPlayer.color = playerColor;  

  shared[playerNumber].color = yourPlayer.color;
}




function draw() {

  shared[playerNumber].x = yourPlayer.x;
  shared[playerNumber].y = yourPlayer.y;

  background(0);   

  make3d();  

  for (let ray of rays) {
    ray.update();
  }
  
  drawWalls(theWalls);

  yourPlayer.draw();

  drawPlayers();

  drawHealthBar();

}



function keyPressed() {
  if(key === 'f' || key === 'F') {
    shoot();
  }
}




//--------- rendering or something --------------------------------------------------------------------------------//




function make3d() {
// divides the screen into the amount of rays you have, then finds the distance from your player to where the ray hits a wall,
// it then draws it, the further away the smaller leading to a 3d effect
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




function drawHealthBar() {
  // health bar, takes players health at puts it at the top of the screen
  let barWidth = 500;
  let barHeight = 25;
  let barX = width/2 - barWidth/2;
  let barY = 20;

  stroke('white');
  fill(60);
  rect(barX, barY, barWidth, barHeight);
  
  let healthBar = map(shared[playerNumber].health, 0, 100, 0, barWidth);
  fill(0, 255, 0);
  rect(barX, barY, healthBar, barHeight);

  //crosshair for gun
  let crossHairLength = 35;
  strokeWeight(3);
  stroke(60);
  line(width/2 - crossHairLength/2, height/2,  width/2 + crossHairLength/2, height/2);
  line(width/2, height/2 - crossHairLength/2, width/2, height/2 + crossHairLength/2);  
}




//--------- enemies --------------------------------------------------------------------------------//




function drawPlayers() {
// goes through each other player in the game finds its distance to the player, then finds the ray that lines up with that 

  for (let guest = 0; guest < shared.playerCount; guest++){
    let somePlayer = shared[guest];
    fill(somePlayer.color);
    circle(somePlayer.x, somePlayer.y, playerDiameter);    
  }

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
    
    // if the enemy is in your fov, it draws them
    if (closestRay !== 0 && closestRay !== yourPlayer.fov - 1) {
      let wallHit = rays[closestRay].cast();
      if (wallHit.distance < theRayDistance - playerDiameter) {
        continue;
      }
      let imageX = map( closestRay, 0, rays.length, 0, width );
      let size = 7000 / theRayDistance;
      tint(shared[enemy].color);
      image(enemyImg, imageX - size/2, height/2 - size/2, size, size * 2); 
    }
  }
}




function shoot() {
// gets the ray in the center of your screen, if it hits a player it reduces their health, when their health hits zero, they respawn.
  let centerRay = rays[Math.floor(yourPlayer.fov / 2)];
  for (let enemy = 0; enemy < shared.playerCount; enemy++) {
    if (enemy === playerNumber) {
      continue;
    }

    let distanceToEnemy = dist(yourPlayer.x, yourPlayer.y, shared[enemy].x, shared[enemy].y);
    let wallHit = centerRay.cast();
    if (wallHit.distance < distanceToEnemy) {
      continue;
    }

    let rayX = yourPlayer.x + cos(viewAngleValue + centerRay.angle) * distanceToEnemy;
    let rayY = yourPlayer.y + sin(viewAngleValue + centerRay.angle) * distanceToEnemy;
    let error = dist(rayX, rayY, shared[enemy].x, shared[enemy].y);

    if (error < playerDiameter * 2) {
      shared[enemy].health -= 10;
    }
  }  
  if (shared[playerNumber].health <= 0) {
    shared[playerNumber].health = 100;
    shared[playerNumber].x = cellSize * (shared[playerNumber] + 2);
    shared[playerNumber].y = cellSize * 2;
    drawDeathMessage();
  }     
   
  if (shared[enemy].health <= 0) {
    shared[enemy].health = 100;
    shared[enemy].x = cellSize * (enemy + 2);
    shared[enemy].y = cellSize * 2;
    drawKillMessage();
  }
}




function drawKillMessage() {
  if (millis() >= lastSwitch + WAIT_TIME) {
    textAlign(CENTER);
    textSize(160);
    fill('white');
    text('KILL', width/2, height/2);
  }
}




function drawDeathMessage() {
  if (millis() >= lastSwitch + WAIT_TIME) {
    textAlign(CENTER);
    textSize(160);
    fill('white');
    text('KILL', width/2, height/2);
  }
}




//--------- map & walls --------------------------------------------------------------------------------//




// 2d array as our map, 1 means wall, zero means empty space
let theMap = 
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1],
    [1,0,0,1,1,1,1,1,1,0,0,0,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,1],
    [1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];




function drawWalls(theWalls) { 
// goes through each wall and draws it
  for (let i = 0; i < theWalls.length; i++) {
    theWalls[i].draw();
  }
}




function collideWithWalls(x, y) {
// checks to see if the player collides with a wall or another player and returns it to stop clipping through walls or players
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




// for each value in our 2d grid , it first checks to see if its a wall , if it is , then it goes through neighboring squares to see if there are empty spaces around it ,
// after that it creates a new wall in between those points
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
