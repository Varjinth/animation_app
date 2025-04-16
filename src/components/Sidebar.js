import React, { useState } from "react";
import Icon from "./Icon";
import "./Sidebar.css";


export default function Sidebar({ sprites, setSprites, addSprite, onPlay, setReset, repeat, setRepeat, animationSwap, setAnimationSwap }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [visible, setVisible] = useState(true);
  const [selectedSprite, setSelectedSprite] = useState("");
  const [steps, setSteps] = useState(10);
  const [leftAngle, setLeftAngle] = useState(15);
  const [rightAngle, setRightAngle] = useState(15);
  const [goToX, setGoToX] = useState(0);
  const [goToY, setGoToY] = useState(0);

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
  const handleRemoveSprite = (index, sprite) => {
    setSprites((prevSprites) => prevSprites.filter((_, i) => i !== index));
    setAvailableSprites((prevAvailableSprites) => [...prevAvailableSprites, sprite])
  };



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
          setSprites((prevSprites) =>
            prevSprites.map((sprite, index) => ({
              ...sprite,
              motions: [],
              freeze: false,
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

      <div className="section-title">
        Sprites
      </div>
      {sprites.map((sprite, idx) => (
        <div key={idx} className="spriteblock yellow-block">
          {sprite.name}
          <span
            className="close-icon"
            onClick={() => handleRemoveSprite(idx, sprite.name)}
          >
            ❌
          </span>
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

        <div className="motion-blocks space-y-2">
          {/* Move block */}
          <div
            className="block blue-block flex items-center gap-2"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("motion", `Move ${steps} steps`)}
          >
            Move
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 0)}
              className="w-12 px-1 py-0.5 rounded text-black"
            />
            steps
          </div>

          {/* Turn left block */}
          <div
            className="block blue-block flex items-center gap-2"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("motion", `Turn ${leftAngle} degrees Left`)}
          >
            Turn <Icon name="undo" size={15} className="icon-inline" />
            <input
              type="number"
              value={leftAngle}
              onChange={(e) => setLeftAngle(parseInt(e.target.value) || 0)}
              className="w-12 px-1 py-0.5 rounded text-black"
            />
            degrees
          </div>

          {/* Turn right block */}
          <div
            className="block blue-block flex items-center gap-2"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("motion", `Turn ${rightAngle} degrees Right`)}
          >
            Turn <Icon name="redo" size={15} className="icon-inline" />
            <input
              type="number"
              value={rightAngle}
              onChange={(e) => setRightAngle(parseInt(e.target.value) || 0)}
              className="w-12 px-1 py-0.5 rounded text-black"
            />
            degrees
          </div>

          {/* Go to origin block */}
          <div className="block blue-block  flex items-center gap-2" draggable
            onDragStart={(e) => {
              const motion = `Go to x:${goToX} y:${goToY}`;
              e.dataTransfer.setData("motion", motion);
            }}
          >
            <span>Go to x:</span>
            <input
              type="number"
              value={goToX}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= -200 && val <= 200) {
                  setGoToX(val);
                }
              }}
              className="w-12 px-1 py-0.5 rounded text-black"
              min={-200}
              max={200}
            />
            <span>y:</span>
            <input
              type="number"
              value={goToY}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= -200 && val <= 200) {
                  setGoToY(val);
                }
              }}
              className="w-12 px-1 py-0.5 rounded text-black"
              min={-200}
              max={200}
            />
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
