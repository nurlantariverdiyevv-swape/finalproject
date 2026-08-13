import React, { createContext, useContext, useState, useEffect } from 'react';
import WishlistToast from '../component/pages/WishlistToast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export default function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'add' });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
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