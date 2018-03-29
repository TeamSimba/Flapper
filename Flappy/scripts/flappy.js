// global variables
var obstaclesArray = [], // contains all current stalagmites
    textArray = [], // contains all game texts as Kinetik.js objects
    flappy = {}, // our bat
    gameOver = false,
    gameScore = 0
	timerId = 0; // timer ID for background movement

window.onload = function () {
    var stage,
		width = 600,
		heigth = 400,
		stage = new Kinetic.Stage({
		    container: 'container',
		    width: width,
		    height: heigth
		}),
		birdLayer = new Kinetic.Layer,
		obstaclesLayer = new Kinetic.Layer,
		textLayer = new Kinetic.Layer,
        backgroundLayer = new Kinetic.Layer;
    
    stage.add(backgroundLayer);
    stage.add(birdLayer);
    stage.add(obstaclesLayer);
    stage.add(textLayer);
     
    startMenu(birdLayer, obstaclesLayer, textLayer, backgroundLayer); 
};

function startMenu(birdLayer, obstaclesLayer, textLayer, backgroundLayer) {
    setTextLayer(birdLayer, obstaclesLayer, textLayer, backgroundLayer);
    textArray[4].show();
    textArray[2].show();
    textArray[3].show();
    textLayer.draw();
}

function main(birdLayer, obstaclesLayer, textLayer, backgroundLayer) {
    createFlappy(birdLayer);
    doBackground(backgroundLayer)
    // set the first two stalagmites
    createObstacle(600, 0, 50, 100, 'images/stalactite.png', obstaclesLayer);
    createObstacle(600, 250 , 50, 150, 'images/stalagmite.png', obstaclesLayer);
    obstaclesLayer.draw();
    setTextLayer(birdLayer, obstaclesLayer, textLayer); 
    moveFlappy(birdLayer, textLayer, obstaclesLayer);
}

function moveFlappy(birdLayer, textLayer, obstaclesLayer) {
    var arrowUpPressed = false,
        countedFrames = getRandomValue(2, 10) * 30;

    window.addEventListener('keydown', function (e) {
        if (e.keyCode == 38) // arrow up pressed
            arrowUpPressed = true;
    });
    window.addEventListener('keyup', function (e) {
        if (e.keyCode == 38) // arrow up released
            arrowUpPressed = false;
    });

    // create Bat animation
    var anim = new Kinetic.Animation(function (frame) {
        countedFrames--;
        if (flappy.image != undefined) { // will not precess until the image is loaded
                if (!gameOver) {
                    // move the Bat
                    if (arrowUpPressed) {
                        flappy.image.setY(flappy.image.getPosition().y - flappy.acceleration); // 1 - бавно, 2 - по-бързо, etc.
                    } else {
                        flappy.image.setY(flappy.image.getPosition().y + 2);
                    }

                    // process stalagmites
                    for (var i = 0; i < obstaclesArray.length; i++) {
                        if (obstaclesArray[i] != undefined) { // if stalagmite image is loaded
                            // move stalagmites
                            obstaclesArray[i].setX(obstaclesArray[i].getPosition().x - 2);
                            obstaclesLayer.draw();

                            // collisions check
                            var bumpedObstacle = detectObstacleCollision(flappy.image, obstaclesArray[i]), // bat bumps into stalagmite
                                bumpedWall = detectWallCollision(flappy.image); // bat bumps into wall

                            if (bumpedObstacle || bumpedWall) {
                                gameOver = true;
                                textArray[0].show(); // show Game Over text
                                textLayer.draw();

                                // stop background movement
								clearInterval(timerId);

                                // set bat animation to 'dead'
								flappy.image.animation('dead');

                                // stop the 'dead animation after the 10-th frame
                                var frameCount = 0;
                                flappy.image.on('frameIndexChange', function (evt) {
                                    if (flappy.image.animation() === 'dead' && ++frameCount > 10) {
                                        flappy.image.stop();
                                    }
                                });
                            }
                        }
                    } // for
                      
                    // remove stalagmites that leave the game field on the left
                    removeUselessObstacles(obstaclesLayer);

                    // generate new set of stalagmites and add them to the array
                    if (countedFrames < 0) { // at somewhat random intervals
                        generateObstacles(obstaclesLayer);
                        countedFrames = countedFrames = getRandomValue(3, 5) * 30;
                    }

                    // process score
                    doScore(textLayer);
                } // !gameOver
        } // flappy.image != undefined
    }, birdLayer);

    anim.start();
}

