import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


canvas.width = 700;
canvas.height = 600;


const background = new Image();
background.src = 'images/space.png';
background.onload = drawCanvas;

const logoImage = new Image();
logoImage.src = 'icon.png';
logoImage.onload = drawCanvas;


const playerBulletController = new BulletController(canvas, 10, "red", true);
const enemyBulletController = new BulletController(canvas, 5, "white", false);
const enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController);
const player = new Player(canvas, 3, playerBulletController);


let isGameOver = false;
let didwin = false;
let life = 3;
let seconds = 0;
let fps = 80;


function drawButtonStart() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';;
    ctx.fillRect(250, 350, 200, 50);

    ctx.strokeStyle = "red";
    ctx.strokeRect(250, 350, 200, 50);

    ctx.fillStyle = "#39ff14";
    ctx.font = "25px Arial";
    ctx.fillText("Start Game", canvas.width/2 , canvas.height/2 + logoImage.height/2 + 45);

}

function drawCanvas() {
    if (!background.complete || !logoImage.complete) {
        return;
    }

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width/3 - logoImage.width/2, canvas.height/4 - logoImage.height/2 - 50, 350, 300);

    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#39FF14';
    ctx.textAlign = 'center';

    drawButtonStart();

    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x >= 250 && x <= 450 && y >= 350 && y <= 400) {
            startGame();
        }
    });


}


function startGame() {
    const gameInterval = setInterval(game, 1000 / fps);

    function game() {
        checkGameOver();
        lifeLosing();
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        displayGameOver();
        if (!isGameOver) {
            enemyController.draw(ctx);
            player.draw(ctx);
            playerBulletController.draw(ctx);
            enemyBulletController.draw(ctx);

            ctx.fillStyle = '#333333';
            ctx.fillRect(0, 0, canvas.width, 30);

            ctx.fillStyle = 'white';
            ctx.font = '20px sans-serif';
            ctx.fillText('Score: 0', 125, 23);
            ctx.fillText('Life: ' + life, canvas.width - 125, 23);
            ctx.fillText('Time: ' + updateTime(), canvas.width - 350, 23);
        } else {
            clearInterval(gameInterval); 
        }
    }
}


function displayGameOver(){
    if(isGameOver) {
        let text = didwin ? "You win" : "Game Over";

        ctx.fillStyle = "#39ff14";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }
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

/*
function increaseScore(){
    let scoreIncrease = 0;
    if(playerBulletController.collideWith(enemyController)){
        scoreIncrease += 10;
    }
    return scoreIncrease;
}
*/