import React, { useState } from "react";
import "./MidArea.css";

export default function MidArea({ sprites, addMotion }) {

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mid-area">
      {sprites.map((sprite, idx) => (
        <div
          key={idx}
          className="sprite-slot"
          onDragOver={allowDrop}
          onDrop={e => {
            const motion = e.dataTransfer.getData("motion");
            if (motion) addMotion(idx, motion);
          }}
        >
          <div className="sprite-name">{sprite.name}</div>
          <div className="dropped-actions">
            {sprite.motions.map((action, index) => (
              <div key={index} className="action-block">
                {action}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
