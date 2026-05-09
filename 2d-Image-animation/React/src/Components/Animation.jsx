// ImageSequence.jsx

import React, { useEffect, useRef } from "react";

import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import './Animation.css'



// ==========================================
// GSAP REGISTER
// ==========================================

gsap.registerPlugin(ScrollTrigger);



const ImageSequence = () => {

  // Canvas Ref
  const canvasRef = useRef(null);



  useEffect(() => {

    // ==========================================
    // CANVAS
    // ==========================================

    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");



    // FULLSCREEN CANVAS

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;



    // ==========================================
    // TOTAL FRAMES
    // ==========================================

    const frameCount = 64;



    // ==========================================
    // FRAME PATH
    // ==========================================

    const currentFrame = (index) => {

      return `/2d-Image-animation/React/src/assets/frame/frame_${String(index).padStart(3, "0")}.jpg`;

    };



    // ==========================================
    // IMAGE ARRAY
    // ==========================================

    const images = [];



    // ==========================================
    // GSAP OBJECT
    // ==========================================

    const imageSequence = {

      frame: 0

    };



    // ==========================================
    // PRELOAD IMAGES
    // ==========================================

    for (let i = 0; i < frameCount; i++) {

      const img = new Image();

      img.src = currentFrame(i);
      



      // DEBUG

      img.onload = () => {

        console.log("Loaded:", img.src);

      };



      images.push(img);

    }



    // ==========================================
    // DRAW IMAGE FUNCTION
    // ==========================================

    function drawImage(img) {

      // CLEAR OLD FRAME

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );



      // CONTAIN SCALE

      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );



      // CUSTOM ZOOM

      const zoom = 2.5;



      const scaledWidth =
        img.width * scale * zoom;

      const scaledHeight =
        img.height * scale * zoom;



      // CENTER IMAGE

      const x =
        (canvas.width - scaledWidth) / 2;

      const y =
        (canvas.height - scaledHeight) / 2;



      // DRAW IMAGE

      context.drawImage(
        img,
        x,
        y,
        scaledWidth,
        scaledHeight
      );

    }



    // ==========================================
    // RENDER FRAME
    // ==========================================

    function render() {

      drawImage(
        images[Math.floor(imageSequence.frame)]
      );

    }



    // ==========================================
    // FIRST FRAME LOAD
    // ==========================================

    images[0].onload = () => {

      render();

    };



    // ==========================================
    // GSAP SCROLL ANIMATION
    // ==========================================

    gsap.to(imageSequence, {

      frame: frameCount - 1,

      snap: "frame",

      ease: "none",



      scrollTrigger: {

        trigger: ".scroll-section",

        start: "top top",

        end: "+=3000",

        scrub: 1,

        pin: true,

        markers: true

      },



      onUpdate: render

    });



    // ==========================================
    // RESIZE
    // ==========================================

    const handleResize = () => {

      canvas.width = window.innerWidth;

      canvas.height = window.innerHeight;

      render();

    };



    window.addEventListener(
      "resize",
      handleResize
    );



    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      ScrollTrigger.getAll().forEach(
        (trigger) => trigger.kill()
      );

    };

  }, []);




  return (

    <>

      {/* ==========================================
          CANVAS
      ========================================== */}

      <canvas
        ref={canvasRef}
        id="sequence"
        className="fixed top-0 left-0 w-full h-full"
      />



      {/* ==========================================
          SCROLL SECTION
      ========================================== */}

      <section className="scroll-section h-[400vh] relative z-10"></section>

    </>

  );

};

export default ImageSequence;