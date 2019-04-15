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
var height = 750;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
    let key = event.keyCode;
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

var backgrounds = {0: "#00bfff", 1: "#00bfff", 2:"#000000"};
var foregrounds = {0: "#800000", 1: "#800000", 2:"#585858"};
var starting = {0: {x: 200, y: 670}, 1: {x: 200, y: 670}, 
                2: {x: 81, y: height - 50}};

var level = 2;
var screen = 0;

var collidables = {};

collidables[0] = [new Spike(600, 656, 0), new EndGoal(width - 30, height - 150), 
                  new Platform(50, height - 200, 50, 50), 
                  new Platform(0, 700, width, height - 120)];
collidables[10] = [new Spike(390, 656, 0), new EndGoal(width - 30, height - 150), 
                   new Spike(690, 656, 0), new Ring(543, 650),
				   new Platform(0, 700, width, height - 120)];
collidables[20] = [new Platform(0, height - 26, width, 1), new Spike(135, 680, 0), 
                   new Spike(169, 680, 0), new Spike(204, 680, 0), 
                   new Spike(246, 680, 0), new Spike(287, 680, 0), 
                   new Spike(328, 680, 0), new Spike(367, 680, 0), 
                   new Spike(406, 680, 0), new Platform(428, height - 51, 77, 15), 
                   new Platform(193, 133, 607, 376), new Ring(185, 581), 
                   new Platform(139, 616, 96, 23), new Platform(35, 487, 53, 25), 
                   new Spike(150, 409, 3), new Platform(185, 349, 8, 18), 
                   new Spike(35, 312, 1), new Platform(35, 243, 12, 19), 
                   new Platform(150, 133, 55, 22), new Ring(47, 202), 
				   new EndGoal(width - 30, height - 150), new Spike(35, 50, 1), 
				   new Spike(150, 155, 3), new Ring(356, 86), 
                   new Spike(389, 113, 3), new Platform(432, 110, 55, 23), 
                   new Spike(800, 137, 1), new Platform(920, 177, 37, 22)];
/*
up: 0
right: 1
down: 2
left: 3
*/

