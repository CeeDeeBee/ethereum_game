//Code for the game portion of the page
//On DOM load
$(document).ready(function() {
	var jump = false;
	var started = false;
	var shouldLoop = true;
	var $div = $("<div>", {id: "testDiv", "class": "div"}).html("Test");
	$("body").append($div);
	//User input event listener
	$(document).on("keydown", function(e) {
		if (e.key == 'ArrowUp') {
			jump = true;
			if (!started) {
				animate();
				started = true;
			}
		}
	});
	$("#newFrame").click(function() {
		shouldLoop = false;
		animate();
	});
	//Code for canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	//set default values
	var fps = 60;
	var percent = 100;
	var direction = 5;
	var frame = 0;
	var obstacles = [false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, false,
					 false, false, false, false, false, false, false, false, false, true
					];

	//animate();
	drawStage();
	drawRect({x: 100, y: 160});

	function animate() {
		//console.log(obstacles);
		if (jump == true) {
			if (frame == 42) {
				percent = 100;
				frame = 0;
				jump = false;
			}
			percent += direction;
			if (percent < 0) {
				percent = 0;
				direction = 5;
			} else if (percent > 100) {
				percent = 100;
				direction = -5;
			}
			frame += 1;
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

		var xy;

		var percent = sliderValue / 100;
		xy = getLineXYatPercent({
			x: 100,
			y: 20
		}, {
			x: 100,
			y: 160
		}, percent);

		drawRect(xy);

		if ((xy.y - 8) >= 140) {
			if (obstacles[1] == true || obstacles[2] == true || obstacles[3] == true || obstacles[4] == true) {
				console.log("collision");
				shouldLoop = false;			
			}
		}
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

		//draw platform
		ctx.beginPath();
		ctx.moveTo(50, 170);
		ctx.lineTo(550, 170);
		ctx.strokeStyle = "black";
		ctx.stroke();

		$.each(obstacles, function(index, value) {
			var point = 0;
			if (value) {
				point = (index * 12.5) + 50;
				drawObstacle(point);
				obstacles[index] = false;
				if (index != 0) {
					obstacles[index - 1] = true;
				}
			}
		});

		if (Math.random() < .05) {
			obstacles[39] = true;
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
});