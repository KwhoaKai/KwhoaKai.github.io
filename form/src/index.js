import Intro from "./Intro.js";
import SceneManager from "./scenemanager.js";
import FormInfo from "./FormInfo.js";
import Compose from "./Compose.js";
import FinalGrid from "./FinalGrid.js";

// Final sketch with all scenes
const sketch = function(p) {
  const parent = document.getElementById("sketchDiv");
  let mgr;

  p.setup = function() {
    p.createCanvas(parent.offsetWidth, parent.offsetWidth / 1.9);
    mgr = new SceneManager(p);
    mgr.wire();
    mgr.addScene(Intro);
    mgr.addScene(FormInfo);
    mgr.addScene(Compose);
    mgr.addScene(FinalGrid);
    mgr.showScene(Intro);
  };
};
const liveSketch = new p5(sketch, "sketchDiv");
