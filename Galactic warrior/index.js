import EnemyController from "./EnemyController.js";
import Player from "./Player.js";

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

function drawCanvas() {
    if (!background.complete || !logoImage.complete) {
        return;
    }

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width/3 - logoImage.width/2, canvas.height/4 - logoImage.height/2 - 50, 300, 300);

    ctx.font = '30px sans-serif ';
    ctx.fillStyle = '#39FF14';
    ctx.textAlign = 'center';
    ctx.fillText('Press ENTER to play', canvas.width/2, canvas.height/2 + logoImage.height/1 + 25, 500, 500);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            startGame();
        }
    });
}

function startGame() {
    const enemyController = new EnemyController(canvas);
    const player = new Player(canvas, 2);

    function game() {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        enemyController.draw(ctx);
        player.draw(ctx);
    }

    setInterval(game, 1000/60);
}