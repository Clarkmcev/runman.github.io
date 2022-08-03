// Canvas
const myCanvas = document.getElementById("game-board");
const ctx = myCanvas.getContext("2d");

myCanvas.width = 800;
myCanvas.height = 500;

// Configs
const gravity = 1;
let speedPlatforms = 2;
let onRand = true;
let gameAsStarted = false;

const back1 = new Image(800, 700);
const back2 = new Image(800, 700);
const back3 = new Image(800, 700);
const back4 = new Image(800, 700);
const back5 = new Image(800, 700);

const maskRun = new Image(32, 32);
const maskJump = new Image(100, 200);
const maskDoubleJump = new Image(100, 200);

const grass1 = new Image(100, 200);
const grass2 = new Image(100, 200);
const grass3 = new Image(100, 200);

back1.src = "./IMG/parallax-mountain-foreground-trees.png";
back2.src = "./IMG/parallax-mountain-trees.png";
back3.src = "./IMG/parallax-mountain-bg.png";
back4.src = "./IMG/parallax-mountain-montain-far.png";
back5.src = "./IMG/parallax-mountain-mountains.png";

maskRun.src = "./IMG/mask run.png";
maskJump.src = "./IMG/mask jump.png";
maskDoubleJump.src = "./IMG/mask double jump.png";

grass1.src = "./IMG/grass.png";
grass2.src = "./IMG/grass_half.png";
grass3.src = "./IMG/grass_top.png";

let widthBack = 0;
let widthMid = 0;
let widthFore = 0;
let scrollingSpeed1 = 0.5;
let scrollingSpeed2 = 2;
let scrollingSpeed3 = 4;

let frames = 0;
let nPressEnter = 1;

