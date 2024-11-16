import React from 'react';
import './WordBank.css';

function WordBank() {
  return (
    <div className="word-bank">
      <h3>Word Bank</h3>
      <textarea placeholder="Recorded Words" />
      <button>View relevant info</button>
    </div>
  );
}

export default WordBank;
