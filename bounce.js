function Trig() {}

Trig.prototype.sec = function(angle) {
    return 1/Math.cos(angle);
}

Trig.prototype.csc = function(angle) {
    return 1/Math.sin(angle);
}

var trig = new Trig();

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

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

var step = function() {
    update();
    render();
    animate(step);
};

var keysDown = {};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 0;
    this.radius = 30;
    this.isFalling = false;
    this.reset = function() {
        this.x = x;
        this.y = y;
        this.x_speed = 0;
        this.y_speed = 0;
        this.isFalling = false;
        keysDown = {};
    }
}

Ball.prototype.getRadius = function(angle) {
    return this.radius;
}

Ball.prototype.getCenter = function() {
    return {x: this.x, y: this.y};
}

Ball.prototype.render = function() {
    context.fillStyle = "#FF0000";
    context.fillRect(this.x - this.radius, this.y - this.radius, 
                     2 * this.radius, 2 * this.radius);
    context.fill();
};

function Ring(x, y) {
    this.x = x;
    this.y = y;
    this.radiusX = 10;
    this.radiusY = 40;
}

Ring.prototype.render = function() {
    context.fillStyle = "#FFD700";
    context.beginPath();
    context.ellipse(this.x, this.y, this.radiusX, this.radiusY,  2 * Math.PI, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
}

var ball = new Ball(200, 720);

var ring = new Ring(400, 710);

var keysDown = {};
window.addEventListener("keydown", function(event) {
    let key = event.keyCode;
    if(!ball.isFalling || (key != 32 && key != 38))
        keysDown[key] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

Ball.prototype.jump = function() {
    if(!this.isFalling) {
        this.y_speed = -25;
        this.isFalling = true;
    }
}

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
        if(keysDown[32] != undefined || keysDown[38] != undefined) {
            this.isFalling = false;
            this.jump();
        } else {
            this.y_speed = Math.round(-this.y_speed/8);
            if(this.y_speed == 0) {
                this.isFalling = false;
            }
       }
    }
}

Ball.prototype.forceBelow = function(y) {
    if(this.y < y) {
        this.y = y;
        this.y_speed = 0;
    }
}

Ball.prototype.forceLeft = function(x) {
    if(this.x > x) {
        this.x = x;
        this.x_speed = 0;
    }
}

Ball.prototype.forceRight = function(x) {
    if(this.x < x) {
        this.x = x;
        this.x_speed = 0;
    }
}

// 180 * n1 - atan(1/3) + 90

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
    context.closePath();
    context.fill();
}

Spike.prototype.moveX = function(dX) {
    this.x += dX;
}

var spike = new Spike(600, 690); // nice

function Vector2D(x, y) {
    this.x = x;
    this.y = y;
    this.magnitude = Math.sqrt(x * x + y * y);
    this.angle = Math.atan(this.y / this.x);
    if(this.x < 0) {
        this.angle += Math.PI / 2;
    }
    if(this.magnitude == 1) {
        this.unitVector = this;
    } else {
        this.unitVector = new Vector2D(x / this.magnitude, y / this.magnitude);
    }
}

Vector2D.prototype.dotProduct = function(v) {
    return this.x * v.x + this.y + v.y;
}

var collides = function(bal, thing) {
    return thing.x + thing.width > bal.x - bal.radius &&
        thing.y + thing.height > bal.y - bal.radius &&
        thing.x < bal.x + bal.radius &&
        thing.y < bal.y + bal.radius;
}

Ball.prototype.update = function() {
    if(collides(ball, spike)) {
        alert("You died!\nGet good");
        ball.reset();
    }
    
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
                this.jump();
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
    
    this.forceBelow(500);
};

var update = function() {
    ball.update();
};

var render = function() {
    context.fillStyle = "#00bfff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#800000";
    context.fillRect(0,750,width,height-120);
    context.fillRect(0,0,width,height-400);

    ball.render();
    
    ring.render();
    
    spike.render();
};
