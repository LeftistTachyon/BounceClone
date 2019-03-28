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

var getImage = function(location) {
    let image = document.createElement("img");
    image.src = location;
    return image;
}

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
    let key = event.keyCode;
    console.log(key);
    if(!ball.isFalling || (key != 32 && key != 38))
        keysDown[key] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

var step = function() {
    update();
    render();
    animate(step);
};

var level = 0;
var screen = 0;

var collidables = {};

collidables[0] = [new Spike(600, 690), new EndGoal(width - 30, height - 150)];

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
    context.ellipse(this.x, this.y, this.radiusX, this.radiusY,  
                    2 * Math.PI, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
}

var ball = new Ball(200, 720);

var ring = new Ring(400, 710);

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
    if(this.x > x - this.radius) {
        this.x = x - this.radius;
        this.x_speed = 0;
    }
}

Ball.prototype.forceRight = function(x) {
    if(this.x < x + this.radius) {
        this.x = x + this.radius;
        this.x_speed = 0;
    }
}

function EndGoal(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 100;
    this.onTouch = function() {
        console.log("AAAAA");
        alert("Yay! You completed the level! Onto level " + (level + 1));
        level++;
        ball.reset();
    };
}

EndGoal.prototype.render = function() {
    context.fillStyle = "#ffc744";
    context.fillRect(this.x, this.y, this.width, this.height);
}

function Spike(x, y){
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 60;
    this.onTouch = function() {
        alert("You died!\nGet good");
        ball.reset();
    };
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

var collides = function(bal, thing) {
    return thing.x + thing.width > bal.x - bal.radius &&
        thing.y + thing.height > bal.y - bal.radius &&
        thing.x < bal.x + bal.radius &&
        thing.y < bal.y + bal.radius;
}

var collisionFor = function(level, screen) {
    switch(level) {
        case 0:
            switch(screen) {
                case 0:
                    ball.forceRight(30);
                    ball.forceAbove(720);
                    ball.forceBelow(430);
                    ball.forceLeft(width - 29);
                    break;
            }
            break;
    }
}

var checkAllCollisions = function() {
    let num = 10 * level + screen;
    let collides_ = collidables[num];
    
    for(let i = 0;i<collides_.length;i++) {
        let thing = collides_[i];
        if(collides(ball, thing)) {
            thing.onTouch();
        }
    }
}

Ball.prototype.update = function() {
    checkAllCollisions();
    
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
    
    collisionFor(level, screen);
};

var update = function() {
    ball.update();
};

var renderLevel = function(level, screen) {
    switch(level) {
        case 0:
            switch(screen) {
                case 0:
                    context.fillStyle = "#00bfff";
                    context.fillRect(0, 0, width, height);
                    context.fillStyle = "#800000";
                    context.fillRect(0, 750, width, height - 120);
                    context.fillRect(0, 0, width, height - 400);
                    context.fillRect(0, 0, 30, height);
                    context.fillRect(width - 30, 0, 30, height);
                    break;
            }
            break;
    }
    
    context.fillStyle = "#FFFFFF";
    context.font = "30px Consolas";
    context.fillText("Level " + level, 15, height - 15);
}

var render = function() {
    renderLevel(level, screen);
    
    ball.render();
    
    let num = 10 * level + screen;
    let collides_ = collidables[num];
    
    for (let i = 0;i<collides_.length;i++) {
        let thing = collides_[i];
        thing.render();
    }
};
