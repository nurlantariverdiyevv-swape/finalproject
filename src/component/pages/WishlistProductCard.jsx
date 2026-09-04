import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import ImageWithSkeleton from '../ImageWithSkeleton';
import SkeletonBlock from '../SkeletonBlock';
import { useCardReveal } from '../../hooks/useCardReveal';

function WishlistProductCard({ product, index, activeColor, onColorChange, onToggleWishlist, onAddToCart }) {
  const identifier = product.id;
  const activeImage = activeColor?.img || product.images?.[0] || product.img;
  const { ref, armed, ready, notifySettled } = useCardReveal(index);

  return (
    <Link ref={ref} to={`/product/${identifier}`} className="group flex flex-col justify-between no-underline">
      <div>
        <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-[10px] overflow-hidden mb-3">
          <ImageWithSkeleton src={armed ? activeImage : undefined} onSettled={notifySettled} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none" />

          {!ready && (
            <div className="absolute inset-0 z-10">
              <SkeletonBlock className="w-full h-full" rounded="rounded-[10px]" />
            </div>
          )}

          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist(product); }} className={`absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer z-20 ${ready ? '' : 'invisible'}`} aria-label="Remove from wishlist">
            <Heart className="w-[18px] h-[18px] fill-black text-black transition-colors" />
          </button>

          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onAddToCart) onAddToCart(product); }} className={`absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer z-20 ${ready ? '' : 'invisible'}`} aria-label="Add to cart">
            <ShoppingBag className="w-4 h-4 text-black" strokeWidth={1.5} />
          </button>
        </div>

        {ready ? (
          <div className="animate-[card-reveal_0.4s_ease-out]">
            <div className="flex items-center gap-1.5 mb-2 min-h-[26px]">
              {product.colors?.map((color, cIdx) => {
                const colorId = color.id || cIdx;
                const isActive = activeColor?.id === colorId || activeColor === color;
                return (
                  <button type="button" key={colorId} onClick={(e) => onColorChange(e, identifier, color)} className={`w-6 h-6 rounded-[4px] overflow-hidden border cursor-pointer transition-all z-20 ${isActive ? 'border-white scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <img src={color.img} alt={color.name} className="w-full h-full object-cover bg-[#f5f5f5] pointer-events-none" />
                  </button>
                );
              })}
            </div>

            {product.badge && (
              <span className={`inline-block text-[12px] font-semibold mb-1 ${product.badgeType === 'outlet' ? 'text-red-700' : 'text-red-600'}`}>
                {product.badge}
              </span>
            )}
            <h3 className="text-[17px] leading-[1.3] font-semibold uppercase tracking-[-0.01em] text-black group-hover:underline">
              {product.name}
            </h3>
            <p className="text-[13px] text-gray-500 font-light mt-0.5">{product.sub}</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 mb-2 min-h-[26px]">
              <SkeletonBlock className="w-6 h-6" rounded="rounded-[4px]" />
              <SkeletonBlock className="w-6 h-6" rounded="rounded-[4px]" />
            </div>
            <SkeletonBlock className="h-4 w-3/4 mb-1.5" />
            <SkeletonBlock className="h-3 w-1/2" />
          </div>
        )}
      </div>

      {ready ? (
        <div className="mt-2 flex items-center gap-2 animate-[card-reveal_0.4s_ease-out]">
          <span className="text-[15px] font-semibold text-black">${product.price}</span>
          {product.oldPrice && (
            <span className="text-[13px] text-gray-400 line-through font-light">${product.oldPrice}</span>
          )}
          {product.discountPercent && (
            <span className="text-[11px] bg-black text-white px-1.5 py-0.5 rounded-[3px] font-semibold">
              {product.discountPercent}
            </span>
          )}
        </div>
      ) : (
        <SkeletonBlock className="h-3.5 w-1/3 mt-2" />
      )}
    </Link>
  );
}

export default WishlistProductCard;