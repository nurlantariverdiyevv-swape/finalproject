import { createContext, useContext, useState } from "react";
import Api from "../services/Api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [slider, setSlider] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);
  const [content, setContent] = useState(null);
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
        // Api.js-də API_BASE hələ doldurulmayıb (vercel linki boşdur) və ya
        // backend gözlənilən formatda cavab vermir - array-ə çevirməyib boş saxlayırıq.
        console.warn("Slider API gözlənilən formatda deyil. Api.js-də API_BASE (vercel linki) doldurulubmu?", sliderData);
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
        console.warn("Shop Products API gözlənilən formatda deyil. Api.js-də API_BASE (vercel linki) doldurulubmu?", shopData);
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
  // üçün əvvəllər hardcode olunmuş bütün statik məzmunu (menyu, banner,
  // footer linkləri, sıralama seçimləri, ölçü cədvəli və s.) vercel API-dən
  // tək dəfə çəkib bütün tətbiqə paylaşır.
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
        console.warn("Content API gözlənilən formatda deyil. Api.js-də API_BASE (vercel linki) doldurulubmu?", contentData);
        setApiNotConfigured(true);
      }
    } catch (error) {
      console.error("Content API Error:", error);
      setApiNotConfigured(true);
    } finally {
      setContentLoading(false);
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
        // true olduqda deməkdir ki, Api.js-dəki API_BASE hələ boşdur (və ya
        // backend hələ Vercel-ə qaldırılmayıb) - UI bunu istəsə göstərə bilər.
        apiNotConfigured,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => useContext(DataContext);