function detectObstacleCollision(a, b) { // a is bat, b is stalagmite
    var aTop = a.getY(),
        aBottom = a.getY() + a.getHeight(),
        aLeft = a.getX(),
        aRight = a.getX() + a.getWidth(),
        gotCollision;
        
    // check for collisions with stalagmites
    // we have a set of 15 points describing the outlines of the bat
    // for each of those points we check if it fall within the stalagmites
    gotCollision = pointIsInsidePilar(aLeft, aTop + 19, b)||
        pointIsInsidePilar(aLeft + 8, aTop + 12, b) ||
        pointIsInsidePilar(aLeft + 14, aTop + 6, b) ||
        pointIsInsidePilar(aLeft + 18, aTop, b) ||
        pointIsInsidePilar(aLeft + 25, aTop, b) ||
        pointIsInsidePilar(aLeft + 30, aTop + 12, b) ||
        pointIsInsidePilar(aLeft + 42, aTop + 12, b) ||
        pointIsInsidePilar(aLeft + 49, aTop + 25, b) ||
        pointIsInsidePilar(aLeft + 43, aTop + 29, b) ||
        pointIsInsidePilar(aLeft + 33, aTop + 29, b) ||
        pointIsInsidePilar(aLeft + 30, aTop + 34, b) ||
        pointIsInsidePilar(aLeft + 15, aBottom, b) ||
        pointIsInsidePilar(aLeft + 6, aTop + 32, b) ||
        pointIsInsidePilar(aLeft, aTop + 30, b) ||
        pointIsInsidePilar(aLeft + 8, aTop + 12, b);

    return gotCollision;
}

function detectWallCollision(a) {
    // check if bat comes out of the game field, it moves only up and down so only y coordinates are checked
    var gotCollision = a.getPosition().y > (400 - 38) || a.getPosition().y <= 0;

    return gotCollision;
}

function pointIsInsidePilar(pointX, pointY, pilar) {
    var isInside = false,
        pilarTop = pilar.getY(),
        pilarBottom = pilar.getY() + pilar.getHeight(),
        pilarLeft = pilar.getX(),
        pilarRight = pilar.getX() + pilar.getWidth(),
        pilarHeight = pilar.getHeight(),
        scale = pilarHeight / 50,
        i,
        j,
        pilarPointsX,
        pilarPointsY;

    // Еach pilar is represented by a set of points defining its outline,
    // pilarPointsX contains the x-coordinates of those points, pilarPointsY - their y coordinates

    // Вe are using the same image for stalagmites with various heights and their heights are always divisible by 50, 
    // therefore if we have the outline coordinates for the stalagmite with height = 50,
    // we can calculate the y-coordinates of stalagmite with height 100, 150 etc.
    // this why we use the scale variable
    // x-coordinates remain the same

    if (pilarTop == 0) { // upper stalagmite
        pilarPointsX = [pilarLeft, pilarLeft, pilarLeft + 7, pilarLeft + 9, pilarLeft + 16,
                        pilarLeft + 22, pilarLeft + 29, pilarLeft + 30, pilarLeft + 31, pilarLeft + 37,
                        pilarLeft + 37, pilarLeft + 49, pilarLeft + 49];
        pilarPointsY = [pilarTop, pilarTop + 7 * scale, pilarTop + 18 * scale, pilarTop + 19 * scale, pilarTop + 35 * scale,
                        pilarTop + 49 * scale, pilarTop + 49 * scale, pilarTop + 45 * scale, pilarTop + 35 * scale, pilarTop + 25 * scale,
                        pilarTop + 15 * scale, pilarTop + 5 * scale, pilarTop];

        isInside = pointIsInsidePolygon(pointX, pointY, pilarPointsX, pilarPointsY);
    }
    else if (pilarBottom == 400) { // lower stalagmite
        pilarPointsX = [pilarLeft, pilarLeft + 49, pilarLeft + 49, pilarLeft + 48, pilarLeft + 42,
                        pilarLeft + 39, pilarLeft + 34, pilarLeft + 32, pilarLeft + 30, pilarLeft + 26,
                        pilarLeft + 22, pilarLeft + 19, pilarLeft + 18, pilarLeft + 12, pilarLeft + 12, pilarLeft
                        ];
        pilarPointsY = [pilarBottom, pilarBottom, pilarBottom - 3 * scale, pilarBottom - 10 * scale, pilarBottom - 18 * scale,
                        pilarBottom - 20 * scale, pilarBottom - 24 * scale, pilarBottom - 26 * scale, pilarBottom - 44 * scale, pilarBottom - 50 * scale,
                        pilarBottom - 50 * scale, pilarBottom - 46 * scale, pilarBottom - 36 * scale, pilarBottom - 24 * scale, pilarBottom - 16 * scale, pilarBottom - 5 * scale
                        ];

        isInside = pointIsInsidePolygon(pointX, pointY, pilarPointsX, pilarPointsY);
    }
        
    return isInside;
}

function pointIsInsidePolygon(x, y, xp, yp) {
    var i, j, c = 0, npol = xp.length;

    // the algorith for detecting if point is inside polygon is taken from here:
    // http://jsfromhell.com/math/is-point-in-poly
    // http://www.webmasterworld.com/javascript/3551991.htm

    for (i = 0, j = npol-1; i < npol; j = i++) { 
        if ((((yp[i] <= y) && (y < yp[j])) || 
        ((yp[j] <= y) && (y < yp[i]))) && 
        (x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) { 
            c =!c; 
        } 
    }

    return c; 
}

function getRandomValue(min, max) { // return an integer between min and max
    if (!max) {
        max = min;
        min = 0;
    }

    return (Math.random() * (max - min) + min) | 0;
}