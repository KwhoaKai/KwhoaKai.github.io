// Typography waves
var red = function(p) {
    let segmentCount;
    let stackCount;
    let inpText;
    let leading;

    let radius;
    let radiusWave, radiusWaveSize, radiusWaveCount, radiusWaveOffset;
    let radiusWaveSpeed = 0.01;

    let fontSize;
    p.preload = function() {
        fontGenerator = p.loadFont('IBMPlexMono-Bold.otf');
    };

    p.setup = function() {
        console.log($('#typeDiv').width());
        p.createCanvas($('#typeDiv').width(),$('#typeDiv').width(), p.WEBGL);
        fontSize = 0;
        radiusWaveOffset = 0;
        stackCount = 5;
        leading = 10;
        radiusWave = 50;
        radiusWaveCount = 2;
        inpText = "YikaiKuo";
    };

    p.draw = function() {
        p.background('#FF76B8');
        p.orbitControl();
        p.textSize(10);
        p.textAlign(p.LEFT);
        p.fill(255);
        p.noStroke();

        p.translate(-p.width / 2, -p.height / 2);

        //fontSize = fontSizeSlider.value();
        fontSize = p.lerp(fontSize, 60, 0.2);
        //radius = radiusSlider.value();
        radius = 74;
        radiusWaveSize = 84;
        radiusWaveOffset = p.lerp(radiusWaveOffset, 1.38, 0.2);

        console.table(radiusWaveSize);
        // radiusWaveOffset = 1.38

        let pieAngle = 2 * p.PI / inpText.length;
        let fontHeight = 7 / 10 * fontSize;

        let radiusWaveLength = 2 * p.PI / inpText.length * radiusWaveCount;

        // Center matrix
        p.translate(p.width / 2, p.height / 2);

        // Center Y because of stackCount and height
        p.translate(0, -(stackCount - 1) * (fontHeight + leading) / 2);

        p.textFont(fontGenerator);
        p.textSize(fontSize);
        p.textAlign(p.CENTER);
        p.fill(255);
        p.noStroke();

        p.rotateX(-p.PI * .12);
        for (let i = 0; i < stackCount; i++) {
            for (let j = 0; j < inpText.length; j++) {
                radiusWave = p.sin(p.frameCount * radiusWaveSpeed + j * radiusWaveLength + i * radiusWaveOffset) * radiusWaveSize;
                let radiusWavePost = p.sin(p.frameCount * radiusWaveSpeed + (j + 1) * radiusWaveLength + i * radiusWaveOffset) * radiusWaveSize;
                let radiusWavePre = p.sin(p.frameCount * radiusWaveSpeed + (j - 1) * radiusWaveLength + i * radiusWaveOffset) * radiusWaveSize;

                let postX = p.cos(pieAngle * (j + 1)) * (radius + radiusWavePost);
                let preX = p.cos(pieAngle * (j - 1)) * (radius + radiusWavePre);

                let postZ = p.sin(pieAngle * (j + 1)) * (radius + radiusWavePost);
                let preZ = p.sin(pieAngle * (j - 1)) * (radius + radiusWavePre);

                let angleAdjustY = p.atan2(postX - preX, postZ - preZ);

                let radiusWaveAbove = p.sin(p.frameCount * radiusWaveSpeed + j * radiusWaveLength + (i + 1) * radiusWaveOffset) * radiusWaveSize;
                let radiusWaveBelow = p.sin(p.frameCount * radiusWaveSpeed + j * radiusWaveLength + (i - 1) * radiusWaveOffset) * radiusWaveSize;

                let angleAdjustX = p.atan2(radiusWaveBelow - radiusWaveAbove, 2 * (fontHeight + leading));

                p.push();
                p.translate(0, i * (fontHeight + leading));
                p.rotateY(pieAngle * j);
                p.translate(0, 0, radius + radiusWave);
                //ellipse(0, 0, 5, 5);
                p.rotateY(-angleAdjustY - pieAngle * j);
                p.rotateX(-angleAdjustX);
                p.translate(0, fontHeight / 2);
                p.text(inpText.charAt(j), 0, 0);

                p.translate(0, 0, -1);
                p.fill('#FFF714');
                p.text(inpText.charAt(j), 0, 0);
                p.pop();
            }
        }
    }
}
var myp5 = new p5(red, 'typeDiv');
