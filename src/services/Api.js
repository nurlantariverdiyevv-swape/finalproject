import axios from "axios";

// 🔴 PUT YOUR OWN VERCEL LINK HERE (after deploying projectapi to Vercel) 🔴
// Example: "https://your-project-name.vercel.app/api/"
const API_BASE = "https://allapi-tan.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE,
});

const getSliderProduct = async () => {
  const res = await api.get("productSlider");
  return res.data;
};

// Fetches all products for ShopPage:
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

export default {
  getSliderProduct,
  getShopProducts,
  getContent,
};
