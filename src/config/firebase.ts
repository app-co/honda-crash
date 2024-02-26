// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtUtjxijwxTFgrCKzaqzeB4OjK6rF5Drg",
  authDomain: "hondacity-e7979.firebaseapp.com",
  databaseURL: "https://hondacity-e7979-default-rtdb.firebaseio.com",
  projectId: "hondacity-e7979",
  storageBucket: "hondacity-e7979.appspot.com",
  messagingSenderId: "252561046587",
  appId: "1:252561046587:web:77e6427b6afd2ca20ab01e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getFirestore(app)
export const storage = getStorage(app) 