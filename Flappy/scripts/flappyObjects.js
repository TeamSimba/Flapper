﻿function createFlappy(birdLayer) {
    // картинката на птичето
    var imageObj = new Image(),
        flappyImage;

    imageObj.src = 'images/bird.png';

    // да свърши работата след като се е заредила картинката
    imageObj.onload = function () {
        flappyImage = new Kinetic.Image({
            x: 100,
            y: 200,
            image: imageObj,
            width: 50,
            height: 50
        });
        flappy = {
            image: flappyImage,
            acceleration: 8,
        };
        birdLayer.add(flappy.image);
        birdLayer.draw();
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

    createObstacle(600, 0, 50, top * 50, 'images/pipe.png', obstaclesLayer);
    createObstacle(600, (3 + top) * 50, 50, (5 - top) * 50, 'images/pipe.png', obstaclesLayer);

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