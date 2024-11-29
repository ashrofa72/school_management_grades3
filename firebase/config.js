import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAD6niqh4HFuUrnY0Fkhj9qe-yhqv3bWtM',
  authDomain: 'school-grades-management.firebaseapp.com',
  projectId: 'school-grades-management',
  storageBucket: 'school-grades-management.firebasestorage.app',
  messagingSenderId: '1045559615124',
  appId: '1:1045559615124:web:4b1bd0d5f492b847ed9e81',
};

// Initialize Firebase only if there are no initialized apps
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
