import React, { useState, useEffect } from "react";
import axios from "axios";
import './Sidebar.css';
import FileList from './FileList';
import { useNavigate } from 'react-router-dom';
import { signOut } from "../Firebase";
import { ReactNotifications } from 'react-notifications-component';
import { Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { onAuthChange } from "../Firebase"; // Import Firebase functions

function Sidebar({ setActivePdf, setActiveFilename }) {

    // File upload variables
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [pdfs, setPdfs] = useState([]);

    // File retrieval and library editor variables
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = () => setIsEditing(!isEditing);
    
    const navigate = useNavigate();

    // Initialize user email
    const [userEmail, setUserEmail] = useState(""); // Store user email
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

    // Updates file upload field when user changes files
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Passes file to Flask backend for upload to PostgreSQL & S3
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
                Store.addNotification({
                    title: "Success",
                    message: "File successfully uploaded",
                    type: "success",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 2250,
                      onScreen: true
                    }
                  });
            }

            axios
                .get(`http://127.0.0.1:5000/docs?email=${userEmail}`)
                .then((response) => {
                    setPdfs(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (err) {
            closeModal();
            console.log("Upload failed");
        }
    };

    // User signout function
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
        <div>
            <ReactNotifications />
            <div className='navbar'>
                <div className='sideMenu'>
                    <label class="hamburger-menu">
                        <input type="checkbox" />
                    </label>
                    <aside class="sidebar">
                        <h1 className="libraryHeader">Library</h1>
                        {!isEditing ? <h5 className="editLibrary" onClick={toggleEditing}>edit</h5>
                            : <h5 className="editLibrary" onClick={toggleEditing}>done</h5>
                        }
                        <button className="importButton" onClick={openModal}>+</button>
                        <FileList
                            setActivePdf={setActivePdf}
                            userEmail={userEmail}
                            pdfs={pdfs}
                            setPdfs={setPdfs}
                            setActiveFilename={setActiveFilename}
                            isEditing={isEditing}
                        />
                        <div className="accountInfo">
                            <h3>Signed in as:</h3>
                            <p>{userEmail}</p>
                            <button onClick={handleSignOut}>Log out</button>
                        </div>
                    </aside>
                </div>
                <h1 className="title">CRAM</h1>
            </div>
            {isModalOpen && (
                <div className="modalStyle">
                    <div className="modalContentStyle">
                        <h2>Select a File</h2>
                        <input type="file" onChange={handleFileChange} />
                        <div className="buttonGroupStyle">
                            <button className="modalButton" id="uploadButton" onClick={upload}>Upload</button>
                            <button className="modalButton" id="cancelButton" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;