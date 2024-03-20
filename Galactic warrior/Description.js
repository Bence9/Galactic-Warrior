class Description {
    constructor(canvas, ctx, menuCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.menuCallback = menuCallback; // Reference to the menu function
    }

    draw() {
        this.ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);

        this.drawButtonBack();

        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if (x >= 600 && x <= 680 && y >= 20 && y <= 60) {
                this.menuCallback(); // Call the menu function provided as a reference
            }
        });

        var text = 'Space Invaders, released in 1978, is an iconic arcade game known for its addictive gameplay and pixelated graphics. Players control a laser cannon at the bottom of the screen, tasked with defending Earth from descending waves of alien invaders. As the game progresses, the aliens move faster and descend more aggressively, adding to the challenge. Despite its simplicity, Space Invaders has had a significant cultural impact, inspiring numerous adaptations and homages across various media. Its enduring popularity is a testament to its timeless appeal and status as a classic in video game history.';
        var maxWidth = 400;
        var lineHeight = 30;
        var x = 350;
        var y = 100;

        this.drawWrappedText(text, x, y, maxWidth, lineHeight);
    }

    drawButtonBack() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(600, 20, 80, 40);

        this.ctx.fillStyle = "white";
        this.ctx.font = "20px sans-serif";
        this.ctx.fillText("Back", 640, 45);
    }

    drawWrappedText(text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        var lines = [];

        words.forEach((word) => {
            var testLine = line + word + ' ';
            var metrics = this.ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth) {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        });
        lines.push(line);

        lines.forEach((line, index) => {
            this.ctx.font = "25px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(line, x, y + (index * lineHeight));
        });
    }
}