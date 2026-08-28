import { createContext, useContext, useState } from "react";
import Api from "../services/Api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [slider, setSlider] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);
  const [content, setContent] = useState(null);
  const [categories, setCategories] = useState({});
  const [sliderLoading, setSliderLoading] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [loaded, setLoaded] = useState({});
  const [apiNotConfigured, setApiNotConfigured] = useState(false);

  const fetchSlider = async () => {
    if (loaded.slider) return;
    try {
      setSliderLoading(true);
      const sliderData = await Api.getSliderProduct();
      const list = Array.isArray(sliderData)
        ? sliderData
        : Array.isArray(sliderData?.slider)
        ? sliderData.slider
        : null;
      if (list) {
        setSlider(list);
        setLoaded((prev) => ({ ...prev, slider: true }));
      } else {
        // API_BASE in Api.js hasn't been set yet (the Vercel link is empty), or
        // the backend isn't responding in the expected format - we keep it as an empty array instead of coercing it.
        console.warn("Slider API did not return the expected format. Has API_BASE (Vercel link) been set in Api.js?", sliderData);
        setApiNotConfigured(true);
      }
    } catch (error) {
      console.error("Slider API Error:", error);
      setApiNotConfigured(true);
    } finally {
      setSliderLoading(false);
    }
  };

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

  // Header/Footer/Main/RegisterPage/ShopPage/BasketPage/ProductDetail
  // Fetches all the static content that used to be hardcoded (menu, banners,
  // footer links, sort options, size chart, etc.) once from the Vercel API
  // and shares it with the whole app.
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

  // ShopPage's category matching rules & labels (used to be hardcoded
  // categoryRules/categoryLabels objects) - fetched once, same pattern as content.
  const fetchCategories = async () => {
    if (loaded.categories) return;
    try {
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
    }
  };

  return (
    <DataContext.Provider
      value={{
        slider,
        fetchSlider,
        sliderLoading,
        shopProducts,
        fetchShopProducts,
        shopLoading,
        content,
        fetchContent,
        contentLoading,
        categories,
        fetchCategories,
        // true means API_BASE in Api.js is still empty (or the backend
        // hasn't been deployed to Vercel yet) - the UI can surface this if it wants to.
        apiNotConfigured,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => useContext(DataContext);
