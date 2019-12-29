
// Expands from from a line into full canvas height.
// BG and Stroke are set in constructor.
// Has getter method for if finished expanding.
export default class Bar {
  constructor(p, bgCol, strokeCol) {
    this.strokeCol = strokeCol;
    this.bgCol = bgCol;
    this.canvas = p;
    this.init = -1;
    this.h = this.canvas.height / 10;
    this.finalH = this.canvas.height;
    this.fade = 150;
    this.finalFade = 0;
    this.initiate = false;
    console.log(this.finalH);
  }

  grow() {
    if (this.init == -1) this.init = 0;
  }

  initiateFade() {
    this.initiate = true;
  }

  display() {
    this.fade = this.initiate
      ? this.canvas.lerp(this.fade, this.finalFade, 0.2)
      : this.fade;

    this.h =
      this.init == -1
        ? this.canvas.height / 9
        : this.init == 0
        ? this.canvas.lerp(this.h, this.finalH, 0.25)
        : this.finalH;

    this.canvas.push();
    this.canvas.rectMode(this.canvas.CENTER);
    this.canvas.fill(...this.bgCol);
    this.canvas.strokeWeight(1);
    this.canvas.stroke(...this.strokeCol);
    this.canvas.rect(
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width,
      this.h
    );
    if (this.init == 0 && this.finalH % this.h < 0.05) {
      this.init = 1;
    }
    this.canvas.pop();
  }
}
