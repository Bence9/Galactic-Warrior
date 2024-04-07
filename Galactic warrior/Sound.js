export default class Sound {
    constructor(canvas, ctx, background, menuCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.background = background;
        this.menuCallback = menuCallback; 
        this.buttonImage = new Image();
        this.buttonImage.src = 'images/return.png';
        this.soundOn = true;
        this.volume = 50;
        
        const clickHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
        
            if (x >= 600 && x <= 680 && y >= 20 && y <= 60) {
                this.menuCallback(); // menu() visszahívása
            }
        
            if (x >= 100 && x <= 150 && y >= 130 && y <= 180) {
                this.toggleSound(); // Hang ki/be kapcsolása
                this.draw(); // újra rajzolás a gomb on -> off / off -> on váltás miatt
            }
        
            if (x >= 100 && x <= 150 && y >= 200 && y <= 250) {
                this.increaseVolume();
                this.draw();
            }
        
            if (x >= 100 && x <= 150 && y >= 270 && y <= 320) {
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
        this.ctx.fillText("Sound", 350, 80);
    
        this.drawButtonBack();
        this.drawSoundButton();
        this.drawVolumeButton()
    
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px sans-serif";
        this.ctx.fillText("Sound: " + (this.soundOn ? "On" : "Off"), 270, 165);
        this.ctx.fillText("Volume: " + this.volume + " %", 270, 275);

        const image = new Image();
        image.src = 'images/sound.png';
        image.onload = () => {
        this.ctx.drawImage(image, 230, 350, 190, 190);
        };
    }

    drawVolumeButton() {
        // Volume növelése gomb
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(100, 200, 50, 50);
        this.ctx.fillStyle = "black";
        this.ctx.font = "50px sans-serif";
        this.ctx.fillText("+", 125, 245);

        // Volume csökkentése gomb
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(100, 270, 50, 50);
        this.ctx.fillStyle = "black";
        this.ctx.font = "50px sans-serif";
        this.ctx.fillText("-", 125, 310);
    }

    drawSoundButton() {
        this.ctx.fillStyle = this.soundOn ? 'green' : 'red';
        this.ctx.fillRect(100, 130, 50, 50);

        this.ctx.fillStyle = "white";
        this.ctx.font = "25px sans-serif";
        this.ctx.fillText(this.soundOn ? "On" : "Off", 120, 165);
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
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(600, 20, 80, 40);

        this.ctx.drawImage(this.buttonImage, 610, 10, 60, 50);

        this.ctx.fillStyle = "black";
        this.ctx.font = "20px sans-serif";
        this.ctx.fillText("back", 630, 55);
    }
    
}