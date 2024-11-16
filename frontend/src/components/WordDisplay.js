import React from 'react';
import './WordDisplay.css';

function WordDisplay() {
  return (
    <div className="word-display">
      <p className="highlighted-word">elit.</p>
      <div className="text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...
      </div>
    </div>
  );
}

export default WordDisplay;