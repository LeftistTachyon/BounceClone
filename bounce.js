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
	
/*var animate = function(callback) {
	window.setTimeout(callback, 100);
};*/

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
};

var skyline = getImage("skyline.png");
var title = getImage("Title.png");
var instructOne = getImage("Instruction 1.png");

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
                   4: "#88001b", 5: "#88001b", 6: "#7F7F7F", 7: "#99D9EA"};
var foregrounds = {0: "#800000", 1: "#800000", 2: "#585858", 3: "#585858",
                   4: "#6113af", 5: "#6113af", 6: "#000000", 7: "#22B14C"};
var starting = {0: {x: 600, y: 670}, 1: {x: 200, y: 670},
                2: {x: 81, y: height - 50}, 3: {x: 81, y: 694}, 4: {x: 83, y: 700},
                5: {x: 89, y: 698}, 6: {x: 72, y: 700}, 7: {x: 63, y: -100}};

var level = 6; // 0

var screen = 1; // 0

var invisible = false;
var impossible = false;

var collidables = {};

collidables[0] =  [new EndGoal(width - 30, height - 150),
                   new Platform(0, 700, width, height - 120),
                   new Platform(width-30, 300, 100, 300),
                   new Building(0, 423, 49, 277),
                   new Building(58, 311, 52, 389),
                   new Building(118, 495, 52, 205),
                   new Building(177, 384, 52, 316),
                   new Building(236, 594, 105, 106),
                   new Building(347, 478, 53, 222),
                   new Building(409, 206, 52, 494)];
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
                   new Platform(968, 603, 32, 22), new Platform(159, 102, 37, 626),
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
				   new Platform(365, 718, 1, 1), new Ring(516, 644),
				   new Death(529, 603, 223, 49), new Ring(841, 649),
				   new Platform(870, 718, 1, 1)];
