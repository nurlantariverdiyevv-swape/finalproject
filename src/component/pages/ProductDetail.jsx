import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Truck, Store, Package, Maximize2, ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";
import { useDataContext } from "../../context/DataContext";
import { useWishlist } from "../../context/WishlistContext";
import { useBasket } from "../../context/BasketContext";

const sizeGuideData = [
  { cm: 21.5, inch: 8.5, uk: 3.5, eur: 35 }, { cm: 22, inch: 8.7, uk: 4, eur: 36 },
  { cm: 22.5, inch: 8.9, uk: 4.5, eur: 37 }, { cm: 23, inch: 9.1, uk: 5, eur: 37.5 },
  { cm: 23.5, inch: 9.3, uk: 5.5, eur: 38 }, { cm: 24, inch: 9.4, uk: 6, eur: 39 },
  { cm: 24.5, inch: 9.6, uk: 6.5, eur: 39.5 }, { cm: 25, inch: 9.8, uk: 7, eur: 40 },
  { cm: 25.5, inch: 10, uk: 7.5, eur: 41 }, { cm: 26, inch: 10.2, uk: 8, eur: 42 },
  { cm: 26.5, inch: 10.4, uk: 8.5, eur: 42.5 }, { cm: 27, inch: 10.6, uk: 9, eur: 43 },
  { cm: 27.5, inch: 10.8, uk: 9.5, eur: 44 }, { cm: 28, inch: 11, uk: 10, eur: 44.5 },
  { cm: 28.5, inch: 11.2, uk: 10.5, eur: 45 }, { cm: 29, inch: 11.4, uk: 11, eur: 46 }
];

const measureSteps = [
  "Place a sheet of paper on the floor and against a wall",
  "Make sure you are wearing the same socks that you would normally wear with this type of shoe",
  "Wearing these socks, stand on the sheet of paper with your foot perpendicular to the wall and your heel against the wall.",
  "Then use a pen to draw a line just in front of your big toe. Repeat for both feet and take the longer distance to determine your size.",
  "Using a ruler, measure the distance between the wall and the line you drew to find your size."
];

