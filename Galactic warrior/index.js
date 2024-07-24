import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import Description from "./Description.js";
import Sound from "./Sound.js";
import Costumization from "./Costumization.js";
import GiftController from "./GiftController.js";
import Gift2Controller from "./Gift2Controller.js";
import MeteorController from "./MeteorController.js";

const canvas = document.getElementById("menu");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;


// menu background
const background = new Image();
background.src = "images/background/space.png";
background.onload = menu;

// game background separated
const gameBackground = new Image();
gameBackground.src = "images/background/space.png";

const logoImage = new Image();
logoImage.src = "images/ikon/welcomeIcon.png";
logoImage.onload = menu;


let rubin = 100;
let level1Complete = false;
let level2Complete = false;
let level3Complete = false;
let level4Complete = false;
let level5Complete = false;

const description = new Description(canvas, ctx, background, menu);
const sound = new Sound(canvas, ctx, background, menu);
const costumization = new Costumization(canvas, ctx, menu, rubin);

const enemyBulletController = new BulletController(canvas, 5, "white", true);
const playerBulletController = new BulletController(canvas, 10, "red", true);
const giftController = new GiftController(canvas, 1);
const gift2Controller = new Gift2Controller(canvas, 1);
const meteorController = new MeteorController(canvas, 2, true);
const enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController, giftController, gift2Controller, meteorController, true);
const player = new Player(canvas, 3, playerBulletController);


let isGameOver = false;
let didwin = false;
let life = 3;
let seconds = 0;
let gameInterval;
let isStartButtonActive = false;

function increaseRubin(amount) {
    console.log(`Adding ${amount} to rubin`);
    rubin += amount;
    console.log(`New rubin value: ${rubin}`);
    costumization.updateRubin(rubin);
}


function drawLevelField(x, y, width, height, radius, playX, playY, level, challenge) {
    // yellow square
    ctx.strokeStyle = "#FFFF00"; // yellow
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.stroke();

    // play button
    const buttonWidth = 50;
    const buttonHeight = 30;
    
    ctx.fillStyle = "#39ff14";
    ctx.fillRect(playX, playY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = "black";
    ctx.font = "20px sans-serif";
    ctx.fillText("Play", playX + 25, playY + 20);

    // text fields
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Level:" + level, x + 70, y + 30);
    ctx.font = "16px sans-serif";
    ctx.fillText("Challenge: " + challenge, x + 70, y + 50);
    let rubinAmount = 25 + (level * 25);
    ctx.fillText("+" + rubinAmount, x + 60, y + 72);

    level = level % 5;
    if(level == 0){
        level = 5;
    }

    const rubinImage = new Image();
    rubinImage.src = `images/ikon/rubyPic.png`;

    rubinImage.onload = () => {
        ctx.drawImage(rubinImage, x + 80, y + 55, 24, 24);
    };

    const enemyImage = new Image();
    enemyImage.src = `images/enemy/enemy${level}.png`;

    enemyImage.onload = () => {
        ctx.drawImage(enemyImage, x + 150, y, 120, 66);
    };

}


function drawGames() {
    const imagePlay = new Image();
    imagePlay.src = "images/ikon/play.png";

    imagePlay.onload = () => {
        ctx.drawImage(imagePlay, 580, 345, 50, 50);
    };

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2; 
    ctx.strokeRect(625, 10, 360, 580);

    const buttonBack = new Image();
    buttonBack.src = "images/ikon/back.png";

    buttonBack.onload = () => {
        ctx.drawImage(buttonBack, 940, 15, 40, 40);
    };

    drawLevelField(630, 60, 350, 90, 10, 920, 80, 1, "Easy"); // + 105 px (y, playY)
    drawLevelField(630, 165, 350, 90, 10, 920, 185, 2, "Easy");
    drawLevelField(630, 270, 350, 90, 10, 920, 290, 3, "Medium");
    drawLevelField(630, 375, 350, 90, 10, 920, 395, 4, "Medium");
    drawLevelField(630, 480, 350, 90, 10, 920, 500, 5, "Hard");

    canvas.addEventListener('click', clickHandler);

    function clickHandler(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.x - rect.left;
        const y = event.y - rect.top;

        if (x >= 920 && x <= 970 && y >= 80 && y <= 110) {
            stopAnimation();
            startGame();
            if (isGameOver) {
                restartGame();
            }
        }
        if (x >= 920 && x <= 970 && y >= 185 && y <= 215) {
            stopAnimation();
            // startGame2()
        }
        if (x >= 920 && x <= 970 && y >= 290 && y <= 320) {
            stopAnimation();
            // startGame3()
        }
        if (x >= 920 && x <= 970 && y >= 395 && y <= 425) {
            stopAnimation();
            // startGame4()
        }
        if (x >= 920 && x <= 970 && y >= 500 && y <= 530) {
            stopAnimation();
            // startGame5()
        }
        if(x >= 940 && x <= 980 && y >= 15 && y <= 55){
            stopAnimation();
            isStartButtonActive = false;
        }
    }

    // Enemy configuration
    const enemyImages = [];
    const enemyWidths = [60, 60, 60, 60, 60];
    const enemyHeights = [33, 33, 33, 33, 33];
    const enemySources = ["images/enemy/enemy1.png", "images/enemy/enemy2.png", "images/enemy/enemy3.png", "images/enemy/enemy4.png", "images/enemy/enemy5.png"];
    for (let i = 0; i < enemySources.length; i++) {
        const img = new Image();
        img.src = enemySources[i];
        enemyImages.push(img);
    }
    
    let angles = [0, 0, 0, 0, 0];
    const angularSpeeds = [0.015, -0.014, 0.011, -0.012, 0.01];
    const orbitRadii = [70, 100, 100, 130, 130];
    const xPos = 150;
    const yPos = 220;
    const scale = 1;

    function drawEnemies() {
        drawBackground(0, 0, 300, 600);
        for (let i = 0; i < enemyImages.length; i++) {
            const enemyX = xPos + orbitRadii[i] * Math.cos(angles[i]) - enemyWidths[i] / 2;
            const enemyY = yPos + orbitRadii[i] * Math.sin(angles[i]) - enemyHeights[i] / 2;
            ctx.drawImage(
                enemyImages[i],
                enemyX,
                enemyY,
                enemyWidths[i] * scale,
                enemyHeights[i] * scale
            );
            angles[i] += angularSpeeds[i];
        }
    }

    function drawBackground(x, y, width, height) {
        // Itt rajzoljuk újra a hátteret a megadott koordinátákon és méretben
        const background = new Image();
        background.src = "images/background/space.png";
        background.onload = () => {
            ctx.drawImage(background, x, y, width, height, x, y, width, height);
        };
    }

    let animationFrameId;

    function frame() {
        drawEnemies();
        animationFrameId = requestAnimationFrame(frame);
    }

    function stopAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }

    // Start the animation
    frame();
}


