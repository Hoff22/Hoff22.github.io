class Obstacle{
    constructor(pos, radius){
        this.pos = pos;
        this.size = radius;
        arrayOfObstacles.push(this);
    }

    Show(){
        ctx.fillStyle = "rgba(255,0,102,0.5)"
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)
        ctx.fill();
    }
}