import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { useWishlist } from '../../context/WishlistContext';

function ProductSlider({ onAddToCart }) {
  const [activeTab, setActiveTab] = useState('Shoes');
  const [selectedColors, setSelectedColors] = useState({});
  const sliderRef = useRef(null);

  const { slider = [], fetchSlider } = useDataContext();
  const { wishlist, toggleWishlist } = useWishlist();

  const filteredProducts = slider.filter((product) => product.category === activeTab);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.75;
      sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleWishlistClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const changeColor = (e, productId, colorObj) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColors((prev) => ({ ...prev, [productId]: colorObj }));
  };

  const handleCartClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  useEffect(() => {
    fetchSlider();
  }, [fetchSlider]);

  return (
    <section className="max-w-360 mx-auto px-4 md:px-10 py-10 select-none">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black">Recommended for you</h2>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleScroll('left')} className="w-10 h-10 rounded-full border border-gray-200 hover:border-black flex items-center justify-center transition-colors active:scale-95 cursor-pointer" aria-label="Previous">
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            <button type="button" onClick={() => handleScroll('right')} className="w-10 h-10 rounded-full border border-gray-200 hover:border-black flex items-center justify-center transition-colors active:scale-95 cursor-pointer" aria-label="Next">
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['Shoes', 'Gear'].map((tab) => (
            <button type="button" key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer ${activeTab === tab ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div ref={sliderRef} className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth pb-4">
        {filteredProducts.map((product) => {
          const identifier = product.id;
          const activeColor = selectedColors[identifier] || product.colors?.[0];
          const activeImage = activeColor?.img || product.images?.[0] || product.img;
          const isLiked = wishlist.some((item) => item.id === identifier);

          return (
            <Link key={identifier} to={`/product/${identifier}`} className="snap-start group min-w-[260px] sm:min-w-[300px] max-w-[320px] shrink-0 flex flex-col justify-between no-underline">
              <div>
                <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-xs overflow-hidden mb-3">
                  <img src={activeImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none" />

                  <button type="button" onClick={(e) => handleWishlistClick(e, product)} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer z-20" aria-label="Add to wishlist">
                    <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-black text-black' : 'text-gray-700'}`} />
                  </button>

                  <button type="button" onClick={(e) => handleCartClick(e, product)} className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-20" aria-label="Add to cart">
                    <ShoppingBag className="w-4 h-4 text-black" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mb-2 min-h-[28px]">
                  {product.colors?.map((color, cIdx) => {
                    const colorId = color.id || cIdx;
                    const isActive = activeColor?.id === colorId || activeColor === color;

                    return (
                      <button type="button" key={colorId} onClick={(e) => changeColor(e, identifier, color)} className={`w-6 h-6 rounded-xs overflow-hidden border cursor-pointer transition-all z-20 ${isActive ? 'border-black scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                        <img src={color.img} alt={color.name} className="w-full h-full object-cover bg-[#f5f5f5] pointer-events-none" />
                      </button>
                    );
                  })}
                </div>

                {product.badge && <span className={`inline-block text-xs font-semibold mb-1 ${product.badgeType === 'outlet' ? 'text-red-700' : 'text-red-600'}`}>{product.badge}</span>}
                <h3 className="text-sm sm:text-base font-bold text-black tracking-tight leading-tight group-hover:underline">{product.name}</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{product.sub}</p>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-bold text-black">${product.price}</span>
                {product.oldPrice && <span className="text-xs text-gray-400 line-through">${product.oldPrice}</span>}
                {product.discountPercent && <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-xs font-bold">{product.discountPercent}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default ProductSlider;