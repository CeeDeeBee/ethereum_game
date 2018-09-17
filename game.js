//Code for the game portion of the page
//On DOM load
$(document).ready(function() {
	//set default values
	var fps = 120;
	var percent = 100;
	var direction = 5;
	var frame = 0;
	var score = 0;
	var jump = false;
	var started = false;
	var shouldLoop = true;
	var obstacles = {box: [535], pit: []};
	var highScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var holdingJump = false;
	var holdingJumpTime = 0;
	var xy;
	var obstacleSpeed = 6.25;
	/*
	var $div = $("<div>", {id: "testDiv", "class": "div"}).html("Test");
	$("body").append($div);
	*/
	//User input event listener
	$(document).on("keydown", function(e) {
		//console.log(e.which);
		if (e.which == 38 || e.which == 32) {
			jump = true;
			holdingJump = true;
			if (!started) {
				animate();
				started = true;
			}
		} else if (e.which == 13) {
			if ($("#overlay").css("z-index") == 5) {
				restart();
			} 
		}
	});
	$(document).on("keyup", function(e) {
		if (e.key == 'ArrowUp') {
			holdingJump = false;
		}
	});
	$("#newFrame").click(function() {
		shouldLoop = false;
		animate();
	});
	$("#restart").click(function() {
		restart();
	});
	//Code for canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	//animate();
	drawStage();
	drawRect({x: 100, y: 160});

	function animate() {
		//console.log(obstacles);
		if (jump) {
			if (frame == 21) {
				percent = 100;
				frame = 0;
				jump = false;
			}
			percent += direction;
			if (percent < 0) {
				percent = 0;
				direction = 10;
			} else if (percent > 100) {
				percent = 100;
				direction = -10;
			}
			frame += 1;
			if (holdingJump) {
				holdingJumpTime += 1;
			}
		}

		draw(percent);

		if (shouldLoop) {
			setTimeout(function() {
				requestAnimationFrame(animate);
			}, 1000 / fps);
		}
		//console.log(frame);
	}

	function draw(sliderValue) {
		drawStage();

		var percent = sliderValue / 100;
		//console.log(percent);
		if (percent > 0) {
			xy = getLineXYatPercent({
				x: 100,
				y: 100
			}, {
				x: 100,
				y: 160
			}, percent);
		}
		
		//console.log(xy);
		drawRect(xy);

		//console.log(obstacles);
		//console.log(pits);
		//Colision detection
		if ((xy.y - 8) >= 140) {
			$.each(obstacles.box, function(index, value) {
				if (value > 72.5 && value < 110) {
					gameOver();
				}
			});
		}
		if (xy.y == 160) {
			$.each(obstacles.pit, function(index, value) {
				if (value > 66.25 && value < 97) {
					gameOver();
				}
			});
		}

		score += .1;
		obstacleSpeed += 0.001;
		//console.log(obstacleSpeed);
	}

	function getLineXYatPercent(startPt, endPt, percent) {
		var dx = endPt.x - startPt.x;
		var dy = endPt.y - startPt.y;
		var X = startPt.x + dx * percent;
		var Y = startPt.y + dy * percent;
		return ({
			x: X,
			y: Y
		});
	}

	function drawRect(point) {
		//console.log(point);
		ctx.fillStyle = "white";
		ctx.strokeStyle = "green";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.rect(point.x - 13, point.y - 8, 25, 15);
		ctx.fill();
		ctx.stroke();
	}

	function drawStage() {
		//clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.lineWidth = 3;
		//draw background
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//draw score
		ctx.font = "15px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("Score: " + Math.floor(score), 500, 20);
		//draw platform
		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.moveTo(50, 170);
		ctx.lineTo(550, 170);
		ctx.stroke();
		//draw obstacles
		let boxesToRemove = [];
		$.each(obstacles.box, function(index, value) {
			if (value > 50) {
				drawObstacle(value);
				obstacles.box[index] = value - obstacleSpeed; 
			} else {
				boxesToRemove.push(index);
			}
		});
		$.each(boxesToRemove, function(index, value) {
			obstacles.box.splice(value, 1);
		});
		let pitsToRemove = [];
		$.each(obstacles.pit, function(index, value) {
			if (value > 10) {
				drawPit(value);
				obstacles.pit[index] = value - obstacleSpeed;
			} else {
				pitsToRemove.push(index);
			}
		});
		$.each(pitsToRemove, function(index, value) {
			obstacles.pit.splice(value, 1);
		});
		//generate new obstacles
		if (Math.random() < 0.01) {
			if ((obstacles.pit[obstacles.pit.length - 1] < 510 && obstacles.box[obstacles.box.length - 1] < 535) || obstacles.pit[obstacles.pit.length - 1] == undefined) {
				obstacles.box.push(550);
			}
		} else if (Math.random() < 0.01) {
			if ((obstacles.box[obstacles.box.length - 1] < 535 && obstacles.pit[obstacles.pit.length - 1] < 510) || obstacles.box[obstacles.box.length - 1] == undefined) {
				obstacles.pit.push(550);
			}
		}
	}

	function drawObstacle(point) {
		//console.log(point);
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.rect(point, 155, 15, 15);
		ctx.fill();
		ctx.stroke();
	}

	function drawPit(point) {
		//console.log(point);
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = "white";
		ctx.moveTo(point, 170);
		ctx.lineTo((point + 40), 170);
		ctx.stroke();
	}

	function updateScores() {
		$("li").each(function(index) {
			$(this).html(highScores[index]);
		});
	}

	function gameOver() {
		shouldLoop = false;
		$.each(highScores, function(index, value) {
			//console.log(index);
			if (score > highScores[index]) {
				highScores.push(score);
				return false;
			}
		});
		highScores.sort(function(a, b) { return b - a });
		highScores.pop();
		updateScores();
		$("#overlay").css("z-index", 5);
	}

	function restart() {
		$("#overlay").css("z-index", -1);
		obstacles.box = [];
		obstacles.box.push(535);
		obstacles.pit = [];
		started = false;
		shouldLoop = true;
		percent = 100;
		frame = 0;
		score = 0;
		jump = false;
		obstacleSpeed = 6.25;
		drawStage();
		drawRect({x: 100, y: 160});
	}
});