function makeButton(text, xPos, yPos, width, height) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(xPos, yPos, width, height);

    ctx.strokeStyle = "red";
    ctx.strokeRect(xPos, yPos, width, height);

    ctx.fillStyle = "#39ff14";
    ctx.font = "30px sans-serif";
    ctx.fillText(text, xPos + 125 , yPos + height / 2 + 10);
}

function drawMenuButtons() {
    makeButton("Start Game", canvas.width/3, 350, 255, 50);
    makeButton("Description", canvas.width/3, 400, 255, 50);
    makeButton("Sound", canvas.width/3, 450, 255, 50);
    makeButton("Customization", canvas.width/3, 500, 255, 50);
}

const buttons = [
    { text: "Start Game", x: canvas.width / 3, y: 350, width: 255, height: 50 },
    { text: "Description", x: canvas.width / 3, y: 400, width: 255, height: 50 },
    { text: "Sound", x: canvas.width / 3, y: 450, width: 255, height: 50 },
    { text: "Customization", x: canvas.width / 3, y: 500, width: 255, height: 50 },
];

function menu() {
    if (!background.complete || !logoImage.complete) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width/3 - logoImage.width/2, canvas.height/4 - logoImage.height/2 - 75, 350, 300);

    ctx.font = "30px sans-serif";
    ctx.fillStyle = "#39FF14";
    ctx.textAlign = "center";


const clickHandler = (event) => {
    if (isStartButtonActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 350 && y <= 400) {
        canvas.removeEventListener('mousemove', mouseMoveHandler);
        drawGames();
        isStartButtonActive = true;
    }
    else if(x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 400 && y <= 450){
        description.draw();
        canvas.removeEventListener('mousemove', mouseMoveHandler);
    }
    else if(x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 450 && y <= 500){
        sound.draw();
        canvas.removeEventListener('mousemove', mouseMoveHandler);
    }
    else if(x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 500 && y <= 550){
        costumization.draw();
        canvas.removeEventListener('mousemove', mouseMoveHandler);
    }
};

const mouseMoveHandler = (event) => {
    if (isStartButtonActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

//    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width / 3 - logoImage.width / 2, canvas.height / 4 - logoImage.height / 2 - 75, 350, 300);


    for (const button of buttons) {
        if (x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height) {
            ctx.fillStyle = "rgba(57, 255, 20, 0.8)";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeStyle = "red";
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#000000"; // black
            ctx.font = "30px sans-serif";
            ctx.fillText(button.text, button.x + 125, button.y + button.height / 2 + 10);
        } else {
            makeButton(button.text, button.x, button.y, button.width, button.height);
        }
    }
};

canvas.addEventListener('mousemove', mouseMoveHandler);
canvas.addEventListener('click', clickHandler);

drawMenuButtons();

}

///////////////////// THE GAME /////////////////////////


const heartImage = new Image();
heartImage.src = "images/ikon/redHeart.png";

const scoreImage = new Image();
scoreImage.src = "images/ikon/score.png";

const timerImage = new Image();
timerImage.src = "images/ikon/timer.png";


function startGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(game1, 100 / 70);
    gameBackground.src = costumization.field;
}


