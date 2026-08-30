import { useState, useEffect, useCallback } from "react";

/**
 * Makes a grid of product images load ONE AT A TIME instead of all in
 * parallel, so the loading skeleton is actually visible on each card in
 * turn (with many images loading at once, the browser usually finishes
 * them all so close together that the skeleton barely shows).
 *
 * Usage in a product grid:
 *   const { isUnlocked, handleSettled } = useSequentialImageReveal(listKey);
 *   ...
 *   products.map((product, index) => (
 *     <ImageWithSkeleton
 *       src={isUnlocked(index) ? product.img : undefined}
 *       onSettled={() => handleSettled(index)}
 *     />
 *   ))
 *
 * Only image 0 starts loading immediately. Once it finishes (loaded OR
 * errored - either way it's "settled"), image 1 is unlocked and gets its
 * real `src`, starting its own request, and so on down the list. Passing
 * `undefined` as src to ImageWithSkeleton means that card just shows its
 * plain grey placeholder with no network request in flight yet - it's
 * simply waiting its turn.
 *
 * `listKey` should be a short string that changes whenever the set of
 * products on screen changes (e.g. product ids joined together) so
 * switching category/filter/sort restarts the sequence from the top
 * instead of leaving it wherever it was for the previous list.
 */
export function useSequentialImageReveal(listKey) {
  const [unlockedCount, setUnlockedCount] = useState(1);

  useEffect(() => {
    setUnlockedCount(1);
  }, [listKey]);

  const handleSettled = useCallback((index) => {
    setUnlockedCount((prev) => (index + 1 > prev ? index + 1 : prev));
  }, []);

  const isUnlocked = useCallback((index) => index < unlockedCount, [unlockedCount]);

  return { isUnlocked, handleSettled };
}
