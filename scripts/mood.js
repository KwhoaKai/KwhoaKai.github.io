import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js";

// Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyDy0Igdoa7RuLQPX8K_dBFrDGjJuJpaFK4",
  authDomain: "website-files-8acf3.firebaseapp.com",
  databaseURL: "https://website-files-8acf3.firebaseio.com",
  projectId: "website-files-8acf3",
  storageBucket: "gs://website-files-8acf3.appspot.com",
  messagingSenderId: "619436936972",
  appId: "1:619436936972:web:6a77d0a5ea9971c8de4329",
  measurementId: "G-9TCCP8F89F",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.performance();
let storage = firebase.storage();
let ref = storage.ref();
let imgsRef = ref.child("/images");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const phrases = [
  "not really sure why i'm here.",
  "how was your day?",
  "welcome to my moldboard.",
  "tired? i can tell.",
  "please buy me clothes...",
  `why are you...             ok`,
  "where are you? i can't see you...",
  '"mood board"  <- bleh',
  "i hope you like them.",
];
let phrase = phrases[getRandomInt(phrases.length - 1)];

let title = window.innerWidth < 500 ? "mood" : phrase;
document.getElementById("moodtitle").innerHTML = title;
let content = document.getElementById("content");

if (window.innerWidth > 500) {
  let reptext = "In this space you can walk without going back on your footsteps";
  let longtext = `The top left corner of the band of tracing paper is stapled onto the wall
                  The top right corner is stapled
                  Finally the middle
                  The staple is horizontal 
                  The other 48 too`;
  let yoff = 25;
  let ystart = 100;
  let canvas = document.querySelector("#c");
  for (let i = 0; i < 5; i++) {
    let p = document.createElement("cite");
    p.innerHTML = reptext;
    p.classList.add("abspos");
    p.style.transform = `translate(${30}px, ${yoff * i + ystart}px)`;
    p.contentEditable = "true";
    canvas.insertAdjacentElement("beforebegin", p);
  }
}

// Find all the prefixes and items.
imgsRef
  .listAll()
  .then((res) => {
    let urls = [];
    res.items.forEach((itemRef) => {
      let promise = itemRef.getDownloadURL().then((url) => url);
      urls.push(promise);
    });

    Promise.all(urls).then((paths) => main(paths));
  })
  .catch(function (error) {
    console.log(error, "Error listing image urls in directory");
  });

