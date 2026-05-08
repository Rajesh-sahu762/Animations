import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



// =========================================
// GSAP PLUGIN
// =========================================

gsap.registerPlugin(ScrollTrigger);



// =========================================
// CANVAS
// =========================================

const canvas = document.querySelector(".webgl");



// =========================================
// SCENE
// =========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);



// =========================================
// CAMERA
// =========================================

const camera = new THREE.PerspectiveCamera(

  75,

  window.innerWidth / window.innerHeight,

  0.1,

  1000

);


// Camera position
camera.position.set(0, 1, 6);

scene.add(camera);



// =========================================
// RENDERER
// =========================================

const renderer = new THREE.WebGLRenderer({

  canvas,

  antialias:true,

  alpha:true

});


renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



// =========================================
// LIGHTS
// =========================================

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);

scene.add(ambientLight);


// Directional light
const dirLight = new THREE.DirectionalLight(0xffffff, 2);

dirLight.position.set(5, 5, 5);

scene.add(dirLight);



// =========================================
// MODEL LOADER
// =========================================

const loader = new GLTFLoader();

loader.load(

  "./cameraModel.glb",

  (gltf)=>{


    // =========================================
    // MODEL
    // =========================================

    const model = gltf.scene;

    scene.add(model);

    model.scale.set(1,1,1);

    model.position.set(-2,0,0);



    // =========================================
    // GET ALL MESH PARTS
    // =========================================

const object6 = model.getObjectByName("Object_6");

if(object6){
  object6.visible = false;
}

    const parts = [];

    model.traverse((child)=>{

      // Only mesh objects
      if(child.isMesh){

        parts.push(child);

      }

    });


    console.log(parts);




    // =========================================
    // SAVE ORIGINAL POSITIONS
    // =========================================

    parts.forEach((part)=>{

      // Save original positions
      part.userData.originalPosition = {

        x:part.position.x,

        y:part.position.y,

        z:part.position.z

      };


      // Save original rotations
      part.userData.originalRotation = {

        x:part.rotation.x,

        y:part.rotation.y,

        z:part.rotation.z

      };

    });




    // =========================================
    // SCATTER PARTS
    // =========================================

    parts.forEach((part)=>{

      // Random position
      part.position.x = (Math.random() - 0.5) * 10;

      part.position.y = (Math.random() - 0.5) * 10;

      part.position.z = (Math.random() - 0.5) * 10;



      // Random rotation
      part.rotation.x = Math.random() * Math.PI * 2;

      part.rotation.y = Math.random() * Math.PI * 2;

      part.rotation.z = Math.random() * Math.PI * 2;

    });




   // =========================================
// PANELS
// =========================================

const panels = gsap.utils.toArray(".panel");



// =========================================
// MASTER TIMELINE
// =========================================

const tl = gsap.timeline({

  scrollTrigger: {

    trigger: ".horizontal-section",

    start: "top top",

    end: "+=4000",

    scrub: 1,

    pin: true,

    anticipatePin: 1

  }

});




// =========================================
// HORIZONTAL SCROLL
// =========================================

tl.to(panels, {

  xPercent: -100 * (panels.length - 0.4),

  ease: "none",

  duration: 4

}, 0);




// =========================================
// ASSEMBLY ANIMATION
// =========================================

parts.forEach((part, index) => {

  // POSITION

  tl.to(part.position, {

    x: part.userData.originalPosition.x,

    y: part.userData.originalPosition.y,

    z: part.userData.originalPosition.z,

    duration: 1,

    ease: "power3.out"

  }, index * 0.1);




  // ROTATION

  tl.to(part.rotation, {

    x: part.userData.originalRotation.x,

    y: part.userData.originalRotation.y,

    z: part.userData.originalRotation.z,

    duration: 1,

    ease: "power3.out"

  }, index * 0.1);

});




// =========================================
// CAMERA ZOOM
// =========================================

tl.to(camera.position, {

  z: 4,

  duration: 2

}, 0);




// =========================================
// MODEL ROTATION
// =========================================

tl.to(model.rotation, {

  y: Math.PI * 2,

  duration: 3

}, 1);

    // =========================================
    // CAMERA MOTION
    // =========================================

    tl.to(camera.position,{

      z:4,

      duration:2

    },0);




    // =========================================
    // MODEL ROTATION
    // =========================================

    tl.to(model.rotation,{

      y:Math.PI * 2,

      duration:3

    },1);

  }

);




// =========================================
// ANIMATION LOOP
// =========================================

function animate(){

  requestAnimationFrame(animate);

  renderer.render(scene, camera);

}

animate();




// =========================================
// RESIZE
// =========================================

window.addEventListener("resize", ()=>{

  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

});