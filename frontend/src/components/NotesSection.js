import React from 'react';
import { jsPDF } from 'jspdf';
import './NotesSection.css';

function NotesSection({ notes, setNotes }) {
  const handleExportNotes = () => {
    const doc = new jsPDF();
    doc.text(notes, 10, 10);
    doc.save('notes.pdf');
  };

  return (
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
  );
}

export default NotesSection;