import React, { useState } from 'react';
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
    <div className="max-w-360 mx-auto px-4 md:px-10 py-10 font-sans min-h-[60vh] select-none">
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black mb-6 uppercase">
        YOUR WISHLIST
      </h1>

      {wishlist.length > 0 ? (
        <div>
          {/* Şəkildəki ilə 1-ə 1 eyni Clear wishlist düyməsi */}
          <button
            type="button"
            onClick={clearWishlist}
            className="border border-gray-300 hover:border-black rounded-full px-6 py-2.5 text-sm font-bold text-black transition-all cursor-pointer bg-transparent hover:bg-gray-50 mb-8"
          >
            Clear wishlist
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                    <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-xs overflow-hidden mb-3">
                      <img
                        src={activeImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none"
                      />

                      <button
                        type="button"
                        onClick={(e) => handleWishlistClick(e, product)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer z-20"
                        aria-label="Remove from wishlist"
                      >
                        <Heart className="w-5 h-5 fill-black text-black transition-colors" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleCartClick(e, product)}
                        className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4 text-black" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mb-2 min-h-[28px]">
                      {product.colors?.map((color, cIdx) => {
                        const colorId = color.id || cIdx;
                        const isActive = activeColor?.id === colorId;

                        return (
                          <button
                            type="button"
                            key={colorId}
                            onClick={(e) => changeColor(e, identifier, color)}
                            className={`w-6 h-6 rounded-xs overflow-hidden border cursor-pointer transition-all z-20 ${
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
                        className={`inline-block text-xs font-semibold mb-1 ${
                          product.badgeType === 'outlet' ? 'text-red-700' : 'text-red-600'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-black tracking-tight leading-tight group-hover:underline">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{product.sub}</p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-bold text-black">${product.price}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${product.oldPrice}
                      </span>
                    )}
                    {product.discountPercent && (
                      <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-xs font-bold">
                        {product.discountPercent}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <p className="text-sm text-gray-700 max-w-[400px] mb-6 font-medium">
            Items added to your favorites will be on your wishlist.
          </p>

          <Link
            to="/"
            className="bg-black text-white rounded-full px-8 py-3 font-bold text-sm hover:opacity-90 transition-opacity mb-12 uppercase"
          >
            Continue shopping
          </Link>

          <div className="flex flex-col items-center gap-2">
            <Heart className="w-6 h-6 text-black" />
            <h2 className="font-bold text-lg">Save your favorites</h2>
            <p className="text-sm text-gray-500">
              Add all the items you want to save and find them here!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;