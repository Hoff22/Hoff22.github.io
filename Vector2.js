class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
        this.mag = this.Magnitude();
        this.angle = this.Angle(); 
    }

    Add(vector2) {
        return new Vector2(vector2.x + this.x, vector2.y + this.y);
    }

    Sub(vector2) {
        return new Vector2(this.x - vector2.x,this.y - vector2.y);
    }

    Div(num){
        return new Vector2(this.x / num, this.y / num);
    }

    Mul(num){
        return new Vector2(this.x * num, this.y * num);
    }
    
    getDistance(vector2) {
        return this.Sub(vector2).Magnitude();
    }

    Magnitude(){
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    Angle(){
        return Math.atan2(this.y, this.x);
    }

    Normalize(){
        return new Vector2(this.x / this.Magnitude(), this.y / this.Magnitude())
    }

    SetMag(num){     
        return new Vector2(this.Normalize().x * num, this.Normalize().y * num)
    }

    Clamp(num){
        if(this.Magnitude() > num) return this.SetMag(num);
        return this;
    }

    toString(){
        return `[${this.x},  ${this.y}]`;
    }
}