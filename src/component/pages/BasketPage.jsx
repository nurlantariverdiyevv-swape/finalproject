import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ChevronRight, Package, X } from 'lucide-react';
import { useBasket } from '../../context/BasketContext';

function InfoDrawer({ open, onClose, title, children }) {
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/40 z-[110] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[120] shadow-2xl transition-transform duration-300 transform overflow-y-auto ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-black">{title}</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 cursor-pointer" aria-label="Close">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6 text-xs text-gray-700 leading-relaxed font-normal">{children}</div>
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

  const paymentLogos = [
    { name: 'Visa', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/3840px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png' },
    { name: 'Mastercard', url: 'https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo.png' },
    { name: 'Amex', url: 'https://1000logos.net/wp-content/uploads/2016/10/American-Express-Color.png' },
    { name: 'Discover', url: 'https://1000logos.net/wp-content/uploads/2021/05/Discover-logo.png' },
    { name: 'PayPal', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png' },
    { name: 'Apple Pay', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/960px-Apple_Pay_logo.svg.png' },
    { name: 'Google Pay', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1280px-Google_Pay_Logo.svg.png' },
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 text-black font-sans antialiased">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {basket.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SOL TƏRƏF */}
            <div className="lg:col-span-6 bg-white p-6 md:p-7 rounded-xl border border-gray-200/80">
              <h1 className="text-base font-bold mb-6 text-black">
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
                        <Link to={`/product/${item.id}`} className="w-20 h-20 md:w-24 md:h-24 bg-[#f5f5f5] rounded-lg overflow-hidden shrink-0 flex items-center justify-center cursor-pointer">
                          <img src={itemImage} alt={item.name} className="w-full h-full object-cover" />
                        </Link>

                        <div className="flex flex-col gap-1">
                          <Link to={`/product/${item.id}`} className="text-xs md:text-sm font-bold uppercase tracking-tight text-black hover:underline cursor-pointer">
                            {item.name}
                          </Link>
                          
                          <div className="flex flex-col text-xs text-gray-500 font-normal mt-0.5">
                            <p>Size: {itemSize}</p>
                            <p>Color: {itemColor}</p>
                          </div>

                          <div className="mt-2 inline-flex items-center border border-gray-300 rounded-full px-2.5 py-1 w-fit bg-white gap-3">
                            <button type="button" onClick={() => updateQuantity(item.id, itemSize, itemColor, -1)} className="text-black hover:opacity-70 cursor-pointer">
                              {item.quantity === 1 ? <Trash2 size={12} strokeWidth={1.5} /> : <Minus size={12} strokeWidth={1.5} />}
                            </button>
                            
                            <span className="text-xs font-semibold select-none">{item.quantity}</span>
                            
                            <button type="button" onClick={() => updateQuantity(item.id, itemSize, itemColor, 1)} className="text-black hover:opacity-70 cursor-pointer">
                              <Plus size={12} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm md:text-base font-bold text-black">${item.price * item.quantity}</span>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* SAĞ TƏRƏF */}
            <div className="lg:col-span-6 bg-white p-6 md:p-7 rounded-xl border border-gray-200/80 sticky top-6">
              <h2 className="text-base font-bold mb-5 text-black">Order Summary</h2>

              <div className="mb-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-black select-none">
                  <input type="checkbox" checked={hasPromoCode} onChange={(e) => setHasPromoCode(e.target.checked)} className="w-4 h-4 rounded border-black text-black accent-black cursor-pointer" />
                  <span>Have a promo code?</span>
                </label>

                {hasPromoCode && (
                  <div className="flex gap-2 mt-3">
                    <input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Type your code" className="flex-1 px-3.5 py-2 border border-gray-300 rounded-md text-xs font-normal outline-none focus:border-black placeholder-gray-400 text-black" />
                    <button type="button" className="px-5 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer">
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 pb-4 text-xs font-medium text-gray-700">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">${subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax</span>
                  <span className="font-bold text-black">$0</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 text-base font-bold border-t border-gray-100 text-black">
                <span>Total</span>
                <span className="font-bold">${subtotal}</span>
              </div>

              <button type="button" className="w-full py-3 bg-black text-white rounded-full text-xs font-bold tracking-wide hover:bg-gray-800 transition-all cursor-pointer my-2">
                Proceed to checkout
              </button>

              <div className="divide-y divide-gray-100 text-xs text-black mt-3 border-t border-gray-100">
                <button type="button" onClick={() => setActiveDrawer("points")} className="w-full flex items-center justify-between py-3 cursor-pointer group text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold italic text-xs">s/+</span>
                    <span className="font-medium text-gray-800">+{subtotal} points with this purchase</span>
                  </div>
                  <ChevronRight size={14} strokeWidth={1.5} className="text-black group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button type="button" onClick={() => setActiveDrawer("returns")} className="w-full flex items-center justify-between py-3 cursor-pointer group text-left">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-black" strokeWidth={1.5} />
                    <span className="font-medium text-gray-800">Free Returns Within 45 Days</span>
                  </div>
                  <ChevronRight size={14} strokeWidth={1.5} className="text-black group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="mt-6 text-center border-t border-gray-100 pt-4">
                <span className="text-[11px] text-gray-500 font-normal block mb-2.5">Easy payment</span>
                <div className="flex items-center justify-center flex-wrap gap-1.5">
                  {paymentLogos.map((logo) => (
                    <div key={logo.name} className="h-4 w-7 bg-[#f4f4f4] rounded-[2px] flex items-center justify-center p-0.5">
                      <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white rounded-xl p-10 text-center border border-gray-200/80 max-w-xl mx-auto">
            <h1 className="text-base font-bold mb-2 text-black">Your cart is empty</h1>
            <p className="text-xs text-gray-500 mb-5 font-normal">Discover our product range</p>
            <Link to="/shop" className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-bold inline-block hover:bg-gray-800">
              Start Shopping
            </Link>
          </div>
        )}

      </div>

      <InfoDrawer open={activeDrawer === "points"} onClose={() => setActiveDrawer(null)} title="S/PLUS Points">
        <p>Earn points with every purchase and enjoy exclusive member rewards.</p>
      </InfoDrawer>

      <InfoDrawer open={activeDrawer === "returns"} onClose={() => setActiveDrawer(null)} title="Free Returns Within 45 Days">
        <p>Free returns by mail within 45 days of delivery.</p>
      </InfoDrawer>
    </div>
  );
}

export default BasketPage;