import React, { useState, useEffect } from "react";
import "./PDFPreviewSection.css";
import { signOut } from "../Firebase";
import axios from "axios";

function PDFPreviewSection({ navigate, userEmail, activePdf }) {

  // Handles opening and closing the file upload modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Stores user's selected file to upload
  const [selectedFile, setSelectedFile] = useState(null);

  // Updates file variable if user changes it
  const fileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Axios request to send file to backend to be uploaded
  const upload = async (e) => {

    // Alerts user if no file is selected
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    // Prevents automatic redirecting
    e.preventDefault();

    // Add file and email to FormData object
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

      // Successful upload
      if (response.status === 200 || response.status === 201) {
        closeModal();
        alert("Upload successful");
      }
    } catch (err) {
      closeModal();
      console.log("Upload failed");
    }
  };

  // Sign out function
  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User has been signed out.");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert("Error signing out: " + error.message);
    }
  };

  return (
    <div className="right-column">
      <div className="button-container">
        <button className="Functionality" onClick={openModal}>
          Import
        </button>

        <button className="Functionality" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
      <div className="pdf-preview">
        <p>{activePdf}</p>
      </div>
      {isModalOpen && (
        <div className="modal-style">
          <div className="modal-content-style">
            <h2>Select a File</h2>
            <input type="file" onChange={fileChange} />
            <div className="button-group-style">
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