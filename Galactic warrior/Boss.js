export default class Boss {
    constructor(x, y, imageNumber, life) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;

        this.value = imageNumber;

        this.image = new Image();
        this.image.src = `images/enemy/Boss.png`;

        this.life = life;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(xVelocity, yVelocity) {
        this.x += xVelocity;
        this.y += yVelocity;
    }

    collideWith(sprite) {
        return (
            this.x + this.width > sprite.x &&
            this.x < sprite.x + sprite.width &&
            this.y + this.height > sprite.y && 
            this.y < sprite.y + sprite.height
        );
    }

}