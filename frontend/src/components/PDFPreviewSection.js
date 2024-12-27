import React from 'react';
import './PDFPreviewSection.css';

function PDFPreviewSection({ activePdf, progressPercentage, activeFilename, setCurrentWord, setCurrentWordIndex }) {

  const contentArray = activePdf.split(/\s+/);

  return (
    <div className="right-column">
      <div className="pdf-preview">
        {activeFilename == "" && (
          <h1>No file selected</h1>
        )}
        <h1>{activeFilename}</h1>
        <div className="progress-bar">
          <div
            className="progress-indicator"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        {activeFilename == "" && (
          <p>Choose a file from the library or upload a new one to get started!</p>
        )}
        
        {activeFilename !== "" && (contentArray.map((word, index) => (
          <input 
            id={index} 
            value={word} 
            style={{display: 'inline'}} 
            type="button"
            onClick={() => {
              setCurrentWord(index);
              setCurrentWordIndex(index);
            }}
          />
        )))}

      </div>
    </div>
  );
}

export default PDFPreviewSection;