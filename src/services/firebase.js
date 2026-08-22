import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";

// Bu dəyərlər .env faylından gəlir (bax: .env.example).
// Vite-də bütün env dəyişənləri "VITE_" ilə başlamalıdır ki, koda daxil ola bilsin.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

// Apple provider: Firebase konsolunda "Apple" sign-in metodunu aktivləşdirib
// Services ID-ni bağladıqdan sonra bu işə düşəcək.
export const appleProvider = new OAuthProvider("apple.com");

export default app;
