import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState('');
  const [wordSpeed, setWordSpeed] = useState(500);
  const [recordedWords, setRecordedWords] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eyeTracking, setEyeTracking] = useState(false);
  
  const handleSpeedChange = (e) => {
    setWordSpeed(e.target.value);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEyeTracking = () => {
    setEyeTracking(!eyeTracking);
  };

  const WordChanger = () => {
    const words = ["1", "2", "3", "4"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const delay = 6000/wordSpeed; // time in milliseconds (e.g., 2000 ms = 2 seconds)
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, delay);
  
      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }, [words.length, delay]);
  
    return <div>{words[currentWordIndex]}</div>;
  };

  return (
    <div className="reader-container">
      <div className="progress-bar">
        <div className="progress-indicator" />
      </div>
      
      <div className="main-content">
        <div className="notes-section">
          <textarea
            placeholder="Notes and stuff"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button className="share-button">
            <span>↗</span>
          </button>
        </div>

        <div className="word-bank">
          <div className="recorded-words">
            <h3>Word bank</h3>
            <div className="words-list">
              {recordedWords.map((word, index) => (
                <div key={index} className="word-item">{word}</div>
              ))}
            </div>
            <button 
            className="view-info" 
            onClick={() => window.open('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.greekmythology.com%2FTitans%2FPrometheus%2Fprometheus.html&psig=AOvVaw0fQlYt1WGkdgH6fEyH3vca&ust=1730759909879000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPipn5-dwYkDFQAAAAAdAAAAABAE', '_blank')}
          >
            View relevant info Helllo
          </button>
          </div>

          <div className="player-controls">
            <button className="control-btn">⏪</button>
            <button className="control-btn" onClick={handlePlayPause}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="control-btn">⏩</button>
          </div>

          <div className="speed-control">
            <span>Word speed</span>
            <input
              type="range"
              min="100"
              max="1000"
              value={wordSpeed}
              onChange={handleSpeedChange}
            />
            <span>{wordSpeed}</span>
            <label className="eye-tracking">
              <input
                type="checkbox"
                checked={eyeTracking}
                onChange={handleEyeTracking}
              />
              Eye-Tracking
            </label>
          </div>
        </div>

        <div className="text-display">
          {/* Lorem ipsum text content */}
          <WordChanger />
        </div>
      </div>

    </div>
  );
};

export default App;