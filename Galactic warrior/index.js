import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import Description from "./Description.js";
import Sound from "./Sound.js";
import Costumization from "./Costumization.js";
import GiftController from "./GiftController.js";
import Gift2Controller from "./Gift2Controller.js";
import MeteorController from "./MeteorController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


canvas.width = 700;
canvas.height = 600;


const background = new Image();
background.src = "images/background/space.png";
background.onload = menu;

// Játék hátterének különválasztása
const gameBackground = new Image();
gameBackground.src = "images/background/space.png";

const logoImage = new Image();
logoImage.src = "images/icon.png";
logoImage.onload = menu;

const description = new Description(canvas, ctx, background, menu);
const sound = new Sound(canvas, ctx, background, menu);
const costumization = new Costumization(canvas, ctx, menu);

const enemyBulletController = new BulletController(canvas, 5, "white", true);
const playerBulletController = new BulletController(canvas, 10, "red", true);
const giftController = new GiftController(canvas, 1);
const gift2Controller = new Gift2Controller(canvas, 1);
const meteorController = new MeteorController(canvas, 2);
const enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController, giftController, gift2Controller, meteorController, true);
const player = new Player(canvas, 3, playerBulletController);


let isGameOver = false;
let didwin = false;
let life = 3;
let seconds = 0;
let gameInterval;


function drawButton(text, xPos, yPos, width, height) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(xPos, yPos, width, height);

    ctx.strokeStyle = "red";
    ctx.strokeRect(xPos, yPos, width, height);

    ctx.fillStyle = "#39ff14";
    ctx.font = "30px sans-serif";
    ctx.fillText(text, xPos + 125 , yPos + height / 2 + 10);
}

function drawMenuButtons() {
    drawButton("Start Game", 225, 350, 255, 50);
    drawButton("Description", 225, 400, 255, 50);
    drawButton("Sound", 225, 450, 255, 50);
    drawButton("Customization", 225, 500, 255, 50);
}


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

    drawMenuButtons();

const clickHandler = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (x >= 225 && x <= 480 && y >= 350 && y <= 400) {
        startGame();
//        canvas.removeEventListener('click', clickHandler);
        if(isGameOver){
            restartGame();
        }
    }
    else if(x >= 225 && x <= 480 && y >= 400 && y <= 450){
        description.draw();
//        canvas.removeEventListener('click', clickHandler);
    }
    else if(x >= 225 && x <= 480 && y >= 450 && y <= 500){
        sound.draw();
    }
    else if(x >= 225 && x <= 480 && y >= 500 && y <= 550){
        costumization.draw();
    }

};

canvas.addEventListener('click', clickHandler);

}


function startGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(game, 100 / 70);
    gameBackground.src = costumization.field;
}


function game() {
    checkGameOver();
    collideWithObject();
    ctx.drawImage(gameBackground, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    if (!isGameOver) {

        settings();

//        ctx.fillStyle = "#333333";
//        ctx.fillRect(0, 0, canvas.width, 30);

        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText("Score: " + enemyController.score, 125, 23);
        ctx.fillText("Life: " + life, canvas.width - 125, 23);
        ctx.fillText("Time: " + updateTime(), canvas.width - 350, 23);
    } else {
        clearInterval(gameInterval); 
    }

}

// All things that user chose from sound and costumization menu
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

    enemyController.enemyDeathSound.volume = (sound.volume/100);
    playerBulletController.shootSound.volume = (sound.volume/100);
    enemyBulletController.shootSound.volume = (sound.volume/100);

    playerBulletController.bulletColor = costumization.playerBulletColor;
    enemyBulletController.bulletColor = costumization.enemyBulletColor;
    
}

function drawButtonBack() {
    const buttonImage = new Image();
    buttonImage.src = "images/return.png";

    buttonImage.onload = () => {
        ctx.drawImage(buttonImage, 610, 10, 60, 50);

        ctx.fillStyle = "black";
        ctx.font = "20px sans-serif";
        ctx.fillText("back", 630, 55);
    };

    ctx.fillStyle = "red";
    ctx.fillRect(600, 20, 80, 40);
}

function displayGameOver(){
    if(isGameOver) {
        let text = didwin ? "You win" : "Game Over";

        drawButtonBack();

        ctx.fillStyle = "#39ff14";
        ctx.font = "100px Arial";
        ctx.fillText(text, 350, 280);

        ctx.fillStyle = "#39ff14";
        ctx.font = "30px Arial";
        ctx.fillText("Earned Score: " + enemyController.score, 350, 360);
        ctx.fillText("Time: " + updateTime(), 350, 400);

        ctx.fillStyle = "#39ff14";
        ctx.font = "30px Arial";
        ctx.fillText("Press [R] to restart game", 350, 470);
        
        document.addEventListener("keydown", function(event) {
            if (event.key === "r") {
                restartGame();
            }
        });

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
        enemyController.score *= 2;
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