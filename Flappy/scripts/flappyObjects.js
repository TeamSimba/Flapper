function createFlappy(birdLayer) {
    // картинката на птичето
    var imageObj = new Image(),
        flappyImage;

    imageObj.src = 'images/bat-sprite.png';

    // да свърши работата след като се е заредила картинката
    // Edit 09.06.2014 - флапъра вече е анимиран
    // кадрите са в bird-sprite.png, долу се вижда как се задават, 
    // за всеки кадър задаваме координати на горен ляв ъгъл в спрайта и размер на кадъра
    imageObj.onload = function () {
        flappyImage = new Kinetic.Sprite({
            x: 100,
            y: 200,
            image: imageObj,
            animation: 'flying',
            animations: {
                flying: [
                  // x, y, width, height (4 frames)
                  0, 0, 50, 38,
                  54, 1, 50, 38,
                  108, 0, 50, 38,
                  162, 1, 50, 38
                ],
                dead: [
                  // x, y, width, height (4 frames)
                  /*240, 0, 50, 38,
                  294, 0, 50, 38,
                  346, 0, 50, 38*/
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
        // ето това  стартира зададената анимация -> animation: 'flying'
        flappy.image.start();
    };

}

function generateObstacles(obstaclesLayer) {
    // на уж рандом интервал, анимацията вика тази функция
    // създаваме стълб тука, с х = 600 за да тръгва от десния край на полето
    // createObstacle се грижи да го добави в масива и лейъра, ние само му задаваме
    // размери и първоначални координати

    // EDIT: генерираме рандом цяло число от 0 до 4 за стълбовете от горе; задаваме координати на топ стълбовете
    // Разликата между top и 3 единици (150 пиксела) остава за долния ред стълбове, другото;
    var top = Math.floor((Math.random() * 4) + 1);

    createObstacle(600, 0, 50, top * 50, 'images/stalactite.png', obstaclesLayer);
    createObstacle(600, (3 + top) * 50, 50, (5 - top) * 50, 'images/stalagmite.png', obstaclesLayer);

    // някакво псевдо рандом генериране трябва тука 
    // има такива стълбове с дупка по средата
    // | |
    // 
    // | |
    // за да работят колизиите трябва да се правят от две картинки - една отдолу и една отгоре
    // и дупката между тях да варира
}

function createObstacle(x, y, width, height, src, obstaclesLayer) {
    var imageObj = new Image(),
          pilar;

    imageObj.src = src;

    // без онлоад не ми зареждаше картинката, четох че може и да я зарежда понякога, но е хубаво да го гарантираме
    imageObj.onload = function () {
        pilar = new Kinetic.Image({
            x: x,
            y: y,
            image: imageObj,
            width: width,
            height: height
        });
        //console.log('pilar ' + pilar);
        obstaclesLayer.add(pilar);
        obstaclesLayer.draw();
        obstaclesArray.push(pilar);
    }
}

function removeUselessObstacles(obstaclesLayer) {
    // ако стълб излезе от екрана - махаме го от масива и и от лейъра
    // иначе ще се трупат до безкрай и ще ги обработва, въпреки че са извън екрана
    var elementsToRemove = [];
    for (var i = 0; i < obstaclesArray.length; i += 1) {
        // минавам през всичките, не са много, а не знам колко едновременно излизат от екрана
        if ((obstaclesArray[i].getPosition().x + obstaclesArray[i].getWidth()) <= 0) {
            //console.log('will remove');
            //elementsToRemoveCount += 1;
            elementsToRemove.push(obstaclesArray[i]);
        }
    }

    for (var i = 0; i < elementsToRemove.length; i += 1) {
        elementsToRemove[i].remove();
        obstaclesLayer.draw();
        obstaclesArray.shift();
    }
}