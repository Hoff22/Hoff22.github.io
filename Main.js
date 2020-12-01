window.onload = Run;

var monte;
var arrayOfObstacles;

function Run() {
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    monte = [];
    arrayOfObstacles = [];
    
    function CreateBirds(num){
        for(i = 1; i<=num; i++){
                new Bird()
        }
    }

    InitEventListners();
    CreateBirds(300);

    function Draw() { 
        ctx.clearRect(0,0,c.width,c.height);

        ObstaclePreview();
        
        for(let bird of monte){
            //console.log(`bird 1: ${monte[0].vel} \nbird 2: ${monte[1].vel}`);       
            bird.Acceleration();        
            bird.Update();
            bird.Show();
            //console.log(monte.length)
        }

        for(let obstacle of arrayOfObstacles){
            obstacle.Show();
        }
        window.requestAnimationFrame(Draw);
    }
    window.requestAnimationFrame(Draw);
}