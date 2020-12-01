var mouseDown = false
var mouse = new Vector2();
var center= new Vector2();
var distanceFromCenter = 0;

function InitEventListners(){

    window.addEventListener("mousedown", function(e){
        mouseDown = true;
        center = new Vector2(e.clientX, e.clientY);
    });

    window.addEventListener("mouseup", function(e){
        mouseDown = false;
        new Obstacle(center, distanceFromCenter)
    });

    // window.addEventListener("touchstart", function(e){
    //     mouseDown = true;
    // });
    
    // window.addEventListener("touchend", function(e){
    //     mouseDown = false;
    //     place = mouse;
    // });
    
    window.addEventListener("mousemove", function(e){
        mouse = new Vector2(e.clientX, e.clientY);
        if(mouseDown){
            distanceFromCenter = center.Sub(mouse).Magnitude();
        }
    });

    // window.addEventListener("touchmove", function(e){
    //     mouse = new Vector2(e.clientX, e.clientY);
    // });
}

function ObstaclePreview(){
    ctx.fillStyle = "rgba(255,0,102,0.5)"
    ctx.beginPath();
    ctx.arc(center.x, center.y, distanceFromCenter, 0, Math.PI * 2)
    ctx.fill();
}