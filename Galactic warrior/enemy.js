export default class Enemy{

    constructor(x,y,imageNumber){
        this.x = x;
        this.y = y;
        this.width = 60;
        this.heigth = 33;

        this.image = new Image();
        this.image.src = `images/enemy${imageNumber}.png`;
    }

    draw(ctx){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.heigth);
    }

    move(xVelocity,yVelocity){
        this.x += xVelocity;
        this.y += yVelocity;
    }
}