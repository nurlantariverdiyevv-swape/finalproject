import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../services/firebase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

function mapAuthError(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Email ünvanı yanlışdır.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email və ya şifrə səhvdir.';
    case 'auth/email-already-in-use':
      return 'Bu email artıq qeydiyyatdan keçib.';
    case 'auth/weak-password':
      return 'Şifrə ən azı 6 simvol olmalıdır.';
    case 'auth/popup-closed-by-user':
      return 'Pəncərə bağlandı, giriş tamamlanmadı.';
    case 'auth/too-many-requests':
      return 'Çox sayda cəhd edildi. Bir az sonra yenidən cəhd edin.';
    default:
      return 'Nəsə səhv getdi. Yenidən cəhd edin.';
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithEmail = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return { user: res.user, error: null };
    } catch (error) {
      return { user: null, error: mapAuthError(error) };
    }
  };

  const registerWithEmail = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      return { user: res.user, error: null };
    } catch (error) {
      return { user: null, error: mapAuthError(error) };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      return { user: res.user, error: null };
    } catch (error) {
      return { user: null, error: mapAuthError(error) };
    }
  };

  const loginWithApple = async () => {
    try {
      const res = await signInWithPopup(auth, appleProvider);
      return { user: res.user, error: null };
    } catch (error) {
      return { user: null, error: mapAuthError(error) };
    }
  };

  const logout = () => signOut(auth);

  // Şifrəni sıfırlamaq üçün Firebase-in özünə real reset linki olan email göndərməsi.
  // İstifadəçi həmin linkə klikləyib yeni şifrə təyin edə bilər.
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error: mapAuthError(error) };
    }
  };

  const value = {
    user,
    authLoading,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithApple,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