function main(paths) {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth * 0.8, window.innerHeight, false);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // Perspective camera details.
  // fov, aspect ratio, near/far clipping plane define frustrum
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 11;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 4, 4);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Hold all shapes in scene
  const shapes = [];

  const boxWidth = 3;
  const boxHeight = 3;
  const boxDepth = 0.01;
  const boxgeom = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const planeW = 1;
  const planeH = 1;
  const segmentW = 1;
  const segmentH = 1;
  const planegeom = new THREE.PlaneBufferGeometry(planeW, planeH, segmentW, segmentH);

  let touched = false;
  const lerp = (x, y, a) => x * (1 - a) + y * a;
  let dir = () => (Math.random() <= 0.5 ? -1 : 1);

  // Instantiate new geometry textured by given image
  function makeInstance(geom, img, x, y) {
    //const loader = new THREE.TextureLoader();
    const texture = new THREE.TextureLoader().load(img);
    texture.anisotropy = renderer.getMaxAnisotropy();
    const imgmat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
    });

    const obj = new THREE.Mesh(geom, imgmat);
    scene.add(obj);
    let xoff = canvas.clientWidth > 400 ? dir() * Math.random() * 0.6 : 0;

    obj.position.x = x + xoff;
    obj.position.y = y;
    obj.rotYOffsetTarget = (dir() * Math.random() * Math.PI) / 6;
    obj.scrollYMult = dir() * Math.random() * 2;
    shapes.push(obj);
    return obj;
  }

  let accel;
  let diff;
  let prevTime;

  // Setup vertical scrolling on click/drag and touch events
  function setupScroll() {
    function resetCamera() {
      let newY = camera.position.y;
      const yoffset = 1.5 * boxHeight;
      //console.log(-(boxHeight * paths.length));
      if (camera.position.y < -(boxHeight * (paths.length + 1.2))) {
        newY = -(boxHeight * (paths.length + 1.2));
      } else if (camera.position.y > yoffset) {
        newY = 4;
      }
      camera.position.y = newY;
    }

    function panCamera(yMov) {
      camera.position.y = camera.position.y + yMov * 0.01;
    }

    // Handle click and drag vertical panning
    document.onmousedown = function (event) {
      if (event.button == 0) {
        touched = true;
        accel = 0;
        prevTime = event.timeStamp;
        let startY = event.pageY;

        // Handle click on object in 3d scene
        function handleRaycasting() {
          // Raycasters
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();

          pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
          pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

          // update the picking ray with the camera and pointer position
          raycaster.setFromCamera(pointer, camera);

          // calculate objects intersecting the picking ray
          const intersects = raycaster.intersectObjects(scene.children);
          // console.log(intersects.length);
          for (let i = 0; i < intersects.length; i++) {
            // intersects[i].object.material.color.set(0xff0000);
            let obj = intersects[i].object;
            obj.rotYOffsetTarget = (dir() * Math.random() * Math.PI) / 6;
          }
        }
        handleRaycasting();

        function onMouseMove(event) {
          const curY = event.pageY;
          accel = (curY - startY - diff) / (event.timeStamp - prevTime);
          prevTime = event.timeStamp;
          diff = curY - startY;
          startY = curY;
          panCamera(diff);
        }

        window.addEventListener("mousemove", onMouseMove);
        // window.addEventListener("pointermove", onPointerMove);

        // Remove move listeners on mouseup
        window.onmouseup = function () {
          window.removeEventListener("mousemove", onMouseMove);
          // window.removeEventListener("pointermove", onPointerMove);
          canvas.onmouseup = null;
          diff = 0;
          touched = false;
          resetCamera();
        };
      }
    };

    // Handle click and drag vertical panning
    document.ontouchstart = function (event) {
      touched = true;
      accel = 0;
      let startY = event.touches[0].pageY;

      function onTouchMove(event) {
        const touch = event.touches[0] || event.changedTouches[0];
        const curY = touch.pageY;
        accel = (curY - startY - diff) / (event.timeStamp - prevTime);
        prevTime = event.timeStamp;
        diff = curY - startY;
        startY = curY;
        panCamera(diff);
      }

      document.addEventListener("touchmove", onTouchMove);

      window.ontouchend = function () {
        document.removeEventListener("touchmove", onTouchMove);
        canvas.ontouchend = null;
        resetCamera();
        touched = false;
      };
    };

    let handleWheel = function (event) {
      // console.log(event);
      camera.position.y = camera.position.y + event.deltaY * -0.01;
      resetCamera();
    };

    document.addEventListener("wheel", handleWheel);
  }

  function renderInColumn() {
    const xpad = boxWidth * 1.1;
    const xoffset = 1 * boxWidth;
    const ypad = boxHeight * 1.1;
    const yoffset = 1.5 * boxHeight;

    // Render images in vertical column
    for (let i = 0; i < paths.length; i++) {
      // if (i > paths.length) {
      //   break;
      // }
      const path = paths[i];
      const xloc = 0;
      const yloc = i * ypad - yoffset;
      makeInstance(boxgeom, path, xloc, -yloc);
    }
  }

  setupScroll();
  renderInColumn();

  // Update and rerender
  function render(time) {
    time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // Set and animate Y Rotation for images
    shapes.forEach((shape, i) => {
      const speed = 0.05;
      const curYRot = shape.rotation.y;
      const yRotTarget = shape.rotYOffsetTarget;

      // Lock to target if difference is small enough
      if (Math.abs(yRotTarget - curYRot) < 0.0000001) {
        shape.rotation.y = yRotTarget;
      } else {
        const newYRot = lerp(curYRot, yRotTarget, speed);
        shape.rotation.y = newYRot;
        // console.log(yRotTarget - curYRot);
      }
    });

    if (camera.position.y > -(boxHeight * (paths.length + 1.2))) {
      camera.position.y -= 0.0008;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  canvas.classList.add("fadeIn");
}
