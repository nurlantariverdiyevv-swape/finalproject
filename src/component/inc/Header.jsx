import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, User, Heart, Menu, ShoppingBag, X, ChevronRight, ArrowRight, HelpCircle, MapPin, Mail, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useBasket } from '../../context/BasketContext';
import { useDataContext } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { DesktopSearchOverlay, MobileSearchOverlay } from '../pages/SearchOverlay';

function Header() {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { totalBasketCount } = useBasket();
  const { slider = [], shopProducts = [], fetchSlider, fetchShopProducts, content } = useDataContext();
  const { user, logout } = useAuth();

  // Menyu, banner və axtarış təklifləri artıq hardcode deyil, vercel
  // API-dəki content.json-dan (content.header) gəlir.
  const categories = content?.header?.categories || [];
  const desktopMenuData = content?.header?.desktopMenuData || {};
  const popularSearches = content?.header?.popularSearches || [];

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ------- HESAB DROPDOWN (Log out) -------
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    if (accountMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountMenuOpen]);

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
  };

  // Mobil versiya üçün ayrıca hesab dropdown-u (login/basket menyudan
  // kənarda, birbaşa yuxarı barda görünür)
  const [mobileAccountMenuOpen, setMobileAccountMenuOpen] = useState(false);
  const mobileAccountMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideMobile = (e) => {
      if (mobileAccountMenuRef.current && !mobileAccountMenuRef.current.contains(e.target)) {
        setMobileAccountMenuOpen(false);
      }
    };
    if (mobileAccountMenuOpen) document.addEventListener('mousedown', handleClickOutsideMobile);
    return () => document.removeEventListener('mousedown', handleClickOutsideMobile);
  }, [mobileAccountMenuOpen]);

  const handleMobileLogout = () => {
    logout();
    setMobileAccountMenuOpen(false);
  };

  // ------- AXTARIŞ STATE-İ -------
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDesktopMenu = () => {
    setDesktopMenuOpen((prev) => !prev);
    setActiveCategory(null);
  };

  const handleCategoryClick = (cat) => {
    if (desktopMenuData[cat]) {
      setActiveCategory(activeCategory === cat ? null : cat);
    } else {
      setActiveCategory(null);
    }
  };

  const closeAllMenus = () => {
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
    setActiveCategory(null);
  };

  const openSearch = () => {
    closeAllMenus();
    setSearchOpen(true);
    if (fetchSlider) fetchSlider();
    if (fetchShopProducts) fetchShopProducts();
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    if (searchOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : 'unset';
  }, [searchOpen]);

  const allProducts = useMemo(() => {
    const map = new Map();
    [...slider, ...shopProducts].forEach((p) => {
      if (p && p.id != null) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [slider, shopProducts]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allProducts.filter((p) => {
      const haystack = [p.name, p.sub, p.subCategory, p.subType, p.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [allProducts, searchQuery]);

  const matchingSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const names = new Set();
    allProducts.forEach((p) => {
      if (p.name && p.name.toLowerCase().includes(q)) names.add(p.name);
    });
    return Array.from(names).slice(0, 5);
  }, [allProducts, searchQuery]);

  const bestSellers = useMemo(() => allProducts.slice(0, 5), [allProducts]);

  // Axtarış nəticələrinin dropdown-da göstərilən maksimum sayı
  const SEARCH_RESULTS_PREVIEW_LIMIT = 5;

  const seeAllResultsLink = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(seeAllResultsLink);
      closeSearch();
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 select-none relative z-40">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="w-full bg-[#0d0d0d] text-white text-[11px] sm:text-xs py-2 px-4 md:px-8 flex justify-between items-center tracking-wide font-light">
        <div className="hidden lg:block lg:w-1/3">
          <Link to="/stores" className="hover:underline transition-all">Find a store</Link>
        </div>

        <div className="w-full lg:w-1/3 text-center">
          <Link to="/membership" className="underline underline-offset-4 hover:text-gray-300 transition-all">
            S/PLUS Members: Free Shipping and More
          </Link>
        </div>

        <div className="hidden lg:flex lg:w-1/3 items-center justify-end gap-3 text-gray-200">
          <Link to="/newsletter" className="hover:underline transition-all">Get exclusive news</Link>
          <span className="text-white text-[10px]">&bull;</span>
          <Link to="/help" className="hover:underline transition-all">Help</Link>
        </div>
      </div>

      {/* 2. MOBİL HEADER */}
      <div className="lg:hidden px-4 pt-3 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={closeAllMenus} className="inline-block">
            <img src="/assets/img/runovalogo.png" alt="Logo" className="h-7 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-3">
            {/* Hesaba giriş: menyunu açmağa ehtiyac qalmadan birbaşa yuxarı barda */}
            {user ? (
              <div className="relative" ref={mobileAccountMenuRef}>
                <button
                  type="button"
                  onClick={() => setMobileAccountMenuOpen((prev) => !prev)}
                  className="text-black p-1 hover:opacity-70 cursor-pointer"
                  aria-label="Account"
                >
                  <User size={24} strokeWidth={1.5} />
                </button>

                {mobileAccountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 truncate">
                      {user.displayName || user.email || 'Hesabım'}
                    </div>
                    <button
                      type="button"
                      onClick={handleMobileLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-50 cursor-pointer"
                    >
                      <LogOut size={16} strokeWidth={1.5} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" onClick={closeAllMenus} className="text-black p-1 hover:opacity-70" aria-label="Log in">
                <User size={24} strokeWidth={1.5} />
              </Link>
            )}

            <Link to="/basket" onClick={closeAllMenus} className="relative text-black p-1 hover:opacity-70">
              <ShoppingBag size={24} strokeWidth={1.5} />
              {totalBasketCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c8102e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalBasketCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileMenuOpen(true)} className="text-black p-1 hover:opacity-70 cursor-pointer">
              <Menu size={26} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <button type="button" onClick={openSearch} className="relative w-full text-left cursor-pointer">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
            <Search size={20} strokeWidth={1.5} />
          </span>
          <span className="block w-full bg-[#f4f4f4] text-sm text-gray-500 rounded-full pl-11 pr-4 py-2.5 border border-transparent">
            Search for a product
          </span>
        </button>
      </div>

      {/* 3. DESKTOP HEADER */}
      <div className="hidden lg:block border-b border-gray-100">
        <nav className="max-w-[1536px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 w-1/3">
            <button onClick={toggleDesktopMenu} className="flex items-center gap-2.5 text-black hover:opacity-70 cursor-pointer font-semibold text-sm py-2 px-1">
              <Menu size={22} strokeWidth={1.8} />
              <span>Menu</span>
            </button>

            <button type="button" onClick={openSearch} className="relative w-full max-w-xs text-left cursor-pointer">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <Search size={18} strokeWidth={1.8} />
              </span>
              <span className="block w-full bg-[#f5f5f5] text-sm text-gray-400 rounded-full pl-11 pr-4 py-2 border border-transparent">
                Search for a product
              </span>
            </button>
          </div>

          <div className="flex justify-center w-1/3">
            <Link to="/" onClick={closeAllMenus}>
              <img src="/assets/img/runovalogo.png" alt="Logo" className="h-9 w-auto object-contain" />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-6 w-1/3">
            {user ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-black hover:opacity-70 cursor-pointer"
                >
                  <User size={20} strokeWidth={1.5} />
                  <span className="text-sm font-semibold">{user.displayName ? user.displayName.split(' ')[0] : 'Account'}</span>
                </button>

                {/* Log in adının üstünə basanda açılan dropdown - Log out buradadır */}
                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-44 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1 animate-[fadeIn_0.15s_ease-out]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-50 cursor-pointer"
                    >
                      <LogOut size={16} strokeWidth={1.5} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-black hover:opacity-70">
                <User size={20} strokeWidth={1.5} />
                <span className="text-sm font-semibold">Log in</span>
              </Link>
            )}

            <Link to="/wishlist" className="relative hover:opacity-70 text-black">
              <Heart size={22} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#c8102e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/basket" className="relative hover:opacity-70 text-black">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {totalBasketCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#c8102e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalBasketCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>

      {/* 4. FULL SCREEN DRAWER MENYU */}
      {desktopMenuOpen && (
        <div className="hidden lg:block fixed inset-0 z-[100] h-screen w-screen overflow-hidden">
          <div onClick={closeAllMenus} className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

          <div className={`relative bg-white h-full shadow-2xl flex z-10 transition-all duration-300 ease-in-out ${activeCategory ? 'w-[950px]' : 'w-[280px]'}`}>
            <div className="w-[280px] border-r border-gray-100 p-8 flex flex-col justify-between shrink-0 bg-white h-full">
              <div>
                <button onClick={closeAllMenus} className="flex items-center gap-2 text-black font-semibold text-sm mb-10 hover:opacity-70 cursor-pointer">
                  <X size={20} strokeWidth={1.5} />
                  <span>Close</span>
                </button>

                <div className="flex flex-col gap-6">
                  {categories.map((cat, idx) => {
                    const hasSub = !!desktopMenuData[cat];
                    const isActive = activeCategory === cat;
                    return (
                      <div key={idx} onClick={() => handleCategoryClick(cat)} className="flex items-center justify-between cursor-pointer group py-0.5">
                        <span className={`text-base font-bold transition-colors ${isActive ? 'text-black underline underline-offset-4 decoration-2' : 'text-gray-900 group-hover:text-black'}`}>
                          {cat}
                        </span>
                        {hasSub && <ChevronRight size={18} className={`transition-transform duration-200 ${isActive ? 'text-black translate-x-1' : 'text-gray-400 group-hover:text-black'}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                {user ? (
                  <button
                    type="button"
                    onClick={() => { logout(); closeAllMenus(); }}
                    className="flex items-center gap-2 text-black font-medium text-sm cursor-pointer"
                  >
                    <User size={18} />
                    <span>Log out</span>
                  </button>
                ) : (
                  <Link to="/login" onClick={closeAllMenus} className="flex items-center gap-2 text-black font-medium text-sm">
                    <User size={18} />
                    <span>Log in</span>
                  </Link>
                )}
                <span className="font-bold text-xs italic tracking-wider">S/PLUS</span>
              </div>
            </div>

            {activeCategory && desktopMenuData[activeCategory] && (
              <div className="flex flex-1 overflow-hidden h-full animate-[fadeIn_0.2s_ease-out]">
                <div className="w-[260px] border-r border-gray-100 p-8 overflow-y-auto shrink-0 bg-white h-full">
                  <div className="flex flex-col gap-4">
                    {desktopMenuData[activeCategory].subCategories.map((sub, i) => (
                      <Link key={i} to={sub.link} onClick={closeAllMenus} className="flex items-center justify-between text-sm font-medium text-gray-800 hover:text-black py-1 transition-colors">
                        <span>{sub.name}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto bg-white flex flex-col gap-5 justify-start h-full">
                  {desktopMenuData[activeCategory].banners.map((banner, i) => (
                    <Link key={i} to={banner.link} onClick={closeAllMenus} className="group relative w-full h-[220px] overflow-hidden rounded-sm block bg-gray-900 shadow-sm shrink-0">
                      <img src={banner.img} alt={banner.title} className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                        <div className="flex items-center justify-between w-full text-white">
                          <span className="font-bold text-lg tracking-wide">{banner.title}</span>
                          <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-md transition-transform group-hover:translate-x-1">
                            <ArrowRight size={16} strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MOBİL SAĞ MENYU */}
      <div onClick={closeAllMenus} className={`lg:hidden fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

      <div className={`lg:hidden fixed top-0 right-0 h-full w-[85%] sm:w-[380px] bg-white z-50 shadow-2xl transition-transform duration-300 transform flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex items-center gap-3">
          <button type="button" onClick={openSearch} className="relative flex-1 text-left cursor-pointer">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
              <Search size={18} strokeWidth={1.8} />
            </span>
            <span className="block w-full bg-[#f4f4f4] text-sm text-gray-500 rounded-full pl-10 pr-4 py-2 border border-transparent">
              Search for a product
            </span>
          </button>

          <button onClick={closeAllMenus} className="p-1 text-black hover:opacity-70 cursor-pointer shrink-0">
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col">
          <div className="flex flex-col">
            {categories.slice(0, 5).map((category, idx) => (
              <Link key={idx} to={`/shop/${category.toLowerCase()}`} onClick={closeAllMenus} className="py-3 flex items-center justify-between text-base font-bold text-black border-b border-transparent">
                <span>{category}</span>
                <ChevronRight size={18} className="text-black" strokeWidth={1.5} />
              </Link>
            ))}
          </div>

          <div className="my-4 border-t border-gray-100" />

          <div className="flex flex-col">
            {categories.slice(5).map((category, idx) => (
              <Link key={idx} to={`/shop/${category.toLowerCase()}`} onClick={closeAllMenus} className="py-3 flex items-center justify-between text-base font-medium text-black">
                <span>{category}</span>
                <ChevronRight size={18} className="text-black" strokeWidth={1.5} />
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8 pb-6 flex flex-col gap-5">
            {/* Login/Logout indi yuxarı mobil barda (menyunun kənarında) idarə olunur.
                Burada, giriş edildikdən sonra sadəcə istifadəçinin adı göstərilir. */}
            {user && (
              <div className="flex items-center justify-between text-sm font-medium text-black">
                <div className="flex items-center gap-3">
                  <User size={20} strokeWidth={1.5} />
                  <span className="truncate max-w-[160px]">{user.displayName ? user.displayName.split(' ')[0] : (user.email || 'Hesabım')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { logout(); closeAllMenus(); }}
                  className="text-xs font-bold text-gray-500 hover:text-black underline underline-offset-4 cursor-pointer"
                >
                  Log out
                </button>
              </div>
            )}

            <Link to="/wishlist" onClick={closeAllMenus} className="flex items-center justify-between text-sm font-medium text-black">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Heart size={20} strokeWidth={1.5} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#c8102e] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </div>
            </Link>

            <Link to="/help" onClick={closeAllMenus} className="flex items-center justify-between text-sm font-medium text-black">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} strokeWidth={1.5} />
                <span>Help</span>
              </div>
              <ChevronRight size={16} className="text-black" strokeWidth={1.5} />
            </Link>

            <Link to="/stores" onClick={closeAllMenus} className="flex items-center gap-3 text-sm font-medium text-black">
              <MapPin size={20} strokeWidth={1.5} />
              <span>Find a store</span>
            </Link>

            <Link to="/newsletter" onClick={closeAllMenus} className="flex items-center gap-3 text-sm font-medium text-black">
              <Mail size={20} strokeWidth={1.5} />
              <span>Stay in the loop</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6. DESKTOP AXTARIŞ OVERLAY */}
      <DesktopSearchOverlay
        searchOpen={searchOpen}
        closeSearch={closeSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchKeyDown={handleSearchKeyDown}
        popularSearches={popularSearches}
        bestSellers={bestSellers}
        searchResults={searchResults}
        SEARCH_RESULTS_PREVIEW_LIMIT={SEARCH_RESULTS_PREVIEW_LIMIT}
        seeAllResultsLink={seeAllResultsLink}
      />

      {/* 7. MOBİL AXTARIŞ OVERLAY */}
      <MobileSearchOverlay
        searchOpen={searchOpen}
        closeSearch={closeSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchKeyDown={handleSearchKeyDown}
        popularSearches={popularSearches}
        bestSellers={bestSellers}
        matchingSuggestions={matchingSuggestions}
        searchResults={searchResults}
        SEARCH_RESULTS_PREVIEW_LIMIT={SEARCH_RESULTS_PREVIEW_LIMIT}
        seeAllResultsLink={seeAllResultsLink}
      />
    </header>
  );
}

export default Header;