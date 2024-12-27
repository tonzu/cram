import React, { useEffect, useRef } from 'react';
import './WordChanger.css';
import PlayerControls from './PlayerControls';

function WordChanger({ isPlaying, setIsPlaying, wordSpeed, onWordChange, contentArray, currentWordIndex, setCurrentWordIndex, editorFocus }) {
  const delay = 60000 / wordSpeed;
  const intervalRef = useRef(null);

  // Notify parent of word changes
  useEffect(() => {
    if (onWordChange && contentArray.length > 0) {
      onWordChange(currentWordIndex, contentArray.length); // Pass current index and total words
    }
  }, [currentWordIndex, onWordChange, contentArray]);

  // Highlight current word
  const highlightCurrentWord = (index) => {
    
    // Removes all current highlighting
    const txt = document.getElementsByClassName('highlighted');
    if (txt) {
       for(let i = 0; i < txt.length; i++) {
        txt[i].classList.remove('highlighted');
      }
    }

    // Highlights new word
    const newWord = document.getElementById(index);
    if (newWord) {
      newWord.classList.add('highlighted');
    }

  };

  // Move between words using arrow keys
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight" && currentWordIndex < contentArray.length  && !editorFocus) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else if (event.key === "ArrowLeft" && currentWordIndex > 0 && currentWordIndex < contentArray.length  && !editorFocus) {
        setCurrentWordIndex(currentWordIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    if (currentWordIndex >= contentArray.length) {
      setCurrentWordIndex(contentArray.length - 1);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      highlightCurrentWord(currentWordIndex);
    };
  });

  // Handle playback logic
  useEffect(() => {
    if (isPlaying && contentArray.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          if (newIndex < contentArray.length) {
            highlightCurrentWord(newIndex);
            return newIndex;
          } else {
            clearInterval(intervalRef.current); // Stop when reaching the end
            return prevIndex; // Keep the index at the last word
          }
        });
      }, delay);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    highlightCurrentWord(currentWordIndex);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, delay, contentArray.length]);

  const renderContent = (content) => {
    if (content && content.includes('<img')) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return content;
  };

  return (
    <div className="flashing-word-container">
      <div className='spacer'>

      </div>
      <div className="flashing-word">
        {contentArray.length > 0 ? renderContent(contentArray[currentWordIndex]) : 'X'}
      </div>
      <div className="playbackControls">
        <PlayerControls
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentWordIndex={currentWordIndex}
          setCurrentWordIndex={setCurrentWordIndex}
          contentArray={contentArray}
        />
      </div>
    </div>
  );
}

export default WordChanger;
