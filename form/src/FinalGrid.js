import Intro from "./Intro.js";
import SceneManager from "./scenemanager.js";
import FormInfo from "./FormInfo.js";
import Compose from "./Compose.js";
// Display the final composite grid created by the users
export default function FinalGrid(p) {
  let ratio,
    finalH,
    finalW,
    finalFade,
    time,
    start,
    fadeImg,
    fadeText,
    popup,
    replayButt;

  this.setup = function() {
    start = false;
    time = 0;
    finalFade = 255;
    fadeImg = 0;
    fadeText = 0;
    ratio = 0.76;
    finalH = p.height * ratio;
    finalW = finalH;
    popup = null;
    p.imageMode(p.CENTER);
    p.textAlign(p.CENTER);
    p.textSize(p.width / 35);
    p.rectMode(p.CENTER);
    replayButt = new StartButt(p.width * 0.9, p.height * 0.9, "replay?");
  };

  this.draw = function() {
    p.background(255);
    if (start) {
      if (time > 100) {
        p.stroke(0);
        p.noFill();
        p.strokeWeight(1);
        p.rect(p.width / 2, p.height * 0.45, finalW, finalH);
        p.push();
        fadeImg = p.lerp(fadeImg, finalFade, 0.05);
        p.tint(255, fadeImg);
        p.image(p.finalGrid, p.width / 2, p.height * 0.45, finalW, finalH);

        p.push();
        p.noStroke();
        p.textAlign(p.LEFT);
        p.rectMode(p.CORNERS);
        p.fill(0, 0, 0, fadeImg);
        p.textSize(p.width / 45);
        p.text(
          "Click your grid to save!",
          p.width / 2 + finalW / 2 + 10,
          p.height * 0.2,
          p.height / 2 + finalH / 2,
          p.width * 0.8
        );
        p.pop();

        p.pop();
        replayButt.display(p.mouseX, p.mouseY);
      }

      p.push();
      p.noStroke();
      fadeText = p.lerp(fadeText, finalFade, 0.05);
      p.fill(0, 0, 0, fadeText);
      p.translate(p.width / 2, p.height * 0.9);
      p.text("Here's what you came up with. Nice job!", 0, 0);
      p.pop();
      if (popup != null) {
        popup.display();
      }
    }

    if (time > 30) {
      start = true;
    }
    time++;
  };

  this.mouseClicked = function(event) {
    let inX =
      p.mouseX <= p.width / 2 + finalW / 2 &&
      p.mouseX >= p.width / 2 - finalW / 2;
    let inY =
      p.mouseY <= p.height / 2 + finalH / 2 &&
      p.mouseY >= p.height / 2 - finalH / 2;
    if (start && inY && inX) {
      popup = new Popup();
      p.save(p.finalGrid, "LetterformGrid");
    } else if (start && replayButt.inContact(p.mouseX, p.mouseY)) {
      this.sceneManager.scenes = [];
      this.sceneManager.wire();
      this.sceneManager.addScene(Intro);
      this.sceneManager.addScene(FormInfo);
      this.sceneManager.addScene(Compose);
      this.sceneManager.addScene(FinalGrid);
      this.sceneManager.showScene(Intro);
    }
  };

  // Message displayed on user submit
  class Popup {
    constructor() {
      this.msg = "Saving";
      this.fade = 255;
      this.finalFade = 0;
      this.ypos = p.height * 0.5;
      this.finalY = this.ypos * 0.9;
      this.xpos = p.width / 2 + finalW / 2 + p.width * 0.05;
    }

    display() {
      p.push();
      p.textAlign(p.CENTER);
      p.textSize(p.width / 40);
      this.fade = p.lerp(this.fade, this.finalFade, 0.05);
      this.ypos = p.lerp(this.ypos, this.finalY, 0.1);
      p.fill(0, 0, 0, this.fade);
      p.noStroke();
      p.text(this.msg, this.xpos, this.ypos);
      p.pop();
    }
  }

  class StartButt {
    constructor(x, y, text) {
      this.xpos = x;
      this.ypos = y;
      this.font = "Georgia";
      this.fade = 255;
      this.text = text;
      this.fontSize = p.width * 0.03;
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
        ? (this.fade = p.lerp(this.fade, 120, 0.3))
        : (this.fade = p.lerp(this.fade, fadeImg, 0.3));

      p.fill(0, 0, 0, this.fade);
      p.textSize(this.fontSize);
      p.noStroke();
      p.textFont(this.font);
      p.text(this.text, 0, 0);
      p.pop();
    }
  }
}
