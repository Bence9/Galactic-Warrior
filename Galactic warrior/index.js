import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import Description from "./Description.js";
import Options from "./Options.js";
import Costumization from "./Costumization.js";
import Enemy from "./Enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


canvas.width = 700;
canvas.height = 600;


const background = new Image();
background.src = 'images/space.png';
background.onload = menu;

const logoImage = new Image();
logoImage.src = 'images/icon.png';
logoImage.onload = menu;

const description = new Description(canvas, ctx, background, menu);
const options = new Options(canvas, ctx, background, menu);
const costumization = new Costumization(canvas, ctx, background, menu);

const playerBulletController = new BulletController(canvas, 10, "red", true);
const enemyBulletController = new BulletController(canvas, 5, "white", true);
const enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController, true);
const player = new Player(canvas, 3, playerBulletController);


let isGameOver = false;
let didwin = false;
let life = 3;
let seconds = 0;
let gameInterval;


function drawButton(text, xPos, yPos, width, height) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
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
    drawButton("Options", 225, 450, 255, 50);
    drawButton("Customization", 225, 500, 255, 50);
}


function menu() {
    if (!background.complete || !logoImage.complete) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width/3 - logoImage.width/2, canvas.height/4 - logoImage.height/2 - 50, 350, 300);

    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#39FF14';
    ctx.textAlign = 'center';

    drawMenuButtons();

const clickHandler = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (x >= 225 && x <= 480 && y >= 350 && y <= 400) {
        startGame();
        canvas.removeEventListener('click', clickHandler);
        if(isGameOver){
            restartGame();
        }
    }
    else if(x >= 225 && x <= 480 && y >= 400 && y <= 450){
        description.draw();
        canvas.removeEventListener('click', clickHandler); 
    }
    else if(x >= 225 && x <= 480 && y >= 450 && y <= 500){
        options.draw();
        canvas.removeEventListener('click', clickHandler);
    }
    else if(x >= 225 && x <= 480 && y >= 500 && y <= 550){
        costumization.draw();
        canvas.removeEventListener('click', clickHandler);
    }

};

canvas.addEventListener('click', clickHandler);

}


function startGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(game, 1000 / 90);
}


function game() {
    checkGameOver();
    lifeLosing();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    if (!isGameOver) {

        player.image.src = costumization.selectedPlayer;

        player.draw(ctx);
        enemyController.draw(ctx);
        playerBulletController.draw(ctx);
        enemyBulletController.draw(ctx);

        enemyController.soundEnabled = options.soundOn;
        playerBulletController.soundEnabled = options.soundOn;
        enemyBulletController.soundEnabled = options.soundOn;

        enemyController.enemyDeathSound.volume = (options.volume/100);
        playerBulletController.shootSound.volume = (options.volume/100);
        enemyBulletController.shootSound.volume = (options.volume/100);

        playerBulletController.bulletColor = costumization.playerBulletColor;
        enemyBulletController.bulletColor = costumization.enemyBulletColor;
        
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, canvas.width, 30);

        ctx.fillStyle = 'white';
        ctx.font = '20px sans-serif';
        ctx.fillText('Score: ' + enemyController.score, 125, 23);
        ctx.fillText('Life: ' + life, canvas.width - 125, 23);
        ctx.fillText('Time: ' + updateTime(), canvas.width - 350, 23);

    } else {
        clearInterval(gameInterval); 
    }
}

function drawButtonBack() {
    const buttonImage = new Image();
    buttonImage.src = 'images/return.png';

    buttonImage.onload = () => {
        ctx.drawImage(buttonImage, 610, 10, 60, 50);

        ctx.fillStyle = "black";
        ctx.font = "20px sans-serif";
        ctx.fillText("back", 630, 55);
    };

    ctx.fillStyle = 'red';
    ctx.fillRect(600, 20, 80, 40);
}

function displayGameOver(){
    if(isGameOver) {
        let text = didwin ? "You win" : "Game Over";

        drawButtonBack();

        ctx.fillStyle = "#39ff14";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        ctx.fillStyle = "#39ff14";
        ctx.font = "50px Arial";
        ctx.fillText('Press R to restart game', canvas.width - 350, 400);
        
        document.addEventListener('keydown', function(event) {
            if (event.key === 'r') {
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
}

function lifeLosing(){
    if(enemyBulletController.collideWith(player)){
        life--;
    }

    if(enemyController.collideWith(player)){
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
}
