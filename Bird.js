class Bird {
    constructor(x = c.width / 2, y = c.height / 2, r = 30) {
        this.pos = new Vector2(x + Random(-1, 1), y + Random(-1, 1));
        this.vel = new Vector2(Random(-20, 20), Random(-20, 20));
        this.acc = new Vector2();
        this.maxSpeed = 2;
        this.maxForce = 0.3;
        this.color = "#000000";
        this.size = 10;
        this.mouseSize = 100;
        this.radiusOfInfluence = r;
        this.index = monte.length;
        monte.push(this);
        birdIdx.push(lookup.length);
        cellBegin[this.GetBirdCell()] = Math.min(cellBegin[this.GetBirdCell()], lookup.length);
        lookup.push([this.GetBirdCell(), this]);
    }

    Show() {
        this.Triangle();
        if(this.index == 0){
            this.DrawTouchedCells();
            this.DrawRange();
        }
    }

    Triangle() {
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.vel.Angle());
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.size / 4);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, -this.size / 4);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color + "7F";
        ctx.fill();
        ctx.stroke();
        ctx.rotate(-this.vel.Angle());
        ctx.translate(-this.pos.x, -this.pos.y);
    }

    DrawRange(){
        ctx.translate(this.pos.x, this.pos.y);
        ctx.beginPath();
        ctx.arc(0,0, this.radiusOfInfluence, 0, 2*Math.PI);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color + "7F";
        ctx.fill();
        ctx.stroke();
        ctx.translate(-this.pos.x, -this.pos.y);
    }

    DrawVector(pos, vec, color){
        ctx.translate(pos.x, pos.y);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(vec.Mul(50).x, vec.Mul(50).y);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.translate(-pos.x, -pos.y);
    }

    DrawTouchedCells(){
        let r = this.radiusOfInfluence;
        let upperLeft = GetCellCoord(GetCellIndex(this.pos.Add(new Vector2(-r, -r))));
        ctx.rect(upperLeft.x, upperLeft.y, this.radiusOfInfluence * 3, this.radiusOfInfluence * 3);
        ctx.fillStyle = "#6600FF3F";
        ctx.fill();
    }

    GetBirdCell(){
        return Math.floor(this.pos.x / this.radiusOfInfluence) + Math.floor(this.pos.y / this.radiusOfInfluence) * Math.ceil(c.width / this.radiusOfInfluence);
    }

    Update() {
        this.color = "#6600FF";
        if(this.index == 0){
            this.color = "#FF0066";
        }
        this.vel = this.vel.Add(this.acc).SetMag(this.maxSpeed);
        this.pos = this.pos.Add(this.vel);
        this.acc = new Vector2();

        this.CheckWalls();

        lookup[birdIdx[this.index]] = [this.GetBirdCell(), this];
    }

    Acceleration() {
        this.acc = this.acc.Add(this.Alignment().Mul(0.1))
        this.acc = this.acc.Add(this.Separation().Mul(0.3))
        this.acc = this.acc.Add(this.Cohesion().Mul(0.1))
    }

    Separation() {
        let neighbours = this.GetNeighborhood();
        if(neighbours.length == 0) return new Vector2();

        let desiredVelocity = new Vector2();
        
        let p = 1.5;

        for(let bird of neighbours){
            let dv = this.pos.Sub(bird.pos);
            let fac = (Math.pow(this.radiusOfInfluence, p) - Math.pow(dv.Magnitude(), p)) / Math.pow(this.radiusOfInfluence, p);
            desiredVelocity = desiredVelocity.Add(
                dv.Normalize().Mul(fac)
            );
        }

        // desiredVelocity = desiredVelocity.Div(neighbours.length);

        let desiredAcceleration = desiredVelocity.Sub(this.vel);

        // this.DrawVector(this.pos, desiredVelocity, "#00FF66");
        // this.DrawVector(this.pos, this.vel, "#6600FF");
        // this.DrawVector(this.pos.Add(this.vel.Mul(50)), desiredAcceleration, "#FF0022");

        // return new Vector2();
        return desiredAcceleration;
    }

    Alignment() {
        let neighbours = this.GetNeighborhood();
        if(neighbours.length == 0) return new Vector2();

        let desiredVelocity = this.vel;

        for(let bird of neighbours){
            desiredVelocity = desiredVelocity.Add(bird.vel);
        }

        desiredVelocity = desiredVelocity.Div(neighbours.length+1);

        let desiredAcceleration = desiredVelocity.Sub(this.vel);

        // this.DrawVector(this.pos, desiredVelocity, "#00FF66");
        // this.DrawVector(this.pos, this.vel, "#6600FF");
        // this.DrawVector(this.pos.Add(this.vel.Mul(50)), desiredAcceleration, "#FF0022");

        // return new Vector2();
        return desiredAcceleration;
    }

    Cohesion() {
        let neighbours = this.GetNeighborhood();
        if(neighbours.length == 0) return new Vector2();

        let avgPos = this.pos;
        for(let bird of neighbours){
            avgPos = avgPos.Add(bird.pos);
        }

        avgPos = avgPos.Div(neighbours.length+1);

        let desiredVelocity = avgPos.Sub(this.pos).Clamp(this.maxSpeed);
        let desiredAcceleration = desiredVelocity.Sub(this.vel);

        return desiredAcceleration;
    }

    GetNeighborhood(){
        let neighbours = [];

        let centerCell = this.GetBirdCell();
        let r = this.radiusOfInfluence;
        let cells = [
            centerCell,
            GetCellIndex(this.pos.Add(new Vector2(r, 0))),
            GetCellIndex(this.pos.Add(new Vector2(0, r))),
            GetCellIndex(this.pos.Add(new Vector2(r, r))),
            GetCellIndex(this.pos.Add(new Vector2(-r, 0))),
            GetCellIndex(this.pos.Add(new Vector2(0, -r))),
            GetCellIndex(this.pos.Add(new Vector2(-r, -r))),
            GetCellIndex(this.pos.Add(new Vector2(-r, r))),
            GetCellIndex(this.pos.Add(new Vector2(r, -r))),
        ];

        cells = new Set(cells);

        for(let cell of cells){
            for(let i = cellBegin[cell]; i < lookup.length && (i == cellBegin[cell] || lookup[i][0] == lookup[i-1][0]); i++){
                let bird = lookup[i][1];
                if(bird == this) continue;
                if(this.pos.getDistance(bird.pos) < this.radiusOfInfluence) neighbours.push(bird);
            }
        }

        // for(let bird of monte){
        //     if(bird == this) continue;
        //     if(this.pos.getDistance(bird.pos) < this.radiusOfInfluence) neighbours.push(bird);
        // }
        return neighbours;
    }

    FleeObstacle() {
        let desiredVelocity = new Vector2();
        let avgPos = new Vector2();
        let total = 0;
        for (let obstacle of arrayOfObstacles) {
            if (this.pos.getDistance(obstacle.pos) < this.size * 2 + obstacle.size) {
                avgPos = avgPos.Add(obstacle.pos);
                total++;
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
                return true;
            }
        }
    }

    CheckWalls() {
        if (this.pos.x > c.width) {
            this.pos.x = this.size;
        }
        if (this.pos.x < 0) {
            this.pos.x = c.width - this.size;
        }
        if (this.pos.y > c.height) {
            this.pos.y = this.size;
        }
        if (this.pos.y < 0) {
            this.pos.y = c.height - this.size;
        }
    }
}

function Random(min, max) {
    return Math.random() * (max - min) + min;
}