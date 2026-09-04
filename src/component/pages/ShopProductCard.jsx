import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import ImageWithSkeleton from '../ImageWithSkeleton';
import SkeletonBlock from '../SkeletonBlock';
import { useCardReveal } from '../../hooks/useCardReveal';

function ShopProductCard({ product, index, activeColor, onColorChange, isLiked, onToggleWishlist, onAddToCart }) {
  const identifier = product.id;
  const activeImage = activeColor?.img || product.images?.[0] || product.img;
  const { ref, armed, ready, notifySettled } = useCardReveal(index);

  return (
    <Link ref={ref} to={`/product/${identifier}`} className="group flex flex-col justify-between no-underline">
      <div>
        <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-xs overflow-hidden mb-2 md:mb-3">
          <ImageWithSkeleton src={armed ? activeImage : undefined} onSettled={notifySettled} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none" />

          {!ready && (
            <div className="absolute inset-0 z-10">
              <SkeletonBlock className="w-full h-full" rounded="rounded-xs" />
            </div>
          )}

          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist(product); }} className={`absolute top-2 right-2 md:top-3 md:right-3 p-1 md:p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer z-20 ${ready ? '' : 'invisible'}`}>
            <Heart className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isLiked ? 'fill-black text-black' : 'text-gray-700'}`} />
          </button>

          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onAddToCart) onAddToCart(product); }} className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1.5 md:p-2 bg-white rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-20 ${ready ? '' : 'invisible'}`}>
            <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 text-black" />
          </button>
        </div>

        {ready ? (
          <div className="animate-[card-reveal_0.4s_ease-out]">
            <div className="flex flex-row flex-wrap items-center gap-1 mb-1.5 min-h-[22px] md:min-h-[28px]">
              {product.colors?.map((color, cIdx) => {
                const colorId = color.id || cIdx;
                const isActive = activeColor?.id === colorId || activeColor === color;
                return (
                  <button type="button" key={colorId} onClick={(e) => onColorChange(e, identifier, color)} className={`w-4 h-4 md:w-6 md:h-6 rounded-xs overflow-hidden border cursor-pointer transition-all ${isActive ? 'border-white scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
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
            <h3 className="text-[15px] md:text-[18px] font-semibold text-black tracking-tight leading-snug group-hover:underline">
              {product.name}
            </h3>
            <p className="text-[11px] md:text-sm text-gray-500 font-normal mt-0.5">
              {product.sub || product.subCategory || product.category}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1 mb-1.5 min-h-[22px] md:min-h-[28px]">
              <SkeletonBlock className="w-4 h-4 md:w-6 md:h-6" rounded="rounded-xs" />
              <SkeletonBlock className="w-4 h-4 md:w-6 md:h-6" rounded="rounded-xs" />
            </div>
            <SkeletonBlock className="h-3.5 md:h-[18px] w-3/4 mb-1.5" />
            <SkeletonBlock className="h-2.5 md:h-3 w-1/2" />
          </div>
        )}
      </div>

      {ready ? (
        <div className="mt-1.5 md:mt-2.5 flex items-center gap-1.5 animate-[card-reveal_0.4s_ease-out]">
          <span className="text-[13px] md:text-[16px] font-semibold text-black">${product.price}</span>
          {product.oldPrice && (
            <span className="text-xs md:text-sm text-gray-400 line-through">${product.oldPrice}</span>
          )}
        </div>
      ) : (
        <SkeletonBlock className="h-3 md:h-4 w-1/3 mt-1.5 md:mt-2.5" />
      )}
    </Link>
  );
}

export default ShopProductCard;