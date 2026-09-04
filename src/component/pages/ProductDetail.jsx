import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Star, Heart, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";
import { useDataContext } from "../../context/DataContext";
import { useWishlist } from "../../context/WishlistContext";
import { useBasket } from "../../context/BasketContext";
import { useAuth } from "../../context/AuthContext";
import ProductInfoLinks from "./ProductInfoLinks";
import NotFoundPage from "./NotFoundPage";
import ImageWithSkeleton from "../ImageWithSkeleton";

const slugify = (str) => (str || "").toString().toLowerCase().trim().replace(/\s+/g, "-");

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

function SizeGuidePanel({ open, onClose, categoryLabel, maxRows, sizeGuideData = [], measureSteps = [] }) {
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
      <ImageWithSkeleton src={src} alt={alt} className="w-full h-full object-cover select-none" />
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

  const goPrev = useCallback((e) => { e?.stopPropagation(); setScale(1); setCurrentSlide((prev) => (prev - 1 + total) % total); }, [total, setCurrentSlide]);
  const goNext = useCallback((e) => { e?.stopPropagation(); setScale(1); setCurrentSlide((prev) => (prev + 1) % total); }, [total, setCurrentSlide]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightbox) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, goPrev, goNext]);

  useEffect(() => {
    if (!lightbox) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
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

      {lightbox && createPortal(
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
        </div>,
        document.body
      )}
    </div>
  );
}

// Description + feature data that lives in the product record, presented as
// an editorial-style "details" block instead of a collapsible accordion: a
// pull-quote style intro paragraph followed by a compact grid of feature
// cards that invert to black on hover.
function ProductDetailsSection({ description, features = [], articleRef }) {
  if (!description && features.length === 0) return null;

  return (
    <div className="pt-6 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-10 h-[2px] bg-black" />
        {/* <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">The Details</span> */}
      </div>

      {description && (
        <div className="relative pl-5 mb-6 border-l-2 border-black">
          <p className="text-[15px] sm:text-base text-gray-900 leading-relaxed font-medium">{description}</p>
        </div>
      )}

      {features.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-gray-50 hover:bg-black transition-colors duration-300 group"
            >
              <span className="text-sm leading-snug text-gray-800 group-hover:text-white transition-colors duration-300">
                {feature}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { shopProducts = [], fetchShopProducts, shopLoading, content } = useDataContext();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToBasket } = useBasket();

  // The size chart and measuring steps are no longer hardcoded, they come
  // from the Vercel API's content.json (content.productDetail).
  const sizeGuideData = content?.productDetail?.sizeGuide || [];
  const measureSteps = content?.productDetail?.measureSteps || [];

  const [selectedSize, setSelectedSize] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchShopProducts();
  }, [fetchShopProducts]);

  // shopProducts is the single source of truth now, so there's nothing to
  // merge - just look the product up by id directly.
  const product = shopProducts.find((item) => String(item.id) === String(id));
  const isLiked = product ? wishlist.some((item) => item.id === product.id) : false;
  const isLoading = shopLoading && shopProducts.length === 0;

  if (isLoading && !product) return <div className="p-10 text-center font-bold">Loading...</div>;
  // No product matches this :id -> broken/incorrect slug, show the 404 page.
  if (!product) return <NotFoundPage />;

  const categoryLabel = product.subCategory ? `${product.subCategory} Footwear` : "Footwear";
  const activeColor = product.colors?.[activeColorIndex] || product.colors?.[0];
  const baseGallery = (product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : product.images || [product.img]).filter(Boolean);
  const sliderImages = activeColor?.img ? [activeColor.img, ...baseGallery.filter((img) => img !== activeColor.img)] : baseGallery;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    // If not logged in, redirect to the Login page before adding to the basket.
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    addToBasket(product, selectedSize, activeColor?.name, activeColor?.img);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-[#111]">
      <nav className="flex items-center gap-2 text-sm text-gray-700 mb-6">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="text-gray-400">/</span>
        <Link to={`/shop/${slugify(product.category)}`} className="hover:underline">{product.category}</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-normal">{product.subType || product.sub}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 lg:sticky lg:top-6">
          <ModernImageGallery images={sliderImages} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} alt={product.name} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1.5">
            {product.badge && <span className="text-red-600 font-semibold text-sm block">{product.badge}</span>}
            <h1 className="font-heading-runova text-3xl sm:text-4xl font-bold uppercase tracking-tight text-black leading-none">{product.name}</h1>
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

          <ProductDetailsSection description={product.description} features={product.features} articleRef={product.articleRef} />

          {/* This used to be 3 separate buttons + 3 separate InfoDrawers.
              It all now lives inside the ProductInfoLinks component. */}
          <ProductInfoLinks />
        </div>
      </div>

      <SizeGuidePanel open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} categoryLabel={categoryLabel} maxRows={product.sizes?.length} sizeGuideData={sizeGuideData} measureSteps={measureSteps} />
    </div>
  );
}

export default ProductDetail;