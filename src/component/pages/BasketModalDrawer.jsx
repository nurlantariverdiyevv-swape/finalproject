import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useBasket } from '../../context/BasketContext';

export function SizeSelectionModal() {
  const { sizeModalProduct, closeSizeModal, addToBasket } = useBasket();
  const [selectedSize, setSelectedSize] = useState('');

  if (!sizeModalProduct) return null;

  const defaultSizes = ["4 - 5½ Men's", "6 - 8 Men's", "8½-11 Men's", "11½-14 Men's"];
  const sizesToRender = sizeModalProduct.sizes?.length
    ? sizeModalProduct.sizes.map((s) => (typeof s === 'object' ? s.label : s))
    : defaultSizes;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-300">
        <div>
          <div className="flex justify-end mb-6">
            <button type="button" onClick={closeSizeModal} className="p-1 hover:opacity-70 cursor-pointer">
              <X size={22} className="text-black" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-black mb-6">Select size</h2>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {sizesToRender.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button type="button" key={size} onClick={() => setSelectedSize(size)} className={`py-3 px-4 text-xs font-semibold rounded-xs border transition-all cursor-pointer ${isSelected ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 text-gray-900 hover:border-black'}`}>
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <button type="button" disabled={!selectedSize} onClick={() => addToBasket(sizeModalProduct, selectedSize)} className={`w-full py-3.5 rounded-full text-sm font-bold transition-all cursor-pointer ${selectedSize ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            Add to cart
          </button>

          <div className="text-center mt-4">
            <Link to={`/product/${sizeModalProduct.id}`} onClick={closeSizeModal} className="text-xs font-semibold text-black underline hover:text-gray-600">
              Product details {sizeModalProduct.colors?.length ? `• ${sizeModalProduct.colors.length} colors` : ''}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddedToBagDrawer({ recommendedProducts = [] }) {
  const { addedSuccessProduct, setAddedSuccessProduct, totalBasketCount } = useBasket();

  if (!addedSuccessProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
            <h2 className="text-base font-bold text-black">Product added to your bag</h2>
            <button type="button" onClick={() => setAddedSuccessProduct(null)} className="p-1 hover:opacity-70 cursor-pointer">
              <X size={20} className="text-black" />
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="w-24 h-24 bg-[#f5f5f5] rounded-xs overflow-hidden shrink-0">
              <img src={addedSuccessProduct.images?.[0] || addedSuccessProduct.img} alt={addedSuccessProduct.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black uppercase tracking-tight">{addedSuccessProduct.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{addedSuccessProduct.subCategory || 'Sneakers'} - Unisex</p>
              <p className="text-xs text-gray-500 mt-0.5">Size: {addedSuccessProduct.selectedSize}</p>
              <p className="text-sm font-bold text-black mt-2">${addedSuccessProduct.price}</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <Link to="/basket" onClick={() => setAddedSuccessProduct(null)} className="block w-full py-3 border border-black rounded-full text-center text-xs font-bold text-black hover:bg-black hover:text-white transition-all">
              See cart ({totalBasketCount})
            </Link>

            <Link to="/basket" onClick={() => setAddedSuccessProduct(null)} className="block w-full py-3 bg-black text-white rounded-full text-center text-xs font-bold hover:bg-gray-900 transition-all">
              Proceed to checkout
            </Link>
          </div>

          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-tight mb-4">Complete this product with...</h4>
            <div className="grid grid-cols-2 gap-3">
              {recommendedProducts.slice(0, 2).map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="w-full aspect-square bg-[#f5f5f5] rounded-xs overflow-hidden mb-2">
                    <img src={item.images?.[0] || item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <h5 className="text-xs font-bold text-black uppercase truncate">{item.name}</h5>
                  <p className="text-[11px] text-gray-500 truncate">{item.sub || 'Accessories'}</p>
                  <p className="text-xs font-bold text-black mt-0.5">${item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}