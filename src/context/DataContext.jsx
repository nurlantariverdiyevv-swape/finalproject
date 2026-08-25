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

  const fetchSlider = async () => {
    if (loaded.slider) return;
    try {
      setSliderLoading(true);
      const sliderData = await Api.getSliderProduct();
      setSlider(sliderData?.slider || sliderData || []);
      setLoaded((prev) => ({ ...prev, slider: true }));
    } catch (error) {
      console.error("Slider API Error:", error);
    } finally {
      setSliderLoading(false);
    }
  };

  const fetchShopProducts = async () => {
    if (loaded.shop) return;
    try {
      setShopLoading(true);
      const shopData = await Api.getShopProducts();
      setShopProducts(shopData?.products || shopData || []);
      setLoaded((prev) => ({ ...prev, shop: true }));
    } catch (error) {
      console.error("Shop Products API Error:", error);
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
      setContent(contentData || null);
      setLoaded((prev) => ({ ...prev, content: true }));
    } catch (error) {
      console.error("Content API Error:", error);
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => useContext(DataContext);
