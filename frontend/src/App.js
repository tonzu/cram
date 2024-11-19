import React, { useState } from 'react';
import './App.css';
import NotesSection from './components/NotesSection';
import WordChangerSection from './components/WordChangerSection';
import PDFPreviewSection from './components/PDFPreviewSection';
import { useNavigate } from 'react-router-dom';

function App() {
  const [notes, setNotes] = useState('');
  const [wordSpeed, setWordSpeed] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eyeTracking, setEyeTracking] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="reader-container">
      <NotesSection notes={notes} setNotes={setNotes} />
      <WordChangerSection 
        wordSpeed={wordSpeed}
        setWordSpeed={setWordSpeed}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        eyeTracking={eyeTracking}
        setEyeTracking={setEyeTracking}
      />
      <PDFPreviewSection navigate={navigate} />
    </div>
  );
}

export default App;