import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ChevronRight, Package, Truck } from 'lucide-react';
import { useBasket } from '../../context/BasketContext';

// Sənin öz yazdığın mükəmməl komponent:
import ProductSlider from "./ProductSlider"; // fayl yolunu lazımdırsa tənzimləyin

function BasketPage({ onAddToCart }) {
  const { basket, updateQuantity, subtotal } = useBasket();
  const [hasPromoCode, setHasPromoCode] = useState(true);
  const [promoInput, setPromoInput] = useState('');

  const totalItems = basket.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 md:py-10 text-black font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* ==================== UPPER SECTION: BASKET & SUMMARY ==================== */}
        {basket.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-12">
            
            {/* SOL: YOUR BAG */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-200/60 shadow-xs">
              <h1 className="text-xl md:text-2xl font-bold mb-6">
                Your bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h1>

              <div className="divide-y divide-gray-100">
                {basket.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="py-6 first:pt-2 last:pb-2 flex items-center justify-between gap-4">
                    
                    <div className="flex gap-4 md:gap-6 items-center">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-[#f0f0f0] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={item.images?.[0] || item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm md:text-base font-bold uppercase tracking-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">
                          Size: {item.selectedSize || 'NS'}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">
                          Color: {item.color || item.colors?.[0]?.name || 'Standard'}
                        </p>

                        <div className="mt-3 inline-flex items-center border border-gray-300 rounded-full px-3 py-1 w-fit bg-white gap-3">
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.id, item.selectedSize, -1)} 
                            className="text-gray-700 hover:text-black cursor-pointer"
                          >
                            {item.quantity === 1 ? <Trash2 size={14} strokeWidth={1.8} /> : <Minus size={14} strokeWidth={1.8} />}
                          </button>
                          
                          <span className="text-xs font-bold select-none">{item.quantity}</span>
                          
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.id, item.selectedSize, 1)} 
                            className="text-gray-700 hover:text-black cursor-pointer"
                          >
                            <Plus size={14} strokeWidth={1.8} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm md:text-base font-bold">
                        ${item.price * item.quantity}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* SAĞ: ORDER SUMMARY */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-gray-200/60 shadow-xs sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold mb-3 select-none">
                  <input 
                    type="checkbox" 
                    checked={hasPromoCode} 
                    onChange={(e) => setHasPromoCode(e.target.checked)} 
                    className="w-4 h-4 rounded border-gray-300 text-black accent-black cursor-pointer" 
                  />
                  <span>Have a promo code?</span>
                </label>

                {hasPromoCode && (
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      value={promoInput} 
                      onChange={(e) => setPromoInput(e.target.value)} 
                      placeholder="Type your code" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-black transition-all pr-24" 
                    />
                    <button 
                      type="button" 
                      className="absolute right-1 px-6 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 pb-4 text-xs md:text-sm text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Subtotal</span>
                  <span className="font-bold text-black">${subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Tax</span>
                  <span className="font-bold text-black">$0</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-100 text-base md:text-lg font-bold">
                <span>Total</span>
                <span>${subtotal}</span>
              </div>

              <button 
                type="button" 
                className="w-full py-3.5 bg-black text-white rounded-full text-xs md:text-sm font-bold tracking-wider hover:bg-gray-800 transition-all cursor-pointer mt-1 mb-6"
              >
                Proceed to checkout
              </button>

              <div className="space-y-4 text-xs text-gray-800 border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <span className="font-bold italic text-sm">S/+</span>
                    <span className="font-medium">+{subtotal} points with this purchase</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                </div>

                <div className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-gray-700" strokeWidth={1.8} />
                    <span className="font-medium">Free Returns Within 45 Days</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                </div>
              </div>

              <div className="mt-8 text-center">
                <span className="text-[11px] text-gray-500 font-medium block mb-2">Easy payment</span>
                <div className="flex items-center justify-center flex-wrap gap-1.5 text-[9px] font-bold text-gray-600">
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">VISA</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">MC</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">AMEX</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">DISCOVER</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">PayPal</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">Pay</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">G Pay</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">Klarna.</span>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200/60 shadow-xs mb-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Your cart is empty</h1>
            <p className="text-sm text-gray-500 font-normal mb-6">Discover our product range</p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
              {['Women', 'Men', 'Kids', 'Sportstyle', 'Activities'].map((cat) => (
                <Link key={cat} to={`/shop/${cat.toLowerCase()}`} className="px-5 py-2 border border-gray-300 rounded-full text-xs font-semibold hover:bg-black hover:text-white transition-all">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ==================== PRODUCT SLIDER (SƏNİN ORİJİNAL KOMPONENİN) ==================== */}
        <div className="mt-6 bg-white rounded-2xl p-4 md:p-6 border border-gray-200/60">
          <ProductSlider onAddToCart={onAddToCart} />

          {/* 2-ci Şəklin Ən Aşağıdakı Zəmanət Bannerləri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between bg-[#f8f8f8] p-4 rounded-xl cursor-pointer group hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-black" />
                <span className="text-xs md:text-sm font-semibold">Free Returns Within 45 Days</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
            </div>

            <div className="flex items-center justify-between bg-[#f8f8f8] p-4 rounded-xl cursor-pointer group hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-black" />
                <span className="text-xs md:text-sm font-semibold">Free Shipping for S/PLUS Members</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BasketPage;