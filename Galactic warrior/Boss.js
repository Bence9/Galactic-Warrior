export default class Boss {
    constructor(x, y, imageSrc, frameWidth, frameHeight, rows, cols, fps) {
        this.x = x;
        this.y = y;
        this.width = frameWidth;
        this.height = frameHeight;

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.rows = rows;
        this.cols = cols;
        this.fps = fps;

        this.frameIndex = 0;
        this.count = 0;
        this.lastFrameTime = 0;

        this.spriteSheet = new Image();
        this.spriteSheet.src = imageSrc;

        this.spriteSheet.onload = () => {
            this.isLoaded = true;
        };
        this.isLoaded = false;
    }

    draw(ctx) {
        if (!this.isLoaded) return; // Ne rajzoljon, amíg a kép nem töltődött be

        const rowIndex = Math.floor(this.frameIndex / this.cols);
        const colIndex = this.frameIndex % this.cols;

        ctx.drawImage(
            this.spriteSheet,
            colIndex * this.frameWidth,
            rowIndex * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    update(currentTime) {
        if (!this.isLoaded) return; // Ne frissítse, amíg a kép nem töltődött be

        if (currentTime - this.lastFrameTime >= 1000 / this.fps) {
            this.count++;
            if (this.count >= 7) { // Esetleg állítsd be az animáció sebességét
                this.frameIndex++;
                this.count = 0;
            }

            if (this.frameIndex >= this.rows * this.cols) {
                this.frameIndex = 0;
            }

            this.lastFrameTime = currentTime;
        }
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