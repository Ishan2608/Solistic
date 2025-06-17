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
  apiKey: "AIzaSyCs3yNVnExIUnIBurO96J4s65WTICEQp48",
  authDomain: "solistic-9a3d3.firebaseapp.com",
  projectId: "solistic-9a3d3",
  storageBucket: "solistic-9a3d3.firebasestorage.app",
  messagingSenderId: "184668625711",
  appId: "1:184668625711:web:625f2cb2e3d873d6ac5fda",
  measurementId: "G-W50XF4FTR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };