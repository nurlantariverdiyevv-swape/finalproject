import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { useWishlist } from '../../context/WishlistContext';

// ------- Slug uyğunlaşdırma köməkçiləri -------
const slugify = (str) => (str || '').toString().toLowerCase().trim().replace(/\s+/g, '-');

const categoryRules = {
  'men-shoes': (p) => p.category === 'Shoes' && p.subCategory === 'Men',
  'women-shoes': (p) => p.category === 'Shoes' && p.subCategory === 'Women',
  'kids-shoes': (p) => p.category === 'Shoes' && p.subCategory === 'Kids',
  'kids-clothing': (p) => p.category === 'Gear' && p.subCategory === 'Kids',
  'trail-running': (p) => slugify(p.subType) === 'trail-running',
  'road-running': (p) => slugify(p.subType) === 'running',
  // Gravel running üçün ayrıca subType yoxdur, ən yaxın uyğun olan
  // yol/asfalt qaçış (Running) məhsulları göstərilir ki, tile boş qalmasın.
  'gravel-running': (p) => slugify(p.subType) === 'running',
  'running': (p) => slugify(p.subType) === 'running' || slugify(p.subType) === 'trail-running',
  'hiking': (p) => slugify(p.subType) === 'hiking' || slugify(p.subType) === 'hiking-&-backpacking',
  'sportstyle': (p) => slugify(p.subType) === 'sportstyle',
  'men': (p) => p.subCategory === 'Men',
  'women': (p) => p.subCategory === 'Women',
  'kids': (p) => p.subCategory === 'Kids',
  'shoes': (p) => p.category === 'Shoes',
  'new': (p) => p.badge === 'New',
  // Header-də ən üst səviyyəli "Activities" / "Explore" linkləri (əsasən
  // mobil menyuda) birbaşa basılanda heç bir alt-kateqoriya seçilmədən
  // /shop/activities və /shop/explore-a düşür - bunlar üçün də uyğun
  // məhsul dəstləri təyin edirik ki, səhifə boş görünməsin.
  'activities': (p) =>
    ['running', 'trail-running', 'hiking', 'hiking-&-backpacking', 'sportstyle'].includes(slugify(p.subType)),
  'explore': (p) => p.badge === 'New',
  'stories': (p) => p.badge === 'New',
  'sustainability': (p) => slugify(p.subType) === 'hiking' || slugify(p.subType) === 'hiking-&-backpacking',

  // ---- Cinsə görə ayrılmış alt-kateqoriyalar (mega-menyudakı Men/Women bölmələri üçün) ----
  // Bunlar olmadan "Men" menyusundan "Running"-ə keçmək və "Women" menyusundan "Running"-ə
  // keçmək eyni /shop/running səhifəsinə aparırdı, ona görə kişi və qadın məhsulları qarışırdı.
  'men-running': (p) => p.subCategory === 'Men' && slugify(p.subType) === 'running',
  'women-running': (p) => p.subCategory === 'Women' && slugify(p.subType) === 'running',
  'men-trail-running': (p) => p.subCategory === 'Men' && slugify(p.subType) === 'trail-running',
  'women-trail-running': (p) => p.subCategory === 'Women' && slugify(p.subType) === 'trail-running',
  'men-hiking': (p) => p.subCategory === 'Men' && (slugify(p.subType) === 'hiking' || slugify(p.subType) === 'hiking-&-backpacking'),
  'women-hiking': (p) => p.subCategory === 'Women' && (slugify(p.subType) === 'hiking' || slugify(p.subType) === 'hiking-&-backpacking'),
  'men-sportstyle': (p) => p.subCategory === 'Men' && slugify(p.subType) === 'sportstyle',
  'women-sportstyle': (p) => p.subCategory === 'Women' && slugify(p.subType) === 'sportstyle',

  // ---- "New" menyusu üçün cinsə/tipə görə yeni məhsullar ----
  'new-men': (p) => p.badge === 'New' && p.subCategory === 'Men',
  'new-women': (p) => p.badge === 'New' && p.subCategory === 'Women',
  'new-sportstyle': (p) => p.badge === 'New' && slugify(p.subType) === 'sportstyle',
};

