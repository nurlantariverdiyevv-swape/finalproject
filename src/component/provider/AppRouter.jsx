import { Route, Routes } from "react-router-dom";
import Layout from "../../layout/Layout";
import Main from "../../Main";
import ProductDetail from "../pages/ProductDetail";
import WishlistPage from "../pages/WishlistPage";
import ShopPage from "../pages/ShopPage";
import BasketPage from "../pages/BasketPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import StaticInfoPage from "../pages/StaticInfoPage";

// Every footer link (and the header's country selector) points to one of
// these paths. They all render the same generic StaticInfoPage since this
// demo store doesn't have dedicated content for them yet - the point is
// just that they're real, working routes instead of an external redirect.
const STATIC_INFO_PATHS = [
  "/who-we-are", "/s-plus-member", "/pro-deal", "/affiliate", "/forces",
  "/press", "/careers", "/newsletter", "/size-guide", "/order-tracking",
  "/gift-cards", "/warranty", "/shipping-info", "/returns", "/faq",
  "/contact", "/find-a-shop", "/tax-exempt", "/terms", "/s-plus-terms",
  "/cookie-preferences", "/cookie-policy", "/privacy", "/accessibility",
  "/conformity", "/product-recall", "/reviews", "/sustainability",
  "/country-select",
];

function AppRouter({ onAddToCart }) {
  return (
    <Routes>
      {/* Login, Register and Forgot Password: standalone pages with no Header/Footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* All other pages render with Header + Footer (inside Layout) */}
      <Route element={<Layout onAddToCart={onAddToCart} />}>
        <Route path="/" element={<Main onAddToCart={onAddToCart} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<WishlistPage onAddToCart={onAddToCart} />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/shop" element={<ShopPage onAddToCart={onAddToCart} />} />
        <Route path="/shop/:categoryName" element={<ShopPage onAddToCart={onAddToCart} />} />
        {STATIC_INFO_PATHS.map((path) => (
          <Route key={path} path={path} element={<StaticInfoPage />} />
        ))}
        <Route path="*" element={<Main onAddToCart={onAddToCart} />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
