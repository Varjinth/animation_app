import React, { useState } from "react";
import Icon from "./Icon";
import "./Sidebar.css";


export default function Sidebar({ sprites,setSprites, addSprite,playAll, onPlay,reset,setReset, repeat, setRepeat}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [visible,setVisible] = useState(true);
  const [selectedSprite, setSelectedSprite] = useState("")
  let hasAnyMotion = false;

for (let i = 0; i < sprites.length; i++) {
  if (sprites[i].motions.length > 0) {
    hasAnyMotion = true;
    break; 
  }
}
const initialState = [
  { name: "Cat Sprite", motions: [], x: 0, y: 0 },
  { name: "Dog Sprite", motions: [], x: 0, y: 200 }
]
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
      </div>


      <button className="play-button" disabled={!visible || !hasAnyMotion}  onClick={()=>{onPlay(true);setVisible(!visible)}}>▶️ Play All</button>
      <button onClick={()=>{setReset(!reset);onPlay(false);setVisible(true)}}   className="reset-btn">🔁 Reset</button>

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
            onChange={(e) => {setSelectedSprite(e.target.value)}}
          >
            <option value="">Select sprite</option>
            {availableSprites.map((sprite, idx) => (
              <option key={idx} value={sprite}>{sprite}</option>
            ))}
          </select>
          <button className="submit-sprite" onClick={()=>{addSprite(selectedSprite);
          setAvailableSprites(prev => prev.filter(sprite => sprite !== selectedSprite)); setSelectedSprite('')}
          }>Add</button>
        </div>
      )}



      <div className="section-title">Motion</div>

      <div
        className="block blue-block"
        draggable
        onDragStart={(e) => e.dataTransfer.setData("motion", "Move 10 steps")}
      >
        Move 10 steps
      </div>

      <div className="block blue-block"  draggable onDragStart={(e) => e.dataTransfer.setData("motion", "Turn 15 degrees Left")}>
        Turn <Icon name="undo" size={15} className="icon-inline" /> 15 degrees
      </div>
      <div className="block blue-block"  draggable onDragStart={(e) => e.dataTransfer.setData("motion", "Turn 15 degrees Right")}>
        Turn <Icon name="redo" size={15} className="icon-inline" /> 15 degrees
      </div>
      <div className="block blue-block" draggable onDragStart={(e) => e.dataTransfer.setData("motion", "Go to x:0 y:0")}>
        Go to x:0 y:0
      </div>
    </div>
  );
}
