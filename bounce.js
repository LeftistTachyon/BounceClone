var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 500/3) };

var canvas = document.createElement('canvas');
var width = 1000;
var height = 800;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var getImage = function(location) {
    var image = document.createElement("img");
    image.src = location;
    return image;
}

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

var step = function() {
    update();
    render();
    animate(step);
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 30;
    this.isFalling = false;
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#FF0000";
    context.fill();
};

var ball = new Ball(200, 720);

var testImage = getImage("gsycoy jeyo.jfif");

var keysDown = {};

window.addEventListener("keydown", function(event) {
    var key = event.keyCode;
    if(!ball.isFalling || (key != 32 && key != 38))
        keysDown[key] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

Ball.prototype.update = function() {
    for(var key in keysDown) {
        var value = Number(key);
        switch(value) {
            case 37: // [<-]
                this.x_speed = -4;
                break;
            case 39: // [->]
                this.x_speed = 4;
                break;
            case 32: // Jump
            case 38: // up
                if(!this.isFalling) {
                    this.y_speed = -25;
                    this.isFalling = true;
                }
                break;
        }
        
        console.log(key);
    }

    this.moveD();
    
    if(keysDown[32] == undefined && keysDown[39] == undefined) {
        if(this.x_speed > 0) {
            if(this.x_speed < 0.5) {
                this.x_speed = 0;
            } else {
                this.x_speed -= 0.5;
            }
        } else {
            if(this.x_speed > -0.5) {
                this.x_speed = 0;
            } else {
                this.x_speed += 0.5;
            }
        }
    }
    if(this.isFalling) {
        this.y_speed += 0.6;
    }
    
    this.forceAbove(720);
};

Ball.prototype.move = function(dx, dy) {
    this.x_speed = dx;
    this.y_speed = dy;
    
    this.x += this.x_speed;
    this.y += this.y_speed;
}

Ball.prototype.moveD = function() {
    this.move(this.x_speed, this.y_speed);
}

Ball.prototype.forceAbove = function(y) {
    if(this.y > y) {
        this.y = y;
        this.y_speed = Math.round(-this.y_speed/8);
        if(this.y_speed == 0) this.isFalling = false;
    }
}

Ball.prototype.forceBelow = function(y) {
    if(this.y < y) {
        this.y = y;
        this.y_speed = 0;
    }
}

var update = function() {
    ball.update();
};

function Spike(x, y){
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 60;
}

Spike.prototype.render = function() {
    context.fillStyle = "#91612B";
    context.fillRect(this.x, this.y + 10, this.width, this.height - 10);
    context.beginPath();
    context.fillStyle = "#FFEE00";
    context.arc(this.x + 10, this.y + 10, this.width/2, Math.PI * 2, false);
    context.fill();
}

Spike.prototype.moveX = function(dX) {
    this.x += dX;
}

var spike = new Spike(200, 690); // nice

var render = function() {
    context.fillStyle = "#00bfff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#800000";
    context.fillRect(0,750,width,height-120);

    ball.render();
    spike.render();
    
    context.drawImage(testImage, 0, 0, 100, 100);
};