function Ball() {
    let start = starting[level];
    this.x = start.x;
    this.y = start.y;
    this.x_speed = 0;
    this.y_speed = 0;
    this.radius = 30;
    this.isFalling = false;
    this.reset = function() {
        let start = starting[level];
        this.x = start.x;
        this.y = start.y;
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

function Platform(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.onTouch = function() {
        let temp = collideSide(ball, this);
        switch(temp) {
            case "t":
                ball.forceAbove(this.y - ball.radius);
                break;
            case "b":
                ball.forceBelow(this.y + this.height + ball.radius + 1);
                break;
            case "l":
                ball.forceLeft(this.x);
                break;
            case "r":
                ball.forceRight(this.x + this.width);
                break;
        }
    };
}

Platform.prototype.render = function() {
    context.fillStyle = foregrounds[level];
    context.fillRect(this.x, this.y, this.width, this.height);
};

var ringsTouched = 0;

<<<<<<< HEAD
var keysDown = {};
window.addEventListener("keydown", function(event) {
    let key = event.keyCode;
    if(!ball.isFalling || (key != 32 && key != 38))
        keysDown[key] = true;
});
=======
function Ring(x, y) {
    this.collected = false;
    this.radiusX = 6.5;
    this.radiusY = 33.5;
    this.x = x - this.radiusX;
    this.y = y - this.radiusY;
    this.width = this.radiusX * 2;
    this.height = this.radiusY * 2;
    this.onTouch = function() {
        if(!this.collected) {
            ringsTouched++;
            this.collected = true;
        }
    };
}

Ring.prototype.render = function() {
    if(!this.collected) {
        context.fillStyle = "#FFD700";
        context.beginPath();
        context.ellipse(this.x + this.radiusX, this.y + this.radiusY, 
                        this.radiusX, this.radiusY,  
                        2 * Math.PI, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }
}

var ball = new Ball();

Ball.prototype.jump = function() {
    if(!this.isFalling) {
        switch(level) {
            case 0:
            case 1:
                this.y_speed = -25;
                break;
            case 2:
                this.y_speed = -15;
                break;
        }
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
    this.levelRequirements = {0: 0, 1: 1, 2: 6};
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 100;
    this.onTouch = function() {
        if(this.meetsRequirements()) {
            level++;
            alert("Yay! You completed the level! Onto level " + level);
            ball.reset();
        }
    };
}

EndGoal.prototype.meetsRequirements = function() {
    return this.levelRequirements[level] == ringsTouched;
}

EndGoal.prototype.render = function() {
    if(this.meetsRequirements()) {
        context.fillStyle = "#17d80d";
    } else {
        context.fillStyle = "#d80d0d";
    }
    
    context.fillRect(this.x, this.y, this.width, this.height);
}

/*
up: 0
right: 1
down: 2
left: 3
*/
function Spike(x, y, orientation){
    this.orientation = orientation;
    this.x = x;
    this.y = y;
    if(orientation % 2 == 0) {
        this.width = 14;
        this.height = 44;
        this.fRadius = this.width / 2;
    } else {
        this.width = 44;
        this.height = 14;
        this.fRadius = this.height / 2;
    }
    this.onTouch = function() {
        alert("You died!\nGet good");
        ball.reset();
        let coll = collidables[10 * level + screen];
        for(let i = 0;i<coll.length;i++) {
            let col = coll[i];
            if(col instanceof Ring) {
                col.collected = false;
            }
        }
        ringsTouched = 0;
    };
}

Spike.prototype.render = function() {
    switch(this.orientation) {
        case 0:
            context.fillStyle = "#91612B";
            context.fillRect(this.x, this.y + this.fRadius, 
                             this.width, this.height - this.fRadius);
            context.beginPath();
            context.fillStyle = "#FFEE00";
            context.arc(this.x + this.fRadius, this.y + this.fRadius, 
                        this.fRadius, Math.PI * 2, false);
            context.closePath();
            context.fill();
            break;
        case 1:
            context.fillStyle = "#91612B";
            context.fillRect(this.x, this.y, this.width - this.fRadius, this.height);
            context.beginPath();
            context.fillStyle = "#FFEE00";
            context.arc(this.x + this.width - this.fRadius, this.y + this.fRadius, 
                        this.fRadius, Math.PI * 2, false);
            context.closePath();
            context.fill();
            break;
        case 2:
            context.fillStyle = "#91612B";
            context.fillRect(this.x, this.y, this.width, this.height - this.fRadius);
            context.beginPath();
            context.fillStyle = "#FFEE00";
            context.arc(this.x + this.fRadius, this.y + this.height - this.fRadius, 
                        this.fRadius, Math.PI * 2, false);
            context.closePath();
            context.fill();
            break;
        case 3:
            context.fillStyle = "#91612B";
            context.fillRect(this.x + this.fRadius, this.y, 
                             this.width - this.fRadius, this.height);
            context.beginPath();
            context.fillStyle = "#FFEE00";
            context.arc(this.x + this.fRadius, this.y + this.fRadius, 
                        this.fRadius, Math.PI * 2, false);
            context.closePath();
            context.fill();
            break;
    }
}

Spike.prototype.moveX = function(dX) {
    this.x += dX;
}

var collides = function(bal, thing) {
    return thing.x + thing.width >= bal.x - bal.radius &&
        thing.y + thing.height >= bal.y - bal.radius &&
        thing.x <= bal.x + bal.radius &&
        thing.y <= bal.y + bal.radius;
};

var collideSide = function(bal, thing) {
    let vX = bal.x - (thing.x + (thing.width / 2)),
        vY = bal.y - (thing.y + (thing.height / 2)),
        
        hWidths = bal.radius + (thing.width / 2),
        hHeights = bal.radius + (thing.height / 2),
        colDir = null;
 

    if (collides(bal, thing)) {         
      
        let oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY < 0) {
                colDir = "t";
            } else {
                colDir = "b";
            }
        } else {
            if (vX < 0) {
                colDir = "l";
            } else {
                colDir = "r";
            }
        }
    }
    
    return colDir;
};

var collisionFor = function(level, screen) {
    switch(level) {
        case 0:
        case 1:
            ball.forceRight(30);
            ball.forceBelow(380);
            ball.forceLeft(width - 30);
            break;
        case 2:
            ball.forceBelow(47);
            ball.forceRight(35);
            ball.forceLeft(width - 59);
            break;
    }
}

var checkAllCollisions = function() {
    let num = 10 * level + screen;
    let collides_ = collidables[num];
    
    let shouldFall = true;
    
    for(let i = 0;i<collides_.length;i++) {
        let thing = collides_[i];
        if(collides(ball, thing)) {
			if(thing instanceof Platform) {
                shouldFall = collideSide(ball, thing) != "t";
            }
            thing.onTouch();
        }
    }
    
    ball.isFalling = shouldFall;
}

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
    
<<<<<<< HEAD
    this.forceAbove(720);
    
    this.forceBelow(530);
=======
    checkAllCollisions();
    collisionFor(level, screen);
};

var update = function() {
    ball.update();
};

var renderLevel = function(level, screen) {
    context.fillStyle = backgrounds[level];
    context.fillRect(0, 0, width, height);
<<<<<<< HEAD
    context.fillStyle = "#800000";
    context.fillRect(0,750,width,height-120);
    context.fillRect(0,0,width,height-400);
=======
    context.fillStyle = foregrounds[level];
    switch(level) {
        case 0:
        case 1:
            context.fillRect(0, 750, width, height - 120);
            context.fillRect(0, 0, width, height - 400);
            context.fillRect(0, 0, 30, height);
            context.fillRect(width - 30, 0, 30, height);
            break;
        case 2:
            context.fillRect(0, height - 26, width, height - 26);
            context.fillRect(0, 0, width, 17);
            context.fillRect(0, 0, 35, height);
            context.fillRect(941, 0, 59, 604);
            break;
    }
    
    context.fillStyle = "#FFFFFF";
    context.font = "20px Consolas";
    context.fillText("Level " + level, 7, height - 7);
}

var render = function() {
    renderLevel(level, screen);
    
    ball.render();
    
<<<<<<< HEAD
    ring.render();
    
    spike.render();
=======
    let num = 10 * level + screen;
    let collides_ = collidables[num];
    
    for (let i = 0;i<collides_.length;i++) {
        let thing = collides_[i];
        thing.render();
    }
};
