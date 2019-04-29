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

var backgrounds = {0: "#00bfff", 1: "#00bfff", 2: "#000000", 3: "#000000", 
                   4: "#88001b", 5: "#88001b"};
var foregrounds = {0: "#800000", 1: "#800000", 2: "#585858", 3: "#585858", 
                   4: "#6113af", 5: "#6113af"};
var starting = {0: {x: 200, y: 670}, 1: {x: 200, y: 670}, 
                2: {x: 81, y: height - 50}, 3: {x: 81, y: 694}, 4: {x: 83, y: 700}, 
                5: {x: 89, y: 698}}; 

var level = 5;
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
                   new Spike(35, 50, 1), 
				   new Spike(150, 155, 3), new Ring(486, 86),
                   new Spike(269, 113, 3), new Platform(312, 110, 55, 23), 
                   new Spike(367, 113, 1),
                   new Spike(569, 113, 3), new Platform(612, 110, 55, 23), 
                   new Spike(667, 113, 1),
                   new Spike(800, 137, 1),
                   new Platform(920, 177, 37, 22), 
                   new Platform(width-30, 624, 30, 100), 
                   new Platform(941, 16, 59, 608), new EndGoal(width - 30, 624), 
                   new Spike(516, 681, 0), new Spike(554, 681, 0), 
                   new Spike(588, 681, 0),
                   new Spike(625, 681, 0), new Spike(658, 681, 0), 
                   new Spike(690, 681, 0), new Spike(721, 681, 0), 
                   new Spike(751, 681, 0), new Spike(781, 681, 0),
                   new Spike(813, 681, 0), new Spike(846, 681, 0), 
                   new Platform(768, 649, 71, 17), new Ring(804, 602), 
                   new Spike(898, 360, 3)];
collidables[30] = [new Platform(0, height - 26, width, 5), 
                   new Platform(941, 17, 59, 607), new Platform(35, 626, 75, 19), 
                   new Spike(187, 681, 0), new Spike(35, 471, 1), 
                   new Platform(200, 537, 48, 20), new Ring(224, 491), 
                   new Platform(248, 107, 77, 617), new Platform(536, 17, 74, 596), 
                   new Platform(738, 141, 85, 583), new EndGoal(width - 30, 624), 
                   new Platform(35, 396, 17, 19), new Platform(181, 282, 67, 19), 
                   new Spike(184, 301, 2), new Platform(35, 165, 14, 19), 
                   new Platform(168, 125, 80, 20), new Platform(325, 156, 128, 20), 
                   new Spike(355, 113, 0), new Spike(355, 176, 2), 
                   new Spike(459, 18, 2), new Ring(511, 123), 
                   new Platform(444, 256, 92, 20), new Spike(485, 276, 2), 
                   new Platform(325, 392, 79, 20), new Ring(374, 349), 
                   new Spike(493, 470, 3), new Spike(325, 540, 1), 
                   new Ring(350, 685), new Spike(436, 681, 0), 
                   new Spike(695, 694, 3), new Platform(714, 645, 24, 20), 
                   new Platform(610, 593, 16, 20), new Spike(722, 492, 2), 
                   new Platform(719, 473, 19, 19), new Platform(610, 341, 19, 18), 
                   new Spike(613, 359, 2), new Platform(719, 197, 19, 19), 
                   new Spike(723, 216, 2), new Ring(728, 155), 
                   new Spike(914, 155, 0), 
                   new Spike(928, 155, 0), new Spike(823, 319, 0), 
                   new Spike(837, 319, 0), new Ring(900, 355), 
                   new Spike(914, 472, 0), new Spike(928, 472, 0), 
                   new Ring(865, 554), new Spike(823, 649, 0)];
collidables[40] = [new Spike(223, 725, 3), new Spike(454, 725, 3), 
                   new Platform(0, height - 23, width, 23), 
                   new Platform(944, 15, 56, 612), new EndGoal(970, 627), 
                   new Platform(0, 0, 223, 591), new Platform(222, 561, 458, 30), 
                   new Platform(223, 0, 382, 102), new Platform(223, 723, 1, 5), 
                   new Platform(454, 723, 1, 5), new Spike(349, 591, 2), 
                   new Ring(424, 684), new Spike(574, 591, 2), 
                   new Spike(747, 684, 0), new Spike(614, 518, 0), 
                   new Platform(789, 81, 66, 646), new Spike(487, 518, 0), 
                   new Ring(366, 519), new Spike(293, 518, 0), 
                   new Spike(287, 102, 2), new Spike(479, 102, 2), 
                   new Platform(349, 415, 18, 44), new Platform(283, 330, 18, 44),
                   new Platform(367, 235, 18, 44), new Platform(471, 290, 18, 44),
                   new Platform(563, 343, 18, 44), new Ring(573, 299), 
                   new Platform(665, 285, 18, 44), new Platform(729, 168, 18, 44),
                   new Ring(930, 109), new Ring(867, 276), new Ring(932, 425), 
                   new Ring(865, 563), new Spike(857, 684, 0)];
