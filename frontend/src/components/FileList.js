import React, { useState, useEffect } from "react";
import axios from "axios";
import './FileList.css';

function FileList({ activePdf, setActivePdf, userEmail }) {

  // Holds the user's list of uploaded pdfs
  const [pdfs, setPdfs] = useState([]);

  // Updates the current pdf being viewed
  function updatePdf(item) {
    setActivePdf(item.text_content);
  }

  // Checks for updated user files associated w/ email
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`http://127.0.0.1:5000/docs?email=${userEmail}`)
        .then((response) => {
          setPdfs(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  return (
    <div className="listContainer">
      <h3>Uploaded Files</h3>
        {pdfs.map((item, index) => (
            <button
              className="fileButton"
              id={index}
              onClick={() => updatePdf(item)}
            >
              {item.filename}
            </button>
        ))}
    </div>
  );
}

export default FileList;