import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ChevronRight, Package, X, ShoppingBag } from 'lucide-react';
import { useBasket } from '../../context/BasketContext';
import { useDataContext } from '../../context/DataContext';
import ImageWithSkeleton from '../ImageWithSkeleton';

function InfoDrawer({ open, onClose, title, children }) {
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/40 z-[110] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />
      <div className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-[120] shadow-2xl transition-transform duration-300 transform overflow-y-auto text-black antialiased ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-heading-runova text-[19px] leading-[1.3] font-bold uppercase text-black">{title}</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 cursor-pointer" aria-label="Close">
            <X size={20} className="text-black" strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6 text-[15px] text-gray-700 leading-relaxed font-light">{children}</div>
      </div>
    </>
  );
}

function BasketPage() {
  const { basket, updateQuantity, subtotal } = useBasket();
  const [hasPromoCode, setHasPromoCode] = useState(true);
  const [promoInput, setPromoInput] = useState('');
  const [activeDrawer, setActiveDrawer] = useState(null);

  const totalItems = basket.reduce((a, b) => a + b.quantity, 0);

  // The payment logos are no longer hardcoded, they come from the Vercel
  // API's content.json (content.basket.paymentLogos).
  const { content } = useDataContext();
  const paymentLogos = content?.basket?.paymentLogos || [];

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 text-black antialiased">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {basket.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SOL TƏRƏF */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-[28px] rounded-xl border border-gray-200/80">
              <h1 className="font-heading-runova text-[19px] leading-[1.3] font-bold uppercase mb-[24px] text-black">
                Your bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h1>

              <div className="divide-y divide-gray-100">
                {basket.map((item) => {
                  const itemColor = item.selectedColor || item.color || item.colors?.[0]?.name || 'Default';
                  const itemSize = item.selectedSize || 'NS';
                  const itemImage = item.selectedImage || item.images?.[0] || item.img;
                  const uniqueKey = `${item.id}-${itemSize}-${itemColor}`;

                  return (
                    <div key={uniqueKey} className="py-5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                      
                      <div className="flex gap-4 items-start">
                        <Link to={`/product/${item.id}`} className="w-[96px] h-[96px] bg-[#f5f5f5] rounded-[10px] overflow-hidden shrink-0 flex items-center justify-center cursor-pointer">
                          <ImageWithSkeleton src={itemImage} alt={item.name} className="w-full h-full object-cover" />
                        </Link>

                        <div className="flex flex-col gap-[3px]">
                          <Link to={`/product/${item.id}`} className="text-[15px] leading-[1.3] font-semibold uppercase tracking-[-0.01em] text-black hover:underline cursor-pointer">
                            {item.name}
                          </Link>
                          
                          <div className="flex flex-col text-[15px] leading-[1.5] text-gray-500 font-light mt-[2px]">
                            <p>Size: {itemSize}</p>
                            <p>Color: {itemColor}</p>
                          </div>

                          <div className="mt-[10px] inline-flex items-center border border-gray-300 rounded-full px-[12px] py-[5px] w-fit bg-white gap-[12px]">
                            <button type="button" onClick={() => updateQuantity(item.id, itemSize, itemColor, -1)} className="text-black hover:opacity-70 cursor-pointer">
                              {item.quantity === 1 ? <Trash2 size={12} strokeWidth={1.5} /> : <Minus size={12} strokeWidth={1.5} />}
                            </button>
                            
                            <span className="text-[15px] font-semibold select-none min-w-[8px] text-center">{item.quantity}</span>
                            
                            <button type="button" onClick={() => updateQuantity(item.id, itemSize, itemColor, 1)} className="text-black hover:opacity-70 cursor-pointer">
                              <Plus size={12} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[16px] font-semibold text-black whitespace-nowrap">${item.price * item.quantity}</span>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-[28px] rounded-xl border border-gray-200/80 sticky top-6">
              <h2 className="font-heading-runova text-[19px] leading-[1.3] font-bold uppercase mb-[24px] text-black">Order Summary</h2>

              {/* PROMO CODE SECTION (OPTIMIZED) */}
              <div className="mb-5">
                <label className="flex items-center gap-2 cursor-pointer text-[15px] font-semibold text-black select-none">
                  <input type="checkbox" checked={hasPromoCode} onChange={(e) => setHasPromoCode(e.target.checked)} className="w-[15px] h-[15px] rounded border-black text-black accent-black cursor-pointer" />
                  <span>Have a promo code?</span>
                </label>

                {hasPromoCode && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 items-stretch sm:items-center">
                    <input 
                      type="text" 
                      value={promoInput} 
                      onChange={(e) => setPromoInput(e.target.value)} 
                      placeholder="Type your code" 
                      className="w-full sm:w-auto sm:max-w-[240px] px-[14px] py-[9px] border border-gray-300 rounded-[6px] text-[15px] font-light outline-none focus:border-black placeholder-gray-400 text-black" 
                    />
                    <button type="button" className="px-[22px] py-[9px] bg-black text-white rounded-full text-[15px] font-semibold hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap">
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-[5px] pb-4 text-[15px] font-normal text-gray-700">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">${subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax</span>
                  <span className="font-semibold text-black">$0</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-[14px] text-[19px] font-semibold border-t border-gray-100 text-black">
                <span>Total</span>
                <span className="font-semibold">${subtotal}</span>
              </div>

              <button type="button" className="w-full py-[14px] bg-black text-white rounded-full text-[15px] font-semibold tracking-wide hover:bg-gray-800 transition-all cursor-pointer my-[6px]">
                Proceed to checkout
              </button>

              <div className="divide-y divide-gray-100 text-[15px] text-black mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setActiveDrawer("points")} className="w-full flex items-center justify-between py-[13px] cursor-pointer group text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold italic text-[15px]">R+</span>
                    <span className="font-normal text-gray-800">+{subtotal} points with this purchase</span>
                  </div>
                  <ChevronRight size={14} strokeWidth={1.5} className="text-black group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button type="button" onClick={() => setActiveDrawer("returns")} className="w-full flex items-center justify-between py-[13px] cursor-pointer group text-left">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-black" strokeWidth={1.5} />
                    <span className="font-normal text-gray-800">Free Returns Within 45 Days</span>
                  </div>
                  <ChevronRight size={14} strokeWidth={1.5} className="text-black group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="mt-[22px] text-center border-t border-gray-100 pt-4">
                <span className="text-[14px] text-gray-500 font-light block mb-[10px]">Easy payment</span>
                <div className="flex items-center justify-center flex-wrap gap-[10px]">
                  {paymentLogos.map((logo) => (
                    <div key={logo.name} className="h-[16px] w-[28px] bg-[#f4f4f2] rounded-[2px] flex items-center justify-center p-[2px]">
                      <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white p-5 sm:p-[28px] rounded-xl border border-gray-200/80 max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center text-center py-16">
              <p className="text-[15px] text-gray-500 max-w-[400px] mb-6 font-light">
                Items you add to your bag will show up here.
              </p>

              <Link
                to="/shop"
                className="bg-black text-white rounded-full px-8 py-[13px] font-semibold text-[15px] hover:bg-gray-800 transition-colors mb-12"
              >
                Start shopping
              </Link>

              <div className="flex flex-col items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-black" strokeWidth={1.5} />
                <h2 className="font-heading-runova font-bold text-[19px] uppercase text-black">Your cart is empty</h2>
                <p className="text-[15px] text-gray-500 font-light">
                  Discover our product range and start shopping!
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      <InfoDrawer open={activeDrawer === "points"} onClose={() => setActiveDrawer(null)} title="R+ Points">
        <p>Earn points with every purchase and enjoy exclusive member rewards.</p>
      </InfoDrawer>

      <InfoDrawer open={activeDrawer === "returns"} onClose={() => setActiveDrawer(null)} title="Free Returns Within 45 Days">
        <p>Free returns by mail within 45 days of delivery.</p>
      </InfoDrawer>
    </div>
  );
}

export default BasketPage;