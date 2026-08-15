import { useState, useEffect, useMemo } from 'react';
import { Search, User, Heart, Menu, ShoppingBag, X, ChevronRight, ArrowRight, HelpCircle, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useBasket } from '../../context/BasketContext';
import { useDataContext } from '../../context/DataContext';

const popularSearches = [
  'xt 6', 'speedcross', 'gore tex', 'xt 4', 'salomon',
  'snowboard', 'maison margiela', 'xt whisper', 'margiela',
  'xa pro 3d', 'whisper', 'x ultra',
];

function Header() {
  const { wishlist } = useWishlist();
  const { totalBasketCount } = useBasket();
  const { slider = [], shopProducts = [], fetchSlider, fetchShopProducts } = useDataContext();

  const categories = ['New', 'Shoes', 'Men', 'Women', 'Kids', 'Activities', 'Explore'];

  const desktopMenuData = {
    New: {
      subCategories: [
        { name: 'Men', link: '/shop/men' },
        { name: 'Women', link: '/shop/women' },
        { name: 'Sportstyle', link: '/shop/sportstyle' },
        { name: 'Icons', link: '/shop/icons' },
        { name: 'See all', link: '/shop' },
      ],
      banners: [
        { title: 'New Arrivals', img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop', link: '/shop/new' },
        { title: 'Best Sellers', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', link: '/shop/best-sellers' },
      ],
    },
    Shoes: {
      subCategories: [
        { name: 'Men Shoes', link: '/shop/men-shoes' },
        { name: 'Women Shoes', link: '/shop/women-shoes' },
        { name: 'Sportstyle', link: '/shop/sportstyle' },
        { name: 'See all', link: '/shop' },
      ],
      banners: [
        { title: 'New Arrivals', img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop', link: '/shop/new' },
        { title: 'Best Sellers', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', link: '/shop/best-sellers' },
      ],
    },
    Men: {
      subCategories: [
        { name: 'Running', link: '/shop/running' },
        { name: 'Trail Running', link: '/shop/trail-running' },
        { name: 'Hiking', link: '/shop/hiking' },
        { name: 'See all', link: '/shop' },
      ],
      banners: [
        { title: 'New Arrivals', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop', link: '/shop/men' },
      ],
    },
    Women: {
      subCategories: [
        { name: 'Running', link: '/shop/running' },
        { name: 'Trail Running', link: '/shop/trail-running' },
        { name: 'Hiking', link: '/shop/hiking' },
        { name: 'See all', link: '/shop' },
      ],
      banners: [
        { title: 'New Arrivals', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop', link: '/shop/women' },
      ],
    },
    Kids: {
      subCategories: [
        { name: 'Shoes', link: '/shop/kids-shoes' },
        { name: 'Clothing', link: '/shop/kids-clothing' },
      ],
      banners: [
        { title: 'Kids New Collection', img: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop', link: '/shop/kids' },
      ],
    },
    Activities: {
      subCategories: [
        { name: 'Trail Running', link: '/shop/trail-running' },
        { name: 'Road Running', link: '/shop/road-running' },
        { name: 'Hiking & Backpacking', link: '/shop/hiking' },
      ],
      banners: [
        { title: 'Explore Activities', img: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop', link: '/shop/activities' },
      ],
    },
    Explore: {
      subCategories: [
        { name: 'Stories', link: '/shop/stories' },
        { name: 'Sustainability', link: '/shop/sustainability' },
      ],
      banners: [
        { title: 'Our Stories', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop', link: '/shop/stories' },
      ],
    },
  };

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const DesktopProductCard = ({ product, onNavigate }) => {
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
  };

  const MobileProductCard = ({ product }) => {
    const activeColor = product.colors?.[0];
    const activeImage = activeColor?.img || product.images?.[0] || product.img;
    return (
      <Link to={`/product/${product.id}`} onClick={closeSearch} className="flex flex-col no-underline">
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
            <Link to="/login" className="flex items-center gap-2 text-black hover:opacity-70">
              <User size={20} strokeWidth={1.5} />
              <span className="text-sm font-semibold">Log in</span>
            </Link>

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
                <Link to="/login" onClick={closeAllMenus} className="flex items-center gap-2 text-black font-medium text-sm">
                  <User size={18} />
                  <span>Log in</span>
                </Link>
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
            <Link to="/login" onClick={closeAllMenus} className="flex items-center justify-between text-sm font-medium text-black">
              <div className="flex items-center gap-3">
                <User size={20} strokeWidth={1.5} />
                <span>Log in</span>
              </div>
              <span className="font-bold text-xs italic tracking-wider">S/PLUS</span>
            </Link>

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

            <Link to="/basket" onClick={closeAllMenus} className="flex items-center justify-between text-sm font-medium text-black">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {totalBasketCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#c8102e] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {totalBasketCount}
                    </span>
                  )}
                </div>
                <span>Basket</span>
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
      {searchOpen && (
        <div className="hidden lg:block fixed inset-0 z-[200]">
          {/* Arxa fon - səhifənin qalanı bulanıq/tündləşmiş görünür */}
          <div onClick={closeSearch} className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

          {/* Yuxarı ağ panel - yalnız məzmun qədər hündürlükdə */}
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
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a product"
                    className="w-full bg-[#f4f4f4] text-base text-black placeholder-gray-500 rounded-full pl-10 pr-10 py-2.5 border border-transparent focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-black cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                <span className="font-black tracking-tight text-lg text-black select-none">SALOMON</span>

                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex items-center gap-2 text-black font-semibold text-sm hover:opacity-70 cursor-pointer shrink-0 ml-auto"
                >
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
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSearchQuery(term)}
                          className="flex items-center gap-3 py-2.5 text-left cursor-pointer group"
                        >
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
                    {searchResults.slice(0, 10).map((product) => (
                      <DesktopProductCard key={product.id} product={product} onNavigate={closeSearch} />
                    ))}
                  </div>

                  {searchResults.length > 10 && (
                    <div className="flex justify-center">
                      <Link to="/shop" onClick={closeSearch} className="px-6 py-3 border border-gray-300 rounded-full text-sm font-semibold text-black hover:bg-black hover:text-white transition-all">
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
      )}

      {/* 7. MOBİL AXTARIŞ OVERLAY */}
      {searchOpen && (
        <div className="lg:hidden fixed inset-0 z-[200] bg-white flex flex-col">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 shrink-0">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                <Search size={20} strokeWidth={1.8} />
              </span>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a product"
                className="w-full bg-[#f4f4f4] text-sm text-black placeholder-gray-500 rounded-full pl-11 pr-4 py-3 border border-transparent focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-black shrink-0 cursor-pointer"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8">
            {searchQuery.trim() === '' ? (
              <>
                <div className="flex flex-col mb-6">
                  {popularSearches.slice(0, 6).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearchQuery(term)}
                      className="flex items-center gap-3 py-3 border-b border-gray-100 text-left cursor-pointer"
                    >
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
                        <MobileProductCard key={product.id} product={product} />
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
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSearchQuery(name)}
                        className="flex items-center gap-3 py-3 border-b border-gray-100 text-left cursor-pointer"
                      >
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
                      {searchResults.slice(0, 10).map((product) => (
                        <MobileProductCard key={product.id} product={product} />
                      ))}
                    </div>
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
      )}
    </header>
  );
}

export default Header;