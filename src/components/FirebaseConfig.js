// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpRw_234hMXXccRh0KkqEDlXYHMypUqpA",
  authDomain: "cybervie-1a0fd.firebaseapp.com",
  projectId: "cybervie-1a0fd",
  storageBucket: "cybervie-1a0fd.appspot.com",
  messagingSenderId: "1001452678687",
  appId: "1:1001452678687:web:c1f254db2338f4dc1b6f2a",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const firebaseDB = getFirestore(app);
export default storage;
