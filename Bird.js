class Bird {
    constructor(x = c.width / 2,y = c.height / 2) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(Random(-2, 2), Random(-2, 2));
        this.acc = new Vector2();
        this.maxSpeed = 5
        this.maxForce = 0.3
        this.color = "#000000"
        this.size = 10
        this.mouseSize = 100
        monte.push(this);
    }

    Show() {
        this.Triangle();
    }

    Triangle() {
        ctx.translate(this.pos.x, this.pos.y)
        ctx.rotate(this.vel.Angle())
        ctx.beginPath();
        ctx.moveTo(0, 0)
        ctx.lineTo(0, this.size / 4)
        ctx.lineTo(this.size, 0)
        ctx.lineTo(0, -this.size / 4)
        ctx.lineTo(0, 0)
        ctx.strokeStyle = "#FF0066"
        ctx.fillStyle = "rgba(255,0,102,0.5)"
        ctx.fill();
        ctx.stroke();
        ctx.rotate(-this.vel.Angle())
        ctx.translate(-this.pos.x, -this.pos.y)
    }

    Update() {
        this.color = "#FF0066";
        this.vel = this.vel.Add(this.acc).SetMag(this.maxSpeed);
        this.pos = this.pos.Add(this.vel);
        this.acc = new Vector2();

        this.CheckWalls();
    }

    Acceleration() {
        if (this.CheckMates) {
            this.acc = this.acc.Add(this.Alignment().Mul(1))
            this.acc = this.acc.Add(this.Separation().Mul(2))
            this.acc = this.acc.Add(this.Cohesion().Mul(1))
            this.acc = this.acc.Add(this.FleeObstacle().Mul(5))
        }
        else {
            this.acc = this.acc.Add(this.FleeObstacle().Mul(5))
        }
        //return this.acc;
    }

    Separation() {
        let desiredVelocity = new Vector2();
        let avgPos = new Vector2();
        let distance = 0;
        let total = 0;
        for (let other of monte) {
            if (other != this) {
                if (this.pos.getDistance(other.pos) <= 0.5) {
                    avgPos = avgPos.Add(other.pos);
                    total++
                    distance = 1
                    break
                }
                if (this.pos.getDistance(other.pos) < this.size * 2 && this.pos.getDistance(other.pos) > 0.5) {
                    avgPos = avgPos.Add(other.pos);
                    total++
                    distance = this.pos.getDistance(other.pos)
                }
            }
        }
        if (total > 0) {
            avgPos = avgPos.Div(total);
            desiredVelocity = this.pos.Sub(avgPos)
            return desiredVelocity.Sub(this.vel).SetMag(this.maxForce * this.size * 2 / distance);
        }
        else { return new Vector2(); }
    }

    Alignment() {
        let desiredVelocity = new Vector2();
        let total = 0;
        for (let other of monte) {
            if (other != this) {
                if (this.pos.getDistance(other.pos) < this.size * 5) {
                    desiredVelocity = desiredVelocity.Add(other.vel);
                    total++
                }
            }
        }
        if (total > 0) {
            desiredVelocity = desiredVelocity.Div(total).SetMag(this.maxSpeed);
            if (Math.abs(desiredVelocity.Sub(this.vel).x) < 0.1 && Math.abs(desiredVelocity.Sub(this.vel).y) < 0.1) {
                return new Vector2();
            }
            else {
                return desiredVelocity.Sub(this.vel).SetMag(this.maxForce);
            }
        }
        else { return new Vector2(); }
    }

    Cohesion() {
        let desiredVelocity = new Vector2();
        let avgPos = new Vector2();
        let total = 0;
        for (let other of monte) {
            if (other != this) {
                if (this.pos.getDistance(other.pos) < this.size * 5) {
                    avgPos = avgPos.Add(other.pos);
                    total++
                }
            }
        }
        if (total > 0) {
            avgPos = avgPos.Div(total);
            desiredVelocity = avgPos.Sub(this.pos)
            return desiredVelocity.Sub(this.vel).SetMag(this.maxForce);
        }
        else { return new Vector2(); }
    }

    FleeObstacle() {
        let desiredVelocity = new Vector2();
        let avgPos = new Vector2();
        let total = 0;
        for (let obstacle of arrayOfObstacles) {
            if (this.pos.getDistance(obstacle.pos) < this.size * 2 + obstacle.size) {
                avgPos = avgPos.Add(obstacle.pos);
                total++
            }
        }
        if (total > 0) {
            avgPos = avgPos.Div(total);
            desiredVelocity = this.pos.Sub(avgPos).SetMag(this.maxSpeed);
            return desiredVelocity.Sub(this.vel).SetMag(this.maxForce);
        }
        else { return new Vector2(); }
    }

    CheckMates() {
        for (let other of monte) {
            if (this.pos.getDistance(other.pos) < this.size * 5 && other != this) {
                return true
            }
        }
    }

    CheckWalls() {
        if (this.pos.x > c.width) {
            this.pos.x = this.size;
        }
        if (this.pos.x < 0) {
            this.pos.x = c.width - this.size
        }
        if (this.pos.y > c.height) {
            this.pos.y = this.size;
        }
        if (this.pos.y < 0) {
            this.pos.y = c.height - this.size
        }
    }
}

function Random(min, max) {
    return Math.random() * (max - min) + min
}