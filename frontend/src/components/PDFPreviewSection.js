import React, { useState, useEffect } from 'react';
import './PDFPreviewSection.css';
import { signOut } from '../Firebase';
import axios from "axios";

function PDFPreviewSection({ navigate, userEmail, activePdf }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const upload = async (e) => {
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    // Prevents automatic redirecting
    e.preventDefault();

    // Add file to FormData object
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", userEmail);

    // Send file to backend
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        closeModal();
        alert("Upload successful");
      }
    } catch (err) {
      closeModal();
      console.log("Upload failed");
    }
  };

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
        <button className="Functionality" onClick={openModal}>Import</button>
        <button className="Functionality" onClick={handleSignOut}>Sign out</button>
      </div>
      <div className="pdf-preview">
        <p>{activePdf}</p>
      </div>
      {isModalOpen && (
        <div className="modalStyle">
          <div className="modalContentStyle">
            <h2>Select a File</h2>
            <input type="file" onChange={handleFileChange} />
            <div className="buttonGroupStyle">
              <button onClick={upload}>Upload</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PDFPreviewSection;