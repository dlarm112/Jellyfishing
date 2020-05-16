let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;
document.body.appendChild(canvas);
let score = 0
let lives = 3
let finalDisplayScore = false
let finalDisplayScoreReady = false;
let history = [0]

let mySound
let gameOverSound
let hitSound
let backgroundSound
let bubble1
let bubble2
let highscore
let soundReady
let left
let right

mySound = new Audio("sounds/bubbles.mp3");
gameOverSound = new Audio("sounds/gameover.mp3");
hitSound = new Audio("sounds/hit.mp3");
backgroundSound = new Audio("sounds/background.mp3");
bubble1 = new Audio("sounds/bubble1.mp3");
bubble2 = new Audio("sounds/bubble2.mp3");
highscore = new Audio("sounds/highscore.mp3");

let frequency = 200;
let blinking = false
let status = ''

let bgReady, heroReady, monsterReady, fishReady, fishReady2, scoreBoardready, heroImageRightready;
let bgImage, heroImage, monsterImage, fishImage, fishImage2, scoreBoardImage, heroImageRight;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "images/bikini.jpg";
  heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "images/sponge.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    monsterReady = false;
  };
  monsterImage.src = "images/patrick.png";
  fishImage = new Image();
  fishImage.onload = function () {
    fishReady = true;
  };
  fishImage.src = "images/fish.png";

  fishImage2 = new Image();
  fishImage2.onload = function () {
    fishReady2 = true;
  };
  fishImage2.src = "images/fish.png";

  scoreBoardImage = new Image();
  scoreBoardImage.onload = function () {
    scoreBoardready = false;
  };
  scoreBoardImage.src = "images/score-board.png";


  heroImageRight = new Image();
  heroImageRight.onload = function () {
    heroImageRightready = false;
  };
  heroImageRight.src = "images/heroImageRight.png";
}

let heroX = (canvas.width / 2) - 65;
let heroY = canvas.height - 130;

let monsterX = -150
let monsterY = -130;

let fishX = Math.floor(Math.random() * (canvas.width - 130) * 0.95)
let fishY = -130;

let fishX2 = Math.floor(Math.random() * (canvas.width - 130) * 0.95)
let fishY2 = -130;

let keysDown = {};

function setupKeyboardListeners() {
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);
  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}
