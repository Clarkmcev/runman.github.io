// Canvas
const myCanvas = document.getElementById("game-board");
const ctx = myCanvas.getContext("2d");

myCanvas.width = 800;
myCanvas.height = 500;

// Configs
const gravity = 1;
let speedObj = 2;
let onRand = true;
let gameAsStarted = false;

const back1 = new Image(800, 700);
const back2 = new Image(800, 700);
const back3 = new Image(800, 700);
const back4 = new Image(800, 700);
const back5 = new Image(800, 700);
const back6 = new Image(88, 700);

const maskRun = new Image(32, 32);
const maskJump = new Image(100, 200);
const maskDoubleJump = new Image(100, 200);

const grass1 = new Image(1000, 500);
const grass2 = new Image(100, 200);
const grass3 = new Image(100, 200);

const bigplatform = new Image(100, 200);
const smallplatform = new Image(100, 200);

const block1 = new Image(800, 700);

//Fruits
const cherryImg = new Image(800, 700);
const melonImg = new Image(800, 700);
const orangeImg = new Image(800, 700);
const pineappleImg = new Image(800, 700);
const strawberryImg = new Image(800, 700);
const bananaImg = new Image(800, 700);
const collectedImg = new Image(800, 700);
const nothingImg = new Image(800, 700);
const appleImg = new Image(800, 700);

back1.src = "./IMG/parallax-mountain-foreground-trees.png";
back2.src = "./IMG/parallax-mountain-trees.png";
back3.src = "./IMG/parallax-mountain-bg.png";
back4.src = "./IMG/parallax-mountain-montain-far.png";
back5.src = "./IMG/parallax-mountain-mountains.png";
back6.src = "./IMG/Hills Layer 05.png";

maskRun.src = "./IMG/mask run.png";
maskJump.src = "./IMG/mask jump.png";
maskDoubleJump.src = "./IMG/mask double jump.png";

grass1.src = "./IMG/grass.png";
grass2.src = "./IMG/grass_half.png";
grass3.src = "./IMG/grass_top.png";

bigplatform.src = "./IMG/bigplatform.png";
smallplatform.src = "./IMG/hills layer cropped.png";
block1.src = "./IMG/block.png";

cherryImg.src = "./IMG/Cherries.png";
melonImg.src = "./IMG/Melon.png";
orangeImg.src = "./IMG/Orange.png";
pineappleImg.src = "./IMG/Pineapple.png";
strawberryImg.src = "./IMG/Strawberry.png";
bananaImg.src = "./IMG/Bananas.png";
collectedImg.src = "./IMG/Collected.png";
nothingImg.src = "./IMG/nothing.png";
appleImg.src = "./IMG/Apple.png";

let widthBackPlus = 0;
let widthBack = 0;
let widthMid = 0;
let widthFore = 0;
let widthForePlus = 0;
let scrollingSpeed1 = 0.5;
let scrollingSpeed2 = 1;
let scrollingSpeed3 = 2;
let scrollingSpeed4 = 4;
let scrollingSpeed5 = 5;

