import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkkiliduf_BwqPSfL-MJRKfyFkwek bNniPQ",
  authDomain: "bitiku.firebaseapp.com",
  projectId: "bitiku",
  storageBucket: "bitiku.appspot.com",
  messagingSenderId: "118434566096",
  appId: "1:118434566096:web:a23492a9cfc62f78b1b805",
  measurementId: "G-MK6CPSFDT8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
