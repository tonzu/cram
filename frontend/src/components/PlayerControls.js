import React from 'react';
import './PlayerControls.css';

function PlayerControls({ isPlaying, setIsPlaying, currentWordIndex, setCurrentWordIndex, contentArray }) {
  
  // Toggle RSVP
  const handlePlayPause = () => setIsPlaying(!isPlaying);

  // Move forward 1 word
  const forward = () => {
    if (currentWordIndex >= 0 && currentWordIndex < contentArray.length) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  }

  // Go back 1 word
  const backward = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  }

  return (
    <div className="player-controls">
      <img src={require('./assets/backward.png')} onClick={backward} height="25px" width="25px" alt="back" />
      {isPlaying ?
        <img src={require('./assets/pauseicon.png')} onClick={handlePlayPause} height="25px" width="25px" alt="pause" />
        : <img src={require('./assets/playicon.png')} onClick={handlePlayPause} height="25px" width="25px" alt="play" />}
      <img src={require('./assets/forward.png')} onClick={forward} height="25px" width="25px" alt="forward" />
    </div>
  );
}

export default PlayerControls;