let frames = 0;
let nPressEnter = 1;

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
  constructor(x, y, width, height, image, color) {
    this.position = {
      x: x,
      y: y,
    };
    this.width = width;
    this.height = height;
    this.image = image;
    this.color = color;

    this.pattern = ctx.createPattern(grass1, "repeat");
  }
  update() {
    ctx.fillStyle = "transparent"; /* this.pattern; */
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

class Coin {
  constructor(x, y, width, height, image) {
    this.position = {
      x: x,
      y: y,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = width;
    this.height = height;
    this.frames = 0;
    this.isFruitCollected = false;
    this.image = image;

    this.sprites = {
      banana: {
        image: bananaImg,
        cropWidth: 32,
        maxFrames: 17,
      },
      cheery: {
        image: cherryImg,
        cropWidth: 32,
        maxFrames: 4,
      },
      strawberry: {
        image: strawberryImg,
        cropWidth: 32,
        maxFrames: 4,
      },
      orange: {
        image: orangeImg,
        cropWidth: 32,
        maxFrames: 4,
      },
      pineapple: {
        image: pineappleImg,
        cropWidth: 32,
        maxFrames: 4,
      },
      apple: {
        image: appleImg,
        cropWidth: 32,
        maxFrames: 4,
      },
      collected: {
        image: collectedImg,
        cropWidth: 32,
        maxFrames: 7,
      },
      nothing: {
        image: nothingImg,
        cropWidth: 32,
        maxFrames: 4,
      },
    };

    this.currentSprite = this.sprites[this.image].image;
    this.currentCropWidth = this.sprites[this.image].cropWidth;
    this.CurrentMaxFrames = this.sprites[this.image].maxFrames;
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
    ctx.fillStyle = "transparent";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    this.frames += 1;
    if (
      this.frames >= this.CurrentMaxFrames &&
      this.currentSprite != collectedImg
    ) {
      this.frames = 0;
    }

    if (
      this.frames >= this.CurrentMaxFrames &&
      this.currentSprite === collectedImg
    ) {
      this.frames = 0;
    }

    this.draw();

    this.position.y += this.velocity.y;
    if (this.position.y <= myCanvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

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
    elem.position.x -= speedObj;
  });

  currentGame.currentCoins.forEach((coin) => {
    coin.position.x -= speedObj;
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
    speedObj = 5;
    delete currentGame.currentPlayer;
    gameAsStarted = false;
  }
}

function randomObjects(n) {
  let arrFruit = [
    "banana",
    "cheery",
    "strawberry",
    "pineapple",
    "melon",
    "orange",
    "apple",
  ];
  // let image;
  setTimeout(() => {
    if (n % 50 === 1) {
      let randomY = Math.floor(Math.random() * 450 + 100);
      currentGame.currentPlatforms.push(
        new Platform(myCanvas.width, randomY, 200, 50, smallplatform)
      );
    }
    if (n % 50 === 1) {
      let imageIndexRandom = Math.floor(Math.random() * arrFruit.length);
      let randomX = Math.floor(Math.random() * myCanvas.width) + 600;
      currentGame.currentPlatforms.push(
        new Coin(randomX, 0, 50, 60, arrFruit[imageIndexRandom])
      );
    }
  }, 10);
}

let obstacleFrequency = 0;

function Init() {
  currentGame = new Game();
  currentGame.currentPlayer = new Player();

  // Platform plus froot init
  currentGame.currentCoins = [new Coin(250, 100, 50, 60, "cheery")];
  currentGame.currentPlatforms = [new Platform(0, 450, 800, 50, bigplatform)];

  currentGame.currentPlatforms[0].update();
  currentGame.currentCoins[0].update();
  currentGame.currentPlayer.update();
}

Init();
animate();

function backgroundRender() {
  //   BACKGROUND RENDERING
  //   BackGround sky
  ctx.drawImage(back3, widthBackPlus, 0, myCanvas.width, myCanvas.height);
  ctx.drawImage(
    back3,
    widthBackPlus + myCanvas.width,
    0,
    myCanvas.width,
    myCanvas.height
  );

  ctx.drawImage(back5, widthBack, 0, myCanvas.width, myCanvas.height);
  ctx.drawImage(
    back5,
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

  // Mountains
  ctx.drawImage(back4, widthMid, 0, myCanvas.width, myCanvas.height);
  ctx.drawImage(
    back4,
    widthMid + myCanvas.width,
    0,
    myCanvas.width,
    myCanvas.height
  );
  // Trees
  ctx.drawImage(back1, widthFore, 0, myCanvas.width, myCanvas.height);
  ctx.drawImage(
    back1,
    widthFore + myCanvas.width,
    0,
    myCanvas.width,
    myCanvas.height
  );

  // conditionals background
  if (widthBackPlus == -myCanvas.width) {
    widthBackPlus = 0;
  }

  if (widthBack == -myCanvas.width) {
    console.log;
    widthBack = 0;
  }

  if (widthFore == -myCanvas.width) {
    widthFore = 0;
  }

  if (widthMid == -myCanvas.width) {
    widthMid = 0;
  }

  widthBackPlus -= scrollingSpeed1;
  widthBack -= scrollingSpeed2;
  widthMid -= scrollingSpeed3;
  widthFore -= scrollingSpeed4;
}

function collisionsAndUpdate() {
  if (currentGame.currentPlayer && currentGame.currentPlatforms) {
    currentGame.currentPlatforms.forEach((platform) => {
      platform.update();
    });
    currentGame.currentCoins.forEach((coin) => {
      coin.update();
    });
    currentGame.currentPlayer.update();

    // Collision Platforms
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

    // Collisions Coins
    currentGame.currentCoins.forEach((coin) => {
      currentGame.currentPlatforms.forEach((platform) => {
        if (
          coin.position.y + coin.height <= platform.position.y &&
          coin.position.y + coin.height + coin.velocity.y >=
            platform.position.y &&
          coin.position.x + coin.width >= platform.position.x &&
          platform.position.x + platform.width >= coin.position.x
        ) {
          coin.velocity.y = 0;
        }
        if (coin.position.x <= currentGame.currentPlayer.position.x) {
          coin.currentSprite = collectedImg;
          coin.CurrentMaxFrames = coin.sprites.collected.maxFrames;
          console.log(coin.CurrentMaxFrames);
        }
      });
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
    speedObj += 0.005;
    obstacleFrequency++;
    updateSpeed();
    randomObjects(obstacleFrequency);
    checkGameOver();
    computeScore();
  }

  requestAnimationFrame(animate);
}
