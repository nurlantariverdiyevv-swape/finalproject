import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import WishlistProductCard from './WishlistProductCard';

function WishlistPage({ onAddToCart }) {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const [selectedColors, setSelectedColors] = useState({});

  const changeColor = (e, productId, colorObj) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColors((prev) => ({ ...prev, [productId]: colorObj }));
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 text-black antialiased">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-white p-5 sm:p-[28px] rounded-xl border border-gray-200/80">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-[24px]">
            <h1 className="font-heading-runova text-[19px] leading-[1.3] font-bold uppercase text-black">
              Your wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
            </h1>

            {wishlist.length > 0 && (
              <button type="button" onClick={clearWishlist} className="border border-gray-300 hover:border-black rounded-full px-5 py-[9px] text-[13px] font-semibold text-black transition-all cursor-pointer bg-white hover:bg-gray-50">
                Clear wishlist
              </button>
            )}
          </div>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {wishlist.map((product, index) => {
                const identifier = product.id;
                const activeColor = selectedColors[identifier] || product.colors?.[0];

                return (
                  <WishlistProductCard key={identifier} product={product} index={index} activeColor={activeColor} onColorChange={changeColor} onToggleWishlist={toggleWishlist} onAddToCart={onAddToCart} />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <p className="text-[15px] text-gray-500 max-w-[400px] mb-6 font-light">
                Items added to your favorites will be on your wishlist.
              </p>

              <Link to="/" className="bg-black text-white rounded-full px-8 py-[13px] font-semibold text-[15px] hover:bg-gray-800 transition-colors mb-12">
                Continue shopping
              </Link>

              <div className="flex flex-col items-center gap-2">
                <Heart className="w-6 h-6 text-black" strokeWidth={1.5} />
                <h2 className="font-heading-runova font-bold text-[19px] uppercase text-black">Save your favorites</h2>
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