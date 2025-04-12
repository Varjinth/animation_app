import React, { useRef } from "react";
import "./PreviewArea.css";
import CatSprite from "./sprites/CatSprite";
import DogSprite from "./sprites/DogSprite";
import BirdSprite from "./sprites/BirdSprite";
import Sprite from "./Sprite";

export default function PreviewArea({ sprites, setSprites, playAll, repeat, reset, animationSwap }) {
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

  const recentlySwapped = useRef(new Set());

  const checkAndSwapCollisions = () => {
    const ids = Object.keys(spriteRefs.current);

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const id1 = ids[i];
        const id2 = ids[j];

        const key = [id1, id2].sort().join("-");

        const el1 = spriteRefs.current[id1];
        const el2 = spriteRefs.current[id2];

        if (el1 && el2 && isColliding(el1, el2)) {
          if (recentlySwapped.current.has(key)) {
            return; // skip if already swapped recently
          }

          // Mark as recently swapped
          recentlySwapped.current.add(key);
          setTimeout(() => {
            recentlySwapped.current.delete(key);
          }, 10000); // reset after 10 second


          const getTransformValues = (el) => {
            const transform = el.style.transform;
            const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*rotate\(([-\d.]+)deg\)/);
            if (!match) return { x: 0, y: 0, rotation: 0 };
            return {
              x: parseFloat(match[1]),
              y: parseFloat(match[2]),
              rotation: parseFloat(match[3]),
            };
          };

          const pos1 = getTransformValues(el1);
          const pos2 = getTransformValues(el2);
         

          setSprites((prevSprites) => {
            const updated = prevSprites.map(sprite => ({ ...sprite }));
            const idx1 = updated.findIndex(s => s.id === parseInt(id1));
            const idx2 = updated.findIndex(s => s.id === parseInt(id2));

            if (idx1 !== -1 && idx2 !== -1) {
              const sprite1 = { ...updated[idx1] };
              const sprite2 = { ...updated[idx2] };

              sprite1.x = pos1.x;
              sprite1.y = pos1.y;
              sprite1.rotation = pos1.rotation;

              sprite2.x = pos2.x;
              sprite2.y = pos2.y;
              sprite2.rotation = pos2.rotation;

              const motions1 = [...sprite1.motions];
              const motions2 = [...sprite2.motions];

              sprite1.motions = motions2;
              sprite2.motions = motions1;

              updated[idx1] = sprite1;
              updated[idx2] = sprite2;

            // Updating postion of other sprites
              ids.forEach(id => {
                if (id !== id1 && id !== id2) {
                  const otherPos = getTransformValues(spriteRefs.current[id])
                  const otherIndex=  updated.findIndex(s => s.id === parseInt(id));
                  const otherSprite=  { ...updated[otherIndex] };
                  otherSprite.x = otherPos.x;
                  otherSprite.y = otherPos.y;
                  otherSprite.rotation = otherPos.rotation;
                  updated[otherIndex]=otherSprite
                }
              });
              return updated;
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
      animationSwap,
      onRegister: (ref) => registerRef(s.id, ref),
      checkCollision: checkAndSwapCollisions,
    };

    switch (s.name) {
      case "Cat Sprite":
        return <Sprite {...commonProps} svg={CatSprite} />;
      case "Dog Sprite":
        return <Sprite {...commonProps} svg={DogSprite} />;
      case "Bird Sprite":
        return <Sprite {...commonProps} svg={BirdSprite} />;
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
