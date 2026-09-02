import SkeletonBlock from "./SkeletonBlock";

/**
 * Plain skeleton card with no product data behind it at all - used to fill
 * the grid on first load / refresh, before the API response with the
 * actual products has come back. Shape matches ShopProductCard so the
 * grid doesn't visually jump once real cards take its place.
 */
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col justify-between">
      <div>
        <SkeletonBlock className="w-full aspect-square mb-2 md:mb-3" rounded="rounded-xs" />
        <div className="flex items-center gap-1 mb-1.5 min-h-[22px] md:min-h-[28px]">
          <SkeletonBlock className="w-4 h-4 md:w-6 md:h-6" rounded="rounded-xs" />
          <SkeletonBlock className="w-4 h-4 md:w-6 md:h-6" rounded="rounded-xs" />
        </div>
        <SkeletonBlock className="h-3.5 md:h-[18px] w-3/4 mb-1.5" />
        <SkeletonBlock className="h-2.5 md:h-3 w-1/2" />
      </div>
      <SkeletonBlock className="h-3 md:h-4 w-1/3 mt-1.5 md:mt-2.5" />
    </div>
  );
}

export default ProductCardSkeleton;
