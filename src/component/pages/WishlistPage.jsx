import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

function WishlistPage({ onAddToCart }) {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const [selectedColors, setSelectedColors] = useState({});

  const changeColor = (e, productId, colorObj) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColors((prev) => ({ ...prev, [productId]: colorObj }));
  };

  const handleWishlistClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCartClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  return (
    // Same font (Inter) and same background/card style as the Basket page
    <div className="bg-[#f5f5f5] min-h-screen py-8 text-black antialiased" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-white p-5 sm:p-[28px] rounded-xl border border-gray-200/80">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-[24px]">
            <h1 className="text-[17px] leading-[1.3] font-bold text-black">
              Your wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
            </h1>

            {wishlist.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="border border-gray-300 hover:border-black rounded-full px-5 py-[9px] text-[13px] font-semibold text-black transition-all cursor-pointer bg-white hover:bg-gray-50"
              >
                Clear wishlist
              </button>
            )}
          </div>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {wishlist.map((product) => {
                const identifier = product.id;
                const activeColor = selectedColors[identifier] || product.colors?.[0];
                const activeImage = activeColor?.img || product.images?.[0] || product.img;

                return (
                  <Link
                    key={identifier}
                    to={`/product/${identifier}`}
                    className="group flex flex-col justify-between no-underline"
                  >
                    <div>
                      <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-[10px] overflow-hidden mb-3">
                        <img
                          src={activeImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none"
                        />

                        <button
                          type="button"
                          onClick={(e) => handleWishlistClick(e, product)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer z-20"
                          aria-label="Remove from wishlist"
                        >
                          <Heart className="w-[18px] h-[18px] fill-black text-black transition-colors" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleCartClick(e, product)}
                          className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="w-4 h-4 text-black" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mb-2 min-h-[26px]">
                        {product.colors?.map((color, cIdx) => {
                          const colorId = color.id || cIdx;
                          const isActive = activeColor?.id === colorId || activeColor === color;

                          return (
                            <button
                              type="button"
                              key={colorId}
                              onClick={(e) => changeColor(e, identifier, color)}
                              className={`w-6 h-6 rounded-[4px] overflow-hidden border cursor-pointer transition-all z-20 ${
                                isActive
                                  ? 'border-black scale-105'
                                  : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={color.img}
                                alt={color.name}
                                className="w-full h-full object-cover bg-[#f5f5f5] pointer-events-none"
                              />
                            </button>
                          );
                        })}
                      </div>

                      {product.badge && (
                        <span
                          className={`inline-block text-[12px] font-semibold mb-1 ${
                            product.badgeType === 'outlet' ? 'text-red-700' : 'text-red-600'
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}
                      <h3 className="text-[15px] leading-[1.3] font-semibold uppercase tracking-[-0.01em] text-black group-hover:underline">
                        {product.name}
                      </h3>
                      <p className="text-[13px] text-gray-500 font-light mt-0.5">{product.sub}</p>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-black">${product.price}</span>
                      {product.oldPrice && (
                        <span className="text-[13px] text-gray-400 line-through font-light">
                          ${product.oldPrice}
                        </span>
                      )}
                      {product.discountPercent && (
                        <span className="text-[11px] bg-black text-white px-1.5 py-0.5 rounded-[3px] font-semibold">
                          {product.discountPercent}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <p className="text-[15px] text-gray-500 max-w-[400px] mb-6 font-light">
                Items added to your favorites will be on your wishlist.
              </p>

              <Link
                to="/"
                className="bg-black text-white rounded-full px-8 py-[13px] font-semibold text-[15px] hover:bg-gray-800 transition-colors mb-12"
              >
                Continue shopping
              </Link>

              <div className="flex flex-col items-center gap-2">
                <Heart className="w-6 h-6 text-black" strokeWidth={1.5} />
                <h2 className="font-bold text-[17px] text-black">Save your favorites</h2>
                <p className="text-[15px] text-gray-500 font-light">
                  Add all the items you want to save and find them here!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
