// Explanatinon of form and counterform in typography
export default function Compose(p) {
  let squareWidth = 0.9 * p.height;
  let alph = "abcdefghijklmnopqrstuvwxyz".split("");
  let char = alph[Math.floor(Math.random() * 26)];
  let xpos,
    ypos,
    mainSize,
    sizeSlider,
    startMX,
    startMY,
    rot,
    biggerButt,
    smallerButt,
    input,
    centerButt,
    submitButt,
    imgCt,
    submittedImgs,
    fadeout,
    fade,
    finalFade,
    popup,
    borderSize,
    pg;

  this.setup = function() {
    popup = new Popup();
    fade = 0;
    finalFade = 255;
    fadeout = false;
    imgCt = 0;
    submittedImgs = [];
    p.basker = p.loadFont("./OpenBaskerville.otf");
    p.rectMode(p.RADIUS);
    pg = p.createGraphics(squareWidth, squareWidth);
    xpos = pg.width / 2;
    ypos = pg.height / 1.5;
    mainSize = pg.width * 0.9;
    pg.textAlign(pg.CENTER);
    pg.angleMode(pg.DEGREES);
    rot = 0;
    biggerButt = new Button(
      "BIGGER",
      (p.width - pg.width) / 4,
      p.height * 0.2,
      false,
      null
    );
    smallerButt = new Button(
      "smaller",
      (p.width - pg.width) / 4,
      p.height * 0.8,
      false,
      null
    );
    submitButt = new Button(
      "submit",
      p.width * 0.85,
      p.height * 0.9,
      true,
      this.handleSubmit
    );
    sizeSlider = p.createSlider(0, 3000, mainSize);
    sizeSlider.size(p.height * 0.4);
    sizeSlider.style("transform: rotate(-90deg)");
    sizeSlider.position(p.width * 0.02, p.height * 0.45);
    input = p.createInput(char);
    input.position(p.width * 0.88, p.height * 0.23);
    input.size(p.width * 0.03);
    input.input(this.updateChar);
    centerButt = p.createButton("center");
    centerButt.position(p.width * 0.88, p.height * 0.5);
    centerButt.mousePressed(this.recenterLetter);
    borderSize = squareWidth / 2;
  };

  this.draw = function() {
    p.background(255);
    if (imgCt > 0 && imgCt < 4) {
      popup.display();
    }

    if (fadeout) {
      p.push();
      p.noStroke();
      fade = p.lerp(fade, finalFade, 0.05);
      p.fill(0, 0, 0, fade);
      p.rectMode(p.CORNER);
      p.rect(0, 0, p.width, p.height);
      p.pop();

      if (finalFade - fade < 0.5) {
        this.sceneManager.showNextScene();
      }
    }

    mainSize = sizeSlider.value();
    p.strokeWeight(2);
    p.stroke(0);

    borderSize = p.lerp(borderSize, squareWidth / 2, 0.05);
    p.push();
    p.stroke(0);
    p.noFill();
    p.strokeWeight(1);
    p.rect(p.width / 2, p.height / 2, borderSize, borderSize);
    p.pop();

    pg.background(255);
    // Main center letter
    pg.push();
    pg.fill(0);
    pg.textFont(p.basker);

    pg.translate(xpos, ypos);
    pg.rotate(rot);
    pg.textSize(mainSize);
    pg.text(input.value(), 0, (mainSize * 0.69) / 5);
    pg.pop();

    p.imageMode(p.CORNER);
    p.image(pg, (p.width - squareWidth) / 2, (p.height - squareWidth) / 2);
    biggerButt.display(p.mouseX, p.mouseY);
    smallerButt.display(p.mouseX, p.mouseY);
    submitButt.display(p.mouseX, p.mouseY);

    p.push();
    p.textAlign(p.CENTER);
    p.textFont("georgia");
    p.textSize(p.width * 0.05);
    p.noStroke();
    p.fill(0);
    p.text("character", p.width * 0.8, p.height * 0.25);
    p.pop();
  };

  this.inGraphics = function() {
    let withinX =
      p.mouseX < p.width - (p.width - squareWidth) / 2 &&
      p.mouseX > (p.width - squareWidth) / 2;
    let withinY =
      p.mouseY < p.height - (p.height - squareWidth) / 2 &&
      p.mouseY > (p.height - squareWidth) / 2;

    return withinX && withinY;
  };

  this.mouseDragged = function() {
    if (this.inGraphics()) {
      xpos += p.mouseX - startMX;
      ypos += p.mouseY - startMY;
      startMX = p.mouseX;
      startMY = p.mouseY;
    }
  };

  this.mousePressed = function() {
    startMX = p.mouseX;
    startMY = p.mouseY;
    submitButt.clicked();
  };

  // Changes character in textbox, maintains string length of 1
  this.updateChar = e => {
    input.value(e.data);
  };

  this.recenterLetter = () => {
    xpos = pg.width / 2;
    ypos = pg.height / 1.5;
  };

  this.handleSubmit = () => {
    let w = Math.floor(pg.width);
    let h = Math.floor(pg.height);
    let img = p.createImage(w, h);
    pg.push();
    pg.stroke(0);
    pg.noFill();
    pg.strokeWeight(3);
    pg.rectMode(p.CORNER);
    pg.rect(0, 0, pg.width, pg.height);
    pg.pop();
    img.copy(pg, 0, 0, w, h, 0, 0, w, h);
    submittedImgs.push(img);
    // input.value(alph[Math.floor(Math.random() * 26)]);

    // Transition to next scene after 4 submissions
    if (imgCt == 3) {
      sizeSlider.hide();
      input.hide();
      centerButt.hide();
      fadeout = true;
      this.buildGrid();
      this.sceneManager.showNextScene();
    } else {
      imgCt++;
    }
    borderSize = squareWidth * 0.56;
    popup = new Popup();
  };

  // Combine saved user images into composite grid
  this.buildGrid = () => {
    let block = squareWidth / 13;
    let horGap = block * 2;
    let vertGap = horGap * 2;
    let padding = block * 3;
    let gridWidth = Math.floor(squareWidth * 2 + horGap + padding * 2);
    let gridHeight = Math.floor(squareWidth * 2 + vertGap + padding * 2);
    let grid = p.createImage(gridWidth, gridHeight);

    // White background
    grid.loadPixels();
    for (let i = 0; i < grid.width; i++) {
      for (let j = 0; j < grid.height; j++) {
        grid.set(i, j, p.color(255, 255, 255));
      }
    }
    grid.updatePixels();

    let one, two, three, four;
    [one, two, three, four] = [
      submittedImgs[0],
      submittedImgs[1],
      submittedImgs[2],
      submittedImgs[3]
    ];
    grid.copy(
      one,
      0,
      0,
      one.height,
      one.width,
      padding,
      padding,
      squareWidth,
      squareWidth
    );
    grid.copy(
      two,
      0,
      0,
      two.height,
      two.width,
      padding + horGap + squareWidth,
      padding,
      squareWidth,
      squareWidth
    );
    grid.copy(
      three,
      0,
      0,
      three.height,
      three.width,
      padding,
      padding + vertGap + squareWidth,
      squareWidth,
      squareWidth
    );
    grid.copy(
      four,
      0,
      0,
      four.height,
      four.width,
      padding + horGap + squareWidth,
      padding + vertGap + squareWidth,
      squareWidth,
      squareWidth
    );
    p.finalGrid = grid;
  };

  class Button {
    constructor(text, xpos, ypos, hoverFade, callBack) {
      this.text = text;
      this.fontSize =
        text == "BIGGER"
          ? p.width / 20
          : text == "smaller"
          ? p.width / 30
          : p.width / 30;
      this.fade = 160;
      this.ypos = ypos;
      this.xpos = xpos;
      this.hoverFade = hoverFade;
      this.callBack = callBack;
    }

    // Returns if given coordinates are within the area of the textbox
    inContact(tx, ty) {
      p.textSize(this.fontSize);
      let h = p.textAscent();
      let descent = p.textDescent();
      let w = p.textWidth(this.text);
      let inX = tx >= this.xpos - w / 2 && tx <= this.xpos + w / 2;
      let inY = ty >= this.ypos - h && ty <= this.ypos + descent;
      return inY && inX;
    }

    // Submit button
    clicked() {
      if (
        this.callBack != null &&
        this.inContact(p.mouseX, p.mouseY) &&
        imgCt < 4
      ) {
        this.callBack();
      }
    }

    // Draws startButt
    display(tx, ty) {
      p.textFont("georgia");
      p.push();
      p.rectMode(p.CENTER);
      p.textAlign(p.CENTER);
      p.translate(this.xpos, this.ypos);

      if (this.hoverFade) {
        this.fade = this.inContact(tx, ty)
          ? (this.fade = p.lerp(this.fade, 170, 0.3))
          : (this.fade = p.lerp(this.fade, 255, 0.3));
      } else {
        this.fade = 255;
      }

      p.fill(0, 0, 0, this.fade);

      let newSize = p.map(sizeSlider.value(), 0, 2000, 0, 10);

      newSize =
        this.text == "BIGGER" ? newSize : this.text == "smaller" ? -newSize : 0;

      p.textSize(this.fontSize + newSize);
      p.noStroke();
      p.text(this.text, 0, 0);
      p.pop();
    }
  }

  // Message displayed on user submit
  class Popup {
    constructor() {
      this.submitMsg = Math.floor(Math.random() * 4);
      this.popMsgs = [
        "nice one",
        "very cool",
        "hmm, ok",
        "awesome",
        "Ah, I see"
      ];
      this.msg = this.popMsgs[this.submitMsg];
      this.fade = 255;
      this.finalFade = 0;
      this.ypos = p.height * 0.9;
      this.finalY = this.ypos * 0.9;
      this.xpos = p.width * 0.85;
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
}