collidables[60] = [new Spike(963, 96, 0), new Spike(889, 221, 0),
				   new Spike(963, 358, 0), new Spike(889, 479, 0), 
				   new Spike(963, 586, 0), 
				   new Platform(0, 0, width, 21), new Platform(0, 21, 21, height), 
				   new Platform(965, 0, 35, 630), 
				   new Platform(21, 520, 406, 40), new Platform(90, 221, 341, 50), 
				   new Platform(230, 95, 31, 126), new Platform(546, 226, 50, 504),
				   new Platform(742, 21, 20, 447), new Platform(880, 122, 21, 608),
				   new Platform(115, 560, 8, 8),
				   new Death(21, 560, 20, 170), new Death(41, 560, 74, 7), 
				   new Platform(115, 722, 8, 8), new Platform(193, 560, 8, 8), 
				   new Platform(344, 560, 8, 8),
				   new Platform(419, 560, 8, 8), new Death(122, 560, 296, 7), 
				   new Platform(267, 722, 8, 8), 
				   new Platform(419, 722, 8, 8), 
				   new Death(123, 724, 144, 7), new Death(275, 724, 114, 7),
				   new Spike(188, 686, 0),
				   new Spike(340, 686, 0), new Death(427, 724, 54, 7),
				   new Spike(481, 716, 3), new Platform(525, 709, 21, 21),
				   new Spike(532, 665, 0), new Spike(427, 551, 1),
				   new Platform(538, 591, 8, 10), 
				   new Platform(492, 391, 10, 12), new Platform(421, 271, 10, 20),
				   new Kaizo(421, 291, 125, 10, 0), 
                   new Kaizo(116, 285, 20, 2, 2), new Kaizo(350, 285, 9, 2, 2),
                   new Spike(502, 390, 3),
                   new Spike(97, 271, 3), new Spike(153, 271, 3),
                   new Spike(209, 271, 3), new Spike(265, 271, 3),
                   new Spike(321, 271, 3), new Spike(377, 271, 3),
                   new Kaizo(431, 221, 115, 5, 2),
                   new Spike(249, 476, 0), new Spike(353, 476, 0),
                   new Platform(263, 433, 10, 10), new Platform(343, 433, 10, 10),
                   new Death(344, 427, 8, 6),
                   new Death(254, 434, 9, 42), new Death(353, 434, 9, 42),
                   new Kaizo(263, 452, 90, 5, 2), new Spike(125, 476, 0),
                   new Death(21, 457, 4, 63), new Kaizo(21, 452, 104, 5, 2),
                   new Spring(21, 430, 12, 12, -20), new Kaizo(21, 221, 69, 50, 0),
				   new Platform(46, 136, 12, 12), new Platform(135, 146, 12, 12),
				   new Platform(217, 127, 12, 12), new Platform(33, 30, 12, 12),
				   new Kaizo(21, 95, 50, 15, 2), new Kaizo(147, 95, 83, 15, 2),
				   new Death(66, 110, 5, 20), new Death(147, 110, 5, 20),
				   new Death(162, 91, 15, 5), new Kaizo(168, 86, 3, 3, 0),
				   new Kaizo(322, 21, 11, 73, 3), new Spike(261, 177, 0),
				   new Spike(289, 177, 0), new Spike(317, 177, 0),
				   new Spike(345, 177, 0), new Platform(283, 159, 7, 12),
				   new Kaizo(357, 161, 66, 3, 2), new Kaizo(423, 162, 134, 3, 2),
				   new Death(423, 159, 134, 3), new Kaizo(557, 161, 61, 3, 2),
				   new Kaizo(313, 161, 7, 12, 0), new Kaizo(341, 161, 7, 12, 0),
				   new Platform(341, 88, 7, 12), new Platform(406, 88, 7, 12),
				   new Platform(445, 119, 7, 12), new Platform(533, 118, 7, 12),
				   new Platform(546, 221, 77, 5), new Platform(618, 101, 5, 120),
				   new Platform(623, 101, 15, 5), new Platform(734, 181, 8, 10),
				   new Spike(596, 226, 1), new Spike(698, 341, 3),
				   new Platform(596, 361, 8, 10), new Death(596, 358, 7, 3),
				   new Platform(734, 458, 8, 10), new Death(735, 455, 7, 3),
				   new Spike(726, 468, 1), new Spike(596, 468, 0),
				   new Platform(596, 670, 8, 10), new Platform(736, 650, 14, 15),
				   new Spike(603, 686, 0), new Spike(627, 686, 0), 
				   new Spike(652, 686, 0), new Spike(677, 686, 0),
				   new Spike(701, 686, 0), new Spike(727, 686, 0),
				   new Spike(753, 686, 0), new Spike(781, 686, 0),
				   new Spike(807, 686, 0), new Spike(834, 686, 0),
				   new Spike(859, 686, 0), new Platform(872, 543, 8, 10),
				   new Platform(0, height - 20, width, 20), new Spike(866, 382, 0),
				   new Platform(762, 379, 8, 10), new Spike(762, 230, 0),
				   new Platform(872, 273, 8, 10), new Spike(866, 124, 0),
				   new Platform(762, 120, 9, 10), new Death(914, 21, 51, 5),
                   new Portal(width - 30, 630, 1, {x: 66, y: 689}, true)];
