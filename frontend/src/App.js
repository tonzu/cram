import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { jsPDF } from 'jspdf';
import { contentArray } from './wordcontent'; // Make sure the path is correct

function App() {
  const [notes, setNotes] = useState('');
  const [wordSpeed, setWordSpeed] = useState(100);
  const [recordedWords, setRecordedWords] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eyeTracking, setEyeTracking] = useState(false);

  const handleSpeedChange = (e) => {
    setWordSpeed(e.target.value * 5);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEyeTracking = () => {
    setEyeTracking(!eyeTracking);
  };

  // Function to export notes
  const handleExportNotes = () => {
    const doc = new jsPDF();

    // Add the notes text to the PDF
    doc.text(notes, 10, 10); // (10, 10) sets the position on the PDF page

    // Save the PDF
    doc.save('notes.pdf');
  };


  // Flashing words component
  const WordChanger = () => {

    const words = contentArray; // Use your array of words
    const [currentWordIndex, setCurrentWordIndex] = useState(0); // Maintain current word index
    const delay = 60000 / wordSpeed; // Adjust speed based on wordSpeed state
    const intervalRef = useRef(null); // Ref to keep track of the interval

    // Update the word index if playing
    useEffect(() => {
      if (isPlaying) {
        // Set up interval only if playing
        intervalRef.current = setInterval(() => {
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, delay);
      } else {
        // Clean up interval when paused
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }

      // Cleanup interval on component unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isPlaying, delay, words.length]); // Dependencies include isPlaying, delay, and words.length

    return (
      <div className="flashing-word-container">
        <div className="flashing-word">{words[currentWordIndex]}</div>
      </div>
    );
  };

  return (
    <div className="reader-container">
      {/* Left column for Notes */}
      <div className="left-column">
        <button onClick={handleExportNotes} className="export-notes-button">
          Export Notes
        </button>
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="textarea"
        />
      </div>


      {/* Center column for flashing words and controls */}
      <div className="center-column">
        <div className="progress-bar">
          <div className="progress-indicator"></div>
        </div>

        {/* Word Bank above flashing words */}
        <div className="word-bank">
          <h3>Word Bank</h3>
          <textarea placeholder="Add words here!" className="word-bank-textbox"></textarea>
          <button>View relevant info</button>
        </div>

        {/* Flashing word container */}
        <WordChanger />

        {/* Playback controls */}
        <div className="player-controls">
          <button>⏪</button>
          <button onClick={handlePlayPause}>{isPlaying ? '⏸' : '▶'}</button>
          <button>⏩</button>
        </div>

        {/* Speed control */}
        <div className="speed-control">
          <span>Word speed</span>
          <input
            type="range"
            min="1"
            max="150"
            value={wordSpeed / 5}
            onChange={handleSpeedChange}
          />
          <span>{wordSpeed}</span>
          <label><input type="checkbox" checked={eyeTracking} onChange={handleEyeTracking} /> Eye-Tracking</label>
        </div>
      </div>

      {/* Right column for PDF Preview */}
      <div className="right-column">
        <div className = "buttonContainer">        
          <button className="Functionality">Import</button>
          <button className="Functionality">Sign out</button>
        </div>
        <div className="pdf-preview">
          <h2>CS 70</h2>
          <p id='cs70-test-notes'>
            CS 70<br />
            Discrete Mathematics and Probability Theory<br />
            Fall 2024<br />
            Course Notes<br />
            Note 8<br /><br />
            1. Polynomials<br />
            Polynomials constitute a rich class of functions that are both easy to describe and widely applicable
            in topics ranging from Fourier analysis, cryptography, and communication, to control and computational
            geometry. In this note, we will discuss further properties of polynomials that make them so useful. The
            key idea here is to extend what you already know about polynomials over the real and complex numbers
            to modulo arithmetic. We will then describe how to take advantage of these properties to develop a secret-
            sharing scheme.<br /><br />
            Recall that a polynomial in a single variable is an expression that has an associated function. The polynomial
            expression is p(x) = adxd + ad−1xd−1 + … + a1x + a0. Here the variable x and the coefficients ai are
            usually real numbers. For example, p(x) = 5x3 + 2x + 1 is a polynomial of degree d = 3. Its coefficients
            are a3 = 5, a2 = 0, a1 = 2, and a0 = 1. Polynomials have some remarkably simple, elegant, and powerful
            properties, which we will explore in this note.<br /><br />
            ...
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
