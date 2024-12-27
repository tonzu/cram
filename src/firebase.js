// Import the Firebase core module and services you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // Example: Firestore Database

// Firebase configuration object, which you get from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBrXHjgcrhb5V5gTEQpE85kdYJXc61JCUk",
    authDomain: "cram-a3297.firebaseapp.com",
    projectId: "cram-a3297",
    storageBucket: "cram-a3297.appspot.com",
    messagingSenderId: "850194777586",
    appId: "1:850194777586:web:9abbd58f87b4c65a4b176b"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you want to use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);