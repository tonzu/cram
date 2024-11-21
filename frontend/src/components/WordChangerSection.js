import React from 'react';
import WordChanger from './WordChanger';
import PlayerControls from './PlayerControls';
import SpeedControl from './SpeedControl';
import './WordChangerSection.css';

function WordChangerSection({ wordSpeed, setWordSpeed, isPlaying, setIsPlaying, eyeTracking, setEyeTracking }) {
  return (
    <div className="center-column">
      <div className="progress-bar">
        <div className="progress-indicator"></div>
      </div>
      <div className="word-bank">
        <h3>Word Bank</h3>
        <textarea placeholder="Add words here!" className="word-bank-textbox"></textarea>
        <button>View relevant info</button>
      </div>
      <WordChanger isPlaying={isPlaying} wordSpeed={wordSpeed} />
      <PlayerControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <SpeedControl 
        wordSpeed={wordSpeed}
        setWordSpeed={setWordSpeed}
        eyeTracking={eyeTracking}
        setEyeTracking={setEyeTracking}
      />
    </div>
  );
}

export default WordChangerSection;