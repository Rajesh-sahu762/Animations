import React, { useEffect, useRef } from "react";

import "./assemble.css";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";



// =========================================
// GSAP REGISTER
// =========================================

gsap.registerPlugin(ScrollTrigger);



const Assemble = () => {

  // Canvas Ref
  const canvasRef = useRef(null);



  useEffect(() => {

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

    camera.position.set(0, 1, 6);

    scene.add(camera);



    // =========================================
    // RENDERER
    // =========================================

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );



    // =========================================
    // LIGHTS
    // =========================================

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      1
    );

    scene.add(ambientLight);



    const dirLight = new THREE.DirectionalLight(
      0xffffff,
      2
    );

    dirLight.position.set(5, 5, 5);

    scene.add(dirLight);



    // =========================================
    // LOADER
    // =========================================

    const loader = new GLTFLoader();



    loader.load(

      "/src/assets/3d-Model/cameraModel.glb",

      (gltf) => {

        // =========================================
        // MODEL
        // =========================================

        const model = gltf.scene;

        scene.add(model);

        model.scale.set(1, 1, 1);

        model.position.set(-2, 0, 0);



        // =========================================
        // HIDE OBJECT
        // =========================================

        const object6 =
          model.getObjectByName("Object_6");

        if (object6) {

          object6.visible = false;

        }



        // =========================================
        // GET PARTS
        // =========================================

        const parts = [];

        model.traverse((child) => {

          if (child.isMesh) {

            parts.push(child);

          }

        });



        // =========================================
        // SAVE ORIGINAL POSITIONS
        // =========================================

        parts.forEach((part) => {

          part.userData.originalPosition = {

            x: part.position.x,
            y: part.position.y,
            z: part.position.z

          };



          part.userData.originalRotation = {

            x: part.rotation.x,
            y: part.rotation.y,
            z: part.rotation.z

          };

        });



        // =========================================
        // RANDOM SCATTER
        // =========================================

        parts.forEach((part) => {

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

        tl.to(".horizontal-wrapper", {

          xPercent: -75,

          ease: "none",

          duration: 4

        }, 0);



        // =========================================
        // ASSEMBLE ANIMATION
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

      },

      undefined,

      (error) => {

        console.log(error);

      }

    );



    // =========================================
    // ANIMATE LOOP
    // =========================================

    const animate = () => {

      requestAnimationFrame(animate);

      renderer.render(scene, camera);

    };

    animate();



    // =========================================
    // RESIZE
    // =========================================

    const handleResize = () => {

      camera.aspect =
        window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

    };



    window.addEventListener(
      "resize",
      handleResize
    );



    // =========================================
    // CLEANUP
    // =========================================

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      ScrollTrigger.getAll().forEach(
        (trigger) => trigger.kill()
      );

      renderer.dispose();

    };

  }, []);




  return (

    <>

      {/* ========================================= */}
      {/* CANVAS */}
      {/* ========================================= */}

      <canvas
        ref={canvasRef}
        className="webgl"
      />



      {/* ========================================= */}
      {/* HORIZONTAL SECTION */}
      {/* ========================================= */}

      <section className="horizontal-section">

        <div className="horizontal-wrapper">


          {/* PANEL 1 */}
          <div className="panel">

            <div className="content">

              <h1>Lens Assembly</h1>

              <p>
                Premium cinematic lens system
                designed for storytelling.
              </p>

            </div>

          </div>



          {/* PANEL 2 */}
          <div className="panel">

            <div className="content">

              <h1>Camera Body</h1>

              <p>
                Durable body structure with
                cinematic precision.
              </p>

            </div>

          </div>



          {/* PANEL 3 */}
          <div className="panel">

            <div className="content">

              <h1>Control Buttons</h1>

              <p>
                Smooth controls for creators
                and filmmakers.
              </p>

            </div>

          </div>



          {/* PANEL 4 */}
          <div className="panel">

            <div className="content">

              <h1>Final Product</h1>

              <p>
                A complete cinematic camera
                experience.
              </p>

            </div>

          </div>

        </div>

      </section>



      {/* ========================================= */}
      {/* NEXT SECTION */}
      {/* ========================================= */}

      <section className="next-section">

        <h1>NEXT SECTION</h1>

      </section>

    </>

  );

};

export default Assemble;