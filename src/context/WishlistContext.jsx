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

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'add' });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    // Hesaba giriş edilməyibsə, wishlist-ə əlavə etməzdən əvvəl Login səhifəsinə yönləndir.
    // Login-dən sonra istifadəçi hardan gəldiyi səhifəyə geri qayıdır (location.state.from).
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