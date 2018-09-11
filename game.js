//Code for the game portion of the page
//On DOM load
$(document).ready(function() {
	//set default values
	var fps = 60;
	var percent = 100;
	var direction = 5;
	var frame = 0;
	var score = 0;
	var jump = false;
	var started = false;
	var shouldLoop = true;
	var obstacles = [false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, "box"
					];
	var highScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var holdingJump = false;
	var holdingJumpTime = 0;
	var xy;
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
			if ($("#overlay").css("z-index") == 1) {
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
		/*
		ctx.beginPath();
		ctx.moveTo(100, 20);
		ctx.lineTo(100, 160);
		ctx.strokeStyle = "black";
		ctx.stroke();
		*/

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
		if ((xy.y - 8) >= 140) {
			if (obstacles[3] == "box" || obstacles[4] == "box" || obstacles[5] == "box" || obstacles[6] == "box" || obstacles[7] == "box" || obstacles[8] == "box" || obstacles[9] == "box") {
				console.log("collision");
				shouldLoop = false;
				gameOver();	
			} else if (xy.y >= 160) {
				if (obstacles[3] == "pit" || obstacles[4] == "pit" || obstacles[5] == "pit") {
					console.log("collision");
					shouldLoop = false;
					gameOver();
					console.log(xy);
					console.log(obstacles);
				}
			}
		}

		score += .1;

		/*
		var lastCalledTime;
		var fps;
		if (!lastCalledTime) {
			lastCalledTime = performance.now();
			fps = 0;
			return;
		}
		delta = (performance.now() - lastCalledTime)/1000;
		lastCalledTime = performance.now();
		fps = 1 / delta;
		console.log(fps);
		*/
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
		/*
		$.each(pits, function(index, value) {
			let point = 0;
			if (value) {
				point = (index * 6.25) + 50;
				ctx.beginPath();
				ctx.lineWidth = 4;
				ctx.strokeStyle = "white";
				ctx.moveTo(point, 170);
				ctx.lineTo((point + 6.25), 170);
				ctx.stroke();
				pits[index] = false;
				if (index != 0) {
					pits[index - 1] = true;
				}
			}
		});
		*/
		//draw obstacles
		$.each(obstacles, function(index, value) {
			if (value == "box") {
				let point = (index * 6.25) + 50;
				drawObstacle(point);
				obstacles[index] = false;
				if (index != 0) {
					obstacles[index - 1] = "box";
				}
			} else if (value == "pit") {
				let point = (index * 6.25) + 50;
				ctx.beginPath();
				ctx.lineWidth = 4;
				ctx.strokeStyle = "white";
				ctx.moveTo(point, 170);
				ctx.lineTo((point + 6.5), 170);
				ctx.stroke();
				obstacles[index] = false;
				if (index != 0) {
					obstacles[index - 1] = "pit";
				}
			}
		});
		//generate new obstacles
		if (Math.random() < .01) {
			if (obstacles[79] != "pit") {
				obstacles[79] = "box";
			}
		} else if (Math.random() < .01) {
			for (let i = 79; i < 85; i ++) {
				obstacles[i] = "pit";
			}
		}
	}

	function drawObstacle(point) {
		//draw obstacles
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.rect(point, 155, 15, 15);
		ctx.fill();
		ctx.stroke();
	}

	function updateScores() {
		$("li").each(function(index) {
			$(this).html(highScores[index]);
		});
	}

	function gameOver() {
		$("#overlay").css("z-index", 1);
		$.each(highScores, function(index, value) {
			//console.log(index);
			if (score > highScores[index]) {
				highScores.push(score);
				return false;
			}
		});
		highScores.sort(function(a, b) { return b - a });
		highScores.pop();
		//console.log(highScores);
		updateScores();
	}

	function restart() {
		$("#overlay").css("z-index", -1);
		$.each(obstacles, function(index) {
			obstacles[index] = false;
		});
		obstacles[79] = "box";
		started = false;
		shouldLoop = true;
		percent = 100;
		frame = 0;
		score = 0;
		drawStage();
		drawRect({x: 100, y: 160});
	}
});