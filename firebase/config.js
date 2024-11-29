// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAD6niqh4HFuUrnY0Fkhj9qe-yhqv3bWtM',
  authDomain: 'school-grades-management.firebaseapp.com',
  projectId: 'school-grades-management',
  storageBucket: 'school-grades-management.firebasestorage.app',
  messagingSenderId: '1045559615124',
  appId: '1:1045559615124:web:4b1bd0d5f492b847ed9e81',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
