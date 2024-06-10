export default class Sound {
    constructor(canvas, ctx, background, menuCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.background = background;
        this.menuCallback = menuCallback; 
        this.buttonImage = new Image();
        this.buttonImage.src = "images/return.png";
        this.soundOn = true;
        this.volume = 50;
        
        const clickHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
        
            if (x >= 900 && x <= 980 && y >= 20 && y <= 60) {
                this.menuCallback(); // menu() visszahívása
            }
        
            if (x >= 350 && x <= 400 && y >= 180 && y <= 230) {
                this.toggleSound(); // Hang ki/be kapcsolása
                this.draw(); // újra rajzolás a gomb on -> off / off -> on váltás miatt
            }
        
            if (x >= 750 && x <= 800 && y >= 150 && y <= 200) {
                this.increaseVolume();
                this.draw();
            }
        
            if (x >= 750 && x <= 800 && y >= 220 && y <= 270) {
                this.decreaseVolume();
                this.draw();
            }
        };
        
        this.canvas.addEventListener('click', clickHandler);
    }
    
    draw() {
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "50px sans-serif";
        this.ctx.fillText("Sound", 500, 80);
    
        this.drawButtonBack();
        this.drawSoundButton();
        this.drawVolumeButton()

        this.ctx.fillStyle = "white";
        this.ctx.font = "40px sans-serif";
        this.ctx.fillText("Sound: ", 270, 220);
    
        this.ctx.fillStyle = "white";
        this.ctx.font = "35px sans-serif";
        this.ctx.fillText("Volume: " + this.volume + " %", 600, 220);

        const image = new Image();
        image.src = "images/sound.png";
        image.onload = () => {
        this.ctx.drawImage(image, 370, 320, 240, 240);
        };
    }

    drawVolumeButton() {
        // Volume növelése gomb
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(750, 150, 50, 50);
        this.ctx.fillStyle = "black";
        this.ctx.font = "50px sans-serif";
        this.ctx.fillText("+", 775, 195);

        // Volume csökkentése gomb
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(750, 220, 50, 50);
        this.ctx.fillStyle = "black";
        this.ctx.font = "50px sans-serif";
        this.ctx.fillText("-", 775, 260);
    }

    drawSoundButton() {
        this.ctx.fillStyle = this.soundOn ? "green" : "red";
        this.ctx.fillRect(350, 180, 50, 50);

        this.ctx.fillStyle = "white";
        this.ctx.font = "25px sans-serif";
        this.ctx.fillText(this.soundOn ? "On" : "Off", 370, 215);
    }

    // Hang be/kikapcsolás
    toggleSound() {
        this.soundOn = !this.soundOn;
    }

    increaseVolume() {
        const maxVolume = 100;
    
        this.volume = Math.min(this.volume + 10, maxVolume);
    }

    decreaseVolume() {
        const minVolume = 0;

        this.volume = Math.max(this.volume - 10, minVolume);
    }

    drawButtonBack() {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(900, 20, 80, 40);

        this.ctx.drawImage(this.buttonImage, 910, 10, 60, 50);

        this.ctx.fillStyle = "black";
        this.ctx.font = "20px sans-serif";
        this.ctx.fillText("back", 930, 55);
    }
    
}