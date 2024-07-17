export default class Description {
    constructor(canvas, ctx, background, menuCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.background = background;
        this.menuCallback = menuCallback; 
        this.buttonImage = new Image();
        this.buttonImage.src = "images/ikon/back.png";

        const clickHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (x >= 910 && x <= 974 && y >= 10 && y <= 74) {
                this.menuCallback(); // menu() visszahívása
            }
        };

        this.canvas.addEventListener('click', clickHandler);
    }

draw() {
    this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "50px sans-serif";
    this.ctx.fillText("Description", 500, 80);

    this.drawButtonBack();

    var text = "Space Invaders, released in 1978, is an iconic arcade game known for its addictive gameplay and pixelated graphics. Players control a laser cannon at the bottom of the screen, tasked with defending Earth from descending waves of alien invaders. As the game progresses, the aliens move faster and descend more aggressively, adding to the challenge. Despite its simplicity, Space Invaders has had a significant cultural impact, inspiring numerous adaptations and homages across various media. Its enduring popularity is a testament to its timeless appeal and status as a classic in video game history.";
    var maxWidth = 400;
    var lineHeight = 30;
    var x = 500;
    var y = 130;

    this.drawWrappedText(text, x, y, maxWidth, lineHeight);

    const image = new Image();
    image.src = "images/ikon/description.png";
    image.onload = () => {
        this.ctx.drawImage(image, 50, 250, 150, 150);
        this.ctx.drawImage(image, 800, 250, 150, 150);
    };
}

drawButtonBack() {
    this.ctx.drawImage(this.buttonImage, 910, 10, 64, 64);
}

drawWrappedText(text, x, y, maxWidth, lineHeight) {
    this.ctx.font = "20px sans-serif";
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
        this.ctx.font = "25px Arial"; // ettől nagyobbnak tűnik a szöveg
        this.ctx.fillStyle = "white";
        this.ctx.fillText(line, x, y + (index * lineHeight));
    });
}


}