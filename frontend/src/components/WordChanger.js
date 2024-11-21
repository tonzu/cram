import React, { useState, useEffect, useRef } from 'react';
import { contentArray } from './wordcontent';
import './WordChanger.css';

function WordChanger({ isPlaying, wordSpeed }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const delay = 60000 / wordSpeed;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % contentArray.length);
      }, delay);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, delay]);

  return (
    <div className="flashing-word-container">
      <div className="flashing-word">{contentArray[currentWordIndex]}</div>
    </div>
  );
}

export default WordChanger;