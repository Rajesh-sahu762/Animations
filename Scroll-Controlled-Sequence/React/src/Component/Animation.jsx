import React, { useEffect, useRef } from "react";

import "./Animation.css";

import gsap from "gsap";

const Animation = () => {

  // ==========================================
  // CANVAS REF
  // ==========================================

  const canvasRef = useRef(null);

  // ==========================================
  // IMAGE SEQUENCE OBJECT
  // ==========================================

  const imageSequence = useRef({
    frame: 0,
  });

  useEffect(() => {

    // ==========================================
    // CANVAS
    // ==========================================

    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");

    context.imageSmoothingEnabled = true;

    context.imageSmoothingQuality = "high";



    // ==========================================
    // HIGH DPI FIX
    // ==========================================

    const setCanvasSize = () => {

      canvas.width =
        window.innerWidth * window.devicePixelRatio;

      canvas.height =
        window.innerHeight * window.devicePixelRatio;

      canvas.style.width =
        window.innerWidth + "px";

      canvas.style.height =
        window.innerHeight + "px";

      context.setTransform(1, 0, 0, 1, 0, 0);

      context.scale(
        window.devicePixelRatio,
        window.devicePixelRatio
      );

    };



    setCanvasSize();



    // ==========================================
    // TOTAL FRAMES
    // ==========================================

    const frameCount = 182;



    // ==========================================
    // FRAME PATH
    // ==========================================

    const currentFrame = (index) => {

      return `/src/assets/dslr/frame_${String(index).padStart(3, "0")}.jpg`;

    };



    // ==========================================
    // IMAGE ARRAY
    // ==========================================

    const images = [];



    // ==========================================
    // PRELOAD IMAGES
    // ==========================================

    for (let i = 0; i < frameCount; i++) {

      const img = new Image();

      img.src = currentFrame(i);

      images.push(img);

    }



    // ==========================================
    // DRAW IMAGE
    // ==========================================

    const drawImage = (img) => {

      if (!img) return;



      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );



      // ==========================================
      // IMAGE RATIO
      // ==========================================

      const imageRatio =
        img.width / img.height;

      const canvasRatio =
        window.innerWidth / window.innerHeight;



      let drawWidth;
      let drawHeight;
      let x;
      let y;



      // ==========================================
      // FULLSCREEN COVER
      // ==========================================

      if (imageRatio > canvasRatio) {

        drawHeight = window.innerHeight;

        drawWidth =
          img.width *
          (window.innerHeight / img.height);

        x =
          (window.innerWidth - drawWidth) / 2;

        y = 0;

      } else {

        drawWidth = window.innerWidth;

        drawHeight =
          img.height *
          (window.innerWidth / img.width);

        x = 0;

        y =
          (window.innerHeight - drawHeight) / 2;

      }



      // ==========================================
      // DRAW FRAME
      // ==========================================

      context.drawImage(
        img,
        x,
        y,
        drawWidth,
        drawHeight
      );

    };



    // ==========================================
    // RENDER FRAME
    // ==========================================

    const render = () => {

      drawImage(
        images[
          Math.max(
            0,
            Math.min(
              Math.floor(
                imageSequence.current.frame
              ),
              frameCount - 1
            )
          )
        ]
      );

    };



    // ==========================================
    // FIRST FRAME
    // ==========================================

    images[0].onload = () => {

      render();

    };



    // ==========================================
    // SLIDER
    // ==========================================

    const sliderTrack =
      document.querySelector(".slider-track");

    const sliderKnob =
      document.querySelector(".slider-knob");

    const sliderProgress =
      document.querySelector(".slider-progress");



    let isDragging = false;



    // ==========================================
    // START DRAG
    // ==========================================

    const handleMouseDown = () => {

      isDragging = true;

    };



    // ==========================================
    // STOP DRAG
    // ==========================================

    const handleMouseUp = () => {

      isDragging = false;

      gsap.to(sliderKnob, {
        scale: 1,
        duration: 0.2,
      });

    };



    // ==========================================
    // MOVE
    // ==========================================

    const handleMouseMove = (e) => {

      if (!isDragging) return;



      const rect =
        sliderTrack.getBoundingClientRect();



      let x = e.clientX - rect.left;



      x = Math.max(
        0,
        Math.min(x, rect.width)
      );



      const progress =
        x / rect.width;



      // ==========================================
      // KNOB POSITION
      // ==========================================

      sliderKnob.style.left =
        `${progress * 100}%`;



      sliderProgress.style.width =
        `${progress * 100}%`;



      // ==========================================
      // FRAME UPDATE
      // ==========================================

      imageSequence.current.frame =
        Math.round(
          progress * (frameCount - 1)
        );



      gsap.to(sliderKnob, {
        scale: 1.2,
        duration: 0.2,
      });



      render();

    };



    // ==========================================
    // EVENTS
    // ==========================================

    sliderKnob.addEventListener(
      "mousedown",
      handleMouseDown
    );



    window.addEventListener(
      "mouseup",
      handleMouseUp
    );



    window.addEventListener(
      "mousemove",
      handleMouseMove
    );



    window.addEventListener(
      "resize",
      () => {

        setCanvasSize();

        render();

      }
    );



    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      sliderKnob.removeEventListener(
        "mousedown",
        handleMouseDown
      );



      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );



      window.removeEventListener(
        "mousemove",
        handleMouseMove
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
      />



      {/* ==========================================
          SLIDER
      ========================================== */}

      <div className="slider-container">

        <div className="slider-track">

          <div className="slider-progress"></div>

          <div className="slider-knob"></div>

        </div>

      </div>

    </>

  );

};

export default Animation;