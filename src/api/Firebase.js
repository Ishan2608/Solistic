import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCnoz6I1TVgFQEsjM7v2wvUFk4FYh1cOPs",
//     authDomain: "solisticone.firebaseapp.com",
//     projectId: "solisticone",
//     storageBucket: "solisticone.firebasestorage.app",
//     messagingSenderId: "685524178439",
//     appId: "1:685524178439:web:816c147f7b7bc6a2407ca2",
//     measurementId: "G-YD1P4XCF4F"
//   };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };