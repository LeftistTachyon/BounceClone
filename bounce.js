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

var keysDown = {};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 0;
    this.radius = 5;
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

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#FF0000";
    context.fill();
};

var ball = new Ball(200, 745);

var testImage = getImage("gsycoy jeyo.jfif");

window.addEventListener("keydown", function(event) {
    var key = event.keyCode;
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

function Spike(x, y){
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 60;
}

Spike.prototype.getDot = function(idx) {
    switch(idx) {
        case 0:
            // return new Point(this.x + this.width / 2, this.y + this.height / 2);
            return {x: this.x + this.width / 2, y: this.y + this.height / 2};
        case 1:
            // return new Point(this.x, this.y);
            return {x: this.x, y: this.y};
        case 2:
            // return new Point(this.x + this.width, this.y);
            return {x: this.x + this.width, y: this.y};
        case 3:
            // return new Point(this.x + this.width, this.y + this.height);
            return {x: this.x + this.width, y: this.y + this.height};
        case 4:
            // return new Point(this.x, this.y + this.height);
            return {x: this.x, y: this.y + this.height};
    }
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

for(var i = 0;i<=4;i++) {
    console.log(spike.getDot(i));
}

Ball.prototype.update = function() {
    if(this.collides(spike)) {
        alert("You died!\nGet good");
        this.reset();
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
    
    this.forceAbove(745);
};

var update = function() {
    ball.update();
};

var render = function() {
    context.fillStyle = "#00bfff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#800000";
    context.fillRect(0,750,width,height-120);

    ball.render();
    spike.render();
    
    context.drawImage(testImage, 0, 0, 100, 100);
};

function Vector2D(x, y) {
    this.x = x;
    this.y = y;
    this.magnitude = Math.sqrt(x * x + y * y);
    if(this.magnitude == 1) {
        this.unitVector = this;
    } else {
        this.unitVector = new Vector2D(x / this.magnitude, y / this.magnitude);
    }
}

Vector2D.prototype.dotProduct = function(v) {
    return this.x * v.x + this.y + v.y;
}

Ball.prototype.collides = function(box) {
    var centerBox = box.getDot(0);
    
    var max = Number.NEGATIVE_INFINITY;
    var box2circle = new Vector2D(this.x - centerBox.x, this.y - centerBox.y);
    var box2circle_normalised = box2circle.unitVector;
    
    for(var i = 1;i<=4;i++) {
        var currentBoxCorner = box.getDot(i);
        var v = new Vector2D(currentBoxCorner.x - centerBox.x, 
                             currentBoxCorner.y - centerBox.y);
        var currentProj = v.dotProduct(box2circle_normalised);
        
        if(max < currentProj) max = currentProj;
    }
    
    return box2circle.magnitude - max - this.radius <= 0 || 
             box2circle.magnitude <= 0;
}