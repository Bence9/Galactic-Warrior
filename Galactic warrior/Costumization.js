export default class Costumization {
    constructor(canvas, ctx, background, menuCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.background = background;
        this.menuCallback = menuCallback; 
        this.buttonImage = new Image();
        this.buttonImage.src = 'images/return.png';
        this.playerBulletColor = "red";
        this.enemyBulletColor = "white";
        this.selectedPlayer = 'images/player/player1.png';
        this.playerName = 'Player1';
    
        // Négyzetek méretei és az eltolás mértéke
        this.squareSize = 30; 
        this.squareGap = 10; 
    
        // Eseményfigyelő hozzáadása a konstruktorban a dinamikus kirajzolás miatt
        const clickHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
        
            // Visszalépés a menube
            if (x >= 600 && x <= 680 && y >= 20 && y <= 60) {
                this.menuCallback();
//                this.canvas.removeEventListener('click', clickHandler);
            }
        
            // Player bullet color beállítása
                if (x >= 350 && x <= 350 + this.squareSize  && y >= 130 && y <= 170) {
                    this.playerBulletColor = 'blue';
                    this.draw();
                } else if (x >= 350 + this.squareSize + this.squareGap && x <= 350 + 2 * this.squareSize + this.squareGap && y >= 130 && y <= 170) {
                    this.playerBulletColor = 'red';
                    this.draw();
                } else if (x >= 350 + 2 * (this.squareSize + this.squareGap) && x <= 350 + 3 * this.squareSize + 2 * this.squareGap && y >= 130 && y <= 170) {
                    this.playerBulletColor = '#39FF14'; // Zöld
                    this.draw();
                } else if (x >= 350 + 3 * (this.squareSize + this.squareGap) && x <= 350 + 4 * this.squareSize + 3 * this.squareGap && y >= 130 && y <= 170) {
                    this.playerBulletColor = 'yellow';
                    this.draw();
                } else if (x >= 350 + 4 * (this.squareSize + this.squareGap) && x <= 350 + 5 * this.squareSize + 4 * this.squareGap && y >= 130 && y <= 170) {
                    this.playerBulletColor = '#e01fd0'; //lila
                    this.draw();
                } else if (x >= 350 + 5 * (this.squareSize + this.squareGap) && x <= 350 + 6 * this.squareSize + 5 * this.squareGap && y >= 130 && y <= 170) {
                    this.playerBulletColor = 'white';
                    this.draw();
                }

                // Enemy bullet color beállítása
                if (x >= 350 && x <= 350 + this.squareSize && y >= 230 && y <= 270) {
                    this.enemyBulletColor = 'blue';
                    this.draw();
                } else if (x >= 350 + this.squareSize + this.squareGap && x <= 350 + 2 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270) {
                    this.enemyBulletColor = 'red';
                    this.draw();
                } else if (x >= 350 + 2 * (this.squareSize + this.squareGap) && x <= 350 + 3 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270) {
                    this.enemyBulletColor = '#39FF14'; // Zöld
                    this.draw();
                } else if (x >= 350 + 3 * (this.squareSize + this.squareGap) && x <= 350 + 4 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270) {
                    this.enemyBulletColor = 'yellow';
                    this.draw();
                } else if (x >= 350 + 4 * (this.squareSize + this.squareGap) && x <= 350 + 5 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270) {
                    this.enemyBulletColor = '#e01fd0'; //lila
                    this.draw();
                } else if (x >= 350 + 5 * (this.squareSize + this.squareGap) && x <= 350 + 6 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270) {
                    this.enemyBulletColor = 'white';
                    this.draw();
                }

                if (x >= 30 && x <= 110 && y >= 380 && y <= 460) {
                    this.selectedPlayer = 'images/player/player1.png';
                    this.playerName = 'Player1';
                    this.draw(); 
                } else if (x >= 130 && x <= 210 && y >= 380 && y <= 460) {
                    this.selectedPlayer = 'images/player/player2.png';
                    this.playerName = 'Player2';
                    this.draw(); 
                } else if (x >= 230 && x <= 310 && y >= 380 && y <= 460) {
                    this.selectedPlayer = 'images/player/player3.png';
                    this.playerName = 'Player3';
                    this.draw(); 
                }

        };
        
        this.canvas.addEventListener('click', clickHandler);

    }
    
    draw() {
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "50px sans-serif";
        this.ctx.fillText("Costumizaton", 350, 80);

        this.drawButtonBack();
        this.drawPlayerBulletColor();
        this.drawEnemyBulletColor();
        this.drawPlayers();
    
        this.ctx.fillStyle = this.playerBulletColor;
        this.ctx.font = "25px sans-serif";
        this.ctx.fillText("Player bullet color: ", 240, 160);

        this.ctx.fillStyle = this.enemyBulletColor;
        this.ctx.font = "25px sans-serif";
        this.ctx.fillText("Enemy bullet color: ", 240, 260);

        this.ctx.fillStyle = "orange";
        this.ctx.font = "30px sans-serif";
        this.ctx.fillText("Choose player: ", 170, 340);

        this.ctx.fillStyle = "orange";
        this.ctx.font = "40px sans-serif";
        this.ctx.fillText(this.playerName + " selected", 170, 550);


    }

    drawPlayers(){
        const image1 = new Image();
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(25, 380, 90, 90);
        image1.src = 'images/player/player1.png';
        image1.onload = () => {
        this.ctx.drawImage(image1, 30, 380, 80, 80);
        };

        const image2 = new Image();
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(125, 380, 90, 90);
        image2.src = 'images/player/player2.png';
        image2.onload = () => {
        this.ctx.drawImage(image2, 130, 380, 80, 80);
        };

        const image3 = new Image();
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(225, 380, 90, 90);
        image3.src = 'images/player/player3.png';
        image3.onload = () => {
        this.ctx.drawImage(image3, 230, 380, 80, 80);
        };
    }

    drawButtonBack() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(600, 20, 80, 40);

        this.ctx.drawImage(this.buttonImage, 610, 10, 60, 50);

        this.ctx.fillStyle = "black";
        this.ctx.font = "20px sans-serif";
        this.ctx.fillText("back", 630, 55);
    }

    drawPlayerBulletColor() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(350, 130, this.squareSize, this.squareSize);
    
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(350 + this.squareSize + this.squareGap, 130, this.squareSize, this.squareSize);
    
        this.ctx.fillStyle = '#39FF14';
        this.ctx.fillRect(350 + 2 * (this.squareSize + this.squareGap), 130, this.squareSize, this.squareSize);
    
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(350 + 3 * (this.squareSize + this.squareGap), 130, this.squareSize, this.squareSize);
    
        this.ctx.fillStyle = '#e01fd0';
        this.ctx.fillRect(350 + 4 * (this.squareSize + this.squareGap), 130, this.squareSize, this.squareSize);

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(350 + 5 * (this.squareSize + this.squareGap), 130, this.squareSize, this.squareSize);
    }

    drawEnemyBulletColor() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(350, 230, this.squareSize, this.squareSize);
    
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(350 + this.squareSize + this.squareGap, 230, this.squareSize, this.squareSize);
    
        this.ctx.fillStyle = '#39FF14';
        this.ctx.fillRect(350 + 2 * (this.squareSize + this.squareGap), 230, this.squareSize, this.squareSize);
    
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(350 + 3 * (this.squareSize + this.squareGap), 230, this.squareSize, this.squareSize);
    
        this.ctx.fillStyle = '#e01fd0';
        this.ctx.fillRect(350 + 4 * (this.squareSize + this.squareGap), 230, this.squareSize, this.squareSize);

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(350 + 5 * (this.squareSize + this.squareGap), 230 , this.squareSize, this.squareSize);
    }

    
}
