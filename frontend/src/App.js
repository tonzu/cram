import React, { useState, useEffect } from 'react';
import './App.css';
import NotesSection from './components/NotesSection';
import WordChangerSection from './components/WordChangerSection';
import PDFPreviewSection from './components/PDFPreviewSection';
import Sidebar from './components/Sidebar';

function App() {
  
  const [notes, setNotes] = useState('');
  const [activeFilename, setActiveFilename] = useState("");
  const [activePdf, setActivePdf] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [editorFocus, setEditorFocus] = useState(false);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');

  return (
    <div>
      <Sidebar
        setActivePdf={setActivePdf}
        setActiveFilename={setActiveFilename}
      />
      <div className="reader-container">
        <NotesSection 
          notes={notes} 
          setNotes={setNotes} 
          setEditorFocus={setEditorFocus} 
        />
        <WordChangerSection
          setNotes={setNotes} // Pass setNotes function
          activePdf={activePdf}
          setProgressPercentage={setProgressPercentage}
          editorFocus={editorFocus}
          currentWord={currentWord}
          setCurrentWord={setCurrentWord}
          currentWordIndex={currentWordIndex}
          setCurrentWordIndex={setCurrentWordIndex}
        />
        <PDFPreviewSection
          activePdf={activePdf}
          progressPercentage={progressPercentage}
          activeFilename={activeFilename}
          setCurrentWord={setCurrentWord}
          setCurrentWordIndex={setCurrentWordIndex}
        />
      </div>
    </div>
  );
}

export default App;