collidables[50] = [new Spike(350, 723, 3), new Spike(855, 723, 3), 
                   new Platform(0, 725, width, 25), new Platform(942, 17, 58, 586), 
                   new Platform(968, 603, 32, 22), new Platform(159, 99, 37, 626), 
                   new Platform(196, 388, 631, 31), new Platform(323, 570, 620, 33), 
                   new Platform(151, 582, 8, 9), new Spike(34, 524, 1), 
                   new Platform(34, 455, 8, 9), new Spike(115, 340, 3), 
                   new Platform(151, 303, 8, 7), new Spike(34, 200, 1), 
				   new Platform(34, 165, 8, 8), new Ring(178, 57), 
				   new Spike(201, 344, 0), new Spike(234, 344, 0), 
				   new EndGoal(970, 625), new Spike(265, 344, 0), 
				   new Spike(293, 344, 0), new Spike(323, 344, 0), 
				   new Spike(354, 344, 0), new Spike(387, 344, 0), 
				   new Spike(413, 344, 0), new Spike(446, 344, 0), 
				   new Spike(477, 344, 0), new Spike(505, 344, 0), 
				   new Spike(535, 344, 0), new Spike(566, 344, 0), 
				   new Spike(599, 344, 0), new Spike(626, 344, 0), 
				   new Spike(659, 344, 0), new Spike(690, 344, 0), 
				   new Spike(718, 344, 0), new Spike(748, 344, 0), 
				   new Spike(779, 344, 0), new Spike(812, 344, 0), 
				   new Platform(308, 294, 17, 24), new Platform(369, 219, 17, 24), 
				   new Ring(316, 256), new Platform(457, 106, 17, 24), 
				   new Platform(558, 172, 17, 24), new Platform(682, 301, 17, 24), 
				   new Ring(691, 260), new Platform(808, 226, 17, 24), 
				   new Ring(880, 361), new Spike(908, 528, 0), 
				   new Spike(875, 528, 0), new Spike(844, 528, 0), 
				   new Platform(828, 488, 17, 24), new Spike(814, 528, 0),
				   new Spike(786, 528, 0), new Spike(755, 528, 0), 
				   new Spike(722, 528, 0), new Platform(718, 505, 53, 14),
				   new Spike(695, 528, 0), new Spike(662, 528, 0), 
				   new Spike(631, 528, 0), new Spike(601, 528, 0), 
				   new Platform(589, 484, 53, 14), new Spike(573, 528, 0),
				   new Spike(542, 528, 0), new Spike(509, 528, 0),
				   new Spike(483, 528, 0), new Platform(464, 505, 53, 14),
				   new Spike(450, 528, 0), new Spike(419, 528, 0),
				   new Spike(389, 528, 0), new Spike(361, 528, 0),
				   new Spike(330, 528, 0), new Platform(321, 493, 53, 14),
				   
				   new Platform(365, 718, 1, 1),
				   new Ring(516, 644), 
				   new Death(529, 603, 223, 49), new Ring(841, 649),
				   new Platform(870, 718, 1, 1)];

var deaths = 0;

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
            case 3:
            case 4:
            case 5:
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
    this.levelRequirements = {0: 0, 1: 1, 2: 4, 3: 7, 4: 7, 5: 6};
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

function Death(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
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
        deaths++;
    };
}

Death.prototype.render = function() {};

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
        deaths++;
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
        if (oX >  oY) {
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
    ball.forceLeft(width - 30);
    switch(level) {
        case 0:
        case 1:
            ball.forceRight(30);
            ball.forceBelow(380);
            break;
        case 2:
            ball.forceBelow(47);
            ball.forceRight(35);
            break;
        case 3:
            ball.forceBelow(48);
            ball.forceRight(35);
            break;
        case 4:
            ball.forceRight(32);
            ball.forceBelow(45);
            break;
        case 5:
            ball.forceRight(34);
            ball.forceBelow(47);
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
    
    checkAllCollisions();
    collisionFor(level, screen);
};

var update = function() {
    ball.update();
};

let torch1 = new Spike(623, 681, 0);

var renderLevel = function(level, screen) {
    context.fillStyle = backgrounds[level];
    context.fillRect(0, 0, width, height);
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
            break;
        case 3:
            context.fillRect(0, 0, 35, height);
            context.fillRect(0, height - 26, width, 26);
            context.fillRect(0, 0, width, 18);
            break;
        case 4:
            context.fillRect(0, 0, width, 15);
            context.fillRect(0, 0, 33, height);
            
            context.beginPath();
            context.moveTo(193, 709);
            context.quadraticCurveTo(209, 671, 243, 698);
            context.quadraticCurveTo(280, 671, 295, 709);
            context.closePath();
            context.stroke();
            
            break;
        case 5:
            context.fillRect(0, 0, width, 17);
            context.fillRect(0, 0, 34, height);
			
			torch1.render();
            break;
    }
}

var renderText = function() {
    context.fillStyle = "#FFFFFF";
    context.font = "20px Consolas";
    context.fillText("Level " + level, 7, height - 7);
    context.fillText("Deaths: " + deaths, width / 2, height - 7);
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
    
    renderText();
};
