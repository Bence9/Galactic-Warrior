export default class Player {
    rightPress = false;
    leftPress = false;
    shootPressed = false;

    constructor(canvas, velocity, bulletController) {
        this.canvas = canvas;
        this.velocity = velocity;
        this.BulletController = bulletController;

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 75;
        this.width = 60;
        this.height = 61;
        this.image = new Image();
        this.image.src = `images/player.png`;

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    draw(ctx) {
        if(this.shootPressed === true){
            this.BulletController.shoot(this.x + this.width/2, this.y, 4, 10);
        }
        this.move();
        this.collisionWithWalls();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move() {
        if (this.rightPress) {
            this.x += this.velocity;
        } else if (this.leftPress) {
            this.x -= this.velocity;
        }
    }

    collisionWithWalls() {
        if (this.x < 0) {
            this.x = 0;
        }

        if (this.x > this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width;
        }
    }

    handleKeyDown = (event) => {
        if (event.code === 'ArrowRight') {
            this.rightPress = true;
        }
        if (event.code === 'ArrowLeft') {
            this.leftPress = true;
        }
        if (event.code === 'Space'){
            event.preventDefault(); //space lenyomása esetén ne gördüljen le az oldal aljára
            this.shootPressed = true;
        }
    }

    handleKeyUp = (event) => {
        if (event.code === 'ArrowRight') {
            this.rightPress = false;
        }
        if (event.code === 'ArrowLeft') {
            this.leftPress = false;
        }
        if (event.code === 'Space'){
            event.preventDefault();
            this.shootPressed = false;
        }
    }
}