import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { jsPDF } from 'jspdf';
import { contentArray } from './wordcontent'; // Ensure the path is correct
import { signOut } from './Firebase';  // Import signOut from Firebase.js
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect

function App() {
  const [notes, setNotes] = useState('');
  const [wordSpeed, setWordSpeed] = useState(100);
  const [recordedWords, setRecordedWords] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eyeTracking, setEyeTracking] = useState(false);
  const navigate = useNavigate(); // Create a navigate object for redirection

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
    doc.text(notes, 10, 10);
    doc.save('notes.pdf');
  };

  // Handle sign out and redirect to TestPage
  const handleSignOut = async () => {
    try {
      await signOut(); // Call the signOut function from Firebase.js
      console.log('User has been signed out.');
      // Redirect to TestPage after sign out
      navigate('/'); // Navigate to the root path (TestPage)
    } catch (error) {
      console.error('Error signing out:', error.message);
      alert('Error signing out: ' + error.message);
    }
  };

  // Flashing words component
  const WordChanger = () => {
    const words = contentArray; // Use your array of words
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const delay = 60000 / wordSpeed;
    const intervalRef = useRef(null);

    useEffect(() => {
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, delay);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isPlaying, delay, words.length]);

    return (
      <div className="flashing-word-container">
        <div className="flashing-word">{words[currentWordIndex]}</div>
      </div>
    );
  };

  return (
    <div className="reader-container">
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

      <div className="center-column">
        <div className="progress-bar">
          <div className="progress-indicator"></div>
        </div>

        <div className="word-bank">
          <h3>Word Bank</h3>
          <textarea placeholder="Add words here!" className="word-bank-textbox"></textarea>
          <button>View relevant info</button>
        </div>

        <WordChanger />

        <div className="player-controls">
          <button>⏪</button>
          <button onClick={handlePlayPause}>{isPlaying ? '⏸' : '▶'}</button>
          <button>⏩</button>
        </div>

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

      <div className="right-column">
        <div className="buttonContainer">
          <button className="Functionality">Import</button>
          <button className="Functionality" onClick={handleSignOut}>Sign out</button>
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
            across many fields of science and engineering. Polynomials are often used to approximate other functions, 
            particularly when dealing with real-world phenomena. The general form of a polynomial is given by:
            <br /><br />
            f(x) = a_n * x^n + a_(n-1) * x^(n-1) + ... + a_1 * x + a_0<br /><br />
            Where a_n, a_(n-1), ..., a_1, a_0 are constants and n is a non-negative integer. These constants are 
            referred to as the coefficients of the polynomial.<br /><br />
            {/* The rest of your CS 70 content goes here */}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
