// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJQsiVTSHqJ5VQYnQF56N1E9hjdlw_Cq4",
  authDomain: "kocluk-app-f3e63.firebaseapp.com",
  projectId: "kocluk-app-f3e63",
  storageBucket: "kocluk-app-f3e63.firebasestorage.app",
  messagingSenderId: "675406832543",
  appId: "1:675406832543:web:c814a921fdce6f212493aa",
  measurementId: "G-8TBPM0NKNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };