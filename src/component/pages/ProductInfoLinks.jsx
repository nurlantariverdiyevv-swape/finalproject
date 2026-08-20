import { useState } from "react";
import { X, Truck, Store, Package } from "lucide-react";

function InfoDrawer({ open, onClose, title, children }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[110] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[120] shadow-2xl transition-transform duration-300 transform overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 cursor-pointer" aria-label="Close">
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="p-6 text-sm text-gray-800 leading-relaxed">{children}</div>
      </div>
    </>
  );
}

function ProductInfoLinks() {
  const [activeDrawer, setActiveDrawer] = useState(null);

  return (
    <>
      <div className="pt-2 border-t border-gray-200 text-sm">
        <button onClick={() => setActiveDrawer("returns")} className="w-full py-3 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 text-left cursor-pointer">
          <div className="flex items-center gap-3"><Package className="w-5 h-5" strokeWidth={1.5} /><span className="font-medium">Free Returns Within 45 Days</span></div>
        </button>
        <button onClick={() => setActiveDrawer("shipping")} className="w-full py-3 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 text-left cursor-pointer">
          <div className="flex items-center gap-3"><Truck className="w-5 h-5" strokeWidth={1.5} /><span className="font-medium">Free Shipping for S/PLUS Members</span></div>
        </button>
        <button onClick={() => setActiveDrawer("store")} className="w-full py-3 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 text-left cursor-pointer">
          <div className="flex items-center gap-3"><Store className="w-5 h-5" strokeWidth={1.5} /><span className="font-medium">Find in store</span></div>
        </button>
      </div>

      <InfoDrawer open={activeDrawer === "returns"} onClose={() => setActiveDrawer(null)} title="Free Returns Within 45 Days">
        <p>Free returns by mail within 45 days of delivery.</p>
      </InfoDrawer>
      <InfoDrawer open={activeDrawer === "shipping"} onClose={() => setActiveDrawer(null)} title="Free Shipping">
        <p>S/Plus Members will receive free shipping on every purchase.</p>
      </InfoDrawer>
      <InfoDrawer open={activeDrawer === "store"} onClose={() => setActiveDrawer(null)} title="Find in store">
        <p>Check stock availability in nearby stores.</p>
      </InfoDrawer>
    </>
  );
}

export default ProductInfoLinks;