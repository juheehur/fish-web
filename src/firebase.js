// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpsmqBnR3D5heG1XcJAumULMwpSXxZdOg",
  authDomain: "fish-app-fcfb6.firebaseapp.com",
  projectId: "fish-app-fcfb6",
  storageBucket: "fish-app-fcfb6.firebasestorage.app",
  messagingSenderId: "788339893519",
  appId: "1:788339893519:web:602d666f9acff7a7200a7a",
  measurementId: "G-RBWF6Y8EG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };