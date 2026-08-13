import axios from "axios";

const API_BASE = "https://nurlantariverdiyevv-swape-apiprojec-gules.vercel.app/api/";

const api = axios.create({
  baseURL: API_BASE
});

const getSliderProduct = async () => {
  const res = await api.get("productSlider");
  return res.data;
};

// ShopPage üçün bütün məhsulları gətirən yeni metod:
const getShopProducts = async () => {
  const res = await api.get("products"); // Backend-dəki endpoint adına uyğunlaşdırın (məs. "products")
  return res.data;
};

export default {
  getSliderProduct,
  getShopProducts
};