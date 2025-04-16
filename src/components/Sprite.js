import React, { useState, useEffect, useRef } from "react";



export default function Sprite({ sprite, setSprites, playAll, repeat, reset, animationSwap, previewRef, toast, onRegister, checkCollision, svg }) {
  const spriteRef = useRef(null);
  const [message, setMessage] = useState("");


  let currentX = sprite.x;
  let currentY = sprite.y;
  let currentRotation = sprite.rotation;

  useEffect(() => {
    if (onRegister) onRegister(spriteRef.current);
  }, [onRegister]);

  const playMotions = async () => {
    if (sprite.freeze) return;
    const previewBox = previewRef.current;
    if (!previewBox || !spriteRef.current) return;

    const boxRect = previewBox.getBoundingClientRect();
    const spriteRect = spriteRef.current.getBoundingClientRect();

    for (const motion of sprite.motions) {
      let newX = currentX;
      let newY = currentY;
      let newRotation = currentRotation;
      if (motion.startsWith("Move")) {
        const match = motion.match(/Move (-?\d+) steps/);
        const steps = match ? parseInt(match[1], 10) : 40;
        const angleRad = (currentRotation * Math.PI) / 180;
        newX += steps * Math.cos(angleRad);
        newY += steps * Math.sin(angleRad);
      } else if (motion.includes("Right")) {
        const angle = parseInt(motion.match(/\d+/)?.[0] || "15");
        newRotation += angle;
      } else if (motion.includes("Left")) {
        const angle = parseInt(motion.match(/\d+/)?.[0] || "15");
        newRotation -= angle;
      } else if (motion.startsWith("Go to x:")) {
        const match = motion.match(/Go to x:([-]?\d+)\s*y:([-]?\d+)/);
        if (match) {
          const gotoX = parseInt(match[1], 10);
          const gotoY = parseInt(match[2], 10);
          currentX = gotoX;
          currentY = gotoY;
          currentRotation = 0;
          newX = gotoX;
          newY = gotoY;
          newRotation = 0;
          if (spriteRef.current) {
            spriteRef.current.style.left = `${sprite.initialPosition.x + gotoX}px`;
            spriteRef.current.style.top = `${sprite.initialPosition.y + gotoY}px`;
            spriteRef.current.style.transform = `translate(0px, 0px) rotate(0deg)`;
          }
          if (animationSwap) {
            checkCollision();
          }
          await new Promise((res) => setTimeout(res, 600));
          continue;
        }
      }
      else if (motion.startsWith("Say")) {
        const msg = motion.slice(4);
        setMessage(msg);

        const utterance = new SpeechSynthesisUtterance(msg);
        window.speechSynthesis.speak(utterance);

        await new Promise((res) => setTimeout(res, 1200));
        setMessage("");
        continue
      }

      const halfWidth = spriteRect.width / 2;
      const halfHeight = spriteRect.height / 2;

      const isOutOfBounds =
        sprite.initialPosition.x + newX + halfWidth > boxRect.width ||
        sprite.initialPosition.x + newX + halfWidth < 0 ||
        sprite.initialPosition.y + newY > boxRect.height ||
        sprite.initialPosition.y + newY + spriteRect.height - 20 < 0;

      if (isOutOfBounds) {
        console.warn("Sprite out of bounds — freezing sprite.");
        // Freezeing this sprite
        setSprites(prev =>
          prev.map(s =>
            s.id === sprite.id ? { ...s, freeze: true } : s
          )
        );
        toast(`${sprite.name}: Uh-oh! I'm about to move out of bounds!`);


        await new Promise((res) => setTimeout(res, 600));

        return; // Stop this sprite's motion
      }

      currentX = newX;
      currentY = newY;
      currentRotation = newRotation;
      console.log(newX, newY)
      spriteRef.current.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;

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
        if (!sprite.freeze) {
          await playMotions();
        }
      } while (repeat && !isCancelled && !sprite.freeze);
    };

    if (playAll && sprite.motions.length > 0 && !sprite.freeze) {
      loopMotions();
    }

    return () => {
      isCancelled = true;
    };
  }, [playAll, sprite]);


  useEffect(() => {
    if (spriteRef.current) {
      spriteRef.current.style.transform = `translate(0px, 0px) rotate(0deg)`;
      spriteRef.current.style.left = `${sprite.initialPosition['x']}px`;
      spriteRef.current.style.top = `${sprite.initialPosition['y']}px`;
    }
    currentX = 0;
    currentY = 0;
    currentRotation = 0;
  }, [reset]);

  return (

    <div
      ref={spriteRef}
      style={{
        position: "absolute",
        transition: "transform 0.4s ease-in-out",
        left: `${sprite.initialPosition["x"]}px`,
        top: `${sprite.initialPosition["y"]}px`,
      }}
    >
      {React.createElement(svg)}
      {message && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "80px",
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
