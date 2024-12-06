import React, { useState, useEffect, useRef } from 'react';
import './WordChanger.css';

function WordChanger({ isPlaying, wordSpeed, onWordChange, setTotalWords, activePdf }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const delay = 60000 / wordSpeed;
  const intervalRef = useRef(null);

  const contentArray = activePdf.split(/\s+/);

  // Notify parent of word changes
  useEffect(() => {
    if (onWordChange && contentArray.length > 0) {
      onWordChange(currentWordIndex, contentArray.length); // Pass current index and total words
    }
  }, [currentWordIndex, onWordChange, contentArray]);

  // Highlight current word
  const highlightCurrentWord = (index) => {
    const txt = document.getElementById('pdfText');
    if (txt) {
      if (!txt.innerHTML.includes('class="word"')) {
        const nodes = Array.from(txt.childNodes);
        txt.innerHTML = nodes.map(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.split(/(\s+)/).map(part =>
              part.trim() ? `<span class="word">${part}</span>` : part
            ).join('');
          }
          return node.outerHTML;
        }).join('');
      }

      const wordElements = txt.querySelectorAll('.word');
      wordElements.forEach(word => word.classList.remove('highlighted'));
      if (wordElements[index]) {
        wordElements[index].classList.add('highlighted');
      }
    }
  };

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
      <div className="flashing-word">
        {contentArray.length > 0 ? renderContent(contentArray[currentWordIndex]) : 'X'}
      </div>
    </div>
  );
}

export default WordChanger;
