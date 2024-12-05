import React from "react";
import "./PlayerControls.css";

function PlayerControls({ isPlaying, setIsPlaying }) {
  const handlePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <div className="player-controls">
      <button>⏪</button>
      <button onClick={handlePlayPause}>{isPlaying ? "⏸" : "▶"}</button>
      <button>⏩</button>
    </div>
  );
}

export default PlayerControls;
