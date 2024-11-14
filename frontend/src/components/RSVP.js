import React, { useState, useEffect } from 'react';
import Controls from './Controls';

const RSVP = () => {
  // State management
  const [words, setWords] = useState([
    "Hello", "world,", "this", "is", "a", "test", "of", "the", "RSVP", "functionality!"
  ]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [wpm, setWpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate delay in milliseconds based on WPM
  const delayMs = 60000 / wpm;

  // Word display timer
  useEffect(() => {
    let timer;
    if (isPlaying && currentWordIndex < words.length) {
      timer = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delayMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, delayMs, words.length]);

  // Calculate progress percentage
  const progress = ((currentWordIndex + 1) / words.length) * 100;

  // Reset function
  const handleReset = () => {
    setCurrentWordIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-8">
      {/* Progress bar */}
      <div className="w-full max-w-2xl h-2 bg-gray-100 rounded-full mb-8">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">

        {/* Word display */}
        <div className="h-48 flex items-center justify-center">
          <div className="text-6xl font-medium">
            {words[currentWordIndex]}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full">
          <Controls 
            wpm={wpm}
            setWpm={setWpm}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default RSVP;