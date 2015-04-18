var canvas;
var context;
var amplitude;

var isGamePaused = false;
var stopSaucer = false;
var stopGame = false;

var features = []; //the feature images for the product
var pipes = []; //the pipe data
var playPause = []; //play and pause button images
var saucerOptions;

var cfeatureIdx;
var ftime; //feature drop time
var pipeHeight;
var score = 0;

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

function init(){
   window.addEventListener("keypress",keypress,false);

   canvas = document.getElementById('arena');
   canvas.width = screen.width * 0.7;
   canvas.height = screen.height - (0.1 * screen.height);
   context = canvas.getContext('2d');
   amplitude = canvas.width/2 - (0.1 * canvas.width);
   
   var saucer = new Image();
   saucer.src = "images/ufo.png";
   
    
   saucer.onload = function(){
   
    saucerOptions = {
        x: canvas.width/2 - saucer.width/2,
        y: canvas.height/4 - saucer.height/2,
        img: saucer,
        i: 0
     };

     loadData();
           
     drawSaucer();
     drawFeatures();
     drawPlayPauseButton();  
     drawPipes();
     updateScore();
     //set feature idx
     cfeatureIdx = features.length - 1;
     // wait one second before starting animation
     setTimeout(function() {
        var startTime = (new Date()).getTime();
        animate(startTime);
     }, 1000);
   }
}

function loadData(){
    loadFeatureImgArray();
    loadPlayPauseImgArray();
    loadPipes();
}

function loadFeatureImgArray(){
    var fs = ["lens.png","resolution.png","zoom.png","lens.png","resolution.png","zoom.png"];
    for (var i=0;i<fs.length;i++){
        var img = new Image();
        img.src = "images/" + fs[i];
        features.push({
            img: img,
            reviewed: false
        });
    }    
}

function loadPlayPauseImgArray(){
    var play = new Image();
    play.src = "images/play_thin_border.png";
    playPause.push(play);

    var pause = new Image();
    pause.src = "images/pause_thin_border.png";
    playPause.push(pause);
}

function loadPipes(){
    var y = canvas.height - (canvas.height * 0.18);
    pipeHeight = parseInt(y);
    var d = 50;
    for (var i=1;i<=5;i++){
        var img = new Image();
        img.src = "images/pipe" + i + ".png";
        var x = d + (i-1)*270;
        var range = [];

        range.push(x + 10);
        range.push(x + 90);
        pipes.push({
            x: x,
            y: y,
            img:img,
            range: range
        });
    }
}

function keypress(e){
    var kc = e.keyCode;

    if (kc == 112){ //pause
        isGamePaused = !isGamePaused;
        if (!isGamePaused) {
            stopSaucer = false;
        }
    }
    else if (kc == 32 && !isGamePaused) {
        stopSaucer = true;
        ftime = (new Date()).getTime();
    }
}


function featureInRange(x){
    for (var i in pipes){
        var pipe = pipes[i];
        var r = pipe.range;
        if (x >= r[0] && x<= r[1]){
            return true;
        }
    }
    return false;
}

function dropFeature(){
    //drop feature
    var feature = features[cfeatureIdx];
    
    var fx = saucerOptions.x + saucerOptions.img.width/2 - 20;
    var fy = saucerOptions.y + saucerOptions.img.height;
    var wh = 64;
    var time = (new Date()).getTime() - ftime;

    var gravity = 250;    

    fy = fy + (gravity * 0.6 * Math.pow(time/1000,2));

    if (parseInt(fy) >= pipeHeight && featureInRange(parseInt(fx))){
        onDropFeatureSuccess(feature);
        return;
    }

    if (canvas.height - fy < feature.img.height/2){
        onDropFeatureFailed();
        return;
    }

    context.drawImage(feature.img, fx, fy, wh, wh);
}

function onDropFeatureSuccess(feature){
    //mark current feature as reviewed
    feature.reviewed = true;
    cfeatureIdx --;
    
    score += 200;
    if (cfeatureIdx < 0) {//stop game; all features reviewed
       stopGame = true;
    }
    stopSaucer = false;
}

function onDropFeatureFailed(){
    score -= 50; 
    stopSaucer = false;
}

function stop(){
    context.clearRect(0,0,canvas.width,canvas.height);
    context.font = "48pt bold 'Comic Sans MS'";
    context.fillStyle = "red";
    context.fillText("LEVEL COMPLETE", canvas.width/2-250,canvas.height/2);
}

function updateScore(){
    context.font = "36pt bold 'Comic Sans MS'";
    context.fillStyle = 'green';
    context.fillText("Score: " + score , canvas.width - 420, 60);
}

function drawPlayPauseButton(){
    var img = isGamePaused ? playPause[0]: playPause[1];
    context.drawImage(img, canvas.width * 0.93, 20);
}

function drawFeatures(){
    var ctx = context;
    var fstyle = "#ddd";
    
    var y = 20;
    var d = 20;
    var c = 80;
    var fw = 64,fh = 64;
    var b = 5;
    var wh = 74;
    for (var i=features.length-1;i>=0;i--){
        var x = c*i + d;
        var feature = features[i];
        var img = feature.img;
        
        ctx.beginPath();
        fstyle = (i == cfeatureIdx)? "#00ff00": feature.reviewed ? "#ff0000" : "#ddd" ;  
        ctx.fillStyle = fstyle;
        
        ctx.fillRect(x-b,y-b,wh,wh);
        ctx.stroke();
        
        ctx.drawImage(img, x, y, fw, fh);
    }
}

function drawPipes () {
    for (var i in pipes){
        var pipe = pipes[i];
        context.drawImage(pipe.img,pipe.x,pipe.y);    
    }
}


function drawSaucer () {
    
    var x = saucerOptions.x;
    var y = saucerOptions.y;
    var i = saucerOptions.i;
    var imgObj = saucerOptions.img;

    context.drawImage(imgObj,x,y); 
}

function animate(startTime) {
    if(isGamePaused){
        drawPlayPauseButton();  
        requestNewFrame(startTime);
        return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    // draw saucer
    if (!stopSaucer) {
      computeSaucerNewPos(startTime);
      drawSaucer();
    } else {
      drawSaucer();
      dropFeature();
    } 
    //draw features
    drawFeatures();
    drawPlayPauseButton();  
    //draw pipes
    drawPipes();
    //update score
    updateScore();

    if (stopGame){
        stop();
        return;
    }
    // request new frame
    requestNewFrame(startTime);
}

function computeSaucerNewPos(startTime){
   // update
    var time = (new Date()).getTime() - startTime;
    
    // in ms
    var period = 6000;
    var centerX = canvas.width / 2 - saucerOptions.img.width/2;
    var nextX = amplitude * Math.sin(time * 2 * Math.PI / period) + centerX;
    saucerOptions.x = nextX;
    saucerOptions.i = (saucerOptions.i < 50)? saucerOptions.i + 1: 0;
}

function requestNewFrame(startTime){
        // request new frame
    requestAnimFrame(function() {
        animate(startTime);
    });
}

init();