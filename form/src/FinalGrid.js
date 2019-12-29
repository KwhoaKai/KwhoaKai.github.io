// Display the final composite grid created by the users
export default function FinalGrid(p) {
  let ratio, finalH, finalW, finalFade, time, start, fadeImg, fadeText;

  this.setup = function() {
    start = false;
    time = 0;
    finalFade = 255;
    fadeImg = 0;
    fadeText = 0;
    ratio = 0.76;
    finalH = p.height * ratio;
    finalW = finalH;
    p.imageMode(p.CENTER);
    p.textAlign(p.CENTER);
    p.textSize(p.width / 35);
    p.rectMode(p.CENTER);
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
          "Click anywhere to save!",
          p.width / 2 + finalW / 2 + 10,
          p.height * 0.2,
          p.height / 2 + finalH / 2,
          p.width * 0.8
        );
        p.pop();

        p.pop();
      }

      p.push();
      p.noStroke();
      fadeText = p.lerp(fadeText, finalFade, 0.05);
      p.fill(0, 0, 0, fadeText);
      p.translate(p.width / 2, p.height * 0.9);
      p.text("Here's what you came up with. Nice job!", 0, 0);
      p.pop();
    }

    if (time > 50) {
      start = true;
    }
    time++;
  };

  this.mousePressed = function() {
    if (start) {
      p.save(p.finalGrid, "LetterformGrid");
    }
  };
}
