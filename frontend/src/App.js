import React, { useState, useEffect } from "react";
import "./App.css";
import NotesSection from "./components/NotesSection";
import WordChangerSection from "./components/WordChangerSection";
import PDFPreviewSection from "./components/PDFPreviewSection";
import { useNavigate } from "react-router-dom";
import { onAuthChange, getCurrentUserEmail } from "./Firebase"; // Import Firebase functions

function App() {
  const [notes, setNotes] = useState("");
  const [wordSpeed, setWordSpeed] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eyeTracking, setEyeTracking] = useState(false);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [activePdf, setActivePdf] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUserEmail(user.email); // Update email
      } else {
        setUserEmail(""); // Clear email if no user
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
        activePdf={activePdf}
        setActivePdf={setActivePdf}
        userEmail={userEmail}
      />
      <PDFPreviewSection
        navigate={navigate}
        userEmail={userEmail}
        activePdf={activePdf}
      />
    </div>
  );
}

export default App;
