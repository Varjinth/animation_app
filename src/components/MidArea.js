import React from "react";
import "./MidArea.css";

export default function MidArea({ sprites, setSprites, addMotion }) {

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSpriteId) => {
    const motion = e.dataTransfer.getData("motion");
    const fromSpriteId = e.dataTransfer.getData("from_s_id");
    const motionIndex = parseInt(e.dataTransfer.getData("motion_id"), 10);
  
    if (motion) {
      addMotion(targetSpriteId, motion);
    }
  
    if (fromSpriteId && !isNaN(motionIndex)) {
      setSprites(prevSprites =>
        prevSprites.map(sprite => {
          if (sprite.id.toString() === fromSpriteId) {
            const updatedMotions = [...sprite.motions];
            updatedMotions.splice(motionIndex, 1);
            return { ...sprite, motions: updatedMotions };
          }
          return sprite;
        })
      );
    }
  };
  

  return (
    <div className="mid-area">
      {sprites.map((sprite, idx) => (
        <div
          key={idx}
          className="sprite-slot"
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, idx)}
        >
          <div className="sprite-name">{sprite.name}</div>
          <div className="dropped-actions">
            {sprite.motions.map((action, index) => (
              <div key={index} className="action-block"  draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("motion", action);
                e.dataTransfer.setData("from_s_id", sprite.id);
                e.dataTransfer.setData("motion_id", index);
              }}
              >
                {action}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
