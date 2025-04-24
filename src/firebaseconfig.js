// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs_gX96KoAsXOLWi_F3_jjgDFQCaUw_hc",
  authDomain: "mallify-7cc98.firebaseapp.com",
  projectId: "mallify-7cc98",
  storageBucket: "mallify-7cc98.firebasestorage.app",
  messagingSenderId: "1032535257934",
  appId: "1:1032535257934:web:5537073c7b0a47e45d241f",
  measurementId: "G-GVFFF5CXVR"
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

const db = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, doc, setDoc };