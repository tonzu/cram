import React, { useState, useRef, useEffect } from 'react';
import WordChanger from './WordChanger';
import PlayerControls from './PlayerControls';
import SpeedControl from './SpeedControl';
import './WordChangerSection.css';

function WordChangerSection({ wordSpeed, setWordSpeed, isPlaying, setIsPlaying, eyeTracking, setEyeTracking, notes, setNotes }) {
  const [currentWord, setCurrentWord] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0); // State to track progress percentage
  const wordBankRef = useRef(null);

  const addWordToBank = () => {
    if (wordBankRef.current) {
      const currentText = wordBankRef.current.value;
      wordBankRef.current.value = currentText
        ? `${currentText}\n${currentWord}`
        : currentWord;
    }
  };

  const moveToNotes = () => {
    if (wordBankRef.current) {
      const wordBankContent = wordBankRef.current.value.trim(); // Get and trim Word Bank content
      if (wordBankContent) {
        setNotes((prevNotes) => (prevNotes ? `${prevNotes}\n${wordBankContent}` : wordBankContent)); // Append to Notes
        wordBankRef.current.value = ''; // Clear Word Bank
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'b') {
        addWordToBank(); // Keybind for adding the current word
      }
      if (event.key.toLowerCase() === 'n') {
        moveToNotes(); // Keybind for moving to notes
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentWord]); // Dependencies ensure the latest state is used

  // Handle word change and calculate progress percentage
  const handleWordChange = (currentIndex, totalWords) => {
    setCurrentWord(currentIndex); // Update the current word
    const percentage = (currentIndex / totalWords) * 100; // Calculate percentage
    setProgressPercentage(percentage); // Update progress percentage state
    console.log(`Current Index: ${currentIndex}, Total Words: ${totalWords}, Percentage: ${percentage}`);

  };

  return (
    <div className="center-column">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-indicator"
          style={{ width: `${progressPercentage}%` }} // Dynamically update width
        ></div>
      </div>
      <div className="word-bank">
        <h3>Word Bank</h3>
        <textarea
          ref={wordBankRef}
          placeholder="Add words here!"
          className="word-bank-textbox"
        ></textarea>
        <button onClick={addWordToBank}>Add Current Word (b)</button>
        <button onClick={moveToNotes}>Move to Notes (n)</button>
      </div>
      <WordChanger
        isPlaying={isPlaying}
        wordSpeed={wordSpeed}
        onWordChange={handleWordChange} // Pass callback to track progress
      />
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
