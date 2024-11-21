import React from 'react';
import './PDFPreviewSection.css';
import { signOut } from '../Firebase';

function PDFPreviewSection({ navigate }) {
  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User has been signed out.');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error.message);
      alert('Error signing out: ' + error.message);
    }
  };

  return (
    <div className="right-column">
      <div className="buttonContainer">
        <button className="Functionality">Import</button>
        <button className="Functionality" onClick={handleSignOut}>Sign out</button>
      </div>
      <div className="pdf-preview">
        <h2>CS 70</h2>
        <p id='cs70-test-notes'>
          {/* CS 70 content */}
        </p>
      </div>
    </div>
  );
}

export default PDFPreviewSection;