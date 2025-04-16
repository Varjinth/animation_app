import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {

  const previewRef = useRef(null);


  const [previewCenter, setPreviewCenter] = useState({ x: 0, y: 0 });
  const [sprites, setSprites] = useState([]);
  console.log(sprites)

  useEffect(() => {
    const updateCenter = () => {
      if (previewRef.current) {
        const rect = previewRef.current.getBoundingClientRect();
        setPreviewCenter({
          x: rect.width / 2 - 50,
          y: rect.height / 2 - 50,
        });
      }
    };

    updateCenter();
    window.addEventListener("resize", updateCenter);

    return () => window.removeEventListener("resize", updateCenter);
  }, []);


  useEffect(() => {
    if (previewCenter.x === 0 && previewCenter.y === 0) return;

    // Only add if there's no sprite yet
    if (sprites.length === 0) {
      const newSprite = {
        id: 1,
        name: "Cat Sprite",
        motions: [],
        initialPosition: { ...previewCenter },
        x: 0,
        y: 0,
        rotation: 0, freeze: false
      };
      setSprites([newSprite]);
    }
  }, [previewCenter]);


  const [playAll, setPlayAll] = useState(false);
  const [animationSwap, setAnimationSwap] = useState(true)
  const [reset, setReset] = useState(false);
  const [repeat, setRepeat] = useState(true);

  const addMotion = (spriteIndex, motion) => {
    const updated = [...sprites];
    updated[spriteIndex].motions.push(motion);
    updated[spriteIndex].freeze = false;

    setSprites(updated);
  };

  const addSprite = (name) => {
    if (name.trim().length < 1) return;

    const newSprite = {
      id: sprites.length + 1,
      name: name,
      motions: [],
      initialPosition: {
        x: previewCenter.x,
        y: previewCenter.y,
      },
      x: 0,
      y: 0,
      rotation: 0, freeze: false
    };

    setSprites((prevSprites) => [...prevSprites, newSprite]);
  };


  return (
    <div className="bg-blue-100 font-sans">
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
            sprites={sprites}
            setSprites={setSprites}
            addSprite={addSprite}
            onPlay={setPlayAll}
            setReset={setReset}
            repeat={repeat}
            setRepeat={setRepeat}
            animationSwap={animationSwap}
            setAnimationSwap={setAnimationSwap}
          />
          <MidArea sprites={sprites} setSprites={setSprites} addMotion={addMotion} />
        </div>

        {/* Preview Area Styled as a Box */}
        <div className="w-2/5 h-screen overflow-hidden p-4" ref={previewRef}>
          <div className="w-full h-full shadow-lg border border-gray-300 rounded-lg p-0">
            <PreviewArea
              sprites={sprites}
              setSprites={setSprites}
              playAll={playAll}
              repeat={repeat}
              reset={reset}
              animationSwap={animationSwap}
              previewRef={previewRef}
            />
          </div>
        </div>
      </div>
    </div>

  );
}
