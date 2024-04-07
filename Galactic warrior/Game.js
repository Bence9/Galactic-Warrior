import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import Options from "./Options.js";
import Costumization from "./Costumization.js";

export default class Game {
    
    constructor(canvas, ctx, background, menuCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.background = background;
        this.menuCallback = menuCallback; 
        this.buttonImage = new Image();
        this.buttonImage.src = 'images/return.png';

        const clickHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (x >= 600 && x <= 680 && y >= 20 && y <= 60) {
                this.menuCallback(); // menuCallback hivatkozás
            }
        };

        canvas.width = 700;
        canvas.height = 600;

        this.canvas.addEventListener('click', clickHandler);
    }

    playerBulletController = new BulletController(this.canvas, 10, "red", true);
    enemyBulletController = new BulletController(this.canvas, 5, "white", true);
    enemyController = new EnemyController(this.canvas, this.enemyBulletController, this.playerBulletController, true);
    player = new Player(this.canvas, 3, this.playerBulletController);
    options = new Options(this.canvas, this.ctx, this.background, this.menuCallback); // menuCallback hivatkozás
    costumization = new Costumization(this.canvas, this.ctx, this.background, this.menuCallback); // menuCallback hivatkozás

    isGameOver = false;
    didwin = false;
    life = 3;
    seconds = 0;
    gameInterval;

    startGame() {
        clearInterval(this.gameInterval);
        this.gameInterval = setInterval(this.game.bind(this), 1000 / 90);
    }
    
    
    game() {
        this.checkGameOver();
        this.lifeLosing();
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        this.displayGameOver();
        if (!this.isGameOver) {
    
            this.player.image.src = this.costumization.selectedPlayer;
    
            this.player.draw(this.ctx);
            this.enemyController.draw(this.ctx);
            this.playerBulletController.draw(this.ctx);
            this.enemyBulletController.draw(this.ctx);
    
            this.enemyController.soundEnabled = this.options.soundOn;
            this.playerBulletController.soundEnabled = this.options.soundOn;
            this.enemyBulletController.soundEnabled = this.options.soundOn;
    
            this.enemyController.enemyDeathSound.volume = (this.options.volume/100);
            this.playerBulletController.shootSound.volume = (this.options.volume/100);
            this.enemyBulletController.shootSound.volume = (this.options.volume/100);
    
            this.playerBulletController.bulletColor = this.costumization.playerBulletColor;
            this.enemyBulletController.bulletColor = this.costumization.enemyBulletColor;
            
            this.ctx.fillStyle = '#333333';
            this.ctx.fillRect(0, 0, this.canvas.width, 30);
    
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px sans-serif';
            this.ctx.fillText('Score: ' + this.enemyController.score, 125, 23);
            this.ctx.fillText('Life: ' + this.life, this.canvas.width - 125, 23);
            this.ctx.fillText('Time: ' + this.updateTime(), this.canvas.width - 350, 23);
    
        } else {
            clearInterval(this.gameInterval); 
        }
    }
    
    drawButtonBack() {
        this.buttonImage.onload = () => {
            this.ctx.drawImage(this.buttonImage, 610, 10, 60, 50);
    
            this.ctx.fillStyle = "black";
            this.ctx.font = "20px sans-serif";
            this.ctx.fillText("back", 630, 55);
        };
    
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(600, 20, 80, 40);
    }
    
    displayGameOver(){
        if(this.isGameOver) {
            let text = this.didwin ? "You win" : "Game Over";
    
            this.drawButtonBack();
    
            this.ctx.fillStyle = "#39ff14";
            this.ctx.font = "80px Arial";
            this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    
            this.ctx.fillStyle = "#39ff14";
            this.ctx.font = "30px Arial";
            this.ctx.fillText('Press [R] to restart game', this.canvas.width - 350, 400);
            
            document.addEventListener('keydown', (event) => {
                if (event.key === 'r') {
                    this.restartGame();
                }
            });
    
        }
    }
    
    restartGame() {
        this.seconds = 0;
        this.isGameOver = false;
        this.didwin = false;
        this.enemyController.score = 0;
        this.life = 3;
        clearInterval(this.gameInterval);
        this.player.x = this.canvas.width / 2 ;
        this.player.y = this.canvas.height - 75;
        this.enemyController.createEnemies();
        this.startGame();
        this.enemyBulletController.clearBullets();
        this.playerBulletController.clearBullets();
    }
    
    lifeLosing(){
        if(this.enemyBulletController.collideWith(this.player)){
            this.life--;
        }
    
        if(this.enemyController.collideWith(this.player)){
            this.life--;
        }
    }
    
    checkGameOver(){
        if(this.life === 0){
            this.isGameOver = true;
        }
    
        if(this.enemyController.enemyRows.length === 0){
            this.didwin = true;
            this.isGameOver = true;
        }
    }
    
    updateTime() {
        this.seconds++;
        const formattedTime = this.formatTime(this.seconds);
        return formattedTime;
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 3600);
        const second = Math.floor((seconds % 3600) / 60);
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = second < 10 ? `0${second}` : `${second}`;
        return `${formattedMinutes}:${formattedSeconds}`;
    }

}
