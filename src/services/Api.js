import axios from "axios";

const API_BASE = "https://allapi-tan.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE,
});

const getShopProducts = async () => {
  const res = await api.get("products");
  return res.data;
};

const getContent = async () => {
  const res = await api.get("content");
  return res.data;
};

const getCategories = async () => {
  const res = await api.get("categories");
  return res.data;
};

export default {
  getShopProducts,
  getContent,
  getCategories,
};
