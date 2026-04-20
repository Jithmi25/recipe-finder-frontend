import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasRequiredFirebaseConfig =
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId;

export const firebaseApp = hasRequiredFirebaseConfig
  ? initializeApp(firebaseConfig)
  : null;

export const firestoreDb = firebaseApp ? getFirestore(firebaseApp) : null;

export let firebaseAnalytics = null;

if (firebaseApp && typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        firebaseAnalytics = getAnalytics(firebaseApp);
      }
    })
    .catch(() => {
      firebaseAnalytics = null;
    });
}
