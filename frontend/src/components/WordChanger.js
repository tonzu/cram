import React, { useState, useEffect, useRef } from "react";
import "./WordChanger.css";

function WordChanger({ isPlaying, wordSpeed, onWordChange, activePdf }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const delay = 60000 / wordSpeed;
  const intervalRef = useRef(null);

  const contentArray = activePdf.split(/\s+/);
  console.log(contentArray);

  useEffect(() => {
    onWordChange(contentArray[currentWordIndex]);
  }, [currentWordIndex, onWordChange]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex(
          (prevIndex) => (prevIndex + 1) % contentArray.length
        );
      }, delay);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, delay]);

  return (
    <div className="flashing-word-container">
      <div className="flashing-word">{contentArray[currentWordIndex]}</div>
    </div>
  );
}

export default WordChanger;
