import React from 'react';
import './SpeedControl.css';

function SpeedControl({ wordSpeed, setWordSpeed, eyeTracking, setEyeTracking }) {
  const handleSpeedChange = (e) => {
    setWordSpeed(e.target.value * 5);
  };

  return (
    <div className="speed-control">
      <span>Word speed</span>
      <input
        type="range"
        className="speedSlider"
        min="1"
        max="150"
        value={wordSpeed / 5}
        onChange={handleSpeedChange}
      />
      <span>{wordSpeed}</span>
      <label>
        <input
          type="checkbox"
          checked={eyeTracking}
          onChange={() => setEyeTracking(!eyeTracking)}
        />
        Eye-Tracking
      </label>
    </div>
  );
}

export default SpeedControl;