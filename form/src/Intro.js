/*
	Starting screen for Form. 
	On user click, animation plays, sends to FormInfo scene when done.
*/
export default function Intro(p) {
  let ring;
  let started;

  this.setup = function() {
    started = false;
    p.colorMode(p.RGB);
    this.chars = ["k", "g", "t", "v", "x", "i", "y", "s", "z", "b"];
    ring = new RevealRing();
    this.startButt = new StartButt(p.width / 2, p.height * 0.85, "ready?");
    p.textFont("Georgia");
    this.letPos = [];
    this.letSpeed = [];
    this.letCol = [];
    this.fade = 255;
    this.smallLetterFade = 130;
    // Set random starting points for flying letters.
    this.chars.forEach(char =>
      this.letPos.push([Math.random() * p.width, p.height - 10])
    );
    this.chars.forEach(char =>
      this.letSpeed.push(2 + Math.random() * p.height * 0.02)
    );
    this.chars.forEach(char =>
      this.letCol.push([
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      ])
    );

    this.startFade = false;
    this.wonderFinish = p.height * 0.75;
    this.wonderCur = p.height * 0.9;
    p.noStroke();
  };

  this.draw = function() {
    if (this.fade == 0) {
      this.sceneManager.showNextScene();
    } else {
      p.background(255);
      p.rectMode(p.CENTER);
      if (started) {
        p.push();
        p.textSize(p.width * 0.1);
        p.textAlign(p.CENTER);
        p.stroke(0);
        p.noStroke();

        this.fade = this.startFade ? (this.fade -= 5) : 255;
        this.smallLetterFade = this.startFade
          ? (this.smallLetterFade -= 5)
          : 130;

        // Stop linear interpolation if close enough
        if (this.wonderCur - this.wonderFinish < 0.5) {
          this.wonderCur = this.wonderFinish;
          this.startFade = true;
        } else {
          this.wonderCur = p.lerp(this.wonderCur, this.wonderFinish, 0.05);
        }
        p.translate(p.width / 2, this.wonderCur);
        p.fill(0, 0, 0, this.fade);
        p.text("wonderful", 0, 0);
        p.pop();

        // Animate floaters going up
        for (let i = 0; i < this.chars.length; i++) {
          p.push();
          p.textSize(p.width / 10);
          let fontHeight = 0.7 * p.textSize();
          let letter = this.chars[i];
          let fontWidth = p.textWidth(letter);

          p.fill(...this.letCol[i], this.smallLetterFade);
          p.translate(this.letPos[i][0], this.letPos[i][1]);
          p.rotate(this.letPos[i][1] * 0.01);
          p.text(letter, fontWidth / 2, fontHeight / 2);

          this.letPos[i][1] -= this.letSpeed[i];
          p.pop();
        }
      }
      ring.display();
      if (!started) {
        this.startButt.display(p.mouseX, p.mouseY);

        p.push();
        p.rectMode(p.CORNERS);
        p.fill(255, 255, 255, 160);
        p.noStroke();
        p.textSize(p.width * 0.04);
        p.textAlign(p.LEFT);
        p.pop();
      }
    }

    this.mousePressed = function(event) {
      if (this.startButt.inContact(p.mouseX, p.mouseY)) {
        ring.startExpand();
        started = true;
      }
      return false;
    };
  };

  // Reveals background on click
  class RevealRing {
    constructor() {
      this.rad = p.width * 0.7;
      this.expand = false;
      this.weight = p.width * 1.4;
    }

    // Ellipse at the button, stroke decreases on click to reveal layer
    display() {
      p.push();
      p.ellipseMode(p.RADIUS);
      p.stroke(0);
      p.noFill(0);
      p.strokeWeight(this.weight);
      p.ellipse(p.width * 0.5, p.height * 0.85, this.rad);
      // Handles reveal
      this.weight = this.expand ? p.lerp(this.weight, 1, 0.09) : this.weight;
      p.pop();
    }

    // starts expansion
    startExpand() {
      this.expand = true;
    }
  }

  // Start button
  class StartButt {
    constructor(x, y, text) {
      this.xpos = x;
      this.ypos = y;
      this.font = "Georgia";
      this.fade = 160;
      this.text = text;
      this.fontSize = p.width * 0.07;
    }

    // Returns if given coordinates are within the area of the textbox
    inContact(tx, ty) {
      p.textSize(this.fontSize);
      let h = p.textAscent();
      let descent = p.textDescent();
      let w = p.textWidth(this.text);
      let inX = tx >= this.xpos - w / 2 && tx <= this.xpos + w / 2;
      let inY = ty >= this.ypos - h && ty <= this.ypos + descent;
      return inX && inY;
    }

    // Draws startBut
    display(tx, ty) {
      p.push();
      p.rectMode(p.CENTER);
      p.textAlign(p.CENTER);
      p.translate(this.xpos, this.ypos);

      this.fade = this.inContact(tx, ty)
        ? (this.fade = p.lerp(this.fade, 255, 0.3))
        : (this.fade = p.lerp(this.fade, 120, 0.3));

      p.fill(255, 255, 255, this.fade);
      p.textSize(this.fontSize);
      p.noStroke();
      p.textFont(this.font);
      p.text(this.text, 0, 0);
      p.pop();
    }
  }
}
