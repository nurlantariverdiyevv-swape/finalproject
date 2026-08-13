import React, { createContext, useContext, useState, useEffect } from 'react';

const BasketContext = createContext();

export function BasketProvider({ children }) {
  const [basket, setBasket] = useState(() => {
    const saved = localStorage.getItem('salomon_basket');
    return saved ? JSON.parse(saved) : [];
  });

  const [sizeModalProduct, setSizeModalProduct] = useState(null);
  const [addedSuccessProduct, setAddedSuccessProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem('salomon_basket', JSON.stringify(basket));
  }, [basket]);

  const openSizeModal = (product) => {
    setSizeModalProduct(product);
  };

  const closeSizeModal = () => {
    setSizeModalProduct(null);
  };

  const addToBasket = (product, size) => {
    setBasket((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });

    setSizeModalProduct(null);
    setAddedSuccessProduct({ ...product, selectedSize: size });
  };

  const updateQuantity = (id, size, delta) => {
    setBasket((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.selectedSize === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromBasket = (id, size) => {
    setBasket((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === size)));
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

export const useBasket = () => useContext(BasketContext);

// Sizin istədiyiniz default export funksiyası (Komponent wrapper olaraq)
function BasketContextWrapper({ children }) {
  return <BasketProvider>{children}</BasketProvider>;
}

export default BasketContextWrapper;