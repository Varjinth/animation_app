import React, { useRef, useEffect } from "react";
import "./PreviewArea.css";
import CatSprite from "./sprites/CatSprite";
import DogSprite from "./sprites/DogSprite";
import BirdSprite from "./sprites/BirdSprite";
import Sprite from "./Sprite";

export default function PreviewArea({ sprites, setSprites, playAll, repeat, reset }) {
  const spriteRefs = useRef({});

  const registerRef = (id, ref) => {
    spriteRefs.current[id] = ref;
  };



  const isColliding = (el1, el2) => {
    if (!el1 || !el2) return false;
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    return !(
      r1.right < r2.left ||
      r1.left > r2.right ||
      r1.bottom < r2.top ||
      r1.top > r2.bottom
    );
  };

  const checkAndSwapCollisions = () => {
    const ids = Object.keys(spriteRefs.current);
  
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const el1 = spriteRefs.current[ids[i]];
        const el2 = spriteRefs.current[ids[j]];

  
        if (el1 && el2 && isColliding(el1, el2)) {
  
          setSprites((prevSprites) => {
            const updated = prevSprites.map(sprite => ({ ...sprite }));
  
            const idx1 = updated.findIndex(s => s.id === parseInt(ids[i]));
            const idx2 = updated.findIndex(s => s.id === parseInt(ids[j]));
  
            if (idx1 !== -1 && idx2 !== -1) {
              const sprite1 = { ...updated[idx1] };
              const sprite2 = { ...updated[idx2] };
  
              const motions1 = [...sprite1.motions];
              const motions2 = [...sprite2.motions];
  
              sprite1.motions = motions2;
              sprite2.motions = motions1;
  
              updated[idx1] = sprite1;
              updated[idx2] = sprite2;
  
  
              return updated; // Return updated array to update state
            }
  
            return prevSprites;
          });
        }
      }
    }
  };
  
  

  const renderSprite = (s) => {
    const commonProps = {
      sprite: s,
      playAll,
      repeat,
      reset,
      onRegister: (ref) => registerRef(s.id, ref),
      checkCollision: checkAndSwapCollisions,
    };

    switch (s.name) {
      case "Cat Sprite":
        return <Sprite {...commonProps} svg ={CatSprite} />;
      case "Dog Sprite":
        return <Sprite {...commonProps}  svg ={DogSprite}/>;
      case "Bird Sprite":
        return <Sprite {...commonProps}  svg ={BirdSprite} />;
      default:
        return <div className="sprite-box" style={{ left: s.x, top: s.y }}>{s.name}</div>;
    }
  };

  return (
    <div className="preview-area">
      {sprites.map((s) => (
        <div key={s.id}>{renderSprite(s)}</div>
      ))}
    </div>
  );
}
