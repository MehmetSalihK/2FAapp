import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

// Fonction pour vérifier la connexion Firebase
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    
    // Tenter une simple requête Firestore
    const testQuery = Promise.race([
      getDocs(collection(db, 'verification_codes')),
      timeout
    ]);
    
    await testQuery;
    console.log('Firebase connection successful');
    return true;
  } catch (error) {
    console.warn('Firebase connection failed, using local storage mode:', error);
    return false;
  }
};

// Variable globale pour suivre l'état de la connexion
export let isFirebaseConnected = false;

// Vérifier la connexion au démarrage
checkFirebaseConnection().then(connected => {
  isFirebaseConnected = connected;
});
