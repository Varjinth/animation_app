import React, { useEffect, useRef } from "react";



export default function Sprite({ sprite, playAll, repeat, reset, onRegister, checkCollision, svg }) {
  const spriteRef = useRef(null);

  let currentX = 0;
  let currentY = 0;
  let currentRotation = 0;


  useEffect(() => {
    if (onRegister) onRegister(spriteRef.current);
  }, [onRegister]);

  const playMotions = async () => {
    for (const motion of sprite.motions) {
      if (motion.startsWith("Move")) {
        const steps = parseInt(motion.match(/\d+/)?.[0] || "10");
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
        currentX = sprite.x;
        currentY = sprite.y;
        currentRotation = 0;
        // checkCollision?.();
      }

      if (spriteRef.current) {
        spriteRef.current.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;
      }
      checkCollision?.();

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
      isCancelled = true; // stop the loop when unmounted or props change
    };
  }, [playAll,sprite]);

  useEffect(() => {
    if (spriteRef.current) {
      spriteRef.current.style.transform = `translate(0px, 0px) rotate(0deg)`;
    }
    currentX = sprite.x;
    currentY = sprite.y;
    currentRotation = 0;
  }, [reset]);


  return (

    <div
      ref={spriteRef}
      style={{
        position: "absolute",
        transition: "transform 0.4s ease-in-out",
        left:`${sprite.x}px`,
        top: `${sprite.y}px`,
      }}
    >
  {React.createElement(svg)}
    </div>
  );
}
