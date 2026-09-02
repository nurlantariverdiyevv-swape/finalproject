import { createContext, useContext, useState } from "react";
import Api from "../services/Api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [shopProducts, setShopProducts] = useState([]);
  const [content, setContent] = useState(null);
  const [categories, setCategories] = useState({});
  // These start as `true` (not `false`) on purpose: on a hard refresh /
  // direct URL visit, the very first render happens BEFORE the fetch
  // effect has had a chance to run and flip loading to true. If the
  // initial value were `false`, that one render would see
  // "not loading, but data is empty" and pages like ProductDetail/ShopPage
  // would briefly (and wrongly) show a "not found" / empty state before
  // snapping to the real content once the fetch resolves. Starting `true`
  // means that race window shows a normal loading state instead.
  const [shopLoading, setShopLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loaded, setLoaded] = useState({});
  const [apiNotConfigured, setApiNotConfigured] = useState(false);

  // shopProducts is now the ONLY product dataset in the app (single source of
  // truth). It comes from the /products endpoint and every screen - the
  // homepage slider, the shop grid, product detail, search, basket - reads
  // from it instead of each keeping/merging its own partial copy.
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