collidables[61] = [new Platform(0, 0, 450, 31), new Platform(0, 31, 31, 588),
                   new Platform(0, 719, width, 31), new Platform(550, 0, 450, 31),
                   new Platform(969, 31, 31, 2), new Platform(969, 133, 31, 586),
                   new Platform(65, 143, 100, 15), new Platform(100, 323, 100, 15),
                   new Platform(135, 503, 100, 15), new Platform(170, 683, 100, 15),
                   new Platform(301, 208, 15, 511), new Platform(315, 208, 100, 15),
                   new Platform(450, 125, 100, 15), new Platform(580, 273, 100, 15),
                   new Platform(438, 381, 100, 15), new Platform(355, 552, 100, 15),
                   new Platform(612, 485, 96, 15), new Platform(512, 650, 100, 15),
                   new Platform(708, 31, 15, 511), new Spring(771, 709, 150, 10, -27),
                   new Platform(723, 137, 97, 15), 
                   new Platform(723, 167, 96, 15),
                   new Platform(723, 197, 95, 15), 
                   new Platform(723, 227, 94, 15), 
                   new Platform(723, 257, 93, 15), 
                   new Platform(723, 287, 92, 15), 
                   new Platform(723, 317, 91, 15), 
                   new Platform(723, 347, 90, 15), 
                   new Platform(723, 377, 89, 15), 
                   new Platform(723, 407, 88, 15), 
                   new Platform(723, 437, 87, 15), 
                   new Platform(723, 467, 86, 15), 
                   new Platform(723, 497, 85, 15), 
                   new Platform(723, 527, 84, 15), 
                   
                   new Platform(891, 137, 88, 15), 
                   new Platform(890, 167, 89, 15), 
                   new Platform(889, 197, 90, 15), 
                   new Platform(888, 227, 91, 15), 
                   new Platform(887, 257, 92, 15), 
                   new Platform(886, 287, 93, 15), 
                   new Platform(885, 317, 94, 15), 
                   new Platform(884, 347, 95, 15), 
                   new Platform(883, 377, 96, 15), 
                   new Platform(882, 407, 97, 15), 
                   new Platform(881, 437, 98, 15), 
                   new Platform(880, 467, 99, 15), 
                   new Platform(879, 497, 100, 15), 
                   new Platform(878, 527, 101, 15), 
                   new Portal(0, 619, 0, {x: 935, y: 700}, true),
                   new Portal(450, 0, 2, {x: 0, y: 0}, false),
                   new Portal(width - 30, 33, 8, {x: 0, y: 0}, true)];
collidables[70] = [new Platform(0, 690, width, 60), new EndGoal(width - 30, 590),
                   new Platform(968, 540, 32, 50)];

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
        if(this.y >= 1030) return;
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
    if(impossible && this.isFalling || !impossible) {
        context.fillStyle = "#FF0000";
        context.fillRect(this.x - this.radius, this.y - this.radius,
                         2 * this.radius, 2 * this.radius);
    }
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
    if(!invisible && !impossible) {
        context.fillStyle = foregrounds[level];
        context.fillRect(this.x, this.y, this.width, this.height);
    }
};

function Building(x, y, width, height) {
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

Building.prototype.render = function() {};

function Kaizo(x, y, width, height, bad) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.plat = new Platform(x, y, width, height);
	this.bad = ["t", "r", "b", "l"][bad];
	this.touched = false;
	this.onTouch = function() {
		if(!this.touched) {
			let vX = ball.x - (this.x + (this.width / 2)),
				vY = ball.y - (this.y + (this.height / 2)),

				hWidths = ball.radius + (this.width / 2),
				hHeights = ball.radius + (this.height / 2),
				colDir = null;

			let oX = hWidths - Math.abs(vX),
				oY = hHeights - Math.abs(vY);
			if (oX > oY) {
				if (vY <= -this.height / 2) {
					colDir = "t";
				} else if(vY >= this.height / 2) {
					colDir = "b";
				}
			} else {
				if (vX <= -this.width / 2) {
					colDir = "l";
				} else if(vY >= this.height / 2) {
					colDir = "r";
				}
			}

            if(colDir == this.bad) {
                switch(colDir) {
                    case "t":
                        if(ball.y_speed > 0) 
                            this.touched = true;
                        break;
                    case "b":
                        if(ball.y_speed < 0)
                            this.touched = true;
                        break;
                    case "l":
                        if(ball.x_speed > 0)
                            this.touched = true;
                        break;
                    case "r":
                        if(ball.x_speed < 0)
                            this.touched = true;
                        break;
                }
            } else {
                return;
            }
		}
		
		this.plat.onTouch();
	};
}

Kaizo.prototype.render = function() {
	if(this.touched) {
		this.plat.render();
	}
};

function Spring(x, y, width, height, y_speed) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.y_speed = y_speed;
	this.onTouch = function() {
		let temp = collideSide(ball, this);
        switch(temp) {
            case "t":
                ball.forceAbove(this.y - ball.radius);
				ball.y_speed = this.y_speed;
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
	}
}

