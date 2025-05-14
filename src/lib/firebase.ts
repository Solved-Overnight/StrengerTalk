import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAdQ7Rn7TTIXKx_ZPWTn2sAHNP6MzdkP60",
  authDomain: "so-pekpek.firebaseapp.com",
  databaseURL: "https://so-pekpek-default-rtdb.firebaseio.com",
  projectId: "so-pekpek",
  storageBucket: "so-pekpek.firebasestorage.app",
  messagingSenderId: "630926490252",
  appId: "1:630926490252:web:880e3cbaa8a5b1b12cd9a9",
  measurementId: "G-LH41CC4NB6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;