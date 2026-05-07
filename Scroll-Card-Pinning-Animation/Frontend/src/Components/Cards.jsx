import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import './Card.css';

gsap.registerPlugin(ScrollTrigger);

const Cards = () => {
  const container = useRef();

  useGSAP(() => {
    const cards = gsap.utils.toArray(".card");
    
    cards.forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 15%",
          endTrigger: ".sticky-cards",
          end: "bottom 80%",
          pin: true,
          pinSpacing: false,
          scrub: true,
        },
        // Jaise jaise naya card aayega, purana wala thoda chota aur dark hoga
        scale: 1 - (cards.length - i) * 0.05, 
        opacity: 1,
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="sticky-cards">
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className={`card card-${num}`}>
          <span>0{num} FRAME</span>
          <h3>Step {num}: Build</h3>
          <p>
            MERN stack developer specialized in high-performance 3D web experiences. 
            Crafting premium interfaces with React and Three.js.
          </p>
        </div>
      ))}
    </div>
  );
};

export default Cards;