var newGame = true;

function setTextLayer(birdLayer, obstaclesLayer, textLayer, backgroundLayer) {
    // set all game texts
    // textArray legend:
    // [0] - bump
    // [1] - score
    // [2] - instructions rectangle
    // [3] - instructions 
    // [4] - start game
    // [5] - restart text

    var maxWidth = 300,
        left = 150,
        newText;

    newText = createText(left, 180, maxWidth, 'GAME OVER', 25, 'Arial black', '#f00');
    textLayer.add(newText);
    textArray.push(newText);

    newText = createText(left * 2, 5, maxWidth, 'SCORE: ' + gameScore, 25, 'Arial Black', '#0f0');
    textLayer.add(newText);
    textArray.push(newText);

    var rect = new Kinetic.Rect({
        x: left,
        y: 100,
        stroke: '#555',
        fill: '#ddd',
        width: 300,
        height: 200,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: { x: 10, y: 10 },
        opacity: 0.5,
        shadowOpacity: 0.2,
        cornerRadius: 10,
        visible: false
    });
    textLayer.add(rect);
    textArray.push(rect);

    var instructions = createText(left, 160, maxWidth, 'INSTRUCTIONS\n\nClick START GAME, or\npress Enter to begin.\nPress UP ARROW to fly\nTry to avoid the blocks', 18,
    'Calibri', 'black');
    textLayer.add(instructions);
    textArray.push(instructions);

    var startText = createText(left, 120, maxWidth, 'START GAME', 25, 'Arial black', '#0f0');
    textLayer.add(startText);
    textArray.push(startText);

    var restartText = createText(20, 5, maxWidth, 'RESTART (F5)', 25, 'Arial black', '#0f0');
    textLayer.add(restartText);
    textArray.push(restartText);
    textLayer.draw();

    // start game on text click or enter button pressed
    startText.on('mousedown', startGame);
    window.addEventListener('keydown', function (e) {
        if (e.keyCode == 13 && newGame) {
            newGame = false;
            startGame();
        }
    });

    // restart game on text click
    restartText.on('mousedown', function () {
        window.location.reload();
    });

    // start the game
    function startGame() {
        rect.hide();
        instructions.hide();
        startText.hide();
        textArray[1].show();
        textArray[5].show();
        main(birdLayer, obstaclesLayer, textLayer, backgroundLayer);
    }
}

function createText(x, y, width, text, fontSize, fontFamily, fill) {
    var myText = new Kinetic.Text({
        x: x,
        y: y,
        width: width,
        text: text,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: fill,
        shadowColor: 'yellow',
        shadowBlur: 2,
        shadowOffset: { x: 2, y: 2 },
        shadowOpacity: 0.5,
        visible: false,
        align: 'center'
    });

    return myText;
}