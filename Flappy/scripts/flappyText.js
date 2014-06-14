function setTextLayer(birdLayer, obstaclesLayer, textLayer, backgroundLayer) {
    // textArray legend:
    // [0] - bump
    // [1] - score
    // [2] - instructions rectangle
    // [3] - instructions 
    // [4] - start game
    // [5] - restart text

    var newText = createText(240, 180, 'GAME OVER', 25, 'Arial black', '#f00');
    textLayer.add(newText);
    //  textLayer.draw();
    textArray.push(newText);

    newText = createText(470, 5, 'SCORE: ' + gameScore, 25, 'Arial Black', '#0f0');
    textLayer.add(newText);
    //  textLayer.draw();
    textArray.push(newText);

    var rect = new Kinetic.Rect({
        x: 150,
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
    // textLayer.draw();
    textArray.push(rect);

    var instructions = createText(220, 160, 'INSTRUCTIONS\n\nClick START GAME, or\n press Enter to begin.\n Press UP ARROW to fly \nTry to avoid the blocks', 18,
    'Calibri', 'black');
    textLayer.add(instructions);
    //  textLayer.draw();
    textArray.push(instructions);

    var startText = createText(220, 120, 'START GAME', 25, 'Arial black', '#0f0');
    textLayer.add(startText);
    // textLayer.draw();
    textArray.push(startText);

    var restartText = createText(20, 5, 'RESTART (F5)', 25, 'Arial black', '#0f0');
    textLayer.add(restartText);

    textArray.push(restartText);

    textLayer.draw();


    startText.on('mousedown', startGame);
    window.addEventListener('keydown', function (e) {
        if (e.keyCode == 13) {
            startGame();
        }
    });

    restartText.on('mousedown', function () {
        window.location.reload();
    });

    function startGame() {
        rect.hide();
        instructions.hide();
        startText.hide();
        textArray[1].show();
        textArray[5].show();
        main(birdLayer, obstaclesLayer, textLayer, backgroundLayer); // оттук стартира играта

    }
}

function createText(x, y, text, fontSize, fontFamily, fill) {
    // създава ги невидими
    var myText = new Kinetic.Text({
        x: x,
        y: y,
        text: text,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: fill,
        shadowColor: 'yellow',
        shadowBlur: 2,
        shadowOffset: { x: 2, y: 2 },
        shadowOpacity: 0.5,
        visible: false,
    });

    return myText;
}