function StarRating({ rating = 0 }) {
  const numericRating = parseFloat(rating) || 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((index) => {
        const fillPercent = Math.max(0, Math.min(100, (numericRating - (index - 1)) * 100));

        return (
          <div key={index} className="relative w-4 h-4 inline-block">
            <Star className="w-4 h-4 text-gray-300 absolute top-0 left-0" strokeWidth={0} fill="currentColor" />
            {fillPercent > 0 && (
              <div style={{ width: `${fillPercent}%` }} className="overflow-hidden absolute top-0 left-0 h-full">
                <Star className="w-4 h-4 text-black fill-black max-w-none" strokeWidth={0} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function InfoDrawer({ open, onClose, title, children }) {
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/40 z-[110] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[120] shadow-2xl transition-transform duration-300 transform overflow-y-auto ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 cursor-pointer" aria-label="Close"><X size={20} strokeWidth={2} /></button>
        </div>
        <div className="p-6 text-sm text-gray-800 leading-relaxed">{children}</div>
      </div>
    </>
  );
}

function SizeGuidePanel({ open, onClose, categoryLabel, maxRows }) {
  const [openSections, setOpenSections] = useState({ measure: true, guide: true });
  const [unit, setUnit] = useState("cm");
  const visibleRows = maxRows ? sizeGuideData.slice(0, maxRows) : sizeGuideData;

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/40 z-[110] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white z-[120] shadow-2xl transition-transform duration-300 transform overflow-y-auto ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold uppercase tracking-tight">{categoryLabel}</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 cursor-pointer" aria-label="Close"><X size={22} strokeWidth={1.5} /></button>
        </div>
        <div className="px-6 py-4">
          <div className="border-b border-gray-200 py-4">
            <button type="button" onClick={() => setOpenSections(p => ({ ...p, measure: !p.measure }))} className="w-full flex items-center justify-between text-sm font-bold uppercase cursor-pointer">
              <span>How to measure</span>
              {openSections.measure ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSections.measure && (
              <div className="mt-5 flex flex-col gap-4">
                <ol className="flex flex-col gap-2 text-sm text-gray-800">
                  {measureSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-2"><span className="font-bold">{idx + 1}.</span><span>{step}</span></li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <div className="border-b border-gray-200 py-4">
            <button type="button" onClick={() => setOpenSections(p => ({ ...p, guide: !p.guide }))} className="w-full flex items-center justify-between text-sm font-bold uppercase cursor-pointer">
              <span>Size guide</span>
              {openSections.guide ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSections.guide && (
              <div className="mt-4">
                <div className="inline-flex border border-gray-300 rounded-full overflow-hidden mb-4">
                  <button type="button" onClick={() => setUnit("cm")} className={`px-4 py-1 text-xs font-bold cursor-pointer ${unit === "cm" ? "bg-black text-white" : "bg-white text-gray-700"}`}>Cm</button>
                  <button type="button" onClick={() => setUnit("inch")} className={`px-4 py-1 text-xs font-bold cursor-pointer ${unit === "inch" ? "bg-black text-white" : "bg-white text-gray-700"}`}>Inch</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black text-left">
                        <th className="py-2 pr-3 font-bold text-xs uppercase">Foot Length ({unit})</th>
                        <th className="py-2 px-3 font-bold text-xs uppercase">UK</th>
                        <th className="py-2 pl-3 font-bold text-xs uppercase">EUR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2 pr-3">{unit === "cm" ? row.cm : row.inch}</td>
                          <td className="py-2 px-3">{row.uk}</td>
                          <td className="py-2 pl-3">{row.eur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ImageMagnifier({ src, alt, onClick }) {
  const [show, setShow] = useState(false);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleMouseEnter = (e) => {
    const { width, height } = e.currentTarget.getBoundingClientRect();
    setSize({ width, height });
    setShow(true);
  };

  const handleMouseMove = (e) => {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    setXy({ x: e.clientX - left, y: e.clientY - top });
  };

  const magSize = 160;
  const zoom = 2.2;

  return (
    <div className="relative w-full h-full overflow-hidden cursor-crosshair group" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={() => setShow(false)} onClick={onClick}>
      <img src={src} alt={alt} className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105" />
      {show && (
        <div style={{ position: "absolute", pointerEvents: "none", height: `${magSize}px`, width: `${magSize}px`, top: `${xy.y - magSize / 2}px`, left: `${xy.x - magSize / 2}px`, borderRadius: "50%", border: "2px solid white", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", backgroundImage: `url('${src}')`, backgroundRepeat: "no-repeat", backgroundSize: `${size.width * zoom}px ${size.height * zoom}px`, backgroundPositionX: `${-xy.x * zoom + magSize / 2}px`, backgroundPositionY: `${-xy.y * zoom + magSize / 2}px`, zIndex: 30 }} />
      )}
      <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pointer-events-none">
        <Sparkles size={11} className="text-yellow-400" /> Hover to Zoom
      </div>
    </div>
  );
}

function ModernImageGallery({ images, currentSlide, setCurrentSlide, alt }) {
  const [lightbox, setLightbox] = useState(false);
  const [scale, setScale] = useState(1);
  const total = images.length;

  const goPrev = (e) => { e?.stopPropagation(); setScale(1); setCurrentSlide((prev) => (prev - 1 + total) % total); };
  const goNext = (e) => { e?.stopPropagation(); setScale(1); setCurrentSlide((prev) => (prev + 1) % total); };

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightbox) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  return (
    <div className="w-full relative">
      <div className="relative w-full aspect-square bg-[#f7f7f7] rounded-xl overflow-hidden border border-gray-200/60 group">
        <ImageMagnifier src={images[currentSlide]} alt={alt} onClick={() => setLightbox(true)} />
        
        {total > 1 && (
          <>
            <button type="button" onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-black shadow-md flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"><ChevronLeft size={22} /></button>
            <button type="button" onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-black shadow-md flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"><ChevronRight size={22} /></button>
          </>
        )}

        <button type="button" onClick={() => setLightbox(true)} className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-black shadow-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"><Maximize2 size={16} /></button>

        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full z-20">
            {images.map((_, idx) => (
              <button key={idx} type="button" onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full cursor-pointer transition-all ${idx === currentSlide ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col justify-between p-4 select-none">
          <div className="flex items-center justify-between text-white z-20">
            <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full">{currentSlide + 1} / {total}</span>
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full">
              <button type="button" onClick={() => setScale(p => Math.min(p + 0.5, 3))} className="p-1.5 hover:bg-white/20 rounded-full text-white cursor-pointer"><ZoomIn size={16} /></button>
              <button type="button" onClick={() => setScale(p => Math.max(p - 0.5, 1))} className="p-1.5 hover:bg-white/20 rounded-full text-white cursor-pointer"><ZoomOut size={16} /></button>
              <button type="button" onClick={() => setScale(1)} className="p-1.5 hover:bg-white/20 rounded-full text-white cursor-pointer"><RotateCcw size={14} /></button>
            </div>
            <button type="button" onClick={() => setLightbox(false)} className="p-2 rounded-full bg-white/10 text-white cursor-pointer"><X size={20} /></button>
          </div>
          <div className="relative flex-1 flex items-center justify-center my-2 overflow-hidden">
            <div style={{ transform: `scale(${scale})` }} className="transition-transform duration-200 max-h-full max-w-full flex items-center justify-center">
              <img src={images[currentSlide]} alt={alt} className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg" />
            </div>
            {total > 1 && (
              <>
                <button type="button" onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white cursor-pointer"><ChevronLeft size={24} /></button>
                <button type="button" onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white cursor-pointer"><ChevronRight size={24} /></button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { slider = [], fetchSlider, sliderLoading, shopProducts = [], fetchShopProducts, shopLoading } = useDataContext();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToBasket } = useBasket();

  const [selectedSize, setSelectedSize] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeDrawer, setActiveDrawer] = useState(null);

  useEffect(() => {
    if (fetchSlider) fetchSlider();
    if (fetchShopProducts) fetchShopProducts();
  }, []);

  const allProducts = [...slider, ...shopProducts];
  const product = allProducts.find((item) => String(item.id) === String(id));
  const isLiked = product ? wishlist.some((item) => item.id === product.id) : false;
  const isLoading = (sliderLoading && slider.length === 0) || (shopLoading && shopProducts.length === 0);

  if (isLoading && !product) return <div className="p-10 text-center font-bold">Yüklənir...</div>;
  if (!product) return <div className="p-10 text-center font-bold text-red-600">Məhsul tapılmadı!</div>;

  const categoryLabel = product.subCategory ? `${product.subCategory} Footwear` : "Footwear";
  const activeColor = product.colors?.[activeColorIndex] || product.colors?.[0];
  const baseGallery = (product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : product.images || [product.img]).filter(Boolean);
  const sliderImages = activeColor?.img ? [activeColor.img, ...baseGallery.filter((img) => img !== activeColor.img)] : baseGallery;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToBasket(product, selectedSize);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-[#111]">
      <nav className="flex items-center gap-2 text-sm text-gray-700 mb-6">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="text-gray-400">/</span>
        <Link to="#" className="hover:underline">Sportstyle</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-normal">Sneakers</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 lg:sticky lg:top-6">
          <ModernImageGallery images={sliderImages} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} alt={product.name} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1.5">
            {product.badge && <span className="text-red-600 font-semibold text-sm block">{product.badge}</span>}
            <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-black leading-none">{product.name}</h1>
            <p className="text-base text-gray-600 font-medium">{product.sub || product.subCategory || "Sneakers - Unisex"}</p>
            <div className="pt-1"><span className="text-2xl font-bold text-black">${product.price}</span></div>

            <div className="flex items-center gap-2 pt-1 text-sm">
              <StarRating rating={product.rating || 4.7} />
              <span className="font-bold text-black">{product.rating || "4.7"}</span>
              <span>·</span>
              <button type="button" className="underline font-medium text-black cursor-pointer">{product.reviewsCount || 609} reviews</button>
            </div>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {product.colors.map((color, idx) => (
                <button key={color.id || idx} type="button" onClick={() => { setActiveColorIndex(idx); setCurrentSlide(0); }} className={`w-14 h-14 rounded-lg overflow-hidden bg-[#f3f3f3] p-1 border cursor-pointer ${activeColorIndex === idx ? "border-black ring-1 ring-black" : "border-gray-200 opacity-80"}`} aria-label={color.name}>
                  <img src={color.img} alt={color.name} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}

          {product.sizes && (
            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="font-bold text-black">Sizes</span>
                <button type="button" onClick={() => setSizeGuideOpen(true)} className="font-semibold underline text-blue-900 cursor-pointer">Find my size</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size, idx) => {
                  const label = typeof size === "object" ? size.label : size;
                  const inStock = typeof size === "object" ? size.inStock !== false : true;
                  return (
                    <button key={idx} disabled={!inStock} onClick={() => setSelectedSize(label)} className={`py-3 text-sm font-semibold rounded-lg border cursor-pointer ${!inStock ? "border-gray-200 text-gray-300 line-through bg-gray-50" : selectedSize === label ? "border-black bg-white text-black ring-1 ring-black" : "border-gray-300 text-black hover:border-gray-400"}`}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full font-bold text-base py-3.5 rounded-full transition-colors uppercase ${selectedSize ? "bg-black text-white hover:bg-gray-800 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              Add to cart
            </button>
            <button onClick={() => toggleWishlist(product)} className="w-full border border-gray-300 font-bold text-base py-3 rounded-full flex items-center justify-center gap-2 hover:border-black cursor-pointer">
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-black"}`} />
              <span>{isLiked ? "In Wishlist" : "Add to wishlist"}</span>
            </button>
          </div>

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
        </div>
      </div>

      <SizeGuidePanel open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} categoryLabel={categoryLabel} maxRows={product.sizes?.length} />
      <InfoDrawer open={activeDrawer === "returns"} onClose={() => setActiveDrawer(null)} title="Free Returns Within 45 Days"><p>Free returns by mail within 45 days of delivery.</p></InfoDrawer>
      <InfoDrawer open={activeDrawer === "shipping"} onClose={() => setActiveDrawer(null)} title="Free Shipping"><p>S/Plus Members will receive free shipping on every purchase.</p></InfoDrawer>
      <InfoDrawer open={activeDrawer === "store"} onClose={() => setActiveDrawer(null)} title="Find in store"><p>Check stock availability in nearby stores.</p></InfoDrawer>
    </div>
  );
}

export default ProductDetail;