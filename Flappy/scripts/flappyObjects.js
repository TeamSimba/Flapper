function createFlappy(birdLayer) {
    // Bat image object
    var imageObj = new Image(),
        flappyImage;

    imageObj.src = 'images/bat-sprite.png';

    // bat image is animated Kintic.js sprite
    imageObj.onload = function () {
        flappyImage = new Kinetic.Sprite({
            x: 100,
            y: 200,
            image: imageObj,
            animation: 'flying',
            animations: {
                flying: [
                  0, 0, 50, 38,
                  54, 1, 50, 38,
                  108, 0, 50, 38,
                  162, 1, 50, 38
                ],
                dead: [
                  0, 54, 36, 36,
                  42, 54, 36, 36,
                  84, 54, 36, 36,
                  126, 54, 36, 36,
                  168, 54, 36, 36,
                  0, 94, 36, 36,
                  42, 94, 36, 36,
                  84, 94, 36, 36,
                  126, 94, 36, 36,
                  168, 94, 36, 36,
                  0, 131, 36, 36,
                  42, 131, 36, 36,
                ]
            },
            frameRate: 7,
            frameIndex: 0
        });
        flappy = {
            image: flappyImage,
            acceleration: 8,
        };
        birdLayer.add(flappy.image);
        birdLayer.draw();
        // start the default set animation -> animation: 'flying'
        flappy.image.start();
    };

}

function generateObstacles(obstaclesLayer) {
    // this function is called at random intervals from function "moveFlappy" 
    // it generates a new set of stalagmites, one on the cave floor and one on
 
    // generate random integer between 0 and 4, this number * 50 pixels will be the height of the ceiling stalagmite
    // then the floor stalagmite will start 3 * 50 pixels below and its height is calculated by (5 - number) * 50
    var top = Math.floor((Math.random() * 4) + 1);

    createObstacle(600, 0, 50, top * 50, 'images/stalactite.png', obstaclesLayer);
    createObstacle(600, (3 + top) * 50, 50, (5 - top) * 50, 'images/stalagmite.png', obstaclesLayer);
}

function createObstacle(x, y, width, height, src, obstaclesLayer) {
    // this function creates a stalagmite with the given parameters,
    // then adds it to the obstaclesLayer and to the obstaclesLayer
    var imageObj = new Image(),
          pilar;

    imageObj.src = src;

    imageObj.onload = function () {
        pilar = new Kinetic.Image({
            x: x,
            y: y,
            image: imageObj,
            width: width,
            height: height
        });
        obstaclesLayer.add(pilar);
        obstaclesLayer.draw();
        obstaclesArray.push(pilar);
    }
}

function removeUselessObstacles(obstaclesLayer) {
    // when a stalagmite leaves the game field from the left, there is no more need to process it
    // this function removes those stalagmites from the kinetic layer and from the obstaclesArray

    var elementsToRemove = [];
    for (var i = 0; i < obstaclesArray.length; i += 1) {
        // check position of each stalagmite and if it's out of the game field, 
        // push to elementsToRemove array
        if ((obstaclesArray[i].getPosition().x + obstaclesArray[i].getWidth()) <= 0) {
            elementsToRemove.push(obstaclesArray[i]);
        }
    }

    // new remove all collected useless stalgamites from the kinetic layer and from the obstaclesArray
    for (var i = 0; i < elementsToRemove.length; i += 1) {
        elementsToRemove[i].remove();
        obstaclesLayer.draw();
        obstaclesArray.shift();
    }
}