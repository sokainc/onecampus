import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ─────────── FIREBASE ─────────── */
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBZme2DEX_aubcTBjMviqgEpPk0Z15CzGs',
  authDomain: 'one-campus-acdc6.firebaseapp.com',
  projectId: 'one-campus-acdc6',
  storageBucket: 'one-campus-acdc6.firebasestorage.app',
  messagingSenderId: '673557735993',
  appId: '1:673557735993:web:5084d747e39ee688febbe8',
});
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = initializeFirestore(firebaseApp, { experimentalForceLongPolling: true });

export { auth, db };
