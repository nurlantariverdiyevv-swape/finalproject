import { createContext, useContext, useState } from "react";
import Api from "../services/Api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [shopProducts, setShopProducts] = useState([]);
  const [content, setContent] = useState(null);
  const [categories, setCategories] = useState({});
  const [shopLoading, setShopLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loaded, setLoaded] = useState({});
  const [apiNotConfigured, setApiNotConfigured] = useState(false);

  const fetchShopProducts = async () => {
    if (loaded.shop) return;
    try {
      setShopLoading(true);
      const shopData = await Api.getShopProducts();
      const list = Array.isArray(shopData)
        ? shopData
        : Array.isArray(shopData?.products)
        ? shopData.products
        : null;
      if (list) {
        setShopProducts(list);
        setLoaded((prev) => ({ ...prev, shop: true }));
      } else {
        console.warn("Shop Products API did not return the expected format. Has API_BASE (Vercel link) been set in Api.js?", shopData);
        setApiNotConfigured(true);
      }
    } catch (error) {
      console.error("Shop Products API Error:", error);
      setApiNotConfigured(true);
    } finally {
      setShopLoading(false);
    }
  };

  const fetchContent = async () => {
    if (loaded.content) return;
    try {
      setContentLoading(true);
      const contentData = await Api.getContent();
      const isValidObject = contentData && typeof contentData === "object" && !Array.isArray(contentData);
      if (isValidObject) {
        setContent(contentData);
        setLoaded((prev) => ({ ...prev, content: true }));
      } else {
        console.warn("Content API did not return the expected format. Has API_BASE (Vercel link) been set in Api.js?", contentData);
        setApiNotConfigured(true);
      }
    } catch (error) {
      console.error("Content API Error:", error);
      setApiNotConfigured(true);
    } finally {
      setContentLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (loaded.categories) return;
    try {
      setCategoriesLoading(true);
      const categoriesData = await Api.getCategories();
      const isValidObject = categoriesData && typeof categoriesData === "object" && !Array.isArray(categoriesData);
      if (isValidObject) {
        setCategories(categoriesData);
        setLoaded((prev) => ({ ...prev, categories: true }));
      } else {
        console.warn("Categories API did not return the expected format. Has API_BASE (Vercel link) been set in Api.js?", categoriesData);
        setApiNotConfigured(true);
      }
    } catch (error) {
      console.error("Categories API Error:", error);
      setApiNotConfigured(true);
    } finally {
      setCategoriesLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        shopProducts,
        fetchShopProducts,
        shopLoading,
        content,
        fetchContent,
        contentLoading,
        categories,
        fetchCategories,
        categoriesLoading,
        apiNotConfigured,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
