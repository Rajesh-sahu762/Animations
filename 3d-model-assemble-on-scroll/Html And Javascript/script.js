import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

gsap.registerPlugin(ScrollTrigger);



// =========================================
// CANVAS
// =========================================

const canvas =
document.querySelector(".webgl");



// =========================================
// SCENE
// =========================================

const scene = new THREE.Scene();

scene.background =
new THREE.Color(0x000000);



// =========================================
// CAMERA
// =========================================

const camera =
new THREE.PerspectiveCamera(

  75,

  window.innerWidth /
  window.innerHeight,

  0.1,

  1000

);

scene.add(camera);



// =========================================
// RENDERER
// =========================================

const renderer =
new THREE.WebGLRenderer({

  canvas,

  antialias:true,

  alpha:true

});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio,2)
);



// =========================================
// LIGHTS
// =========================================

const ambientLight =
new THREE.AmbientLight(
  0xffffff,
  1
);

scene.add(ambientLight);



const dirLight =
new THREE.DirectionalLight(
  0xffffff,
  2
);

dirLight.position.set(5,5,5);

scene.add(dirLight);



// =========================================
// LOADER
// =========================================

const loader =
new GLTFLoader();

loader.load(

  "./cameraModel.glb",

  (gltf)=>{

    // =========================================
    // MODEL
    // =========================================

    const model = gltf.scene;

    scene.add(model);

    // =========================================
    // RESPONSIVE MODEL FUNCTION
    // =========================================

    const setResponsiveModel = ()=>{

      // MOBILE
      if(window.innerWidth < 768){

        model.scale.set(
          0.55,
          0.55,
          0.55
        );

        model.position.set(
          0,
          -0.3,
          0
        );

        camera.position.set(
          0,
          0.3,
          9
        );

      }

      // TABLET
      else if(window.innerWidth < 1024){

        model.scale.set(
          0.75,
          0.75,
          0.75
        );

        model.position.set(
          -1,
          -0.1,
          0
        );

        camera.position.set(
          0,
          0.6,
          7
        );

      }

      // DESKTOP
      else{

        model.scale.set(
          1,
          1,
          1
        );

        model.position.set(
          -2,
          0,
          0
        );

        camera.position.set(
          0,
          1,
          6
        );

      }

    };

    // INITIAL CALL
    setResponsiveModel();




    // =========================================
    // HIDE OBJECT
    // =========================================

    const object6 =
    model.getObjectByName("Object_6");

    if(object6){

      object6.visible = false;

    }




    // =========================================
    // PARTS
    // =========================================

    const parts = [];

    model.traverse((child)=>{

      if(
        child.isMesh &&
        parts.length < 40
      ){

        parts.push(child);

      }

    });




    // =========================================
    // SAVE ORIGINALS
    // =========================================

    parts.forEach((part)=>{

      part.userData.originalPosition = {

        x:part.position.x,

        y:part.position.y,

        z:part.position.z

      };



      part.userData.originalRotation = {

        x:part.rotation.x,

        y:part.rotation.y,

        z:part.rotation.z

      };

    });




    // =========================================
    // SCATTER
    // =========================================

    parts.forEach((part)=>{

      part.position.x =
      (Math.random() - 0.5) * 10;

      part.position.y =
      (Math.random() - 0.5) * 10;

      part.position.z =
      (Math.random() - 0.5) * 10;



      part.rotation.x =
      Math.random() * Math.PI * 2;

      part.rotation.y =
      Math.random() * Math.PI * 2;

      part.rotation.z =
      Math.random() * Math.PI * 2;

    });




    // =========================================
    // PANELS
    // =========================================

    const panels =
    gsap.utils.toArray(".panel");




    // =========================================
    // MASTER TIMELINE
    // =========================================

    const tl =
    gsap.timeline({

      scrollTrigger:{

        trigger:".horizontal-section",

        start:"top top",

        end:"+=4000",

        scrub:1,

        pin:true,

        anticipatePin:1

      }

    });




    // =========================================
    // HORIZONTAL SCROLL
    // =========================================

    tl.to(".horizontal-wrapper",{

      xPercent:
      -100 * (panels.length - 1),

      ease:"none",

      duration:4

    },0);




    // =========================================
    // ASSEMBLE
    // =========================================

    parts.forEach((part,index)=>{

      // POSITION

      tl.to(part.position,{

        x:
        part.userData
        .originalPosition.x,

        y:
        part.userData
        .originalPosition.y,

        z:
        part.userData
        .originalPosition.z,

        duration:1,

        ease:"power3.out"

      }, index * 0.05);




      // ROTATION

      tl.to(part.rotation,{

        x:
        part.userData
        .originalRotation.x,

        y:
        part.userData
        .originalRotation.y,

        z:
        part.userData
        .originalRotation.z,

        duration:1,

        ease:"power3.out"

      }, index * 0.05);

    });




    // =========================================
    // CAMERA ZOOM
    // =========================================

    tl.to(camera.position,{

      z:
      window.innerWidth < 768
      ? 6.5
      : 4,

      duration:2,

      ease:"none"

    },0);




    // =========================================
    // MODEL ROTATION
    // =========================================

    tl.to(model.rotation,{

      y:Math.PI * 2,

      duration:3,

      ease:"none"

    },1);




    // =========================================
    // REFRESH
    // =========================================

    ScrollTrigger.refresh();




    // =========================================
    // RESIZE
    // =========================================

    window.addEventListener(
      "resize",
      ()=>{

        camera.aspect =
        window.innerWidth /
        window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
          window.innerWidth,
          window.innerHeight
        );

        // RESPONSIVE MODEL
        setResponsiveModel();

        ScrollTrigger.refresh();

      }
    );

  }

);




// =========================================
// ANIMATION LOOP
// =========================================

function animate(){

  requestAnimationFrame(animate);

  renderer.render(scene,camera);

}

animate();