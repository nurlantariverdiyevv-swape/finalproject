import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WishlistToast from '../component/pages/WishlistToast';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);

export default function WishlistProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'add' });

  // Wishlist is stored per-account (key includes the user's uid). Logging
  // out clears it from view immediately; logging back into the SAME
  // account restores it from that account's own storage slot. Logged-out
  // visitors never read/write any saved wishlist.
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
    const saved = localStorage.getItem(`wishlist_${user.uid}`);
    setWishlist(saved ? JSON.parse(saved) : []);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`wishlist_${user.uid}`, JSON.stringify(wishlist));
  }, [wishlist, user]);

  const toggleWishlist = (product) => {
    // If not logged in, redirect to the Login page before adding to the wishlist.
    // After logging in, the user is sent back to wherever they came from (location.state.from).
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const exists = wishlist.some((item) => item.id === product.id);

    if (exists) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
      showToast('Item removed from your wishlist', 'remove');
    } else {
      setWishlist([...wishlist, product]);
      showToast('Item added to your wishlist', 'add');
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'remove');
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'add' });
    }, 3000);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, clearWishlist, toast, setToast }}>
      {children}
      <WishlistToast />
    </WishlistContext.Provider>
  );
}