function game1() {
    checkGameOver();
    collideWithObject();
    ctx.drawImage(gameBackground, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    if (!isGameOver) {

        settings();

        ctx.fillStyle = "yellow";
        ctx.font = "20px sans-serif";
        ctx.fillText("Score: " + enemyController.score, 125, 23);
        if (scoreImage.complete) {
            ctx.drawImage(scoreImage, 185, 2, 25, 25);
        }

        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText("Time: " + updateTime(), canvas.width/2, 23);
        if (timerImage.complete) {
            ctx.drawImage(timerImage, canvas.width/2 + 60, 2, 25, 25);
        }

        ctx.fillStyle = "red";
        ctx.font = "20px sans-serif";
        ctx.fillText("Life: " + life, canvas.width - 125, 23);
        if (heartImage.complete) {
            ctx.drawImage(heartImage, canvas.width - 95, 2, 25, 25);
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === 'r' || event.key === 'Escape') {
                event.preventDefault();
            }
        });

    } else {
        clearInterval(gameInterval); 
    }
}

// All things that user choose from sound and costumization menu
function settings(){
    player.image.src = costumization.selectedPlayer;
    player.draw(ctx);
    enemyController.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
    giftController.draw(ctx);
    gift2Controller.draw(ctx);
    meteorController.draw(ctx);

    enemyController.soundEnabled = sound.soundOn;
    playerBulletController.soundEnabled = sound.soundOn;
    enemyBulletController.soundEnabled = sound.soundOn;
    meteorController.soundEnabled = sound.soundOn;

    enemyController.enemyDeathSound.volume = (sound.volume / 100);
    playerBulletController.shootSound.volume = (sound.volume / 100);
    enemyBulletController.shootSound.volume = (sound.volume / 100);
    meteorController.shootSound.volume = (sound.volume / 100);

    playerBulletController.bulletColor = costumization.playerBulletColor;
    enemyBulletController.bulletColor = costumization.enemyBulletColor;
}

function displayGameOver(){
    if(isGameOver) {
        let text = didwin ? "You win" : "Game Over";
        level1Complete = didwin ? true : false;

        if(level1Complete == true){
            increaseRubin(50);
        }


        drawButtonBack();

        ctx.fillStyle = "#39ff14";
        ctx.font = "100px Arial";
        ctx.fillText(text, canvas.width / 2 , 250);

        ctx.fillStyle = "#39ff14";
        ctx.font = "25px Arial";
        let addScore = life * 50; // remaining life added to score
        enemyController.score += addScore;
        ctx.fillText("(+ " + addScore + " point added from remaining life)", canvas.width / 2, 340);
        ctx.font = "30px Arial";
        ctx.fillText("Total Score: " + enemyController.score, canvas.width / 2, 380);
        ctx.fillText("Time: " + updateTime(), canvas.width / 2, 420);

        ctx.fillStyle = "#39ff14";
        ctx.font = "30px Arial";
        ctx.fillText("Press [R] to restart game", canvas.width / 2, 510);
        ctx.fillText("Press [Esc] or click [back] to return to menu", canvas.width / 2, 550);
        
        // gomb lenyomás figyelő
        document.addEventListener("keydown", function(event) {
            if (event.key === "r") {
                restartGame();
            }
            else if (event.key === "Escape"){
                isStartButtonActive = false;
                menu();
            }
        });

        // click figyelő
        const clickHandler = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (x >= 910 && x <= 974 && y >= 10 && y <= 74) {
                isStartButtonActive = false;
                menu();
            }
        };

        canvas.addEventListener('click', clickHandler);

    }
}

function restartGame() {
    seconds = 0;
    isGameOver = false;
    didwin = false;
    enemyController.score = 0;
    life = 3;
    clearInterval(gameInterval);
    player.x = canvas.width / 2 ;
    player.y = canvas.height - 75;
    enemyController.createEnemies();
    startGame();
    enemyBulletController.clearBullets();
    playerBulletController.clearBullets();
    giftController.clearGifts();
    gift2Controller.clearGifts();
    meteorController.clearMeteors();
}

function collideWithObject(){

    if(enemyBulletController.collideWith(player)){
        life--;
    }

    if(enemyController.collideWith(player)){
        life--;
    }

    if (giftController.collideWith(player)) {
        life++;
    }

    if(gift2Controller.collideWith(player)){
        enemyController.score += 200;
    }

    if(meteorController.collideWith(player)){
        life--;
    }

}

function checkGameOver(){
    if(life === 0){
        isGameOver = true;
    }

    if(enemyController.enemyRows.length === 0){
        didwin = true;
        isGameOver = true;
    }
}

function updateTime() {
    seconds++;
    const formattedTime = formatTime(seconds);
    return formattedTime;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 3600); 
    const second = Math.floor((seconds % 3600) / 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = second < 10 ? `0${second}` : `${second}`;
    return `${formattedMinutes}:${formattedSeconds}`;
}

function drawButtonBack() {
    const buttonImage = new Image();
    buttonImage.src = "images/ikon/back.png";

    buttonImage.onload = () => {
        ctx.drawImage(buttonImage, 910, 10, 64, 64);
    };


}