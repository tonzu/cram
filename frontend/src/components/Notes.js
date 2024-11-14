import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import './Notes.css';
import myIcon from './export.png'; // Adjust this path as needed

function Notes() {
  const notesRef = useRef(null);

  // Function to toggle bold using execCommand
  const toggleBold = () => {
    document.execCommand('bold', false, null);
  };

  // Function to export to PDF with formatting
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    const elements = notesRef.current.childNodes;

    let yPosition = 10;

    elements.forEach((element) => {
      if (element.nodeType === Node.TEXT_NODE) {
        doc.setFont("helvetica", "normal");
        doc.text(element.textContent, 10, yPosition);
      } else if (element.tagName === "B") {
        doc.setFont("helvetica", "bold");
        doc.text(element.textContent, 10, yPosition);
      }
      yPosition += 10;
    });

    doc.save("notes.pdf");
  };

  return (
    <div className="notes">
      <div
        ref={notesRef}
        contentEditable
        className="notes-content"
        placeholder="Type your notes here..."
      />
      <button onClick={toggleBold}>Toggle Bold</button>
      <div className="export-button-wrapper">
        <button onClick={exportToPDF} className="export-button">
          <img src={myIcon} alt="Export to PDF" className="icon" />
        </button>
      </div>
    </div>
  );
}

export default Notes;
