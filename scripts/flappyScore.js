function doScore(textLayer) {
    // iterate thtrough all stalagmites
    for (var i = 0; i < obstaclesArray.length; i += 1) {
        if (obstaclesArray[i] != undefined) { 
            var flappyLeft = flappy.image.getPosition().x,
                obstacleRight = obstaclesArray[i].getPosition().x + obstaclesArray[i].getWidth();

            // check if bat on the right of the stalagmite
            if (flappyLeft > obstacleRight) {
                // add a "flagged" field to count the passed stalagmites only once
                if (!obstaclesArray[i].flagged) {
                    obstaclesArray[i].flagged = true;
                    gameScore++;
                    textArray[1].setText('SCORE: ' + gameScore/2); // bat passes 2 stalgmites at the same time so score / 2
                    textLayer.draw();
                }
            }
        }
    } 
}