import React, { useState, useEffect, useRef } from 'react';
import './WordChanger.css';

function WordChanger({ isPlaying, wordSpeed, onWordChange }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [contentArray, setContentArray] = useState([]);
  const delay = 60000 / wordSpeed;
  const intervalRef = useRef(null);

  // Get content and set it to state when component mounts
  useEffect(() => {
    const txt = document.getElementById('cs70-test-notes');
    console.log('Text Content:', txt);
    if (txt && txt.childNodes.length > 0) {
      // Convert HTML content to array of nodes
      const nodes = Array.from(txt.childNodes);
      const content = nodes.reduce((acc, node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.trim().split(/\s+/).filter(word => word.length > 0);
          return [...acc, ...words];
        } else if (node.nodeName === 'IMG') {
          return [...acc, node.outerHTML];
        }
        return acc;
      }, []);
      
      if (content.length > 0) {
        setContentArray(content);
      }
    }
  }, []);

  useEffect(() => {
    if (onWordChange && contentArray.length > 0) {
      onWordChange(contentArray[currentWordIndex]);
    }
  }, [currentWordIndex, onWordChange, contentArray]);

  const highlightCurrentWord = (index) => {
    const txt = document.getElementById('cs70-test-notes');
    if (txt) {
      // First ensure all content is properly wrapped
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
      
      // Remove previous highlights
      const wordElements = txt.querySelectorAll('.word');
      wordElements.forEach(word => word.classList.remove('highlighted'));
      
      // Add highlight to current word
      if (wordElements[index]) {
        wordElements[index].classList.add('highlighted');
      }
    }
  };

  useEffect(() => {
    if (isPlaying && contentArray.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % contentArray.length;
          highlightCurrentWord(newIndex);
          return newIndex;
        });
      }, delay);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Highlight initial word
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