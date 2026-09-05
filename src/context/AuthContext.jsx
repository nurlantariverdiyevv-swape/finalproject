import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile|webOS/i.test(navigator.userAgent);
}

function mapAuthError(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'The window was closed before sign-in finished.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again shortly.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

const PENDING_REDIRECT_KEY = 'runova_pending_auth_redirect';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (firebaseUser) {
        const target = sessionStorage.getItem(PENDING_REDIRECT_KEY);
        if (target) {
          sessionStorage.removeItem(PENDING_REDIRECT_KEY);
          navigate(target, { replace: true });
        }
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          const target = sessionStorage.getItem(PENDING_REDIRECT_KEY) || '/';
          sessionStorage.removeItem(PENDING_REDIRECT_KEY);
          navigate(target, { replace: true });
        }
      })
      .catch(() => {
        sessionStorage.removeItem(PENDING_REDIRECT_KEY);
      });
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

  const loginWithGoogle = async (redirectTo = '/') => {
    try {
      if (isMobileDevice()) {
        sessionStorage.setItem(PENDING_REDIRECT_KEY, redirectTo);
        await signInWithRedirect(auth, googleProvider);
        return { user: null, error: null, redirecting: true };
      }
      const res = await signInWithPopup(auth, googleProvider);
      return { user: res.user, error: null };
    } catch (error) {
      return { user: null, error: mapAuthError(error) };
    }
  };

  const loginWithApple = async (redirectTo = '/') => {
    try {
      if (isMobileDevice()) {
        sessionStorage.setItem(PENDING_REDIRECT_KEY, redirectTo);
        await signInWithRedirect(auth, appleProvider);
        return { user: null, error: null, redirecting: true };
      }
      const res = await signInWithPopup(auth, appleProvider);
      return { user: res.user, error: null };
    } catch (error) {
      return { user: null, error: mapAuthError(error) };
    }
  };

  const logout = () => signOut(auth);

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