class Player {
  constructor() {
    this.position = {
      x: 200,
      y: 300,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 50;
    this.height = 70;
    this.image = maskRun;
    this.frames = 0;

    this.sprites = {
      run: {
        image: maskRun,
        cropWidth: 32,
        maxFrames: 12,
      },
      jump: {
        image: maskJump,
        cropWidth: 32,
        maxFrames: 1,
      },
      doubleJump: {
        image: maskDoubleJump,
        cropWidth: 32,
        maxFrames: 6,
      },
    };

    this.currentSprite = this.sprites.run.image;
    this.currentCropWidth = this.sprites.run.cropWidth;
    this.CurrentMaxFrames = this.sprites.run.maxFrames;
  }
  draw() {
    ctx.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      32,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    if (frames % 4 === 0 && this.currentSprite === this.sprites.run.image) {
      this.frames += 1;
      if (this.frames >= this.CurrentMaxFrames) {
        this.frames = 0;
      }
      this.draw();
    } else if (
      frames % 4 === 0 &&
      this.currentSprite === this.sprites.jump.image
    ) {
      this.frames += 1;
      if ((this.frames = this.CurrentMaxFrames)) {
        this.frames = 0;
      }
      this.draw();
    } else if (
      frames % 6 === 0 &&
      this.currentSprite === this.sprites.doubleJump.image
    ) {
      this.frames += 1;
      if (this.frames >= this.CurrentMaxFrames) {
        console.log("hey");
        this.frames = 0;
        this.currentSprite = this.sprites.jump.image;
      }
      this.draw();
    } else {
      this.draw();
    }

    this.position.y += this.velocity.y;
    if (
      this.position.y /*+ this.height + this.velocity.y*/ <= myCanvas.height
    ) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }

  jump() {
    this.position.y += 50;
    this.update();
  }
}

class Game {
  constructor() {
    this.player = {};
    this.platforms = [];
    this.score = 0;
  }
  clear() {
    this.player = {};
    this.platform = [];
  }
}

// can pass in arguments image
class Platform {
  constructor(x, y, width, height) {
    this.position = {
      x: x,
      y: y,
    };
    this.width = width;
    this.height = height;
    this.image = grass1;

    this.pattern = ctx.createPattern(grass1, "repeat");
  }
  update() {
    ctx.fillStyle = this.pattern; /* this.pattern; */
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

let currentGame;
let currentPlayer;

// DOM
const pressEnter = document.getElementById("press-enter");
const pressEnterRestart = document.getElementById("overpress");
const scoreSpan = document.getElementById("scorespan");
const startMenu = document.getElementById("start-menu");
const gameOverMenu = document.getElementById("game-over");

let pressLoop1 = false;
let pressLoop2 = false;

// Functions
// Press Enter Functions
setInterval(() => {
  if (!pressLoop1) {
    pressEnter.style.display = "none";
    pressLoop1 = true;
  } else {
    pressEnter.style.display = "block";
    pressLoop1 = false;
  }
}, 500);

// Press for Restart
setInterval(() => {
  if (!pressLoop2) {
    pressEnterRestart.style.display = "none";
    pressLoop2 = true;
  } else {
    pressEnterRestart.style.display = "block";
    pressLoop2 = false;
  }
}, 500);

// Start function
function startGame() {
  gameAsStarted = true;
  clearInterval();
}

function computeScore() {
  const points = Math.floor(obstacleFrequency / 100);
  currentGame.score = points;
  ctx.font = "50px retro";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${currentGame.score}`, myCanvas.width - 200, 50);
}

function updateSpeed() {
  currentGame.currentPlatforms.forEach((elem) => {
    elem.position.x -= speedPlatforms;
  });
}
let nJump = 0;

// EventListener
addEventListener("keydown", (event) => {
  switch (event.code) {
    case "Enter":
      startMenu.style.display = "none";
      startGame();
      if (gameAsStarted) {
        gameOverMenu.style.display = "none";
        Init();
      }
      break;
    case "Space":
      nJump += 1;
      // console.log(nJump);
      // console.log(currentGame.currentPlayer.currentSprite);
      if (nJump === 1) {
        currentGame.currentPlayer.velocity.y -= 17;
        currentGame.currentPlayer.CurrentMaxFrames =
          currentGame.currentPlayer.CurrentMaxFrames =
            currentGame.currentPlayer.sprites.jump.maxFrames;
        currentGame.currentPlayer.sprites.jump.image;
      } else if (nJump === 2) {
        currentGame.currentPlayer.velocity.y -= 17;
        currentGame.currentPlayer.CurrentMaxFrames =
          currentGame.currentPlayer.sprites.doubleJump.maxFrames;
        currentGame.currentPlayer.currentSprite =
          currentGame.currentPlayer.sprites.doubleJump.image;
      }
      break;
  }
});

function checkGameOver() {
  if (currentGame.currentPlayer.position.y >= myCanvas.height) {
    obstacleFrequency = 0;
    currentGame.currentPlatforms = [];
    scoreSpan.innerText = " " + currentGame.score;
    currentGame.score = 0;
    gameOverMenu.style.display = "block";
    speedPlatforms = 5;
    delete currentGame.currentPlayer;
    gameAsStarted = false;
  }
}

function randomPlatforms(n) {
  setTimeout(() => {
    if (n % 50 === 1) {
      let randomY = Math.random() * 400 + 100;
      currentGame.currentPlatforms.push(
        new Platform(myCanvas.width, randomY, 200, 50)
      );
    }
  }, 800);
}

let obstacleFrequency = 0;

function Init() {
  currentGame = new Game();
  currentGame.currentPlayer = new Player();
  currentGame.currentPlatforms = [new Platform(0, 450, 1000, 500)];
  currentGame.currentPlatforms[0].update();
  currentGame.currentPlayer.update();
}

Init();
animate();

function backgroundRender() {
  //   BACKGROUND RENDERING
  //   BackGround sky
  ctx.drawImage(back3, widthBack, 0, myCanvas.width, myCanvas.height);
  ctx.drawImage(
    back3,
    widthBack + myCanvas.width,
    0,
    myCanvas.width,
    myCanvas.height
  );
  // Mountain trees
  ctx.drawImage(back2, widthMid, 0, myCanvas.width, myCanvas.height);
  ctx.drawImage(
    back2,
    widthMid + myCanvas.width,
    0,
    myCanvas.width,
    myCanvas.height
  );

  if (widthMid == -myCanvas.width) {
    widthMid = 0;
  }
  //   // Mountains
  ctx.drawImage(back4, widthMid, 0, myCanvas.width, myCanvas.height);
  ctx.drawImage(
    back4,
    widthMid + myCanvas.width,
    0,
    myCanvas.width,
    myCanvas.height
  );
  //   // Trees
  ctx.drawImage(back1, widthFore, 0, myCanvas.width, myCanvas.height);
  ctx.drawImage(
    back1,
    widthFore + myCanvas.width,
    0,
    myCanvas.width,
    myCanvas.height
  );
  // conditionals background
  if (widthBack == -myCanvas.width) {
    widthBack = 0;
  }

  if (widthFore == -myCanvas.width) {
    widthFore = 0;
  }

  widthBack -= scrollingSpeed1;
  widthMid -= scrollingSpeed2;
  widthFore -= scrollingSpeed3;
}

function collisionsAndUpdate() {
  if (currentGame.currentPlayer && currentGame.currentPlatforms) {
    currentGame.currentPlayer.update();
    currentGame.currentPlatforms.forEach((elem) => {
      elem.update();
    });

    currentGame.currentPlatforms.forEach((elem) => {
      if (
        currentGame.currentPlayer.position.y +
          currentGame.currentPlayer.height <=
          elem.position.y &&
        currentGame.currentPlayer.position.y +
          currentGame.currentPlayer.height +
          currentGame.currentPlayer.velocity.y >=
          elem.position.y &&
        currentGame.currentPlayer.position.x +
          currentGame.currentPlayer.width >=
          elem.position.x &&
        elem.position.x + elem.width >= currentGame.currentPlayer.position.x
      ) {
        currentGame.currentPlayer.currentSprite =
          currentGame.currentPlayer.sprites.run.image;
        currentGame.currentPlayer.velocity.y = 0;
        currentGame.currentPlayer.currentSprite =
          currentGame.currentPlayer.sprites.run.image;
        currentGame.currentPlayer.currentCropWidth =
          currentGame.currentPlayer.sprites.run.cropWidth;
        currentGame.currentPlayer.CurrentMaxFrames =
          currentGame.currentPlayer.sprites.run.maxFrames;
        nJump = 0;
      }
    });
  }
}

// ANIMATION - HERE
function animate() {
  frames++;

  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  backgroundRender();
  collisionsAndUpdate();
  if (gameAsStarted) {
    speedPlatforms += 0.005;
    obstacleFrequency++;
    updateSpeed();
    randomPlatforms(obstacleFrequency);
    checkGameOver();
    computeScore();
  }
  requestAnimationFrame(animate);
}