//WINDOW SCROLL LOCK
window.addEventListener("keydown", function (e) {
  // space and arrow keys
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);
var count = canvas.height;
var bubbles = [];
var bubbleCount = 20;
var bubbleSpeed = 1;
var popLines = 6;
var popDistance = 40;
var mouseOffset = {
  x: 0,
  y: 0
}









// START UPDATE
let update = function () {
  scoreBoardready = false
  finalDisplayScore = false

  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  status = "running"
  if (37 in keysDown) { // LEFT
    heroX -= 7
    left = true

    backgroundSound.play();
  }
  if (39 in keysDown) { // RIGHT 
    heroX += 7;
    left = false

    backgroundSound.play();
  }
  if (38 in keysDown) { // UP
    heroY -= 5
  }
  if (40 in keysDown) { // DOWN
    heroY += 5
  }
  monsterY += 8;
  fishY += 6;
  fishY2 += 8;
  if (
    heroX <= (monsterX + 110) &&
    monsterX <= (heroX + 110) &&
    heroY <= (monsterY + 110) &&
    monsterY <= (heroY + 110)
  ) {
    monsterReady = false
    getRndInteger()
    blinking = true
    heroReady = false
    lives--
    hitSound.pause();
    hitSound.currentTime = 0;
    hitSound.play();
    console.log("Lives remaing: ", lives)
  }
  if (
    heroX <= (fishX + 60) &&
    fishX <= (heroX + 130) &&
    heroY <= (fishY + 80) &&
    fishY <= (heroY + 130)
  ) {
    getRndInteger();
    score++
    blinking = false
    bubble2.pause();
    bubble2.currentTime = 0;
    bubble2.play();
    console.log("score:", score)
  }
  if (monsterY > 550 && fishY > 500) {
    getRndInteger();
  }
  if (
    heroX <= (fishX2 + 60) &&
    fishX2 <= (heroX + 130) &&
    heroY <= (fishY2 + 80) &&
    fishY2 <= (heroY + 130)
  ) {
    fishX2 = Math.floor(Math.random() * (canvas.width - 130) * 0.95)
    fishY2 = -130;
    score++
    blinking = false
    heroReady = true
    bubble1.pause();
    bubble1.currentTime = 0;
    bubble1.play();
    console.log("score:", score)
  }

  if (fishY2 > 500) {
    fishX2 = Math.floor(Math.random() * (canvas.width - 130) * 0.95)
    fishY2 = -130;

  }
  if (heroX < -130) {
    heroX = canvas.width - 130

  } else if (heroX > canvas.width - 130) {
    heroX = -130

  }
  if (heroY < canvas.height - 200) {
    heroY = canvas.height - 200
  } else if (heroY > canvas.height - 130) {
    heroY = canvas.height - 130
  }
};
// END UPDATE
//LEFT RIGHT BLINK FUNCTION
let blinkFuncL = function () {
  if (Math.floor(Date.now() / frequency) % 2) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
}
let blinkFunc = function () {
  if (Math.floor(Date.now() / frequency) % 2) {
    ctx.drawImage(heroImageRight, heroX, heroY);
  }
}
// RENDER
let render = function () {
  if (heroReady && left == true) {
    ctx.drawImage(heroImage, heroX, heroY);
  } else if (heroReady) {
    ctx.drawImage(heroImageRight, heroX, heroY);
  } else if (left == true) {
    blinkFuncL();
  } else {
    blinkFunc();
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (fishReady) {
    ctx.drawImage(fishImage, fishX, fishY);
  }
  if (fishReady2) {
    ctx.drawImage(fishImage2, fishX2, fishY2);
  }
    // FONT PROPERTIES
  ctx.font = '25px Impact';
  ctx.fillStyle = "firebrick"
  ctx.textAlign = "left";
  ctx.fillText(`${score}`, 706, 82);
  ctx.fillText(`${lives}`, 706, 135);
  ctx.fillStyle = "white"
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 30, 30);
  ctx.fillText(`Hi Score: ${history[0]}`, 30, 480);
  
};

// PATRICK / JELLYFISH SELECTOR
function getRndInteger() {
  let number = Math.floor(Math.random() * 100 + 1);

  if (number < 50) {
    monsterX = -300
    fishX = -300
    createPatrick();
    return;
  } else
    monsterX = -300
  fishX - 300
  createFish();
  return;
}
let createPatrick = function () {
  monsterReady = true
  monsterX = Math.floor(Math.random() * (canvas.width - 130) * 0.85)
  monsterY = -130;
}
let createFish = function () {
  fishReady = true
  fishX = Math.floor(Math.random() * (canvas.width - 130) * 0.95)
  fishY = -130;
}

//RESET GAME
let reset = function () {
  if (status == "running") {
    lives = 0
    return;
  }
  elapsedTime = 0
  score = 0
  startTime = Date.now();
  heroX = (canvas.width / 2) - 65;
  heroY = canvas.height - 130;
  monsterX = -150
  monsterY = -130;
  fishX = Math.floor(Math.random() * (canvas.width - 130) * 0.95)
  fishY = -130;
  fishX2 = Math.floor(Math.random() * (canvas.width - 130) * 0.95)
  fishY2 = -130;
  blinking = false;
  heroReady = true;
  finalDisplayScoreReady = false;
  lives = 3
  mySound.play();
  gameOverSound.pause();
  gameOverSound.currentTime = 0;
  backgroundSound.play();
  main();
}

//RUNS GAME
var main = function () {
  if (lives > 0 && elapsedTime < 30) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    gameOverSequence();
    console.log("game over sequence worked")
  }
};

function gameOverSequence() {
  gameOverSound.play();
  backgroundSound.pause();
  backgroundSound.currentTime = 0;
  scoreBoardready = true
  finalDisplayScoreReady = true
  if (score > history[0]) {
    history[0] = score
    highscore.play();
  }
  status = "stopped"
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
setupKeyboardListeners();
loadImages();

// --------------
// Animation Loop
// --------------

function animate() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();

  if (scoreBoardready) {
    ctx.drawImage(scoreBoardImage, 254, 147);
  }
  if (finalDisplayScoreReady) {
    ctx.textAlign = "center";
    ctx.font = "60px Impact";
    ctx.fillStyle = "#fef53d"
    ctx.fillText(`${score}`, 400, 285);
    ctx.strokeStyle = "#702612"
    ctx.lineWidth = 2.5;
    ctx.strokeText(`${score}`, 400, 285);
  }

  for (var i = 0; i < bubbles.length; i++) {
    // first num = distance between waves
    // second num = wave height
    // third num = move the center of the wave away from the edge
    bubbles[i].position.x = Math.sin(bubbles[i].count / bubbles[i].distanceBetweenWaves) * 50 + bubbles[i].xOff;
    bubbles[i].position.y = bubbles[i].count;
    bubbles[i].render();

    if (bubbles[i].count < 0 - bubbles[i].radius) {
      bubbles[i].count = canvas.height + bubbles[i].yOff;
    } else {
      bubbles[i].count -= bubbleSpeed;
    }
  }

  w.requestAnimationFrame(animate);
}

