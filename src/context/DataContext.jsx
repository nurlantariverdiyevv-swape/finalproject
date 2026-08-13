import { createContext, useContext, useState } from "react";
import Api from "../services/Api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [slider, setSlider] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);
  const [sliderLoading, setSliderLoading] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);
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

  return (
    <DataContext.Provider
      value={{
        slider,
        fetchSlider,
        sliderLoading,
        shopProducts,
        fetchShopProducts,
        shopLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);