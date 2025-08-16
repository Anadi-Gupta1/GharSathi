// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfXpuB6unaF3A1TdPOQ3p16ChMPI95MWE",
  authDomain: "gharsathi.firebaseapp.com",
  projectId: "gharsathi",
  storageBucket: "gharsathi.firebasestorage.app",
  messagingSenderId: "84563901929",
  appId: "1:84563901929:web:bc4ab5221459a0bc185f78",
  measurementId: "G-280EECP3G2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const firestore = getFirestore(app);
const db = firestore; // Alias for backward compatibility

// Initialize Storage
const storage = getStorage(app);

// Initialize Analytics (only works on web/supported platforms)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.log('Analytics not supported on this platform');
}

// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  webClientId: "84563901929-bcpq2hbnkqga6anoj6fr9fhb4vlir8ql.apps.googleusercontent.com",
  // Add iOS and Android client IDs when you create them in Google Console
  iosClientId: "", // Add your iOS client ID here
  androidClientId: "", // Add your Android client ID here
};

export { auth, firestore, db, storage, analytics };
export default app;

// Mock Firebase functions for compatibility
export const signInWithEmailAndPassword = (auth: any, email: string, password: string) => 
  Promise.resolve({ user: { uid: 'demo-user', email } });

export const GoogleAuthProvider = {
  credential: (idToken: string | null, accessToken: string) => ({ providerId: 'google.com' }),
};

export const signInWithCredential = (auth: any, credential: any) => 
  Promise.resolve({ user: { uid: 'demo-user', email: 'demo@example.com', displayName: 'Demo User' } });

export const PhoneAuthProvider = {
  credential: (verificationId: string, code: string) => ({ providerId: 'phone' }),
};

export const signInWithPhoneNumber = (auth: any, phone: string) => 
  Promise.resolve({ confirm: (code: string) => Promise.resolve({ user: { uid: 'demo-user', phoneNumber: phone } }) });

export const RecaptchaVerifier = function(this: any, elementId: string, options: any, auth: any) {
  return { verify: () => Promise.resolve('recaptcha-token') };
};

export const doc = (db: any, collection: string, id: string) => ({
  get: () => Promise.resolve({ exists: false, data: () => null }),
  set: (data: any) => Promise.resolve(),
  update: (data: any) => Promise.resolve(),
});

export const getDoc = (docRef: any) => docRef.get();
export const setDoc = (docRef: any, data: any) => docRef.set(data);
export const updateDoc = (docRef: any, data: any) => docRef.update(data);

export { auth, db, storage, analytics };
export default { auth, db, storage, analytics };