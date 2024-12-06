import React, { useState, useRef, useEffect } from 'react';
import WordChanger from './WordChanger';
import PlayerControls from './PlayerControls';
import SpeedControl from './SpeedControl';
import './WordChangerSection.css';
import FileList from './FileList';

function WordChangerSection({ wordSpeed, setWordSpeed, isPlaying, setIsPlaying, eyeTracking, setEyeTracking, notes, setNotes, activePdf, setActivePdf, userEmail }) {
  const [currentWord, setCurrentWord] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [totalWords, setTotalWords] = useState(0); // State to track total words
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
      const wordBankContent = wordBankRef.current.value.trim();
      if (wordBankContent) {
        setNotes((prevNotes) => (prevNotes ? `${prevNotes}\n${wordBankContent}` : wordBankContent));
        wordBankRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'b') {
        addWordToBank();
      }
      if (event.key.toLowerCase() === 'n') {
        moveToNotes();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentWord]);

  const handleWordChange = (currentIndex, totalWords) => {
    const percentage = ((currentIndex + 1) / totalWords) * 100; // Add 1 to include the last word
    setProgressPercentage(percentage);
    setCurrentWord(currentIndex);
  };

  return (
    <div className="center-column">
      <div className="progress-bar">
        <div
          className="progress-indicator"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
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
      <WordChanger
        isPlaying={isPlaying}
        wordSpeed={wordSpeed}
        onWordChange={handleWordChange}
        setTotalWords={setTotalWords} // Pass callback for total words
        activePdf={activePdf}
      />
      <PlayerControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <SpeedControl
        wordSpeed={wordSpeed}
        setWordSpeed={setWordSpeed}
        eyeTracking={eyeTracking}
        setEyeTracking={setEyeTracking}
      />
      <FileList activePdf={activePdf} setActivePdf={setActivePdf} userEmail={userEmail} />
    </div>
  );
}

export default WordChangerSection;
