import React, { useState,useEffect, useRef } from "react";



export default function Sprite({ sprite,setSprites, playAll, repeat, reset, animationSwap,onRegister, checkCollision, svg }) {
  const spriteRef = useRef(null);
  const [message, setMessage] = useState("");


  let currentX = sprite.x;
  let currentY = sprite.y;
  let currentRotation = sprite.rotation;
  // let currentX = 0;
  // let currentY = 0;
  // let currentRotation = 0;
  


  useEffect(() => {
    if (onRegister) onRegister(spriteRef.current);
  }, [onRegister]);

  const playMotions = async () => { 
    for (const motion of sprite.motions) {
      if (motion.startsWith("Move")) {

        // const steps = parseInt(motion.match(/\d+/)?.[0] || "10");
        const steps = 60;
        const angleRad = (currentRotation * Math.PI) / 180;
        currentX += steps * Math.cos(angleRad);
        currentY += steps * Math.sin(angleRad);
        // checkCollision?.();
      } else if (motion.includes("Right")) {

        const angle = parseInt(motion.match(/\d+/)?.[0] || "15");
        currentRotation += angle;
        // checkCollision?.();
      } else if (motion.includes("Left")) {
        const angle = parseInt(motion.match(/\d+/)?.[0] || "15");
        currentRotation -= angle;
        // checkCollision?.();
      } else if (motion === "Go to x:0 y:0") {
        currentX = 0;
        currentY = 0;
        currentRotation = 0;
        if (spriteRef.current) {
          spriteRef.current.style.left = "0px";
          spriteRef.current.style.top = "0px";
          spriteRef.current.style.transform = `translate(0px, 0px) rotate(0deg)`;
        }
        if (animationSwap) {
          checkCollision();
        }
        await new Promise((res) => setTimeout(res, 600));
        continue; 

      
      }
      else if (motion.startsWith("Say")) {
        const msg = motion.slice(4); 
        setMessage(msg);
      
        // Optional: Speak it aloud
        const utterance = new SpeechSynthesisUtterance(msg);
        window.speechSynthesis.speak(utterance);
      
        await new Promise((res) => setTimeout(res, 1200)); 
        setMessage("");
        continue
      }

      if (spriteRef.current) {
        spriteRef.current.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;
      }
      
      if (animationSwap) {
        checkCollision();
      };      

      await new Promise((res) => setTimeout(res, 600));
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const loopMotions = async () => {
      do {
        await playMotions();
      } while (repeat && !isCancelled);
    };

    if (playAll && sprite.motions.length > 0) {
      loopMotions();
    }

    return () => {
      isCancelled = true; 
    };
  }, [playAll,sprite]);

  useEffect(() => {
    if (spriteRef.current) {
      spriteRef.current.style.transform = `translate(0px, 0px) rotate(0deg)`;
      spriteRef.current.style.left = sprite.initialPosition['x'];
      spriteRef.current.style.top = sprite.initialPosition['y'];


    }
    currentX = 0;
    currentY = 0;
    currentRotation = 0;
  }, [reset]);
let counter = 0
  console.log(`redered=${counter+1}`)


  return (

    <div
      ref={spriteRef}
      style={{
        position: "absolute",
        transition: "transform 0.4s ease-in-out",
        left:`${sprite.initialPosition["x"]}px`,
        top: `${sprite.initialPosition["y"]}px`,
      }}
    >
  {React.createElement(svg)}
  {message && (
    <div
      style={{
        position: "absolute",
        top: "-30px", 
        left: "20px", 
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "4px 8px",
        fontSize: "12px",
        whiteSpace: "nowrap",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  )}
    </div>
  );
}
