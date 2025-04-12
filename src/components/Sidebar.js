import React, { useState } from "react";
import Icon from "./Icon";
import "./Sidebar.css";


export default function Sidebar({ sprites, setSprites, addSprite, onPlay, setReset, repeat, setRepeat, animationSwap, setAnimationSwap }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [visible, setVisible] = useState(true);
  const [selectedSprite, setSelectedSprite] = useState("")
  let hasAnyMotion = false;

  for (let i = 0; i < sprites.length; i++) {
    if (sprites[i].motions.length > 0) {
      hasAnyMotion = true;
      break;
    }
  }

  const [availableSprites, setAvailableSprites] = useState([
    "Dog Sprite",
    "Bird Sprite"
  ]);
 


  return (
    <div className="sidebar">
      <div className="section-title">Events</div>

      <div className="repeat-toggle">
        <label>
          <input
            type="checkbox"
            checked={repeat}
            onChange={(e) => setRepeat(e.target.checked)}
            disabled={!visible}
          />
          Repeat
        </label>
        <label>
          <input
            type="checkbox"
            checked={animationSwap}
            onChange={(e) => setAnimationSwap(e.target.checked)}
            disabled={!visible}
          />
         Hero
        </label>
      </div>


      <button className="play-button" disabled={!visible || !hasAnyMotion} onClick={() => { onPlay(true); setVisible(!visible) }}>▶️ Play All</button>
      <button
  onClick={() => {
    // Reset each sprite’s motions and position
    setSprites((prevSprites) =>
      prevSprites.map((sprite,index) => ({
        ...sprite,
        motions: [],
        initialPosition : {x:0,y: (index*200)},
        x: 0,
        y: 0,
        rotation: 0,
      }))

      
    );


    setReset((prev) => !prev); 
    onPlay(false);             
    setVisible(true);          
  }}
  className="reset-btn"
>
  🔁 Reset
</button>


      {sprites.map((sprite, idx) => (
        <div key={idx} className="block yellow-block">
          {sprite.name}
        </div>
      ))}

      <div className="add-sprite" onClick={() => setShowDropdown(!showDropdown)}>
        <Icon name="plus" size={16} className="add-sprite-icon" />
        <span>Add Sprite</span>
      </div>

      {showDropdown && (
        <div className="dropdown">
          <select
            value={selectedSprite}
            onChange={(e) => { setSelectedSprite(e.target.value) }}
          >
            <option value="">Select sprite</option>
            {availableSprites.map((sprite, idx) => (
              <option key={idx} value={sprite}>{sprite}</option>
            ))}
          </select>
          <button className="submit-sprite" onClick={() => {
            addSprite(selectedSprite);
            setAvailableSprites(prev => prev.filter(sprite => sprite !== selectedSprite)); setSelectedSprite('')
          }
          }>Add</button>
        </div>
      )}


 <div className="menu-section">
        <div className="section-title">
          Motion
        </div>
       
          <div className="motion-blocks">
            <div
              className="block blue-block"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("motion", "Move 10 steps")}
            >
              Move 10 steps
            </div>
            <div
              className="block blue-block"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("motion", "Turn 15 degrees Left")}
            >
              Turn <Icon name="undo" size={15} className="icon-inline" /> 15 degrees
            </div>
            <div
              className="block blue-block"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("motion", "Turn 15 degrees Right")}
            >
              Turn <Icon name="redo" size={15} className="icon-inline" /> 15 degrees
            </div>
            <div
              className="block blue-block"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("motion", "Go to x:0 y:0")}
            >
              Go to x:0 y:0
            </div>
          </div>
       
      </div>

      {/* Voice Menu */}
      <div className="menu-section">
        <div className="section-title" >
          Voice 
        </div>
       
          <div className="voice-blocks">
            <div
              className="block purple-block"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("motion", "Say Hello")}
            >
              Say <span className="voice-text">"Hello"</span>
            </div>
            <div
              className="block purple-block"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("motion", "Say Welcome")}
            >
              Say <span className="voice-text">"Welcome"</span>
            </div>
            <div
              className="block purple-block"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("motion", "Say How are you?")}
            >
              Say <span className="voice-text">"How are you?"</span>
            </div>
          </div>
       
      </div>
    </div>
  );
}
