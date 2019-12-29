// Title screen
export default function FormInfo(p) {
  let time;
  let drawForm;

  this.setup = function() {
    time = 0;
    drawForm = false;
    p.background(255);
    p.textAlign(p.CENTER);
    p.textSize(p.width / 10);
    setTimeout(this.form, 1500);
    setTimeout(this.fadeOut, 4000);
  };

  this.draw = function() {
    p.background(255);
    if (drawForm) {
      time += 1;

      p.text("{ Form }", p.width / 2, p.height / 2);
    }
    if (time == 300) {
      this.sceneManager.showNextScene();
    }
  };

  this.fadeOut = function() {
    p.stroke(255);
    p.fill(255);
  };

  this.form = function() {
    p.stroke(0);
    p.fill(0);
    p.text("{ Form }", p.width / 2, p.height / 2);
    drawForm = true;
  };
}
