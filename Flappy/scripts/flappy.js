// global variables
// лейърите да се изнесат тук
var obstaclesArray = [],
    textArray = [],
    flappy = {},
    gameOver = false,
    gameScore = 0;

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
    textArray[2].show();
    textLayer.draw();
}

function main(birdLayer, obstaclesLayer, textLayer, backgroundLayer) {
    //textArray[1].show();
    //textLayer.draw();

    createFlappy(birdLayer);

    doBackground(backgroundLayer)
    // първоначални стълбове, виждат се на канваса
    // createObstacle(400, 0, 50, 136, 'https://raw.githubusercontent.com/Nailses/Flappy/master/Flappy/images/vader-pilar.jpg', obstaclesLayer);
    // createObstacle(400, 300, 50, 136, 'https://raw.githubusercontent.com/Nailses/Flappy/master/Flappy/images/vader-pilar.jpg', obstaclesLayer);

    createObstacle(600, 0, 50, 100, 'images/pipe.png', obstaclesLayer);
    createObstacle(600, 250 , 50, 150, 'images/pipe.png', obstaclesLayer);

    obstaclesLayer.draw();

    setTextLayer(birdLayer, obstaclesLayer, textLayer); // !!!! 

    moveFlappy(birdLayer, textLayer, obstaclesLayer);
}

function moveFlappy(birdLayer, textLayer, obstaclesLayer) {
    var arrowUpPressed = false,
        countedFrames = getRandomValue(2, 10) * 30;

    // всъщност това и с мишка ще стане mouseup/mousedown, 
    // но така за момента ми е по-лесно да управлявам
    // to do управлението да се поправи - ако държим натисната стрелка нагоре да не ускорява непрестанно
    // играта иска да се помпа постоянно
    window.addEventListener('keydown', function (e) {
        if (e.keyCode == 38) //стрелка нагоре натисната
            arrowUpPressed = true;
    });
    window.addEventListener('keyup', function (e) {
        if (e.keyCode == 38) //стрелка нагоре отпусната
            arrowUpPressed = false;
    });

    // тук правим самата анимация на пилето
    var anim = new Kinetic.Animation(function (frame) {
        countedFrames--;
        if (flappy.image != undefined) { // чакаме да се зареди картинката
                if (!gameOver) {
                    // мърдаме пилето
                    if (arrowUpPressed) {
                        flappy.image.setY(flappy.image.getPosition().y - flappy.acceleration); // 1 - бавно, 2 - по-бързо, etc.
                    } else {
                        flappy.image.setY(flappy.image.getPosition().y + 2);
                    }
                    // flappy.image.setX(flappy.image.getPosition().x + 2); // мърда пилето по х

                    // работим със стълбовете
                    for (var i = 0; i < obstaclesArray.length; i++) {
                        if (obstaclesArray[i] != undefined) { // ако се е заредила картинката на стълба
                            // мърдаме стълбовете
                            obstaclesArray[i].setX(obstaclesArray[i].getPosition().x - 2); // тия двойки да се изнесат някъде, гейм спийд например
                            obstaclesLayer.draw();

                            // проверка за колизии
                            var bumpedObstacle = detectObstacleCollision(flappy.image, obstaclesArray[i]);
                            var bumpedWall = detectWallCollision(flappy.image); // птиче блъска стена
                            if (bumpedObstacle || bumpedWall) {
                                console.log('BUMP');
                                gameOver = true;
                                textArray[0].show();
                                textLayer.draw();
                                // Edit: 09.06.2014 - пилето умира с корема нагоре
                                // ето това  стартира анимация dead
                                flappy.image.animation('dead');                               
                                // след 10-ия кадър на анимация dead я спираме
                                // спрайта и dead са все още грозни
                                var frameCount = 0;
                                flappy.image.on('frameIndexChange', function (evt) {
                                    if (flappy.image.animation() === 'dead' && ++frameCount > 10) {
                                        flappy.image.stop();
                                    }
                                });
                            }
                        }
                    } // for
                      
                    // махаме стълбовете излезли отляво
                    removeUselessObstacles(obstaclesLayer);

                    // генерираме нов стълб и го нареждаме в опашката
                    if (countedFrames < 0) { // това 100 ще бъде рандом време
                        generateObstacles(obstaclesLayer);
                        countedFrames = countedFrames = getRandomValue(3, 5) * 30;
                    }

                    // score
                    doScore(textLayer);

                } // !gameOver
        } // flappy.image != undefined
    }, birdLayer);

    anim.start();
}

function detectObstacleCollision(a, b) { // a, b са правоъгълници
    var aTop = a.getY(),
        aBottom = a.getY() + a.getHeight(),
        aLeft = a.getX(),
        aRight = a.getX() + a.getWidth(),
        bTop = b.getY(),
        bBottom = b.getY() + b.getHeight(),
        bLeft = b.getX(),
        bRight = b.getX() + b.getWidth();

    // птичето се движи отляво надясно и го смятаме за правоъгълник засега, 
    // тук тества само горен десен и долен десен ъгъл, ще добавя и другите после
    //var gotCollision = pointIsInsideRectangle(aRight, aTop, bTop, bBottom, bLeft, bRight) ||
    //    pointIsInsideRectangle(aRight, aBottom, bTop, bBottom, bLeft, bRight);

    // Edit 09.06.2014 - птицата вече не е правоъгълник, затова ще правя проверки по точки по контура
    // В папка images\bird-helper съм намацала приблизително точките, първата е тази над опашката,
    // следващите са по часовниковата стрелка
    var gotCollision = pointIsInsideRectangle(aLeft, aTop + 19, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 8, aTop + 12, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 14, aTop + 6, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 18, aTop, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 25, aTop, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 30, aTop + 12, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 42, aTop + 12, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 49, aTop + 25, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 43, aTop + 29, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 33, aTop + 29, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 30, aTop + 34, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 25, aBottom, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 15, aBottom, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 6, aTop + 32, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft, aTop + 30, bTop, bBottom, bLeft, bRight) ||
            pointIsInsideRectangle(aLeft + 8, aTop + 12, bTop, bBottom, bLeft, bRight);


    return gotCollision;
}

function detectWallCollision(a) {
    // Edit 09.06.2014 - коригирана долна граница, проверката по х не ни трябва
    var gotCollision = a.getPosition().y > (400 - 38) || a.getPosition().y <= 0; // тези цифри на променливи

    return gotCollision;
}

function pointIsInsideRectangle(pointX, pointY, top, bottom, left, right) {
    var isInside = false;

    isInside = (pointX >= left) && (pointX <= right) && (pointY >= top) && (pointY <= bottom);

    return isInside;
}

function getRandomValue(min, max) { // връща цяло число между мин и макс
    if (!max) {
        max = min;
        min = 0;
    }

    return (Math.random() * (max - min) + min) | 0;
}

// to do fon

// nadpisi - s predawane na skore