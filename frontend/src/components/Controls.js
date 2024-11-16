import React, { useState } from 'react';

const Controls = ({ wpm, setWpm, isPlaying, setIsPlaying }) => {
  const handleSpeedDecrease = () => {
    setWpm(prev => Math.max(10, prev - 10));
  };

  const handleSpeedIncrease = () => {
    setWpm(prev => Math.min(1000, prev + 10));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center mb-2">
        <span className="text-sm font-medium">
          Speed: {isPlaying ? wpm : 0} WPM
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={handleSpeedDecrease}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl transition-colors"
          disabled={!isPlaying}
        >
          ⏪
        </button>
        
        <button 
          onClick={handlePlayPause}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white text-2xl transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button 
          onClick={handleSpeedIncrease}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl transition-colors"
          disabled={!isPlaying}
        >
          ⏩
        </button>
      </div>
    </div>
  );
};

export default Controls;