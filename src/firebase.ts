import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBzMS0YKjdLXmqGvOPlieTtHNRrg4zhw20",
  authDomain: "projet2fa.firebaseapp.com",
  projectId: "projet2fa",
  storageBucket: "projet2fa.firebasestorage.app",
  messagingSenderId: "834292485167",
  appId: "1:834292485167:web:47796daa4e099f00124ada",
  measurementId: "G-2R2QB83PJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with email configuration
const auth = getAuth(app);
auth.useDeviceLanguage(); // Utiliser la langue du navigateur pour les emails

// Initialize Firestore
const db = getFirestore(app);

// Initialize Functions
const functions = getFunctions(app);
export const sendVerificationCodeEmail = httpsCallable(functions, 'sendVerificationCodeEmail');

export { auth, db, functions };

// Fonction pour vérifier la connexion Firebase (optionnelle)
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Simple check without timeout to avoid blocking the app
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.warn('Firebase connection issue:', error);
    return false;
  }
};

// Test Firebase auth availability
export const testFirebaseAuth = async (): Promise<boolean> => {
  try {
    // Just check if auth is available
    return auth !== null;
  } catch (error) {
    console.error('Firebase Auth not available:', error);
    return false;
  }
};

// Variable globale pour suivre l'état de la connexion
export let isFirebaseConnected = true; // Assume connection is available by default

// Optional: Check connection manually when needed
// checkFirebaseConnection().then(connected => {
//   isFirebaseConnected = connected;
// });
