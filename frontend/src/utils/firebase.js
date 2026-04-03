import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, set, push, update, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBsQA3EwmPbBZJodiItlHVF5tsXXtuFJlM",
  authDomain: "child-safety-dc7ef.firebaseapp.com",
  databaseURL: "https://child-safety-dc7ef-default-rtdb.firebaseio.com",
  projectId: "child-safety-dc7ef",
  storageBucket: "child-safety-dc7ef.firebasestorage.app",
  messagingSenderId: "877970662930",
  appId: "1:877970662930:web:a92fbf8e4c0745e6701acb",
  measurementId: "G-NHLGJZYMLL"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, off, set, push, update, get };
