function setTextLayer(birdLayer, obstaclesLayer, textLayer, backgroundLayer) {
    // textArray legend:
    // [0] - bump
    // [1] - score
    // [2] - start game

    var newText = createText(250, 200, 'GAME OVER', 20, 'Candara', '#000');
    textLayer.add(newText);
    textLayer.draw();
    textArray.push(newText);

    newText = createText(470, 5, 'SCORE: ' + gameScore, 25, 'Consolas', 'blue');
    textLayer.add(newText);
    textLayer.draw();
    textArray.push(newText);

    var startText = createText(200, 100, 'START GAME', 25, 'Verdana', '#00f');
    textLayer.add(startText);
    textLayer.draw();
    textArray.push(startText);

    startText.on('mousedown', function () {
        console.log('mousedown');
        startText.hide();
        main(birdLayer, obstaclesLayer, textLayer, backgroundLayer); // оттук стартира играта
        textArray[1].show();
        textLayer.draw();

    });
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
        visible: false,
    });

    return myText;
}