// ==========================================
// CANVAS SETUP
// ==========================================

const canvas = document.getElementById("sequence");

const context = canvas.getContext("2d");

context.imageSmoothingEnabled = true;
context.imageSmoothingQuality = "high";

canvas.width =
  window.innerWidth * devicePixelRatio;

canvas.height =
  window.innerHeight * devicePixelRatio;

canvas.style.width =
  window.innerWidth + "px";

canvas.style.height =
  window.innerHeight + "px";

context.scale(
  devicePixelRatio,
  devicePixelRatio
);




// ==========================================
// TOTAL FRAMES
// ==========================================

const frameCount = 182;




// ==========================================
// FRAME PATH
// ==========================================

const currentFrame = (index) => {

  return `/Scroll-Controlled-Sequence/Html-javascript/dslr/frame_${String(index).padStart(3, "0")}.jpg`;

};


// ==========================================
// IMAGE STORAGE
// ==========================================

const images = [];




// ==========================================
// CURRENT FRAME OBJECT
// ==========================================

const imageSequence = {

  frame: 0

};




// ==========================================
// PRELOAD ALL IMAGES
// ==========================================

for(let i = 1; i < frameCount; i++){

  const img = new Image();

  img.src = currentFrame(i);

  images.push(img);

  console.log(img)

}




// ==========================================
// FIRST FRAME LOAD
// ==========================================

images[0].onload = () => {

  render();

};




// ==========================================
// DRAW IMAGE
// ==========================================

function drawImage(img){

  if(!img) return;

  // CLEAR

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );



  // =========================================
  // IMAGE + SCREEN RATIO
  // =========================================

  const imageRatio =
    img.width / img.height;

  const canvasRatio =
    canvas.width / canvas.height;



  let drawWidth;
  let drawHeight;
  let x;
  let y;



  // =========================================
  // FULLSCREEN COVER
  // =========================================

  if(imageRatio > canvasRatio){

    drawHeight = canvas.height;

    drawWidth =
      img.width *
      (canvas.height / img.height);

    x = (canvas.width - drawWidth) / 2;

    y = 0;

  }else{

    drawWidth = canvas.width;

    drawHeight =
      img.height *
      (canvas.width / img.width);

    x = 0;

    y = (canvas.height - drawHeight) / 2;

  }



  // =========================================
  // DRAW DSLR
  // =========================================

  context.drawImage(
    img,
    x,
    y,
    drawWidth,
    drawHeight
  );

}


// ==========================================
// RENDER CURRENT FRAME
// ==========================================

function render(){

  drawImage(

   images[
  Math.max(
    0,
    Math.min(
      Math.floor(imageSequence.frame),
      frameCount - 1
    )
  )
]

  );

}




// ==========================================
// RESIZE
// ==========================================

window.addEventListener("resize", ()=>{

canvas.width =
  window.innerWidth * devicePixelRatio;

canvas.height =
  window.innerHeight * devicePixelRatio;

canvas.style.width =
  window.innerWidth + "px";

canvas.style.height =
  window.innerHeight + "px";

context.scale(
  devicePixelRatio,
  devicePixelRatio
);

  render();

});



// =========================================
// SLIDER ELEMENTS
// =========================================

const sliderTrack = document.querySelector(".slider-track");

const sliderKnob = document.querySelector(".slider-knob");

const sliderProgress = document.querySelector(".slider-progress");



let isDragging = false;




// =========================================
// START DRAG
// =========================================

sliderKnob.addEventListener("mousedown", ()=>{

  isDragging = true;

});




// =========================================
// STOP DRAG
// =========================================

window.addEventListener("mouseup", ()=>{

  isDragging = false;

});




// =========================================
// DRAG LOGIC
// =========================================

window.addEventListener("mousemove",(e)=>{

  if(!isDragging) return;



  // TRACK SIZE

  const rect = sliderTrack.getBoundingClientRect();



  // MOUSE POSITION INSIDE TRACK

  let x = e.clientX - rect.left;



  // LIMITS

  x = Math.max(0, Math.min(x, rect.width));



  // PERCENTAGE

  const progress = x / rect.width;



  // MOVE KNOB

  sliderKnob.style.left = `${progress * 100}%`;



  // UPDATE PROGRESS BAR

  sliderProgress.style.width = `${progress * 100}%`;



  // UPDATE FRAME

imageSequence.frame = Math.min(

  frameCount - 1,

  Math.round(
    progress * (frameCount - 1)
  )

);

if(progress >= 0.99){

  imageSequence.frame = frameCount - 1;

}


gsap.to(sliderKnob,{
  scale:1.2,
  duration:0.2
})


  // RENDER FRAME

  render();

});