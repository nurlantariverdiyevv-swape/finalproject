import axios from "axios";

// 🔴 BURAYA ÖZÜNÜN VERCEL LİNKİNİ YAZ (projectapi-ni Vercel-ə qaldırandan sonra) 🔴
// Nümunə: "https://sizin-layihe-adi.vercel.app/api/"
const API_BASE = "https://allapi-tan.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE,
});

const getSliderProduct = async () => {
  const res = await api.get("productSlider");
  return res.data;
};

// ShopPage üçün bütün məhsulları gətirən metod:
const getShopProducts = async () => {
  const res = await api.get("products");
  return res.data;
};

// Header, Footer, Main, RegisterPage, ShopPage, BasketPage, ProductDetail
// daxilində əvvəllər hardcode olunmuş bütün statik məzmun (menyu, banner,
// footer linkləri, sıralama seçimləri, ölçü cədvəli və s.) artıq bu tək
// endpoint-dən gəlir.
const getContent = async () => {
  const res = await api.get("content");
  return res.data;
};

export default {
  getSliderProduct,
  getShopProducts,
  getContent,
};
