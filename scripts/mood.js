import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

// Firebase configuration
let firebaseConfig = {
  apiKey: 'AIzaSyDy0Igdoa7RuLQPX8K_dBFrDGjJuJpaFK4',
  authDomain: 'website-files-8acf3.firebaseapp.com',
  databaseURL: 'https://website-files-8acf3.firebaseio.com',
  projectId: 'website-files-8acf3',
  storageBucket: 'gs://website-files-8acf3.appspot.com',
  messagingSenderId: '619436936972',
  appId: '1:619436936972:web:6a77d0a5ea9971c8de4329',
  measurementId: 'G-9TCCP8F89F',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.performance();
let storage = firebase.storage();
let ref = storage.ref();
let imgsRef = ref.child('/images');

let title = window.innerWidth < 500 ? "mood" : "A STREAM OF AESTHETIC CONSCIOUSNESS";
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
  let canvas = document.querySelector('#c');
  for (let i = 0; i < 5; i++) {
    let p = document.createElement("cite");
    p.innerHTML = reptext;
    p.classList.add("abspos");
    p.style.transform = (`translate(${30}px, ${yoff * i + ystart}px)`);
    p.contentEditable = 'true';
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
    console.log(error, 'Error listing image urls in directory');
  });

function main(paths) {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth * .8, window.innerHeight, false);

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
  camera.position.set(0, 4, 4)
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF);

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
  const planegeom = new THREE.PlaneBufferGeometry(
    planeW, planeH,
    segmentW, segmentH);

  let touched = false;
  const lerp = (x, y, a) => x * (1 - a) + y * a;
  let dir = () => Math.random() <= 0.5 ? -1 : 1;

  // Instantiate new object textured by given image
  function makeInstance(geom, img, x, y) {
    //const loader = new THREE.TextureLoader();
    const texture = new THREE.TextureLoader().load(img);
    texture.anisotropy = renderer.getMaxAnisotropy();
    const imgmat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      map: texture,
    });

    const obj = new THREE.Mesh(geom, imgmat);
    scene.add(obj);
    let xoff = canvas.clientWidth > 400
      ? dir() * Math.random() * .6
      : 0;

    obj.position.x = x + xoff;
    obj.position.y = y;
    obj.rotYOffset = dir() * Math.random() * Math.PI / 6;
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
      //console.log(-(boxHeight * paths.length));
      if (camera.position.y < -(boxHeight * paths.length)) {
        newY = -(boxHeight * paths.length)
      } else if (camera.position.y > 6) {
        newY = 4;
      }
      camera.position.y = newY;
    }

    function panCamera(yMov) {
      camera.position.y = camera.position.y + (yMov * 0.01);
    }

    // Handle click and drag vertical panning
    canvas.onmousedown = function (event) {
      touched = true;
      accel = 0;
      prevTime = event.timeStamp;
      let startY = event.pageY;

      function onMouseMove(event) {
        const curY = event.pageY;
        accel = ((curY - startY) - diff) / (event.timeStamp - prevTime);
        //console.log(diff);
        prevTime = event.timeStamp;
        diff = curY - startY;
        startY = curY;
        panCamera(diff);
      }

      document.addEventListener('mousemove', onMouseMove);

      canvas.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        canvas.onmouseup = null;
        diff = 0;
        //console.log(accel);
        touched = false;
        resetCamera();
      };
    };

    // Handle click and drag vertical panning
    canvas.ontouchstart = function (event) {
      touched = true;
      accel = 0;
      let startY = event.touches[0].pageY;

      function onTouchMove(event) {
        const touch = event.touches[0] || event.changedTouches[0];
        const curY = touch.pageY;
        accel = ((curY - startY) - diff) / (event.timeStamp - prevTime);
        prevTime = event.timeStamp;
        diff = curY - startY;
        startY = curY;
        panCamera(diff);
      }

      document.addEventListener('touchmove', onTouchMove);

      canvas.ontouchend = function () {
        document.removeEventListener('touchmove', onTouchMove);
        canvas.ontouchend = null;
        resetCamera();
        touched = false;
      };
    };

    let handleWheel = function (event) {
      // console.log(event);
      camera.position.y = camera.position.y + (event.deltaY * -0.01);
      resetCamera();
    }

    document.addEventListener('wheel', handleWheel);
  }
  setupScroll();

  const xpad = boxWidth * 1.1;
  const xoffset = 1 * boxWidth;
  const ypad = boxHeight * 1.1;
  const yoffset = 1.5 * boxHeight;

  // Render images in vertical column
  for (let i = 0; i < paths.length; i++) {
    if (i > paths.length) { break; }
    const path = paths[i];
    const xloc = 0;
    const yloc = i * ypad - yoffset;
    makeInstance(boxgeom, path, xloc, -yloc);
  }

  // Update and rerender
  function render(time) {
    time *= 0.001;  // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    shapes.forEach((shape, i) => {
      const speed = 0.05;
      const rot = shape.rotYOffset;

      //shape.rotation.x = rot;
      shape.rotation.y = rot;
    });

    if (camera.position.y > -(boxHeight * paths.length)) {
      camera.position.y -= 0.0008;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  canvas.classList.add("fadeIn");
}
