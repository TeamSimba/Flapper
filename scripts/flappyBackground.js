function doBackground(backgroundLayer) {
    // background represented by a scrolling image, done via CSS and setInterval
	var background = document.getElementById('slide'),
		bgWidth = 600,
		position = 0,
		speed = 2; // speed of background movement

	timerId = setInterval(animateBackground, 30);

	function animateBackground() {
		position = position - speed;
		if (position < -bgWidth) {
			position = 0;
		}
		background.style.left = position + 'px';
	}
}