function doBackground(backgroundLayer) {
/*
    var group = new Kinetic.Group({ // само с група успях да селектирам всички фигури в лейъра долу
        x: 220,
        y: 50,
        rotation: 20
    });

    var figure = new Kinetic.Circle({
        x: 220,
        y: 50,
        radius: 50,
        fill: 'red',
    });

    group.add(figure);

    figure = new Kinetic.Circle({
        x: 0,
        y: 0,
        radius: 20,
        fill: 'green',
    });

    group.add(figure);

    //backgroundLayer.add(figure);
    backgroundLayer.add(group);
    backgroundLayer.draw();


    var anim = new Kinetic.Animation(function (frame) {
        var nodes = backgroundLayer.find('Group');
        nodes.each(function (node, n) {
            node.setX(node.getPosition().x - 2);
        });
    }, backgroundLayer);

    anim.start();
*/
	
	// анимиране на фона с CSS
	var background = document.getElementById('slide'),
		bgWidth = 600,
		position = 0,
		speed = .9;

	timerId = setInterval(animateBackground, 30);

	function animateBackground() {
		position = position - speed;
		if (position < -bgWidth) {
			position = 0;
		}
		background.style.left = position + 'px';
	}

    // и тук като при стълбовете някой трябва да добавя нови фигури/картинки през определено време
    // и да ги маха като излязат, да не се трупат в нищото
}