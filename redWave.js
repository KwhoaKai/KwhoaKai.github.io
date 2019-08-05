

// red wave
var red = function(p) {
    var xspacing = 2; // How far apart should each ellipse be
    var h; // Width of entire wave
    var theta = 0.0; // Start angle at 0
    var amplitude = 70.0; // Height of wave
    var period = 90.0; // How many pixels before the wave repeats
    var dy; // Value for incrementing X, a function of period and xspacing
    var r;
    var g;
    var b;
    var endG;
    var endB;

    p.setup = function() {
        p.createCanvas($('#waveCanvas').width(), $('#waveCanvas').width()/1.7777);
        h = Math.floor(p.height * 0.8);
        dy = (p.TWO_PI / period) * xspacing;
        xvalues = new Array(h / xspacing);
        console.log(xvalues.length);
    };

    p.draw = function() {
        p.colorMode(p.RGB, 100)
        p.background(0, 0, 0);
        calcWave();
        renderWave();
    };

    function calcWave() {
        // Increment theta (try different values for 'angular velocity' here
        theta += 0.02;

        // For every y value, calculate a x value with sine function
        var x = theta;
        for (i = 0; i < xvalues.length; i++) {
            xvalues[i] = p.sin(x) * amplitude;
            x += dy;
        }
    }

    function renderWave() {
        p.noStroke();
        p.colorMode(p.RGB, 100);
        //  float numIncr = 170 / xvalues.length;
        var incr = (255 - 170) / xvalues.length;
        // A simple way to draw the wave with an ellipse at each location
        // Start at white, move to pink: fill(255, 85, 85)
        for (x = 0; x < xvalues.length; x++) {
            p.fill(255, x*0.4+20, x*0.4+20);
            p.ellipse(p.width / 2 + xvalues[x], x * xspacing, $('#waveCanvas').width()/5, $('#waveCanvas').width()/5);
        }
    }
}
var myp5 = new p5(red, 'waveCanvas');
