import axios from "axios";

// 🔴 PUT YOUR OWN VERCEL LINK HERE (after deploying projectapi to Vercel) 🔴
// Example: "https://your-project-name.vercel.app/api/"
const API_BASE = "https://allapi-tan.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Fetches all products for ShopPage, ProductSlider, ProductDetail, search, basket, etc.
// This is the single source of truth for product data - there is no separate
// "productSlider" endpoint anymore. The homepage slider simply filters this
// same list for items with `featured: true`.
const getShopProducts = async () => {
  const res = await api.get("products");
  return res.data;
};

// Header, Footer, Main, RegisterPage, ShopPage, BasketPage, ProductDetail
// used to have all this static content (menu, banners, footer links,
// sort options, size chart, etc.) hardcoded - it now all comes from this
// single endpoint.
const getContent = async () => {
  const res = await api.get("content");
  return res.data;
};

// ShopPage's category filtering rules & labels (used to be hardcoded
// categoryRules/categoryLabels objects) now come from this endpoint.
const getCategories = async () => {
  const res = await api.get("categories");
  return res.data;
};

export default {
  getShopProducts,
  getContent,
  getCategories,
};
