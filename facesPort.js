var faces = function(p) {
    let rando1 = Math.random();
    let rando2 = Math.random();
    let rando3 = Math.random();
    let lom;
    p.setup = function() {
        p.colorMode(p.RGB, 255, 255, 255);
        p.createCanvas($('#faceCanvas').width(), $('#faceCanvas').width()/1.7777);
        console.log("made canvas" + p.width +" "+p.height);
        p.background(0, 0, 0);
        lom = 1;
        p.angleMode(p.DEGREES);
    };

    p.draw = function() {
        p.background(0, 0, 0);
        if (lom > p.width || lom > p.height) {
            lom = 0;
        }
        p.noFill();
        
        // First shape
        p.stroke(254, 127, 156);
        p.beginShape();
        let minX = p.mouseX >= 5 ? p.mouseX : 5;
        let spacing = p.map(minX, 0, p.width, 1, 200);
        for (let a = 0; a < 360; a += spacing) {
            let x = p.width/5 * p.cos(a) + (rando1 * (p.width-p.width/5));
            let y = p.width/5 * p.sin(a) + 200;
            p.vertex(x, y);
            //console.log(mouseX);
        }
        p.endShape(p.CLOSE);    

        // Second shape
        p.stroke(0, 255, 247);
        p.beginShape();
        let minX2 = p.mouseX >= 5 ? p.mouseX : 5;
        let spacing2 = p.map(minX2, 0, p.width, 1, 200);
        for (let a = 0; a < 360; a += spacing2) {
            let x = p.width/15 * p.sin(a) + (rando2 * (p.width-p.width/15));
            let y = p.width/15 * p.cos(a) + 100;
            p.vertex(x, y);
            //console.log(mouseX);
        }
        p.endShape(p.CLOSE);    

        // Third shape
        p.stroke(3, 252, 132);
        p.beginShape();
        let minY3 = p.mouseY >= 5 ? p.mouseY : 5;
        let spacing3 = p.map(minY3, 0, p.width, 1, 200);
        for (let a = 0; a < 360; a += spacing3) {
            let x = p.width/10 * p.sin(a) + (rando3 * (p.width-p.width/10));
            let y = p.width/10 * p.cos(a) + 50;
            p.vertex(x, y);
            //console.log(mouseY);
        }
        p.endShape(p.CLOSE);
    };
}
var myp5Face = new p5(faces, 'faceCanvas');
