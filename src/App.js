import React, {useState} from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [sprites, setSprites] = useState([
    { id:1, name: "Cat Sprite", motions: [], x: 0, y: 0 },
  ]);
  const [playAll,setPlayAll] = useState(false);
  const [reset, setReset] = useState(false);
  const [repeat, setRepeat] = useState(true);

  const addMotion = (spriteIndex, motion) => {
    const updated = [...sprites];
    updated[spriteIndex].motions.push(motion);
    setSprites(updated);
  };

  // console.log(sprites)

  const addSprite = name => {

    if(name.trim().length<1)return;

    const newSprite = { 
      id: sprites.length + 1, 
      name: name,
      motions: [],
      x: 0,
      y: (sprites.length*200)
    };
  
    // Update the state with the new sprite added
    setSprites(prevSprites => [...prevSprites, newSprite]);
    
  };


  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar sprites={sprites} setSprites={setSprites} addSprite={addSprite} playAll={playAll} onPlay={setPlayAll} reset={reset} setReset={setReset} repeat={repeat} setRepeat={setRepeat}/> 
          <MidArea sprites={sprites} addMotion={addMotion} />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea sprites={sprites} setSprites={setSprites }playAll={playAll} repeat={repeat} reset={reset} />
        </div>
      </div>
    </div>
  );
}