// Kateqoriya slug-larını başlıq/breadcrumb üçün oxunaqlı adlara çeviririk
const categoryLabels = {
  'men-shoes': 'Men’s Shoes',
  'women-shoes': 'Women’s Shoes',
  'kids-shoes': 'Kids’ Shoes',
  'kids-clothing': 'Kids’ Clothing',
  'trail-running': 'Trail Running',
  'road-running': 'Road Running',
  'gravel-running': 'Gravel Running',
  'running': 'Running',
  'activities': 'Activities',
  'explore': 'Explore',
  'stories': 'Our Stories',
  'sustainability': 'Sustainability',
  'hiking': 'Hiking & Backpacking',
  'sportstyle': 'Sportstyle',
  'men': 'Men',
  'women': 'Women',
  'kids': 'Kids',
  'shoes': 'Shoes',
  'new': 'New Arrivals',
  'men-running': 'Men’s Running',
  'women-running': 'Women’s Running',
  'men-trail-running': 'Men’s Trail Running',
  'women-trail-running': 'Women’s Trail Running',
  'men-hiking': 'Men’s Hiking',
  'women-hiking': 'Women’s Hiking',
  'men-sportstyle': 'Men’s Sportstyle',
  'women-sportstyle': 'Women’s Sportstyle',
  'new-men': 'New in Men',
  'new-women': 'New in Women',
  'new-sportstyle': 'New in Sportstyle',
};

function getCategoryLabel(categoryName) {
  if (!categoryName) return 'All Products';
  return categoryLabels[slugify(categoryName)] || categoryName;
}

function matchesCategory(product, categoryName) {
  if (!categoryName || categoryName.toLowerCase() === 'all') return true;

  const slug = slugify(categoryName);

  if (categoryRules[slug]) {
    return categoryRules[slug](product);
  }

  const fields = [product.category, product.subCategory, product.subType, product.sub];
  return fields.some((f) => slugify(f) === slug);
}