Spring.prototype.render = function() {
	if(!invisible && !impossible) {
		context.fillStyle = "#e21dd2";
        context.fillRect(this.x, this.y, this.width, this.height);
	}
}

function Portal(x, y, toScreen, newLoc, vertical) {
    this.x = x;
	this.y = y;
	if(vertical) {
		this.width = 30;
		this.height = 100;
	} else {
		this.width = 100;
		this.height = 30;
	}
    
	this.onTouch = function() {
        screen = toScreen;
        let start = newLoc;
        ball.x = start.x;
        ball.y = start.y;
        ball.x_speed = 0;
        ball.y_speed = 0;
        ball.isFalling = false;
        keysDown = {};
	};
}

Portal.prototype.render = function() {
	context.fillStyle = "#00A2E8";
	context.fillRect(this.x, this.y, this.width, this.height);
}

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
    if(!this.collected && !impossible) {
        context.fillStyle = "#FFD700";
        context.beginPath();
        context.ellipse(this.x + this.radiusX, this.y + this.radiusY,
                        this.radiusX, this.radiusY,
                        2 * Math.PI, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }
}

function Box(x, y, width, height, color) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.onTouch = function() {};
}

Box.prototype.render = function() {
	if(!invisible && !impossible) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};

var ball = new Ball();

// initial position
ball.x = 440;
ball.y = 700;

