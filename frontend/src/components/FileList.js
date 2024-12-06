import React, { useState, useEffect } from "react";
import axios from "axios";
import './FileList.css';

function FileList({ activePdf, setActivePdf, userEmail }) {
  const [pdfs, setPdfs] = useState([]);

  function updatePdf(item) {
    setActivePdf(item.text_content);
  }

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