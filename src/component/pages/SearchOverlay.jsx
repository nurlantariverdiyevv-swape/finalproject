import { Search, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ---------- Product cards ---------- */

function DesktopProductCard({ product, onNavigate }) {
  const activeColor = product.colors?.[0];
  const activeImage = activeColor?.img || product.images?.[0] || product.img;
  return (
    <Link to={`/product/${product.id}`} onClick={onNavigate} className="group flex flex-col no-underline">
      <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-xs overflow-hidden mb-2">
        <img src={activeImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ShoppingBag size={14} className="text-black" />
        </span>
      </div>

      {product.colors && product.colors.length > 0 && (
        <div className="flex items-center gap-1 mb-2 min-h-[20px]">
          {product.colors.slice(0, 5).map((color, cIdx) => (
            <span key={color.id || cIdx} className="w-5 h-5 rounded-xs overflow-hidden border border-gray-200">
              <img src={color.img} alt={color.name} className="w-full h-full object-cover" />
            </span>
          ))}
        </div>
      )}

      {product.badge && (
        <span className={`text-xs font-semibold mb-0.5 ${product.badgeType === 'outlet' ? 'text-red-700' : 'text-red-600'}`}>
          {product.badge}
        </span>
      )}
      <h3 className="text-sm font-bold text-black tracking-tight leading-tight group-hover:underline">{product.name}</h3>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{product.sub || product.subCategory || product.category}</p>
      <p className="text-sm font-bold text-black mt-1">${product.price}</p>
    </Link>
  );
}

function MobileProductCard({ product, onNavigate }) {
  const activeColor = product.colors?.[0];
  const activeImage = activeColor?.img || product.images?.[0] || product.img;
  return (
    <Link to={`/product/${product.id}`} onClick={onNavigate} className="flex flex-col no-underline">
      <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-xs overflow-hidden mb-2">
        <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
        <span className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center">
          <ShoppingBag size={13} className="text-black" />
        </span>
      </div>
      {product.badge && (
        <span className={`text-xs font-semibold block ${product.badgeType === 'outlet' ? 'text-red-700' : 'text-red-600'}`}>
          {product.badge}
        </span>
      )}
      <h3 className="text-sm font-bold text-black leading-tight">{product.name}</h3>
      <p className="text-xs text-gray-500 mt-0.5">{product.sub || product.subCategory || product.category}</p>
      <p className="text-sm font-bold text-black mt-1">${product.price}</p>
    </Link>
  );
}

/* ---------- Desktop search overlay ---------- */

export function DesktopSearchOverlay({
  searchOpen,
  closeSearch,
  searchQuery,
  setSearchQuery,
  handleSearchKeyDown,
  popularSearches,
  bestSellers,
  searchResults,
  SEARCH_RESULTS_PREVIEW_LIMIT,
  seeAllResultsLink,
}) {
  if (!searchOpen) return null;

  return (
    <div className="hidden lg:block fixed inset-0 z-[200]">
      {/* Backdrop - the rest of the page appears blurred/dimmed */}
      <div onClick={closeSearch} className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

      {/* Top white panel - only as tall as its content */}
      <div className="relative bg-white shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="w-full bg-[#0d0d0d] text-white text-[11px] sm:text-xs py-2 px-4 md:px-8 flex justify-between items-center tracking-wide font-light">
          <div className="w-1/3">
            <Link to="/stores" onClick={closeSearch} className="hover:underline transition-all">Find a store</Link>
          </div>
          <div className="w-1/3 text-center">
            <Link to="/membership" onClick={closeSearch} className="underline underline-offset-4 hover:text-gray-300 transition-all">
              S/PLUS Members: Free Shipping and More
            </Link>
          </div>
          <div className="flex w-1/3 items-center justify-end gap-3 text-gray-200">
            <Link to="/newsletter" onClick={closeSearch} className="hover:underline transition-all">Get exclusive news</Link>
            <span className="text-white text-[10px]">&bull;</span>
            <Link to="/help" onClick={closeSearch} className="hover:underline transition-all">Help</Link>
          </div>
        </div>

        <div className="w-full border-b border-gray-100 px-8 py-5">
          <div className="max-w-[1536px] mx-auto flex items-center gap-8">
            <div className="relative flex-1 max-w-2xl">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Search size={20} strokeWidth={1.8} />
              </span>
              <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search for a product" className="w-full bg-[#f4f4f4] text-base text-black placeholder-gray-500 rounded-full pl-10 pr-10 py-2.5 border border-transparent focus:outline-none focus:bg-white focus:border-gray-300 transition-all" />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-black cursor-pointer" aria-label="Clear search">
                  <X size={18} />
                </button>
              )}
            </div>

            <button type="button" onClick={closeSearch} className="flex items-center gap-2 text-black font-semibold text-sm hover:opacity-70 cursor-pointer shrink-0 ml-auto">
              <X size={18} strokeWidth={1.8} />
              <span>Close</span>
            </button>
          </div>
        </div>

        <div className="max-w-[1536px] w-full mx-auto px-8 py-8">
          {searchQuery.trim() === '' ? (
            <div className="grid grid-cols-[220px_1fr] gap-10">
              <div>
                <h3 className="text-sm font-bold text-black uppercase tracking-tight mb-4">Popular searches</h3>
                <div className="flex flex-col">
                  {popularSearches.slice(0, 6).map((term) => (
                    <button key={term} type="button" onClick={() => setSearchQuery(term)} className="flex items-center gap-3 py-2.5 text-left cursor-pointer group">
                      <Search size={15} className="text-gray-400 shrink-0" />
                      <span className="text-sm font-bold text-black capitalize group-hover:underline">{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {bestSellers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Best sellers</h3>
                  <div className="grid grid-cols-5 gap-5">
                    {bestSellers.map((product) => (
                      <DesktopProductCard key={product.id} product={product} onNavigate={closeSearch} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="grid grid-cols-5 gap-5 mb-8">
                {searchResults.slice(0, SEARCH_RESULTS_PREVIEW_LIMIT).map((product) => (
                  <DesktopProductCard key={product.id} product={product} onNavigate={closeSearch} />
                ))}
              </div>

              {searchResults.length > SEARCH_RESULTS_PREVIEW_LIMIT && (
                <div className="flex justify-center">
                  <Link to={seeAllResultsLink} onClick={closeSearch} className="px-6 py-3 border border-gray-300 rounded-full text-sm font-semibold text-black hover:bg-black hover:text-white transition-all">
                    See all results ({searchResults.length})
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-base text-gray-700 mb-8">
                Your search for <span className="font-bold text-black">{searchQuery}</span>
              </p>
              <h3 className="text-sm font-bold text-black uppercase tracking-tight mb-4">Popular searches</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button key={term} type="button" onClick={() => setSearchQuery(term)} className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-black hover:border-black transition-all cursor-pointer">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile search overlay ---------- */

export function MobileSearchOverlay({
  searchOpen,
  closeSearch,
  searchQuery,
  setSearchQuery,
  handleSearchKeyDown,
  popularSearches,
  bestSellers,
  matchingSuggestions,
  searchResults,
  SEARCH_RESULTS_PREVIEW_LIMIT,
  seeAllResultsLink,
}) {
  if (!searchOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[200] bg-white flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 shrink-0">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
            <Search size={20} strokeWidth={1.8} />
          </span>
          <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search for a product" className="w-full bg-[#f4f4f4] text-sm text-black placeholder-gray-500 rounded-full pl-11 pr-4 py-3 border border-transparent focus:outline-none focus:bg-white focus:border-gray-300 transition-all" />
        </div>
        <button type="button" onClick={closeSearch} className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-black shrink-0 cursor-pointer" aria-label="Close search">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {searchQuery.trim() === '' ? (
          <>
            <div className="flex flex-col mb-6">
              {popularSearches.slice(0, 6).map((term) => (
                <button key={term} type="button" onClick={() => setSearchQuery(term)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-left cursor-pointer">
                  <Search size={16} className="text-gray-400 shrink-0" />
                  <span className="text-sm font-semibold text-black capitalize">{term}</span>
                </button>
              ))}
            </div>

            {bestSellers.length > 0 && (
              <>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-tight mb-4">Best sellers</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  {bestSellers.map((product) => (
                    <MobileProductCard key={product.id} product={product} onNavigate={closeSearch} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {matchingSuggestions.length > 0 && (
              <div className="flex flex-col mb-6">
                {matchingSuggestions.map((name) => (
                  <button key={name} type="button" onClick={() => setSearchQuery(name)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-left cursor-pointer">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-black">{name}</span>
                  </button>
                ))}
              </div>
            )}

            {searchResults.length > 0 ? (
              <>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-tight mb-4">Results</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  {searchResults.slice(0, SEARCH_RESULTS_PREVIEW_LIMIT).map((product) => (
                    <MobileProductCard key={product.id} product={product} onNavigate={closeSearch} />
                  ))}
                </div>

                {searchResults.length > SEARCH_RESULTS_PREVIEW_LIMIT && (
                  <div className="flex justify-center mt-6">
                    <Link to={seeAllResultsLink} onClick={closeSearch} className="px-6 py-3 border border-gray-300 rounded-full text-sm font-semibold text-black hover:bg-black hover:text-white transition-all">
                      See all results ({searchResults.length})
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600 py-6">
                No results found for "<span className="font-semibold text-black">{searchQuery}</span>"
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}