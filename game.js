//Code for the game portion of the page
//On DOM load
$(document).ready(function() {
	var $div = $("<div>", {id: "testDiv", "class": "div"}).html("Test");
	$("body").append($div);
	//User input event listener
	$(document).on("keydown", function(e) {
		console.log(e);
		if (e.key == 'ArrowUp') {
			jump();
		}
	});
	//Code for canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	//set default values
	var fps = 60;
	var percent = 100;
	var direction = 1;
	var frame = 0;

	function jump() {
		if (frame == 50) {
			percent = 100;
			frame = 0;
		}
		percent += direction;
		if (percent < 0) {
			percent = 0;
			direction = 1;
		} else if (percent > 25) {
			percent = 25;
			direction = -1;
		}

		draw(percent);

		frame += 1;
		if (frame < 50) {
			setTimeout(function() {
				requestAnimationFrame(jump);
			}, 1000 / fps);
		}
	}

	function draw(sliderValue) {
		//clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.lineWidth = 5;

		
		ctx.beginPath();
		ctx.moveTo(100, 20);
		ctx.lineTo(100, 160);
		ctx.strokeStyle = "black";
		ctx.stroke();
		

		var xy;

		var percent = sliderValue / 25;
		xy = getLineXYatPercent({
			x: 100,
			y: 20
		}, {
			x: 100,
			y: 160
		}, percent);
		drawRect(xy);
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
		ctx.fillStyle = "white";
		ctx.strokeStyle = "green";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.rect(point.x - 13, point.y - 8, 25, 15);
		ctx.fill();
		ctx.stroke();
	}
});