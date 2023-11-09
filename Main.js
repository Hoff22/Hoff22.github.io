window.onload = main;

let monte = [];
let lookup = [];
let birdIdx = [];
let cellBegin = [];
let radiusOfInfluence = 30;

let lastTime = 0.0;

function CreateBirds(num){
    for(i = 1; i<=num; i++){
        new Bird();
    }
}

function PlaceBird(x, y){
    new Bird(x, y);
}

function DrawCells(){
    let rowN = Math.ceil(c.width / radiusOfInfluence);
    let colM = Math.ceil(c.height / radiusOfInfluence);
    let n = rowN * colM;
    ctx.beginPath();
    for(let i = 0; i < n; i++){
        let x = (i%rowN) * radiusOfInfluence;
        let y = Math.floor(i/rowN) * radiusOfInfluence;
        ctx.moveTo(x, y);
        ctx.lineTo(x+radiusOfInfluence, y);
        ctx.lineTo(x+radiusOfInfluence, y+radiusOfInfluence);
    }
    ctx.strokeStyle = "#FF00667F";
    ctx.stroke();
}

function GetCellCoord(index){
    let rowN = Math.ceil(c.width / radiusOfInfluence);
    let colM = Math.ceil(c.height / radiusOfInfluence);
    let x = (index%rowN) * radiusOfInfluence;
    let y = Math.floor(index/rowN) * radiusOfInfluence;
    return new Vector2(x,y);
}

function GetCellIndex(pos){
    return Math.floor(pos.x / radiusOfInfluence) + Math.floor(pos.y / radiusOfInfluence) * Math.ceil(c.width / radiusOfInfluence);
}

function GetNumberOfCells(){
    let rowN = Math.ceil(c.width / radiusOfInfluence);
    let colM = Math.ceil(c.height / radiusOfInfluence);
    return (rowN*colM);
}

function Update(){

    let deltaTime = performance.now() - lastTime;
    lastTime = performance.now();

    if(mouseDown) PlaceBird(mouse.x, mouse.y);
    
    for(let bird of monte){        
        bird.Acceleration();    
        bird.Update();
    }

    for(let i = 0; i < GetNumberOfCells(); i++){
        cellBegin[i] = Infinity;
    }

    lookup.sort();
    for(let i = 0; i < lookup.length; i++){
        birdIdx[lookup[i][1].index] = i;
        if(i == 0 || lookup[i][0] != lookup[i-1][0]){
            cellBegin[lookup[i][0]] = i;
        }
    }


    console.log(Math.floor(1000/deltaTime));

    Draw();

    window.requestAnimationFrame(Update);
    // setTimeout(() => {
    // }, 1000 / 30)
}

function Draw() { 
    ctx.clearRect(0,0,c.width,c.height);
    
    DrawCells();

    for(let bird of monte){        
        bird.Show();
    }
}

function main() {
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    InitEventListners();
    CreateBirds(2000);

    Update();
}