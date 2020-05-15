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

let bgReady, heroReady, monsterReady, fishReady, fishReady2, scoreBoardready;
let bgImage, heroImage, monsterImage, fishImage, fishImage2, scoreBoardImage;

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
// START UPDATE
let update = function () {
  scoreBoardready = false
  finalDisplayScore = false

  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  status = "running"
  if (37 in keysDown) { // LEFT
    heroX -= 7;
    backgroundSound.play();
  }
  if (39 in keysDown) { // RIGHT 
    heroX += 7;
    backgroundSound.play();
  }

  monsterY += 10;
  fishY += 6;
  fishY2 += 8;
  if (
    heroX <= (monsterX + 110) &&
    monsterX <= (heroX + 110) &&
    heroY <= (monsterY + 110) &&
    monsterY <= (heroY + 110)
  ) {
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
    heroReady = true
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
  if (heroY < 0) {
    heroY = 0
  } else if (heroY > canvas.height - 130) {
    heroY = canvas.height - 130
  }
};
// END UPDATE

// RENDER
let render = function () {

  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (!blinking || Math.floor(Date.now() / frequency) % 2) {
    ctx.drawImage(heroImage, heroX, heroY);
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
  if (scoreBoardready) {
    ctx.drawImage(scoreBoardImage, 254, 147);
  }
  if (finalDisplayScoreReady) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#fef53d"
    ctx.font = "60px Impact";
    ctx.fillText(`${score}`, 395, 285);
  }

  // FONT PROPERTIES
  ctx.font = "25px Impact";
  ctx.fillStyle = "firebrick"
  ctx.textAlign = "left";
  ctx.fillText(`${score}`, 706, 82);
  ctx.fillText(`${lives}`, 706, 135);
  ctx.fillStyle = "white"
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 30, 30);
  ctx.fillText(`Hi Score: ${history[0]}`, 30, 470);
};

// PATRICK / JELLYFISH SELECTOR
function getRndInteger() {
  let number = Math.floor(Math.random() * 100 + 1);

  if (number < 50) {
    monsterX = -200
    fishX = -200
    createPatrick();
    return;
  } else
    monsterX = -200
  fishX - 200
  createFish();
  return;
}
let createPatrick = function () {
  monsterReady = true
  monsterX = Math.floor(Math.random() * (canvas.width - 130) * 0.95)
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
    blinkingScore = true;
  }
  render();
  status = "stopped"
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
loadImages();
setupKeyboardListeners();
main();