import React, { useState, useEffect } from 'react';
import './App.css';
import NotesSection from './components/NotesSection';
import WordChangerSection from './components/WordChangerSection';
import PDFPreviewSection from './components/PDFPreviewSection';
import { useNavigate } from 'react-router-dom';
import { onAuthChange, getCurrentUserEmail } from './Firebase'; // Import Firebase functions

function App() {
  const [notes, setNotes] = useState('');
  const [wordSpeed, setWordSpeed] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eyeTracking, setEyeTracking] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // Store user email
  const [userUID, setUserUID] = useState(null); // Store user UID
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange(user => {
      if (user) {
        setUserEmail(user.email); // Update email
        setUserUID(user.uid); // Update UID
      } else {
        setUserEmail(null); // Clear email if no user
        setUserUID(null); // Clear UID if no user
      }
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

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

      {/* Display current user's email and UID */}
      <div className="user-info">
        {userEmail ? (
          <>
            <p>User Email: {userEmail}</p>
            <p>User UID: {userUID}</p>
          </>
        ) : (
          <p>No user is currently logged in.</p>
        )}
      </div>
    </div>
  );
}

export default App;
