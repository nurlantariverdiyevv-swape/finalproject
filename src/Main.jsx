import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductSlider from './component/pages/ProductSlider';
import { useDataContext } from './context/DataContext';

function Main({ onAddToCart }) {
  // "Shop by activity" və bannerlər artıq hardcode deyil, vercel API-dəki
  // content.json-dan (content.home.activities / content.home.banners) gəlir.
  const { content } = useDataContext();
  const activities = content?.home?.activities || [];
  const bannerData = content?.home?.banners || [];

  const scroll = (direction) => {
    const container = document.getElementById('activity-slider');
    if (container) {
      const { scrollLeft, clientWidth } = container;
      const scrollAmount = clientWidth * 0.5;

      container.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Banner Section */}
      <div className="relative w-full aspect-4/3 min-[320px]:aspect-video lg:aspect-auto overflow-hidden bg-gray-200">
        <img src="/assets/img/reklam.jpeg" alt="X Ultra 5 Gore-Tex" className="absolute inset-0 w-full h-full object-cover object-bottom-left transition-all duration-300" />

        <div className="hidden lg:block lg:w-full lg:h-full lg:max-w-360 lg:mx-auto lg:relative">
          <img src="/assets/img/reklam.jpeg" alt="X Ultra 5 Gore-Tex" className="w-full h-auto opacity-0" />
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />

        <div className="absolute inset-0 max-w-360 mx-auto p-4 sm:p-6 md:p-12 flex flex-col justify-center items-start text-white z-10">
          <h1 className="text-xl sm:text-3xl md:text-5xl font-black tracking-wide uppercase max-w-xl mb-1.5 sm:mb-3 drop-shadow-md leading-tight">
            X Ultra 5 Gore-Tex
          </h1>
          <p className="text-xs sm:text-base md:text-lg font-medium text-gray-200 mb-4 sm:mb-8 max-w-md drop-shadow-md">
            Confidence in every step
          </p>

          <Link to="/product/x-ultra-5-gtx-blackcoffee" className="bg-white text-black font-bold text-xs sm:text-sm px-5 py-2 sm:px-8 sm:py-3.5 rounded-full hover:bg-gray-200 transition-all duration-200 active:scale-95 shadow-lg">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Shop By Activity Section */}
      <section className="max-w-360 mx-auto px-4 md:px-12 py-6 sm:py-10 select-none">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
            Shop by activity
          </h2>

          {/* Slider Controls */}
          <div className="hidden min-[768px]:max-[1168px]:flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-black flex items-center justify-center transition-colors active:scale-95 cursor-pointer" aria-label="Previous slide">
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button onClick={() => scroll('right')} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e5e5e5] hover:bg-gray-300 text-black flex items-center justify-center transition-colors active:scale-95 cursor-pointer" aria-label="Next slide">
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div id="activity-slider" className="grid grid-cols-2 gap-2 sm:gap-3 min-[768px]:max-[1168px]:flex min-[768px]:max-[1168px]:overflow-x-auto min-[768px]:max-[1168px]:scroll-smooth min-[768px]:max-[1168px]:scrollbar-none min-[768px]:max-[1168px]:pb-4 min-[1168px]:grid min-[1168px]:grid-cols-5 min-[1168px]:gap-4">
          {activities.map((activity, index) => (
            <Link key={index} to={activity.link} className={`group relative rounded-md overflow-hidden block bg-gray-900 ${index === 0 ? 'col-span-2 aspect-video min-[768px]:max-[1168px]:col-span-1 min-[768px]:max-[1168px]:aspect-[2/3] min-[1168px]:col-span-1 min-[1168px]:aspect-[2/3]' : 'col-span-1 aspect-[2/3]'} min-[768px]:max-[1168px]:shrink-0 min-[768px]:max-[1168px]:w-75`}>
              <img src={activity.img} alt={activity.name} className={`w-full h-full object-cover ${activity.position} transition-transform duration-500 ease-out group-hover:scale-105 opacity-90`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 group-hover:from-black/80 transition-colors duration-300" />
              <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between text-white z-10">
                <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight drop-shadow-md leading-tight pr-1">
                  {activity.name}
                </span>
                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out shrink-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2-li Banner Bölməsi */}
      <section className="w-full py-6 select-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-1.5">
          {bannerData.map((banner) => (
            <Link key={banner.id} to={banner.link} className="group relative w-full h-[450px] sm:h-[520px] lg:h-[620px] overflow-hidden bg-gray-900 cursor-pointer block">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:p-12 flex flex-col items-start gap-3 z-10 text-white">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight leading-tight drop-shadow-md">
                  {banner.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-200 font-light mb-2 drop-shadow">
                  {banner.subtitle}
                </p>
                <span className="bg-white text-black font-bold text-sm sm:text-base px-7 py-3 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-block">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Slider Component */}
      <ProductSlider onAddToCart={onAddToCart} />   
    </main>
  );
}

export default Main;