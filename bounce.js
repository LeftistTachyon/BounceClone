var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 500/3) };

var canvas = document.createElement('canvas');
var width = 1500;
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
  update();
  render();
  animate(step);
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 50;
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#FF0000";
    context.fill();
};

var ball = new Ball(200, 550);

var render = function() {
    context.fillStyle = "#00bfff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#800000";
    context.fillRect(0,600,width,height-600);
    ball.render();
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

Ball.prototype.update = function() {
    for(var key in keysDown) {
        var value = Number(key);
        var pressed = false;
        switch(value) {
            case 37: // [<-]
                this.x_speed = -4;
                pressed = true;
                break;
            case 39: // [->]
                if(pressed) {
                    this.x_speed = 0;
                } else {
                    this.x_speed = 4;
                }
                break;
            case 32: // Jump
            case 38: // up
                this.y_speed = 16;
                break;
        }
    }
    
    this.move();
    
    this.x_speed /= 2;
    this.y_speed -= 2;
    
    // this.forceAbove(1200);
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
    if(this.y > y) this.y = y;
}

var update = function() {
    ball.update();
};
  context.fillStyle = "#00bfff";
  context.fillRect(0, 0, width, height);
  ball.render();
};
