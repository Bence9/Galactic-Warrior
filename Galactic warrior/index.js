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


// menu háttér
const background = new Image();
background.src = "images/background/space.png";
background.onload = menu;

// Játék hátterének különválasztása
const gameBackground = new Image();
gameBackground.src = "images/background/space.png";

const logoImage = new Image();
logoImage.src = "images/ikon/welcomeIcon.png";
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
    { text: "Customization", x: canvas.width / 3, y: 500, width: 255, height: 50 }
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
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 350 && y <= 400) {
        startGame();
        canvas.removeEventListener('mousemove', mouseMoveHandler);
        if(isGameOver){
            restartGame();
        }
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
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width / 3 - logoImage.width / 2, canvas.height / 4 - logoImage.height / 2 - 75, 350, 300);

    for (const button of buttons) {
        if (x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height) {
            ctx.fillStyle = "rgba(57, 255, 20, 0.8)";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeStyle = "red";
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#000000"; // szövegszín fekete
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

        ctx.fillStyle = "yellow";
        ctx.font = "20px sans-serif";
        ctx.fillText("Time: " + updateTime(), canvas.width/2, 23);

        ctx.fillStyle = "red";
        ctx.font = "20px sans-serif";
        ctx.fillText("Life: " + life, canvas.width - 125, 23);

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

    enemyController.enemyDeathSound.volume = (sound.volume/100);
    playerBulletController.shootSound.volume = (sound.volume/100);
    enemyBulletController.shootSound.volume = (sound.volume/100);

    playerBulletController.bulletColor = costumization.playerBulletColor;
    enemyBulletController.bulletColor = costumization.enemyBulletColor;
    
}

function drawButtonBack() {
    const buttonImage = new Image();
    buttonImage.src = "images/ikon/back.png";

    buttonImage.onload = () => {
        ctx.drawImage(buttonImage, 910, 10, 64, 64);
    };

}

function displayGameOver(){
    if(isGameOver) {
        let text = didwin ? "You win" : "Game Over";

        drawButtonBack();

        ctx.fillStyle = "#39ff14";
        ctx.font = "100px Arial";
        ctx.fillText(text, canvas.width/2 , 250);

        ctx.fillStyle = "#39ff14";
        ctx.font = "30px Arial";
        ctx.fillText("Earned Score: " + enemyController.score, canvas.width/2, 340);
        ctx.fillText("Time: " + updateTime(), canvas.width/2, 380);

        ctx.fillStyle = "#39ff14";
        ctx.font = "30px Arial";
        ctx.fillText("Press [R] to restart game", canvas.width/2, 460);
        ctx.fillText("Press [Esc] or click [back] to return to menu", canvas.width/2,500);
        
        // gomb lenyomás figyelő
        document.addEventListener("keydown", function(event) {
            if (event.key === "r") {
                restartGame();
            }
            else if (event.key === "Escape"){
                menu();
            }
        });

        // click figyelő
        const clickHandler = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (x >= 910 && x <= 974 && y >= 10 && y <= 74) {
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