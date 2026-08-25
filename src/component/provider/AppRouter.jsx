import { Route, Routes } from "react-router-dom";
import Layout from "../../layout/Layout";
import Main from "../../Main";
import ProductDetail from "../pages/ProductDetail";
import WishlistPage from "../pages/WishlistPage";
import ShopPage from "../pages/ShopPage";
import BasketPage from "../pages/BasketPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

function AppRouter({ onAddToCart }) {
  return (
    <Routes>
      {/* Login və Register: heç bir Header/Footer olmadan, tamamilə ayrıca səhifə */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Qalan bütün səhifələr Header + Footer ilə (Layout daxilində) */}
      <Route element={<Layout onAddToCart={onAddToCart} />}>
        <Route path="/" element={<Main onAddToCart={onAddToCart} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<WishlistPage onAddToCart={onAddToCart} />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/shop" element={<ShopPage onAddToCart={onAddToCart} />} />
        <Route path="/shop/:categoryName" element={<ShopPage onAddToCart={onAddToCart} />} />
        <Route path="*" element={<Main onAddToCart={onAddToCart} />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
