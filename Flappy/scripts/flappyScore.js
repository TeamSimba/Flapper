function doScore(textLayer) {
    // работим със стълбовете
    for (var i = 0; i < obstaclesArray.length; i += 1) {
        if (obstaclesArray[i] != undefined) { // ако се е заредила картинката на стълба
            // проверка за подминат стълб
            var flappyLeft = flappy.image.getPosition().x,
                obstacleRight = obstaclesArray[i].getPosition().x + obstaclesArray[i].getWidth();


            if (flappyLeft > obstacleRight) {
                // добавя се флага за да брои подминатия стълб само веднъж
                if (!obstaclesArray[i].flagged) {
                    obstaclesArray[i].flagged = true;
                    console.log('not flagged' + obstaclesArray[i].flagged);
                    gameScore++;
                    textArray[1].setText('SCORE: ' + gameScore/2); // Понеже птичката минава между 2 стълба едновременно, gameScore се дели;
                    textLayer.draw();
                }
            }
        }
    } // for
}