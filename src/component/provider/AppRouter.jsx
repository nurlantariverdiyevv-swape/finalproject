import { Route, Routes, useLocation } from "react-router-dom";
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
import NotFoundPage from "../pages/NotFoundPage";
import ErrorBoundary from "../ErrorBoundary";

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
  const location = useLocation();

  const withBoundary = (element) => (
    <ErrorBoundary resetKey={location.pathname + location.search}>{element}</ErrorBoundary>
  );

  return (
    <Routes>
      <Route path="/login" element={withBoundary(<LoginPage />)} />
      <Route path="/register" element={withBoundary(<RegisterPage />)} />
      <Route path="/forgot-password" element={withBoundary(<ForgotPasswordPage />)} />

      <Route element={<Layout onAddToCart={onAddToCart} />}>
        <Route path="/" element={withBoundary(<Main onAddToCart={onAddToCart} />)} />
        <Route path="/product/:id" element={withBoundary(<ProductDetail />)} />
        <Route path="/wishlist" element={withBoundary(<WishlistPage onAddToCart={onAddToCart} />)} />
        <Route path="/basket" element={withBoundary(<BasketPage />)} />
        <Route path="/shop" element={withBoundary(<ShopPage onAddToCart={onAddToCart} />)} />
        <Route path="/shop/:categoryName" element={withBoundary(<ShopPage onAddToCart={onAddToCart} />)} />
        {STATIC_INFO_PATHS.map((path) => (
          <Route key={path} path={path} element={withBoundary(<StaticInfoPage />)} />
        ))}
        <Route path="*" element={withBoundary(<NotFoundPage />)} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
