import Enemy from "./enemy.js";
import MovingDirection from "./MovingDirection.js";


export default class EnemyController{

    enemyMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 5, 5, 5, 5, 5, 5, 5, 5, 1],
        [2, 2, 4, 4, 4, 4, 4, 4, 2, 2],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      ];

      EnemyRows = [];

      currentDirection = MovingDirection.right;
      xVelocity = 0;
      yVelocity = 0;
      defaultXVelocity = 1;
      defaultYVelocity = 1;
      moveDownTimerDefault = 30;
      moveDownTimer = this.moveDownTimerDefault;

    constructor(canvas){
        this.canvas = canvas;
        this.createEnemies();
    }

    draw(ctx){
        this.decrementMoveDownTimer();
        this.updateVelocityAndDirection();
        this.drawEnemies(ctx);
        this.resetMoveDownTimer();
    }

    resetMoveDownTimer(){
        if(this.moveDownTimer <= 0){
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }

    decrementMoveDownTimer(){
        if(this.currentDirection == MovingDirection.downLeft || this.currentDirection == MovingDirection.downRight){
            this.moveDownTimer--;
        }
    }

    updateVelocityAndDirection(){
        for(const enemyRow of this.EnemyRows){
            if(this.currentDirection == MovingDirection.right){
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;
                const rightMostEenmies = enemyRow[enemyRow.length - 1];
                if(rightMostEenmies.x + rightMostEenmies.width >= this.canvas.width ){
                    this.currentDirection = MovingDirection.downLeft;
                    break;
                }
            }
            else if(this.currentDirection == MovingDirection.downLeft){
                if(this.moveDown(MovingDirection.left)){
                    break;
                }
            }
            else if(this.currentDirection === MovingDirection.left ){
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;
                const leftMostEnemy = enemyRow[0];
                if(leftMostEnemy.x <= 0){
                    this.currentDirection = MovingDirection.downRight;
                    break;
                }
            }
            else if(this.currentDirection === MovingDirection.downRight){
                if(this.moveDown(MovingDirection.right)){
                    break;
                }
            }
        }
    }

    moveDown(newDirection){
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if(this.moveDownTimer == 0){
            this.currentDirection = newDirection;
            return true
        }
        return false;
    }

    drawEnemies(ctx){
        this.EnemyRows.flat().forEach((enemy)=>{
            enemy.move(this.xVelocity,this.yVelocity);
            enemy.draw(ctx);
        })
    }

    createEnemies(){
        this.enemyMap.forEach((row,rowindex)=>{
            this.EnemyRows[rowindex] = [];
            row.forEach((enemyNumber,enemyIndex)=>{
                if(enemyNumber > 0){
                    this.EnemyRows[rowindex].push(
                        new Enemy(enemyIndex* 45, rowindex * 30, enemyNumber)
                    );
                }
            });    
        });
    }

    
}