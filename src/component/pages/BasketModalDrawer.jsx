import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useBasket } from '../../context/BasketContext';
import { useDataContext } from '../../context/DataContext';
import { useWishlist } from '../../context/WishlistContext';

// 1. Size Selection Modal
export function SizeSelectionModal() {
  const { sizeModalProduct, closeSizeModal, addToBasket } = useBasket();
  const [selectedSize, setSelectedSize] = useState('');

  if (!sizeModalProduct) return null;

  const defaultSizes = ["4 - 5½ Men's", "6 - 8 Men's", "8½-11 Men's", "11½-14 Men's"];
  const sizesToRender = sizeModalProduct.sizes?.length
    ? sizeModalProduct.sizes.map((s) => (typeof s === 'object' ? s.label : s))
    : defaultSizes;

  const selectedColor = sizeModalProduct.selectedColor || sizeModalProduct.color || sizeModalProduct.colors?.[0]?.name || 'Default';
  const selectedImage = sizeModalProduct.selectedImage || sizeModalProduct.images?.[0] || sizeModalProduct.img;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 text-black antialiased">
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <h2 className="font-heading-runova text-[19px] leading-[1.3] font-bold uppercase text-black">Select size</h2>
            <button type="button" onClick={closeSizeModal} className="p-1 hover:opacity-70 cursor-pointer">
              <X size={20} className="text-black" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex gap-4 items-start mb-6">
            <div className="w-[72px] h-[72px] bg-[#f5f5f5] rounded-[10px] overflow-hidden shrink-0">
              <img src={selectedImage} alt={sizeModalProduct.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-[17px] leading-[1.3] font-semibold uppercase tracking-[-0.01em] text-black">{sizeModalProduct.name}</h3>
              <p className="text-[13px] text-gray-500 font-light mt-0.5">Color: {selectedColor}</p>
              <p className="text-[15px] font-semibold text-black mt-1.5">${sizeModalProduct.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {sizesToRender.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-4 text-[13px] font-semibold rounded-[6px] border transition-all cursor-pointer ${
                    isSelected ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:border-black'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <button
            type="button"
            disabled={!selectedSize}
            onClick={() => addToBasket(sizeModalProduct, selectedSize, selectedColor, selectedImage)}
            className={`w-full py-[14px] rounded-full text-[15px] font-semibold transition-all cursor-pointer ${
              selectedSize ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Add to cart
          </button>

          <div className="text-center mt-4">
            <Link
              to={`/product/${sizeModalProduct.id}`}
              onClick={closeSizeModal}
              className="text-[13px] font-semibold text-black underline underline-offset-4 hover:text-gray-600"
            >
              Product details {sizeModalProduct.colors?.length ? `• ${sizeModalProduct.colors.length} colors` : ''}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Added To Bag Drawer
export function AddedToBagDrawer() {
  const { addedSuccessProduct, setAddedSuccessProduct, totalBasketCount, openSizeModal } = useBasket();
  const { shopProducts = [] } = useDataContext();
  const { wishlist, toggleWishlist } = useWishlist();

  // shopProducts is the single product source now, use it directly.
  const allProducts = shopProducts;

  // For the "Complete this product with..." section, real products from the data
  // are picked (same category first, if available) and shown as a stacked list.
  const recommendedProducts = !addedSuccessProduct ? [] : (() => {
    const pool = allProducts.filter((p) => p.id !== addedSuccessProduct.id);
    const sameCategory = pool.filter((p) => p.category === addedSuccessProduct.category);
    const rest = pool.filter((p) => p.category !== addedSuccessProduct.category);
    return [...sameCategory, ...rest].slice(0, 4);
  })();

  if (!addedSuccessProduct) return null;

  const itemColor = addedSuccessProduct.selectedColor || addedSuccessProduct.color || addedSuccessProduct.colors?.[0]?.name || 'Default';
  const itemImage = addedSuccessProduct.selectedImage || addedSuccessProduct.images?.[0] || addedSuccessProduct.img;

  const handleRecommendedCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedSuccessProduct(null);
    openSizeModal(item);
  };

  const handleRecommendedWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 text-black antialiased">
      <div className="w-full max-w-md bg-white h-full flex flex-col p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <h2 className="font-heading-runova text-[19px] leading-[1.3] font-bold uppercase text-black">Product added to your bag</h2>
          <button type="button" onClick={() => setAddedSuccessProduct(null)} className="p-1 hover:opacity-70 cursor-pointer">
            <X size={20} className="text-black" strokeWidth={1.5} />
          </button>
        </div>

        <Link
          to={`/product/${addedSuccessProduct.id}`}
          onClick={() => setAddedSuccessProduct(null)}
          className="flex gap-4 mb-6 no-underline"
        >
          <div className="w-24 h-24 bg-[#f5f5f5] rounded-[10px] overflow-hidden shrink-0">
            <img src={itemImage} alt={addedSuccessProduct.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-[17px] leading-[1.3] font-semibold uppercase tracking-[-0.01em] text-black hover:underline">{addedSuccessProduct.name}</h3>
            <p className="text-[13px] text-gray-500 font-light mt-0.5">{addedSuccessProduct.subCategory || 'Sneakers'} - Unisex</p>
            <div className="flex flex-col text-[13px] text-gray-500 font-light mt-0.5">
              <span>Size: {addedSuccessProduct.selectedSize}</span>
              <span>Color: {itemColor}</span>
            </div>
            <p className="text-[16px] font-semibold text-black mt-1.5">${addedSuccessProduct.price}</p>
          </div>
        </Link>

        <div className="space-y-2 mb-8">
          <Link
            to="/basket"
            onClick={() => setAddedSuccessProduct(null)}
            className="block w-full py-[13px] border border-black rounded-full text-center text-[15px] font-semibold text-black hover:bg-black hover:text-white transition-all"
          >
            See cart ({totalBasketCount})
          </Link>

          <Link
            to="/basket"
            onClick={() => setAddedSuccessProduct(null)}
            className="block w-full py-[13px] bg-black text-white rounded-full text-center text-[15px] font-semibold hover:bg-gray-800 transition-all"
          >
            Proceed to checkout
          </Link>
        </div>

        {recommendedProducts.length > 0 && (
          <div>
            <h4 className="text-[13px] font-bold text-black uppercase tracking-wide mb-4">Complete this product with...</h4>

            {/* Stacked list: clicking a row goes to the detail page,
                while the right side of the row has quick add-to-basket/wishlist buttons */}
            <div className="divide-y divide-gray-100 border-t border-gray-100">
              {recommendedProducts.map((item) => {
                const isLiked = wishlist.some((w) => w.id === item.id);
                const itemImg = item.images?.[0] || item.img;

                return (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    onClick={() => setAddedSuccessProduct(null)}
                    className="flex items-center gap-3 py-3 no-underline group"
                  >
                    <div className="w-14 h-14 bg-[#f5f5f5] rounded-[8px] overflow-hidden shrink-0">
                      <img src={itemImg} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="text-[13px] font-semibold uppercase tracking-[-0.01em] text-black truncate group-hover:underline">{item.name}</h5>
                      <p className="text-[12px] text-gray-500 font-light truncate">{item.sub || item.subCategory || 'Accessories'}</p>
                      <p className="text-[13px] font-semibold text-black mt-0.5">${item.price}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleRecommendedWishlist(e, item)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Add to wishlist"
                      >
                        <Heart size={16} strokeWidth={1.5} className={isLiked ? 'fill-black text-black' : 'text-black'} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleRecommendedCart(e, item)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag size={16} strokeWidth={1.5} className="text-black" />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