// ------- Axtarış sözünə görə uyğunlaşdırma -------
function matchesSearch(product, searchTerm) {
  if (!searchTerm) return true;
  const q = searchTerm.toLowerCase();
  const haystack = [product.name, product.sub, product.subCategory, product.subType, product.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

function ShopPage({ onAddToCart }) {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = (searchParams.get('search') || '').trim();

  const { shopProducts = [], fetchShopProducts, shopLoading, content } = useDataContext();
  const { wishlist, toggleWishlist } = useWishlist();

  const [showFilters, setShowFilters] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [sortBy, setSortBy] = useState('featured');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [activeCardColors, setActiveCardColors] = useState({});

  const [openSections, setOpenSections] = useState({
    sort: true,
    size: false,
    type: false,
  });

  const toggleSection = (sec) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  useEffect(() => {
    fetchShopProducts();
  }, [fetchShopProducts]);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileFilterOpen]);

  const categoryProducts = useMemo(() => {
    if (!shopProducts || shopProducts.length === 0) return [];
    return shopProducts
      .filter((product) => matchesCategory(product, categoryName))
      .filter((product) => matchesSearch(product, searchTerm));
  }, [shopProducts, categoryName, searchTerm]);

  const availableSizes = useMemo(() => {
    const set = new Set();
    categoryProducts.forEach((product) => {
      product.sizes?.forEach((s) => {
        const label = typeof s === 'object' ? s.label : s;
        if (label) set.add(label);
      });
    });
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [categoryProducts]);

  const availableTypes = useMemo(() => {
    const counts = new Map();
    categoryProducts.forEach((product) => {
      const type = product.subType;
      if (!type) return;
      counts.set(type, (counts.get(type) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoryProducts]);

  const handleSizeToggle = (sz) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((item) => item !== sz) : [...prev, sz]
    );
  };

  const handleTypeToggle = (typeName) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName) ? prev.filter((item) => item !== typeName) : [...prev, typeName]
    );
  };

  const clearAllFilters = () => {
    setSortBy('featured');
    setSelectedSizes([]);
    setSelectedTypes([]);
  };

  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((product) => {
        if (selectedSizes.length > 0) {
          const hasSize = product.sizes?.some((s) => {
            const label = typeof s === 'object' ? s.label : s;
            return selectedSizes.includes(label);
          });
          if (!hasSize) return false;
        }

        if (selectedTypes.length > 0) {
          if (!selectedTypes.includes(product.subType)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdDate || 0) - new Date(a.createdDate || 0);
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
      });
  }, [categoryProducts, selectedSizes, selectedTypes, sortBy]);

  const handleCardColorChange = (e, productId, colorObj) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveCardColors((prev) => ({ ...prev, [productId]: colorObj }));
  };

  // Sıralama seçimləri artıq hardcode deyil, vercel API-dəki content.json-dan
  // (content.shop.sortOptions) gəlir.
  const sortOptions = content?.shop?.sortOptions || [];
  const currentSortLabel = sortOptions.find((o) => o.id === sortBy)?.label || 'Featured';

  if (shopLoading && shopProducts.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-20 text-center text-base font-medium text-gray-500">
        Loading products...
      </div>
    );
  }

  const renderFilterContent = () => (
    <>
      {/* SORT BY */}
      <div className="border-b border-gray-200 py-4">
        <button type="button" onClick={() => toggleSection('sort')} className="w-full flex items-center justify-between text-[16px] font-semibold text-black tracking-tight cursor-pointer">
          <span>Sort by: {currentSortLabel}</span>
          {openSections.sort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSections.sort && (
          <div className="flex flex-col gap-3.5 text-[15px] font-medium mt-4">
            {sortOptions.map((item) => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer hover:text-black">
                <input type="radio" name="sort" checked={sortBy === item.id} onChange={() => setSortBy(item.id)} className="w-4 h-4 accent-black cursor-pointer" />
                <span className={sortBy === item.id ? 'font-semibold text-black' : 'text-gray-800 font-medium'}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* SIZE */}
      <div className="border-b border-gray-200 py-4">
        <button type="button" onClick={() => toggleSection('size')} className="w-full flex items-center justify-between text-[16px] font-semibold text-black tracking-tight cursor-pointer">
          <span>Size</span>
          {openSections.size ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSections.size && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {(availableSizes.length > 0 ? availableSizes : ['M10.5 - W11.5', 'M10 - W11', 'M11.5 - W12.5', 'M11 - W12', 'M12.5 - W13.5', 'M12 - W13']).map((sz) => {
              const isSelected = selectedSizes.includes(sz);
              const displayLabel = sz.replace('/', ' - ');
              return (
                <button type="button" key={sz} onClick={() => handleSizeToggle(sz)} className={`py-2.5 px-2 border rounded text-[13px] text-center transition-all cursor-pointer ${isSelected ? 'bg-black text-white border-black font-semibold' : 'bg-[#f7f7f7] text-gray-900 border-[#e5e5e5] hover:border-black font-medium'}`}>
                  {displayLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* TYPE OF PRODUCT */}
      <div className="border-b border-gray-200 py-4">
        <button type="button" onClick={() => toggleSection('type')} className="w-full flex items-center justify-between text-[16px] font-semibold text-black tracking-tight cursor-pointer">
          <span>Type of product</span>
          {openSections.type ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSections.type && (
          <div className="flex flex-col gap-3.5 mt-4">
            {availableTypes.map((t) => {
              const isSelected = selectedTypes.includes(t.name);
              return (
                <label key={t.name} className="flex items-center gap-3 text-[14px] cursor-pointer hover:text-black">
                  <input type="checkbox" checked={isSelected} onChange={() => handleTypeToggle(t.name)} className="w-4 h-4 border-gray-300 rounded accent-black cursor-pointer shrink-0" />
                  <span className={isSelected ? 'font-semibold text-black' : 'text-gray-800 font-medium'}>
                    {t.name} <span className="text-gray-500 font-normal">({t.count})</span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-4 md:py-6 select-none">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">
          {searchTerm ? 'Search results' : getCategoryLabel(categoryName)}
        </span>
      </div>

      {/* Səhifə Başlığı */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-black uppercase tracking-tight mb-4 md:mb-6">
        {searchTerm
          ? `Results for "${searchTerm}"`
          : categoryName
            ? `${getCategoryLabel(categoryName)} Collection`
            : 'All Products'}
      </h1>

      {/* CONTROL BAR */}
      <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
        <button type="button" onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-1.5 border border-gray-300 rounded-full px-4 py-1.5 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all cursor-pointer">
          <SlidersHorizontal size={14} />
          <span>Filter</span>
        </button>

        <button type="button" onClick={() => setShowFilters(!showFilters)} className="hidden lg:flex items-center gap-2.5 border border-gray-300 rounded-full px-6 py-2 text-sm font-semibold text-black hover:bg-black hover:text-white transition-all cursor-pointer">
          <SlidersHorizontal size={16} />
          <span>{showFilters ? 'Hide filters' : 'Filter'}</span>
        </button>

        <span className="text-xs md:text-sm font-semibold text-gray-800">
          {filteredProducts.length} products
        </span>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex gap-8 items-start">
        {showFilters && (
          <div className="hidden lg:block w-[280px] shrink-0 sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
            {renderFilterContent()}
          </div>
        )}

        {/* MƏHSULLAR GRID-İ */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className={`grid gap-x-3 gap-y-6 sm:gap-6 grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {filteredProducts.map((product) => {
                const identifier = product.id;
                const activeColor = activeCardColors[identifier] || product.colors?.[0];
                const activeImage = activeColor?.img || product.images?.[0] || product.img;
                const isLiked = wishlist.some((item) => item.id === identifier);

                return (
                  <Link key={identifier} to={`/product/${identifier}`} className="group flex flex-col justify-between no-underline">
                    <div>
                      <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-xs overflow-hidden mb-2 md:mb-3">
                        <img src={activeImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none" />

                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }} className="absolute top-2 right-2 md:top-3 md:right-3 p-1 md:p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer z-10">
                          <Heart className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isLiked ? 'fill-black text-black' : 'text-gray-700'}`} />
                        </button>

                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onAddToCart) onAddToCart(product); }} className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1.5 md:p-2 bg-white rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-10">
                          <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 text-black" />
                        </button>
                      </div>

                      <div className="flex flex-row flex-wrap items-center gap-1 mb-1.5 min-h-[22px] md:min-h-[28px]">
                        {product.colors?.map((color, cIdx) => {
                          const colorId = color.id || cIdx;
                          const isActive = activeColor?.id === colorId || activeColor === color;
                          return (
                            <button type="button" key={colorId} onClick={(e) => handleCardColorChange(e, identifier, color)} className={`w-4 h-4 md:w-6 md:h-6 rounded-xs overflow-hidden border cursor-pointer transition-all ${isActive ? 'border-black scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                              <img src={color.img} alt={color.name} className="w-full h-full object-cover pointer-events-none" />
                            </button>
                          );
                        })}
                      </div>

                      {product.badge && (
                        <span className={`block text-[11px] md:text-xs font-semibold mb-0.5 ${product.badgeType === 'outlet' ? 'text-red-700' : 'text-red-600'}`}>
                          {product.badge}
                        </span>
                      )}
                      <h3 className="text-[13px] md:text-[16px] font-semibold text-black tracking-tight leading-snug group-hover:underline">
                        {product.name}
                      </h3>
                      <p className="text-[11px] md:text-sm text-gray-500 font-normal mt-0.5">
                        {product.sub || product.subCategory || product.category}
                      </p>
                    </div>

                    <div className="mt-1.5 md:mt-2.5 flex items-center gap-1.5">
                      <span className="text-[13px] md:text-[16px] font-semibold text-black">${product.price}</span>
                      {product.oldPrice && (
                        <span className="text-xs md:text-sm text-gray-400 line-through">${product.oldPrice}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 font-medium text-base">
              No products found matching your filter options.
            </div>
          )}
        </div>
      </div>

      {/* SALOMON MOBIL FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 className="text-base font-bold text-black tracking-tight">Filter & sort</h2>
            <button type="button" onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-black cursor-pointer hover:opacity-70">
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-2">
            {renderFilterContent()}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3 shrink-0">
            <button type="button" onClick={clearAllFilters} className="flex-1 py-3 px-4 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 text-center hover:bg-gray-100 cursor-pointer">
              Clear all
            </button>
            <button type="button" onClick={() => setIsMobileFilterOpen(false)} className="flex-1 py-3 px-4 rounded-full bg-black text-white text-sm font-semibold text-center hover:bg-gray-900 cursor-pointer">
              View {filteredProducts.length}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopPage;