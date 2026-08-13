import { Route, Routes } from "react-router-dom";
import Main from "../../Main";
import ProductDetail from "../pages/ProductDetail";
import WishlistPage from "../pages/WishlistPage";
import ShopPage from "../pages/ShopPage";
import BasketPage from "../pages/BasketPage";

function AppRouter({ onAddToCart }) {
  return (
    <Routes>
      <Route path="/" element={<Main onAddToCart={onAddToCart} />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/wishlist" element={<WishlistPage onAddToCart={onAddToCart} />} />
      <Route path="/basket" element={<BasketPage />} />
      <Route path="/shop" element={<ShopPage onAddToCart={onAddToCart} />} />
      <Route path="/shop/:categoryName" element={<ShopPage onAddToCart={onAddToCart} />} />
      <Route path="*" element={<Main onAddToCart={onAddToCart} />} />
    </Routes>
  );
}

export default AppRouter;