w.requestAnimationFrame(animate);



// ------------------
// Bubble Constructor
// ------------------

var createBubble = function () {
  this.position = {
    x: 0,
    y: 0
  };
  this.radius = 8 + Math.random() * 6;
  this.xOff = Math.random() * canvas.width - this.radius;
  this.yOff = Math.random() * canvas.height;
  this.distanceBetweenWaves = 50 + Math.random() * 40;
  this.count = canvas.height + this.yOff;
  this.color = '#8bc9ee';
  this.lines = [];
  this.popping = false;
  this.maxRotation = 85;
  this.rotation = Math.floor(Math.random() * (this.maxRotation - (this.maxRotation * -1))) + (this.maxRotation * -1);
  this.rotationDirection = 'forward';

  // Populate Lines
  for (var i = 0; i < popLines; i++) {
    var tempLine = new createLine();
    tempLine.bubble = this;
    tempLine.index = i;

    this.lines.push(tempLine);
  }

  this.resetPosition = function () {
    this.position = {
      x: 0,
      y: 0
    };
    this.radius = 8 + Math.random() * 6;
    this.xOff = Math.random() * canvas.width - this.radius;
    this.yOff = Math.random() * canvas.height;
    this.distanceBetweenWaves = 50 + Math.random() * 40;
    this.count = canvas.height + this.yOff;
    this.popping = false;
  }

  // Render the circles
  this.render = function () {
    if (this.rotationDirection === 'forward') {
      if (this.rotation < this.maxRotation) {
        this.rotation++;
      } else {
        this.rotationDirection = 'backward';
      }
    } else {
      if (this.rotation > this.maxRotation * -1) {
        this.rotation--;
      } else {
        this.rotationDirection = 'forward';
      }
    }

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation * Math.PI / 180);

    if (!this.popping) {
      ctx.beginPath();
      ctx.strokeStyle = '#8bc9ee';
      ctx.lineWidth = 1;
      ctx.arc(0, 0, this.radius - 3, 0, Math.PI * 1.5, true);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
      ctx.stroke();
    }

    ctx.restore();

    // Draw the lines
    for (var a = 0; a < this.lines.length; a++) {
      if (this.lines[a].popping) {
        if (this.lines[a].lineLength < popDistance && !this.lines[a].inversePop) {
          this.lines[a].popDistance += 0.06;
        } else {
          if (this.lines[a].popDistance >= 0) {
            this.lines[a].inversePop = true;
            this.lines[a].popDistanceReturn += 1;
            this.lines[a].popDistance -= 0.03;
          } else {
            this.lines[a].resetValues();
            this.resetPosition();
          }
        }

        this.lines[a].updateValues();
        this.lines[a].render();
      }
    }
  }
}



// ----------------
// Populate Bubbles
// ----------------

for (var i = 0; i < bubbleCount; i++) {
  var tempBubble = new createBubble();

  bubbles.push(tempBubble);
}



// ----------------
// Line Constructor
// ----------------

function createLine() {
  this.lineLength = 0;
  this.popDistance = 0;
  this.popDistanceReturn = 0;
  this.inversePop = false; // When the lines reach full length they need to shrink into the end position
  this.popping = false;

  this.resetValues = function () {
    this.lineLength = 0;
    this.popDistance = 0;
    this.popDistanceReturn = 0;
    this.inversePop = false;
    this.popping = false;

    this.updateValues();
  }

  this.updateValues = function () {
    this.x = this.bubble.position.x + (this.bubble.radius + this.popDistanceReturn) * Math.cos(2 * Math.PI * this.index / this.bubble.lines.length);
    this.y = this.bubble.position.y + (this.bubble.radius + this.popDistanceReturn) * Math.sin(2 * Math.PI * this.index / this.bubble.lines.length);
    this.lineLength = this.bubble.radius * this.popDistance;
    this.endX = this.lineLength;
    this.endY = this.lineLength;
  }

  this.render = function () {
    this.updateValues();

    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.moveTo(this.x, this.y);

    if (this.x < this.bubble.position.x) {
      this.endX = this.lineLength * -1;
    }
    if (this.y < this.bubble.position.y) {
      this.endY = this.lineLength * -1;
    }
    if (this.y === this.bubble.position.y) {
      this.endY = 0;
    }
    if (this.x === this.bubble.position.x) {
      this.endX = 0;
    }
    ctx.lineTo(this.x + this.endX, this.y + this.endY);
    ctx.stroke();
    
  };

  

}