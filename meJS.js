'use strict';

$(document).ready(function() {
    function main() {
      const canvas=document.querySelector("#c");
      const renderer=new THREE.WebGLRenderer({canvas});
      let firstUpdate = true;

      /*renderer.setSize(500, 500);
      const w = window.innerWidth;
      const h = window.innerHeight;

      let size = w / 2;

      renderer.setSize(size, size);
      */

      const fov=75;
      const aspect=1; // the canvas default
      const near=0.1; // Start of the frustrum
      const far=5; // End of the frustrum. Everything in the frustrum is rendered
      const camera=new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z=2;

      //Create a new scene
      let hue = Math.random();
      const saturation=1;
      const luminance=.83;
      let updatedColor=new THREE.Color();
      updatedColor.setHSL(hue, saturation, luminance);

      let rgb = updatedColor.getStyle().split(",");
      let r = rgb[0].split("(")[1];
      let g = rgb[1];
      let b = rgb[2].split(")")[0];

      $("#footer").css("background-color", updatedColor.getStyle());

      const scene=new THREE.Scene();
      scene.background = updatedColor;

      const boxWidth=1;
      const boxHeight=1;
      const boxDepth=1;
      const geometry=new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

      const material=new THREE.MeshBasicMaterial({
          color: 0x44aa88
      });
      //Mesh: Combo on geometry and material, as well as position, orientation, and object scale
      const cube = new THREE.Mesh(geometry, material);

      scene.add(cube);

      // Boolean to decide if needs resize 
      function resizeRendererToDisplaySize(renderer) {
          const canvas = renderer.domElement;
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          const w = window.innerWidth;
          const size = w / 3;     

          // Are desired canvas dimensions same as client dimensions?
          const needsResize = (canvas.width !== size && size <= 500) || firstUpdate;
          if(needsResize) {

            if(firstUpdate) {
              renderer.setSize(500,500, false);
              firstUpdate = false;

            }
            else {
              renderer.setSize(size,size, false);
            }
          }
          return needsResize;
      }

      canvas.addEventListener("mousedown", e => {
          console.log("canvas clicked");
          hue = Math.random();
          let updatedColor=new THREE.Color();
          updatedColor.setHSL(hue, saturation, luminance);
          scene.background=updatedColor;
          $("#footer").css("background-color", updatedColor.getStyle());
        }
      );

      function render(time) {
        // updates aspect ratio on resize 
        if(resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = 1;
            camera.updateProjectionMatrix();
        }
        time *= 0.001;
        cube.rotation.x=time;
        cube.rotation.y=time;

        // Render the updatedd scene using camera, request another animation frame
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }

      // requestAnimationFrame is called when browser view is updated
      requestAnimationFrame(render);
    }

    main();
  }
);