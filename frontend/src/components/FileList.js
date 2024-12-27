import React, { useState, useEffect } from "react";
import axios from "axios";
import './FileList.css';
import { ReactNotifications } from 'react-notifications-component';
import { Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

function FileList({ setActivePdf, userEmail, pdfs, setPdfs, setActiveFilename, isEditing }) {

  // Trigger variable for PostgreSQL retrieval
  const [isLoading, setLoading] = useState(true);

  // Gets latest user files from PostgreSQL
  useEffect(() => {
    if (userEmail && isLoading) {
      axios
        .get(`http://127.0.0.1:5000/docs?email=${userEmail}`)
        .then((response) => {
          setPdfs(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  // File delete function
  const deleteFile = async (filename, id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/delete?email=${userEmail}&filename=${filename}&id=${id}`);

      if (response.status == 200) {
        setLoading(true);
        Store.addNotification({
          title: "File removed",
          message: "File successfully deleted",
          type: "danger",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 2250,
            onScreen: true
          }
        });
      } else {
        alert("File could not be deleted, please try again");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="listContainer">
        {pdfs.map((item, index) => (
          <div className="fileRow">
            <button
              className="fileButton"
              onClick={() => {
                setActivePdf(item.text_content);
                setActiveFilename(item.filename);
              }}
            >
              {item.filename}
            </button>
            <div className="deleteButtonContainer">
              <img src={require('./assets/delete.png')}
                className="deleteButton"
                height="15px"
                width="15px"
                alt="delete"
                style={{ display: isEditing ? 'block' : 'none' }}
                onClick={() => deleteFile(item.filename, item.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileList;