import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBAQm-qGSxmHTtJoBdN8phoy4shvIw59Bo",
  authDomain: "duco-waalid.firebaseapp.com",
  projectId: "duco-waalid",
  storageBucket: "duco-waalid.firebasestorage.app",
  messagingSenderId: "1023013292565",
  appId: "1:1023013292565:web:e530101403fd30fe0c1c1c",
  measurementId: "G-6VPP4KLCM9"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
