const letters = function(p) {
    const parent = document.getElementById("sketch");
    let popBox;
    let infoUp;
    let transMap;
    let bar;
    let letter;
    let cursor;
    let basker;
    let bigLetter;
    let smalls;
    let floaters;
    let locked;
    let noHover;
    let barGrew;
    let retMap;
    let infoMap;
    let quoteMap;
    let tip;
    let randIdx;
    let needBlink;

    p.preload = function() {
        p.basker = p.loadFont("./OpenBaskerville.otf");
        p.floaters = [];
        p.smalls = ["k", "g", "t", "v", "x", "i", "y"];
        p.locked = false;
        p.noHover = false;
        p.barGrew = false;
        p.infoUp = false;
        p.needBlink = true;
    }

    p.setup = function() {
        p.randIdx = Math.floor(Math.random() * 6);
        console.log(p.randIdx);
        p.angleMode(p.DEGREES);
        p.createCanvas(parent.offsetWidth, parent.offsetWidth / 2);
        p.textFont(p.basker);

        p.transMap = {
            // [[Info Letter], [Floater]]
            k: [
                [p.width / 17, p.height / 30],
                [p.width / 45, p.width / 10]
            ],
            g: [
                [p.width / 23, -p.height / 11],
                [p.width / 45, p.width / 12]
            ],
            t: [
                [p.width / 23, 0],
                [p.width / 45, p.width / 10.5]
            ],
            v: [
                [p.width / 23, 0],
                [p.width / 45, p.width / 10.5]
            ],
            x: [
                [p.width / 23, -p.height / 50],
                [p.width / 45, p.width / 10.5]
            ],
            i: [
                [p.width / 23, p.height / 50],
                [p.width / 45, p.width / 9]
            ],
            y: [
                [p.width / 23, -p.height / 20],
                [p.width / 45, p.width / 12]
            ]
        }

        p.retMap = {
            k: [
                [p.width * 0.48, p.height * 0.3],
                [p.width * 0.54, p.height * 0.6]
            ],
            g: [
                [p.width * 0.56, p.height * 0.32],
                [p.width * 0.5, p.height * 0.6]
            ],
            t: [
                [p.width * 0.51, p.height * 0.4]
            ],
            v: [
                [p.width * 0.5, p.height * 0.63]
            ],
            x: [
                [p.width * 0.503, p.height * 0.408]
            ],
            i: [
                [p.width * 0.505, p.height * 0.66]
            ],
            y: [
                [p.width * 0.47, p.height * 0.7]
            ]
        }


        p.infoMap = {
            k: {
                term: ["Ascender", "Leg"],
                info: ["The portion of the stem that projects above the median.", "Short strokes off the stem of the letterform, inclined downward."]
            },
            g: {
                term: ["Ear", "Loop"],
                info: ["The stroke extending out from the main body of the letterform.", "The bowl created in the descender of the lowercase g."]
            },
            t: {
                term: ["Cross Stroke"],
                info: ["The horizontal stroke in a letterform that intersects the stem."]
            },
            v: {
                term: ["Apex"],
                info: ["The point created by joining two diagonal stems."]
            },
            x: {
                term: ["Crotch"],
                info: ["The interior space where two strokes meet."]
            },
            i: {
                term: ["Bracket"],
                info: ["The transition between the serif and the stem."]
            },
            y: {
                term: ["Finial"],
                info: ["The rounded non-serif terminal to a stroke."]
            }
        }

        p.quoteMap = {
            k: '"k, whatever."',
            g: '"g wiz, nice to meet you!"',
            t: '"my favorite drink is t."',
            v: '"know any puns starting with v?"',
            x: '"xiting things are happening!"',
            i: '"i on the prize."',
            y: '"y don' + "'" + 't you stay the night? ;)"'
        }

        p.tip = new Tips(p.width * .015, p.height * .525, "Click to get started...");
        p.bar = new Bar();
        p.cursor = new Cursor(5, p.height / 2, p.height / 11);
        p.smalls.forEach((key) => p.floaters.push(new Letter(key)));
    }

    p.draw = function() {
        p.noStroke();
        p.background(255, 255, 255);
        p.cursor.display();
        p.floaters.forEach((letter) => letter.display(p.mouseX, p.mouseY));
        p.floaters.forEach(function(letter, i) {
            if(i == p.randIdx && p.needBlink) letter.startBlink();
        });
        if(p.infoUp) {
            p.popBox.display();
            p.bigLetter.display();
        }
        p.bar.display();
        p.textSize(30);
        p.rectMode(p.CORNERS);
        p.tip.display();
    }

    p.mousePressed = function(event) {
        if (event.path[1].id == "sketch") {
            if (!p.barGrew) {
                p.bar.grow();
                p.tip.fadeTo(0);
            } else if (p.infoUp) {
                p.infoUp = false;
            } else {
                p.tip.fadeTo(0);
                p.needBlink = false;
                p.floaters[p.randIdx].stopBlink();
            }
        }
    }

    p.touchStarted = function(event) {
        p.mousePressed();
    }

    p.mouseDragged = function(event) {
        if (event.path[1].id == "sketch" && p.barGrew) {
            if(this.needBlink) {
                p.tip.fadeTo(0);
                p.needBlink = false;
                p.floaters[p.randIdx].stopBlink();
            }
            p.floaters.forEach((letter) => letter.dragged());
        }
    }

    p.mouseReleased = function(event) {
        p.floaters.forEach((letter) => letter.stopDrag());
    }

    // Bar that grows to height of div
    class Bar {
        constructor() {
            this.init = -1;
            this.h = p.height / 10;
            this.finalH = parent.offsetHeight * 0.98;
        }

        grow() {
            if (this.init == -1) this.init = 0;
            p.cursor.hideCurs();
            p.barGrew = true;
        }

        display() {
            this.h = this.init == -1 
                ? p.height / 9
                : this.init == 0 
                ? p.lerp(this.h, this.finalH, 0.25) 
                : this.finalH;

            p.push();
            p.rectMode(p.CENTER);
            p.noFill();
            p.stroke(0, 0, 0);
            p.rect(p.width / 2, p.height / 2, p.width, this.h);
            if (this.init == 0 && this.finalH % this.h < 0.05) {
                this.init = 1;
                p.floaters.forEach((floater) => floater.fadeIn());
                p.tip.changeTip("try shaking a letter...");
                p.tip.changeLoc(p.width * .33, p.height * .53);
                p.tip.fadeTo(230);
            }
            p.pop();
        }
    }


    class Tips {
        constructor(x, y, tip) {
            this.x = x;
            this.y = y;
            this.tip = tip;
            this.fade = 255;
            this.finalFade = 255;
        }

        changeTip(tip) {
            this.tip = tip;
        }

        fadeTo(finish) {
            this.finalFade = finish;
        }

        changeLoc(x, y) {
            this.x = x;
            this.y = y;
        }

        display() {
            this.fade = p.lerp(this.fade, this.finalFade, 0.3);
            p.push();
            if(p.barGrew && this.finalFade == 230) {
                p.stroke(150,150,150, this.fade);
            }
            p.fill(255,255,255, this.fade);
            p.rect(this.x*.97, this.y*1.05, p.width*.68, p.height*.45);
            
            p.textFont("Arial");
            p.noStroke();
            p.textSize(p.height * .07);
            if(p.barGrew && this.finalFade == 230) {
                p.fill(255, 165, 165, this.fade)
            } else {
                p.fill(150, 150, 150, this.fade);
            }
            
            p.text(this.tip, this.x, this.y);
            p.pop();
        }


    }
    // Small letter floating around
    class Letter {
        constructor(key) {
            this.key = key;
            this.fade = 0;
            this.finalFade = 255;
            this.startFade = false;
            this.finishedFade = false;
            this.rot = 360 * Math.random();
            this.transX = p.transMap[key][1][0];
            this.transY = p.transMap[key][1][1];
            this.rotDir = Math.random() > 0.5 ? 1 : -1;
            this.x = p.map(Math.random() * p.width, 0, p.width, p.width / 20, p.width - p.width / 10);
            this.y = p.map(Math.random() * p.height, 0, p.height, p.height / 20, p.height - p.height / 10);
            this.xDir = Math.random() > 0.5 ? 1 : -1;
            this.yDir = Math.random() > 0.5 ? 1 : -1;
            this.movX = p.cos(this.rot) * 0.2;
            this.movY = p.sin(this.rot) * 0.2;
            this.isHover = false;
            this.beingDragged = false;
            this.accel = 0;
            this.vel = 0;
            this.shakeThresh = 4;
            this.shakeCt = 0;
            this.retCoords = p.retMap[key];
            this.blink;
        }

        // Post-click fadein
        fadeIn() {
            this.startFade = true;
        }

        startBlink() {
            this.blink = true;
            console.log(this.key +" is blinking");
        }

        dragged() {
            let distM = Math.sqrt(Math.pow(this.x - p.mouseX, 2) + Math.pow(this.y - p.mouseY, 2));
            let col = distM <= p.width / 20 ? true : false;

            if (col && !p.locked) {
                this.beingDragged = true;
                p.locked = true;
            }
        }

        stopBlink() {
            this.blink = false;
        }

        stopDrag() {
            this.shakeCt = 0;
            if (this.beingDragged) {
                this.beingDragged = false;
                this.resetCoord(p.mouseX, p.mouseY);
                this.accel = 0;
                this.vel = 0;
                this.shakeCt = 0;
                console.log(this.x, this.y);
            }
            p.locked = false;
        }

        // New coords if out of sketch dimensions
        resetCoord(x, y) {
            this.x = x < 0 
                ? 1 
                : x > p.width 
                ? p.width - 1 
                : x;

            this.y = y > p.height * .97 
                ? p.height * .97 - 1 
                : y < 0 
                ? p.height * .03 + 1 
                : y;
        }

        display(mx, my) {
            // Detect shake and opacity
            let distM = Math.sqrt(Math.pow(this.x - mx, 2) + Math.pow(this.y - my, 2));
            let col = distM <= p.width / 20 ? true : false;

            if (this.beingDragged) {
                // Update acceleration
                this.accel = Math.abs(this.vel - distM);
                this.vel = distM;

                if (this.accel > p.width*.02) {
                    this.shakeCt++;
                    console.log("shaking");
                }

                // Call InfoLetter
                if (this.shakeThresh == this.shakeCt) {
                    this.activated = true;
                    this.shakeCt = 0;
                    p.infoUp = true;
                    p.popBox = new PopBox(this.x, this.y);
                    p.bigLetter = new InfoLetter(this.key, this.x, this.y, this.retCoords);
                    this.beingDragged = false;
                    this.resetCoord(this.x, this.y);
                }
            }

            if(this.startFade && !this.finishFade) {
                this.fade = this.finalFade - this.fade < 5
                    ? 255
                    : p.lerp(this.fade, this.finalFade, 0.1);

                    if(this.fade == 255) {
                        this.finishFade = true;
                    }

            } else if(this.finishFade && this.blink) {
                this.fade = p.lerp(this.fade, this.finalFade, 0.2);
                let diff = Math.abs(this.fade - this.finalFade) < 2;
                if(diff) {
                    this.finalFade = this.finalFade == 255
                        ? 140
                        : 255;
                }
            }

            // Handle hover
            if(col && this.startFade && (!p.noHover || this.isHover)) {
                this.fade = 160;
                this.isHover = true;
                p.noHover = true;
                console.log("hovering over " + this.key);
            } else if (!col && ((this.finishedFade && this.blink == false) || this.isHover)) {
               this.fade = 255;
                if (this.isHover) {
                    this.isHover = false;
                    p.noHover = false;
                }
            }

            // Draw letter
            this.x = this.beingDragged ? p.mouseX : this.x;
            this.y = this.beingDragged ? p.mouseY : this.y;

            if (this.x > p.width || this.x < 0) this.xDir *= -1;
            if (this.y > p.height * .97 || this.y < p.height * .03) this.yDir *= -1;

            p.push();
            p.rectMode(p.CENTER);
            p.noStroke();
            p.fill(0, 0, 0, this.fade);
            p.textSize(p.height * 0.3);
            p.translate(this.x, this.y);
            p.rotate(this.rot);
            p.textAlign(p.CENTER);
            p.text(this.key, this.transX, this.transY, p.width, p.height * 0.8);
            this.rot += this.rotDir * 0.5;
            if (!this.beingDragged) {
                this.x += this.movX * this.xDir;
                this.y += this.movY * this.yDir;
            }
            p.pop();
        }
    }

    // Big Letter with info + reticles
    class InfoLetter {
        constructor(key, x, y, retCoords) {
            this.key = key;
            this.fade = 0;
            this.finalFade = 110;
            this.fullFade = 255;
            this.fade2 = 0;
            this.x = x;
            this.y = y;
            this.transX = p.transMap[key][0][0];
            this.transY = p.transMap[key][0][1];
            this.centered = false;
            this.retCoords = retCoords;
            this.multRet = p.infoMap[this.key].term.length > 1;
            this.info = p.infoMap[this.key].info;
            this.terms = p.infoMap[this.key].term;
            this.lineFin = this.multRet ?
                [
                    [p.width * .65, p.height * .25],
                    [p.width * .65, p.height * .65]
                ] :
                [p.width * .65, p.height / 2];
        }

        reticle(x, y) {
            this.fade = p.lerp(this.fade, this.finalFade, 0.1);
            p.push();
            p.fill(255, 0, 0, this.fade);
            p.noStroke();
            p.ellipseMode(p.RADIUS);
            p.ellipse(x, y, p.height * 0.08);
            p.pop();
        }

        drawInfo() {
            this.fade2 = p.lerp(this.fade2, this.fullFade, .1);
            this.terms.forEach(function(term, i) {
                if (!this.multRet) {
                    let descrp = this.terms[i];
                    let info = this.info[i];

                    p.push();
                    p.fill(255, 0, 0, this.fade);
                    p.textSize(p.height * 0.1);
                    p.text(descrp, p.width * .68, p.height * 0.4);
                    p.fill(0, 0, 0, this.fade2);
                    p.textSize(p.height * .06);
                    p.rectMode(p.CORNER);
                    p.text(info, p.width * .68, p.height * .43, p.width * .3, p.height);
                    p.pop();
                } else {
                    let descrp = this.terms[i];
                    let info = this.info[i];
                    let yTitle = this.lineFin[i][1] - p.height * .05;
                    let yInfo = yTitle + p.height * .03;

                    p.push();
                    p.fill(255, 0, 0, this.fade);
                    p.textSize(p.height * 0.1);
                    p.text(descrp, p.width * .68, yTitle);
                    p.fill(0, 0, 0, this.fade2);
                    p.textSize(p.height * .06);
                    p.rectMode(p.CORNER);
                    p.text(info, p.width * .68, yInfo, p.width * .3, p.height);
                    p.pop();
                }
            }, this);
        }

        drawQuote() {
            let quote = p.quoteMap[this.key];

            /*
            p.rectMode(p.CORNERS);
            p.noStroke();
            p.fill(255,255,255);
            p.rect(p.width*.1, p.height*.25, p.width*.4, p.height*.42);
            */

            p.push();
            p.stroke(0, 0, 0, this.fade2);
            p.noFill();
            p.bezier(p.width * .25, p.height * .42, p.width * .2, p.height * .5, p.width * .35, p.height * .49, p.width * .42, p.height * .5);
            p.noStroke();
            p.textFont("Georgia");
            p.fill(0, 0, 0, this.fade2);
            p.textSize(p.height * .06);
            p.rectMode(p.CORNER);
            p.textAlign(p.CENTER);
            p.text(quote, p.width * .15, p.height * .25, p.width * .25, p.height);
            p.pop();
        }

        display() {
            if (this.centered) {
                p.push();
                p.stroke(255, 0, 0, this.fade);

                if (this.multRet) {
                    this.retCoords.forEach((coords, i) => p.line(coords[0], coords[1], this.lineFin[i][0], this.lineFin[i][1]), this);
                } else {
                    this.retCoords.forEach((coords) => p.line(coords[0], coords[1], p.width * .65, p.height / 2));
                }

                p.pop();

                p.push();
                p.fill(255, 255, 255);
                p.noStroke();
                p.ellipseMode(p.RADIUS);
                this.retCoords.forEach((coords) => p.ellipse(coords[0], coords[1], p.height * .08));
                p.pop();

                this.drawInfo();
                this.drawQuote();
            }

            if ((Math.abs(p.width / 2 - this.x) < 0.3) && Math.abs((p.height / 2 - this.y) < 0.3)) {
                this.centered = true;
            }

            p.push();
            this.y = p.lerp(this.y, p.height / 2, .2);
            this.x = p.lerp(this.x, p.width / 2, .2);
            p.rectMode(p.CENTER);
            p.noStroke();
            p.fill(0, 0, 0);
            p.textSize(p.height * 0.6);
            p.translate(this.x, this.y);
            p.textAlign(p.CENTER);
            p.text(this.key, this.transX, this.transY, p.width, p.height * 0.8);
            p.pop();

            if (this.centered) this.retCoords.forEach((coords) => this.reticle(coords[0], coords[1]));
        }
    }

    class Cursor {
        constructor(x, y, h) {
            this.x = x;
            this.y = y;
            this.h = h;
            this.hide = false;
            this.fade = 255;
            this.mult = -1;
        }

        grow() {
            if (this.init == -1) this.init = 0;
            p.cursor.hideCurs();
        }

        hideCurs() {
            this.hide = true;
        }

        display() {
            if (!this.hide) {
                p.push();
                p.noStroke();
                p.rectMode(p.CENTER);
                p.colorMode(p.RGB);
                p.fill(247, 0, 0, this.fade);
                p.rect(this.x, this.y, 3, p.height / 11);
                if (this.fade > 255) {
                    this.mult = -1;
                } else if (this.fade < 0) {
                    this.mult = 1;
                }
                this.fade = this.mult * 20 + this.fade;
                p.pop();
            }
        }
    }

    // Clear floaters for InfoLetter view 
    class PopBox {
        constructor(mx, my) {
            this.mx = (mx >= 0 && mx < p.width) 
            	? mx 
                : mx < 0 
                ? 0 :
                p.width;
            this.my = (my >= 0 && my < p.height) 
                ? my 
                : my < 0 
                ? 0 
                : p.height;
            this.rad = 0;
            this.finalRad = p.width * 1.3;
            this.fill = 0;
            this.finalFill = 255;
        }

        display() {
            this.rad = this.finalRad - this.rad < .05 
                ? p.width 
                : p.lerp(this.rad, this.finalRad, .1);

            this.fill = this.finalFill - this.fill < .05 
                ? this.finalFill 
                : p.lerp(this.fill, this.finalFill, .1);

            p.push();
            p.fill(255, this.fill, this.fill);
            p.noStroke();
            p.ellipseMode(p.RADIUS);
            p.ellipse(this.mx, this.my, this.rad);
            p.pop();
        }
    }
}

const letterp5 = new p5(letters, "sketch");