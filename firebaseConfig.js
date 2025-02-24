// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAiK9Lpxefc-ZCFSxhXU2hUViQvGlI0Nl4",
    authDomain: "terapiafisica-8a788.firebaseapp.com",
    projectId: "terapiafisica-8a788",
    storageBucket: "terapiafisica-8a788.firebasestorage.app",
    messagingSenderId: "767069675314",
    appId: "1:767069675314:web:8faa8854eb1eb461ed012b",
    measurementId: "G-EMVYX3Q9ZG"
};

// Export the Firebase config
export { firebaseConfig };

// Initialize Firebase (optional, depending on your architecture)
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };

const db = getFirestore(app);
export { db };