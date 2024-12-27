import React, { useState, useRef, useEffect } from 'react';
import WordChanger from './WordChanger';
import SpeedControl from './SpeedControl';
import './WordChangerSection.css';

function WordChangerSection({ setNotes, activePdf, setProgressPercentage, editorFocus, currentWord, setCurrentWord, currentWordIndex, setCurrentWordIndex }) {
  
  const [wordSpeed, setWordSpeed] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const contentArray = activePdf.split(/\s+/);
  const wordBankRef = useRef(null);

  const [eyeTracking, setEyeTracking] = useState(false);

  const addWordToBank = () => {
    if (wordBankRef.current) {
      const currentText = wordBankRef.current.value;
      wordBankRef.current.value = currentText
        ? `${currentText}\n${contentArray[currentWord]}`
        : contentArray[currentWord];
    }
  };

  const moveToNotes = () => {
    if (wordBankRef.current) {
      const wordBankContent = wordBankRef.current.value.trim();
      if (wordBankContent) {
        setNotes((prevNotes) => (prevNotes ? `${prevNotes}\n${wordBankContent}` : wordBankContent));
        wordBankRef.current.value = '';
      }
    }
  };

  // Word bank keyboard shortcuts, spacebar to toggle RSVP
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'b' && !editorFocus) {
        addWordToBank();
      } else if (event.key.toLowerCase() === 'n' && !editorFocus) {
        moveToNotes();
      } else if (event.key.toLowerCase() === " " && document.activeElement.id !== "playButton"  && !editorFocus) {
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });

  const handleWordChange = (currentIndex, totalWords) => {
    const percentage = ((currentIndex + 1) / totalWords) * 100; // Add 1 to include the last word
    setProgressPercentage(percentage);
    setCurrentWord(currentIndex);
  };

  return (
    <div className="center-column">
      <WordChanger
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        wordSpeed={wordSpeed}
        onWordChange={handleWordChange}
        contentArray={contentArray}
        currentWordIndex={currentWordIndex}
        setCurrentWordIndex={setCurrentWordIndex}
        editorFocus={editorFocus}
      />
      <SpeedControl
        wordSpeed={wordSpeed}
        setWordSpeed={setWordSpeed}
        eyeTracking={eyeTracking}
        setEyeTracking={setEyeTracking}
      />
      <div className="word-bank">
        <h3>Word Bank</h3>
        <textarea
          ref={wordBankRef}
          placeholder="Add words here!"
          className="word-bank-textbox"
        ></textarea>
        <div className="wordbank-buttons-container">
          <button className="wordbankfunctionality" onClick={addWordToBank}>Add Current Word (b)</button>
          <button className="wordbankfunctionality" onClick={moveToNotes}>Move to Notes (n)</button>
        </div>

      </div>
    </div>
  );
}

export default WordChangerSection;