Ball.prototype.jump = function() {
    if(!this.isFalling) {
        switch(level) {
            case 0:
            case 1:
            case 7:
                this.y_speed = -25;
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
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
    this.levelRequirements = {0: 0, 1: 1, 2: 4, 3: 7, 4: 7, 5: 6, 7: 0};
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 100;
    this.onTouch = function() {
		if(impossible && level == 7) return;
        if(this.meetsRequirements()) {
            let coll = collidables[level * 10 + screen];
            for(let i = 0;i<coll.length;i++) {
                let col = coll[i];
                if(col instanceof Ring) {
                    col.collected = false;
                } else if(col instanceof Kaizo) {
					col.touched = false;
				}
            }
            level++;
            if(level == 6) {
                level++;
            } else if(level == 8) {
				if(invisible) {
					impossible = true;
					alert("Advancing to grandmaster mode...");
				} else {
					invisible = true;
					alert("Advancing to master mode...");
				}
				level = 0;
			} else if(level != 1){
                alert("Yay! You completed the level! Onto level " + level);
				if(level >= 2){
					startMusic.pause();
				}
            }
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
        console.info("Collided /w Death @ " + this.x + ", " + this.y);
        alert("You died!\nGet good");
        screen = 0;
        ball.reset();
        let coll = collidables[level * 10 + screen];
        for(let i = 0;i<coll.length;i++) {
            let col = coll[i];
            if(col instanceof Ring) {
                col.collected = false;
            } else if(col instanceof Kaizo) {
				col.touched = false;
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
        console.info("Collided /w Spike @ " + this.x + ", " + this.y);
        alert("You died!\nGet good");
        screen = 0;
        ball.reset();
        let coll = collidables[level * 10 + screen];
        for(let i = 0;i<coll.length;i++) {
            let col = coll[i];
            if(col instanceof Ring) {
                col.collected = false;
            } else if(col instanceof Kaizo) {
				col.touched = false;
			}
        }
        ringsTouched = 0;
        deaths++;
    };
}

Spike.prototype.render = function() {
    if(impossible) return;
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
	let colDir = null;
	
    if (collides(bal, thing)) {
		let vX = bal.x - (thing.x + (thing.width / 2)),
			vY = bal.y - (thing.y + (thing.height / 2)),

			hWidths = bal.radius + (thing.width / 2),
			hHeights = bal.radius + (thing.height / 2);
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
    if(level != 0 && level != 7) {
        ball.forceLeft(width - 30);
    }
    switch(level) {
        case 0:
            ball.forceRight(0);
            ball.forceLeft(width);
            break;
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
		/*case 6:
			switch(screen) {
				
			}
			break;*/
        case 7:
            ball.forceRight(0);
            ball.forceLeft(width);
            break;
    }
}

var checkAllCollisions = function() {
    let num = level * 10 + screen;
    let collides_ = collidables[num];

    let shouldFall = true;
    
    for(let i = 0;i<collides_.length;i++) {
        let thing = collides_[i];
        if(collides(ball, thing)) {
			if(shouldFall && (thing instanceof Platform || thing instanceof Building 
                              || (thing instanceof Kaizo && thing.touched))) {
                shouldFall = collideSide(ball, thing) != "t";
            }
            thing.onTouch();
        }
    }

    ball.isFalling = shouldFall;
}

Ball.prototype.update = function() {
	for(let key in keysDown) {
        let value = Number(key);
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
	
	checkAllCollisions();
    collisionFor(level, screen);

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
};

var sc = ["lmao you\'re bad", "jump ceiling mouse", "spike keyboard bounce",
          "fall screen ring", "torch bottle parkour", "carpet platform wall",
		  "[object null]", undefined, undefined, undefined, "depression", "famine",
		  "Tetris", "tHe", "Grand", "Master", "2 PlUs", undefined, undefined,
		  undefined, "Que", "Como", "Cuanto", "Quien", "Donde", "Pan", "Muerte"];

var menu = function() {
    if(ball.y >= 1030) {
        alert("Hahaha welcome to gay baby jail");
        return;
    }

	if(level == 7) return;

    while(true) {
        let response = prompt("Menu\n" +
                              "To restart, type \"R\"\n" +
                              "To get a save code, type \"S\"\n" +
                              "To enter a save code to pick up where you left off, type \"E\"\n", "");
		if(response == null || response == undefined) {
			break;
		}
        response = response.toUpperCase();
        switch(response) {
            case "R":
                level = 0;
                screen = 0;
                ball.reset();
                return;
            case "S":
				let diff = 0;
				if(impossible) {
					diff = 2;
				} else if(invisible) {
					diff = 1;
				}
                alert("The save code for level " + level + " at difficulty level " + diff + " is:\n" + sc[level]);
                return;
            case "E":
                let r = prompt("Please enter your code:", "");
                if(r == undefined || r == null) {
                    continue;
                }
                for(let i = 0; i<sc.length; i++) {
                    if(r == sc[i]) {
                        level = i%10;
                        invisible = false; impossible = false;
                        i -= level;
                        if(i / 10 == 1) {
                            invisible = true;
                        } else if(i / 10 == 2) {
                            impossible = true;
                        }
                        screen = 0;
                        ball.reset();
                        ringsTouched = 0;
						let coll = collidables[level * 10 + screen];
						for(let i = 0;i<coll.length;i++) {
							let col = coll[i];
							if(col instanceof Ring) {
								col.collected = false;
							} else if(col instanceof Kaizo) {
								col.touched = false;
							}
						}
                        if(level >= 2){
                            startMusic.pause();
                            level2.play();
                        } else {
                            startMusic.play();
                        }
                        alert("Warping to level " + level + " at difficulty " +
                              i/10 + "...");
                        return;
                    }
                }
                alert("Invalid code.");
                return;
        }
    }
};

var update = function() {
    ball.update();

    switch(level){
        case 0:
            startMusic.play();
            break;
        case 2:
            level2.play();
            break;
    }

    for(let key in keysDown) {
        if(key == 77) {
            menu();
            delete keysDown[77];
        } else if(key == 123) {
            ball.y_speed += 9999;
        }
    }
};

let torch1 = new Spike(623, 681, 0);

var renderLevel = function(level, screen) {
    context.fillStyle = backgrounds[level];
    context.fillRect(0, 0, width, height);

    if(impossible) return;

    context.fillStyle = foregrounds[level];
    switch(level) {
        case 0:
            context.drawImage(skyline, 0, 200, 500, 500);
            context.drawImage(title, 500, 100 , 500, 100);
            context.drawImage(instructOne, 750, 550, 200, 100);
            break;
        case 1:
            if(!invisible) {
                context.fillRect(0, 750, width, height - 120);
                context.fillRect(0, 0, width, height - 400);
                context.fillRect(0, 0, 30, height);
                context.fillRect(width - 30, 0, 30, height);
            }
            break;
        case 2:
            if(!invisible) {
                context.fillRect(0, height - 26, width, height - 26);
                context.fillRect(0, 0, width, 17);
                context.fillRect(0, 0, 35, height);
            }
            break;
        case 3:
            if(!invisible) {
                context.fillRect(0, 0, 35, height);
                context.fillRect(0, height - 26, width, 26);
                context.fillRect(0, 0, width, 18);
            }
            break;
        case 4:
            if(!invisible) {
                context.fillRect(0, 0, width, 15);
                context.fillRect(0, 0, 33, height);
            }

            context.beginPath();
            context.moveTo(193, 709);
            context.quadraticCurveTo(209, 671, 243, 698);
            context.quadraticCurveTo(280, 671, 295, 709);
            context.stroke();
            context.closePath();

            break;
        case 5:
            if(!invisible) {
                context.fillRect(0, 0, width, 17);
                context.fillRect(0, 0, 34, height);
            }

			torch1.render();
            break;
    }
}

var renderText = function() {
    context.fillStyle = "#FFFFFF";
    context.font = "20px Consolas";

    context.fillText("Level " + level, 7, height - 7);
    context.fillText("Deaths: " + deaths, width / 2, height - 7);

    if(impossible) {
        context.fillText("Grandmaster mode", 7, 29);
    } else if(invisible) {
        context.fillText("Master mode", 7, 29);
    }

    if(level == 2) {
        context.font = "40px Consolas";
        context.fillText("Press M for the menu", 275, 300);
    } else if(level == 6) {
		if(screen == 0) {
			context.fillStyle = "#000000";
			context.font = "15px Consolas";
			context.fillText("Find all 3 rings", 117, 633);
			context.fillText("to advance!", 117, 653);
			
			context.fillStyle = "#FFFFFF";
			context.beginPath();
			context.moveTo(484, 197);
			context.lineTo(500, 252);
			context.lineTo(492, 252);
			context.lineTo(492, 308);
			context.lineTo(476, 308);
			context.lineTo(476, 252);
			context.lineTo(468, 252);
			context.closePath();
			context.fill();
			context.stroke();
		}
	} else if(level == 7) {
        context.font = "40px Consolas";
        context.fillText("Congrats on completing the game!", 126, 60);

        context.font = "30px Consolas";
        context.fillText("Shoutouts to everyone who helped out!", 126, 110);
        context.fillText("Thanks to our playtesters:", 126, 220);

        context.font = "20px Consolas";
        context.fillText("Level and Sound Design: Nayeef Zaman", 126, 140);
        context.fillText("Programming: Jed Wang", 126, 170);
        context.fillText("Brighton Liu and others", 126, 250);

		context.font = "30px Consolas";
        if(impossible) {
            context.fillText("Congrats on completing the hardest difficulty", 126, 330);
			context.fillText("in the game! You are a true grandmaster.", 126, 370);
        } else if(invisible) {
            context.fillText("Congrats on completing the master difficulty!", 126, 330);
			context.fillText("Enter the portal ahead to advance....", 126, 370);
        } else {
            context.fillText("Congrats on completing the game!", 126, 330);
			context.fillText("Enter the portal ahead to advance....", 126, 370);

			context.font = "20px Consolas";
			context.fillText("It only gets harder from here....", 126, 400);
        }
    }
}

var render = function() {
    renderLevel(level, screen);

    ball.render();

    let num = level * 10 + screen;
    let collides_ = collidables[num];

    for (let i = 0;i<collides_.length;i++) {
        let thing = collides_[i];
        thing.render();
    }

    renderText();
};

var startMusic = new Audio();
startMusic.src = "apples.mp3";

var level2 = new Audio();
level2.src = "orange.mp3";

