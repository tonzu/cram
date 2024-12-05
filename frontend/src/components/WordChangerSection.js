import React, { useState, useRef, useEffect } from "react";
import WordChanger from "./WordChanger";
import PlayerControls from "./PlayerControls";
import SpeedControl from "./SpeedControl";
import "./WordChangerSection.css";
import FileList from "./FileList";

function WordChangerSection({
  wordSpeed,
  setWordSpeed,
  isPlaying,
  setIsPlaying,
  eyeTracking,
  setEyeTracking,
  activePdf,
  setActivePdf,
  userEmail
}) {
  const [currentWord, setCurrentWord] = useState("");
  const wordBankRef = useRef(null);

  const addWordToBank = () => {
    if (wordBankRef.current) {
      const currentText = wordBankRef.current.value;
      wordBankRef.current.value = currentText
        ? `${currentText}\n${currentWord}`
        : currentWord;
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "b") {
        // Change keybind here
        addWordToBank();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentWord]); // Dependency ensures it has the latest word

  return (
    <div className="center-column">
      <div className="progress-bar">
        <div className="progress-indicator"></div>
      </div>
      <div className="word-bank">
        <h3>Word Bank</h3>
        <textarea
          ref={wordBankRef}
          placeholder="Add words here!"
          className="word-bank-textbox"
        ></textarea>
        <button onClick={addWordToBank}>Add Current Word (b)</button>
      </div>
      <WordChanger
        isPlaying={isPlaying}
        wordSpeed={wordSpeed}
        onWordChange={setCurrentWord} // Pass callback to track the current word
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
