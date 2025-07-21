import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDCzcgzqx5wg-EKY4Y3e9s1oek9x1wHQCA",
  authDomain: "cryptoaiagent-7a9ea.firebaseapp.com",
  projectId: "cryptoaiagent-7a9ea",
  storageBucket: "cryptoaiagent-7a9ea.firebasestorage.app",
  messagingSenderId: "1048344253882",
  appId: "1:1048344253882:web:b2b5818d9e59e0d0f33983",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;