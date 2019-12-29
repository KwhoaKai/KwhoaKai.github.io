// Circular popup that spans the canvas
export default class PopBox {
  constructor(mx, my, p) {
    this.canvas = p;
    this.mx = mx >= 0 && mx < p.width ? mx : mx < 0 ? 0 : p.width;
    this.my = my >= 0 && my < p.height ? my : my < 0 ? 0 : p.height;
    this.rad = 0;
    this.finalRad = p.width * 1.3;
    this.fill = 0;
    this.finalFill = 255;
    this.needsDisplay = true;
  }

  display() {
    if (this.finalFill - this.fill < 0.5) {
      this.changeDisplay(false);
    }
    this.rad =
      this.finalRad - this.rad < 0.05
        ? this.canvas.width
        : this.canvas.lerp(this.rad, this.finalRad, 0.1);

    this.fill =
      this.finalFill - this.fill < 0.05
        ? this.finalFill
        : this.canvas.lerp(this.fill, this.finalFill, 0.1);

    this.canvas.push();
    this.canvas.fill(255, this.fill, this.fill);
    this.canvas.noStroke();
    this.canvas.ellipseMode(this.canvas.RADIUS);
    this.canvas.ellipse(this.mx, this.my, this.rad);
    this.canvas.pop();
  }

  // boolean
  changeDisplay(state) {
    this.needsDisplay = state;
  }
}
