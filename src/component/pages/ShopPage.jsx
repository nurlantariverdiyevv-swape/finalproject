import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { useWishlist } from '../../context/WishlistContext';
import NotFoundPage from './NotFoundPage';
import ProductCardSkeleton from '../ProductCardSkeleton';
import ShopProductCard from './ShopProductCard';

const slugify = (str) => (str || '').toString().toLowerCase().trim().replace(/\s+/g, '-');

function ruleMatches(product, match) {
  return Object.entries(match).every(([field, expected]) => {
    const actual = field === 'subType' ? slugify(product.subType) : product[field];
    const expectedList = Array.isArray(expected) ? expected : [expected];
    return expectedList.includes(actual);
  });
}

function getCategoryLabel(categoryName, categories) {
  if (!categoryName) return 'All Products';
  return categories[slugify(categoryName)]?.label || categoryName;
}

function matchesCategory(product, categoryName, categories) {
  if (!categoryName || categoryName.toLowerCase() === 'all') return true;

  const slug = slugify(categoryName);
  const rule = categories[slug];

  if (rule) {
    return ruleMatches(product, rule.match);
  }

  const fields = [product.category, product.subCategory, product.subType, product.sub];
  return fields.some((f) => slugify(f) === slug);
}

function isValidCategorySlug(categoryName, categories, allProducts) {
  if (!categoryName || categoryName.toLowerCase() === 'all') return true;

  const slug = slugify(categoryName);
  if (categories[slug]) return true;

  return allProducts.some((product) => {
    const fields = [product.category, product.subCategory, product.subType, product.sub];
    return fields.some((f) => slugify(f) === slug);
  });
}

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

  const {
    shopProducts = [],
    fetchShopProducts,
    shopLoading,
    content,
    categories = {},
    categoriesLoading,
  } = useDataContext();
  const { wishlist, toggleWishlist } = useWishlist();

  const [showFilters, setShowFilters] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [sortBy, setSortBy] = useState('featured');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [activeCardColors, setActiveCardColors] = useState({});

  const [featuredOrder, setFeaturedOrder] = useState({});

  useEffect(() => {
    const ids = shopProducts.map((p) => p.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    const order = {};
    ids.forEach((id, idx) => { order[id] = idx; });
    setFeaturedOrder(order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopProducts]);

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

  const categoryProducts = !shopProducts || shopProducts.length === 0
    ? []
    : shopProducts
        .filter((product) => matchesCategory(product, categoryName, categories))
        .filter((product) => matchesSearch(product, searchTerm));

  const availableSizes = (() => {
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
  })();

  const availableTypes = (() => {
    const counts = new Map();
    categoryProducts.forEach((product) => {
      const type = product.subType;
      if (!type) return;
      counts.set(type, (counts.get(type) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  })();

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

  const filteredProducts = categoryProducts
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
      if (sortBy === 'newest') {
        const aIsNew = a.badgeType === 'new' ? 1 : 0;
        const bIsNew = b.badgeType === 'new' ? 1 : 0;
        if (aIsNew !== bIsNew) return bIsNew - aIsNew;
        return new Date(b.createdDate || 0) - new Date(a.createdDate || 0);
      }
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'featured') return (featuredOrder[a.id] ?? 0) - (featuredOrder[b.id] ?? 0);
      return 0;
    });

  const handleCardColorChange = (e, productId, colorObj) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveCardColors((prev) => ({ ...prev, [productId]: colorObj }));
  };

  const sortOptions = content?.shop?.sortOptions || [];
  const currentSortLabel = sortOptions.find((o) => o.id === sortBy)?.label || 'Featured';

  const isInitialLoading = shopLoading && shopProducts.length === 0;

  const categoryDataReady = !shopLoading && !categoriesLoading;
  if (categoryName && categoryDataReady && !isValidCategorySlug(categoryName, categories, shopProducts)) {
    return <NotFoundPage />;
  }

  const renderFilterSkeleton = () => (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} className="border-b border-gray-200 py-4">
          <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
        </div>
      ))}
    </>
  );

  const renderFilterContent = () => (
    <>
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
      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">
          {searchTerm ? 'Search results' : getCategoryLabel(categoryName, categories)}
        </span>
      </div>

      <h1 className="text-2xl md:text-4xl font-extrabold text-black uppercase tracking-tight mb-4 md:mb-6">
        {isInitialLoading ? (
          <span className="inline-block h-8 w-56 rounded bg-gray-200 animate-pulse align-middle" />
        ) : searchTerm
          ? `Search results for "${searchTerm}"`
          : categoryName
            ? `${getCategoryLabel(categoryName, categories)} Collection`
            : 'All Products'}
      </h1>

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
          {isInitialLoading ? (
            <span className="inline-block h-4 w-20 rounded bg-gray-200 animate-pulse align-middle" />
          ) : `${filteredProducts.length} products`}
        </span>
      </div>

      <div className="flex gap-8 items-start">
        {showFilters && (
          <div className="hidden lg:block w-[280px] shrink-0 sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
            {isInitialLoading ? renderFilterSkeleton() : renderFilterContent()}
          </div>
        )}

        <div className="flex-1">
          {isInitialLoading ? (
            <div className={`grid gap-x-3 gap-y-6 sm:gap-6 grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={`grid gap-x-3 gap-y-6 sm:gap-6 grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {filteredProducts.map((product, index) => {
                const identifier = product.id;
                const activeColor = activeCardColors[identifier] || product.colors?.[0];
                const isLiked = wishlist.some((item) => item.id === identifier);

                return (
                  <ShopProductCard key={identifier} product={product} index={index} activeColor={activeColor} onColorChange={handleCardColorChange} isLiked={isLiked} onToggleWishlist={toggleWishlist} onAddToCart={onAddToCart} />
                );
              })}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-12 md:py-16">
              <h2 className="text-xl md:text-2xl font-medium text-black mb-8">
                Sorry, we didn&apos;t find any results.
              </h2>
              {(content?.header?.popularSearches || []).length > 0 && (
                <>
                  <h3 className="text-sm font-normal text-gray-500 mb-4">Popular searches</h3>
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                    {content.header.popularSearches.map((term) => (
                      <Link key={term} to={`/shop?search=${encodeURIComponent(term)}`} className="px-4 py-2 border border-gray-300 rounded-full text-sm font-normal text-black capitalize hover:border-black transition-all">
                        {term}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 font-medium text-base">
              No products found matching your filter options.
            </div>
          )}
        </div>
      </div>

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