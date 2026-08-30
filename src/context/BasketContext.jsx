import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const BasketContext = createContext();

export function BasketProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [basket, setBasket] = useState([]);

  const [sizeModalProduct, setSizeModalProduct] = useState(null);
  const [addedSuccessProduct, setAddedSuccessProduct] = useState(null);

  // Basket is stored per-account (key includes the user's uid). Logging out
  // clears it from view immediately; logging back into the SAME account
  // restores it from that account's own storage slot. Logged-out visitors
  // never read/write any saved basket.
  useEffect(() => {
    if (!user) {
      setBasket([]);
      return;
    }
    const saved = localStorage.getItem(`runova_basket_${user.uid}`);
    setBasket(saved ? JSON.parse(saved) : []);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`runova_basket_${user.uid}`, JSON.stringify(basket));
  }, [basket, user]);

  const openSizeModal = (product) => {
    // If not logged in, redirect to the Login page before selecting a size
    // and adding to the basket. After logging in, the user returns to the same page.
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setSizeModalProduct(product);
  };
  const closeSizeModal = () => setSizeModalProduct(null);

  // 4 Parametr: product, size, color, image
  const addToBasket = (product, size, color, image) => {
    const selectedColor = color || product.selectedColor || product.color || product.colors?.[0]?.name || 'Default';
    const selectedImage = image || product.selectedImage || product.images?.[0] || product.img;

    setBasket((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          (item.selectedColor || item.color) === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          selectedImage: selectedImage, // Update the image too
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...product,
          selectedSize: size,
          selectedColor: selectedColor,
          color: selectedColor,
          selectedImage: selectedImage,
          quantity: 1,
        },
      ];
    });

    setSizeModalProduct(null);
    setAddedSuccessProduct({
      ...product,
      selectedSize: size,
      selectedColor: selectedColor,
      color: selectedColor,
      selectedImage: selectedImage,
    });
  };

  const updateQuantity = (id, size, color, delta) => {
    setBasket((prev) =>
      prev
        .map((item) => {
          const itemColor = item.selectedColor || item.color || item.colors?.[0]?.name;
          if (item.id === id && item.selectedSize === size && itemColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromBasket = (id, size, color) => {
    setBasket((prev) =>
      prev.filter((item) => {
        const itemColor = item.selectedColor || item.color || item.colors?.[0]?.name;
        return !(item.id === id && item.selectedSize === size && itemColor === color);
      })
    );
  };

  const clearBasket = () => setBasket([]);

  const totalBasketCount = basket.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = basket.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <BasketContext.Provider
      value={{
        basket,
        sizeModalProduct,
        addedSuccessProduct,
        openSizeModal,
        closeSizeModal,
        setAddedSuccessProduct,
        addToBasket,
        updateQuantity,
        removeFromBasket,
        clearBasket,
        totalBasketCount,
        subtotal,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBasket = () => useContext(BasketContext);

export default BasketProvider;