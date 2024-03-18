import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 600;
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
var life = 3;

function drawCanvas() {
    if (!background.complete || !logoImage.complete) {
        return;
    }

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width/3 - logoImage.width/2, canvas.height/4 - logoImage.height/2 - 50, 300, 300);

    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#39FF14';
    ctx.textAlign = 'center';
    ctx.fillText('Press ENTER to play', canvas.width/2, canvas.height/2 + logoImage.height/1 + 25);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            startGame();
        }
    });
}

function startGame() {

    function game() {
        checkGameOver();
        lifeLosing();
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        displayGameOver();
        if(!isGameOver){
            enemyController.draw(ctx);
            player.draw(ctx);
            playerBulletController.draw(ctx);
            enemyBulletController.draw(ctx);

            ctx.fillStyle = '#333333'; 
            ctx.fillRect(0, 0, canvas.width, 30);

            ctx.fillStyle = 'white';
            ctx.font = '20px sans-serif';
            ctx.fillText('Score: 0' , 100, 23); 
            ctx.fillText('Life: ' + life, canvas.width - 100, 23); 
            ctx.fillText('Time: 0:00', canvas.width - 300, 23);
        }

    }

    setInterval(game, 1000/90);
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