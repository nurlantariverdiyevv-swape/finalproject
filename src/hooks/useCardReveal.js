import { useState, useRef, useEffect, useCallback } from "react";

// How long a card stays on its skeleton at minimum, even if the image was
// already cached and "loaded" instantly - so the skeleton is never just a
// single flickering frame.
const MIN_SKELETON_MS = 900;

// Extra delay per grid position so cards that enter the viewport together
// (e.g. everything above the fold on first load) still reveal in a
// "row by row" cascade instead of all popping in at once.
const STAGGER_STEP_MS = 60;
const STAGGER_MAX_MS = 480;

/**
 * Drives the skeleton -> real-content reveal for ONE product card.
 *
 * Replaces the old useSequentialImageReveal hook, which forced every image
 * in a grid to load one-at-a-time over the network (a real bug: it also had
 * an off-by-one that meant only the very first image ever unlocked). This
 * version lets every visible card load in parallel like normal, and instead
 * gets its "skeleton feel" from three independent things:
 *
 *   1. `armed` - becomes true once the card actually scrolls into view
 *      (IntersectionObserver), so cards further down the page don't start
 *      fetching their image until the user actually scrolls to them.
 *   2. A minimum skeleton time (MIN_SKELETON_MS + a small per-position
 *      stagger) that always has to elapse after the card is armed.
 *   3. `imgSettled` - set once the card's image has loaded or errored
 *      (via ImageWithSkeleton's onSettled).
 *
 * `ready` is only true once all three are satisfied - render the skeleton
 * version of the card until then, and pass the returned `ref` to the
 * card's outer element so it can be observed.
 *
 * `index` should be the card's position in the grid (used only for the
 * stagger amount, not for locking cards behind each other).
 */
export function useCardReveal(index = 0) {
  const ref = useRef(null);
  // Very old browser / non-DOM environment with no IntersectionObserver:
  // start armed immediately rather than getting stuck on the skeleton
  // forever. Checked once up front (lazy initializer) instead of inside the
  // effect below, so we never need to call setState synchronously from
  // within the effect body itself.
  const [armed, setArmed] = useState(() => typeof IntersectionObserver === "undefined");
  const [imgSettled, setImgSettled] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || armed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px", threshold: 0.01 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [armed]);

  useEffect(() => {
    if (!armed) return;
    const stagger = Math.min(index * STAGGER_STEP_MS, STAGGER_MAX_MS);
    const timer = setTimeout(() => setMinTimeDone(true), MIN_SKELETON_MS + stagger);
    return () => clearTimeout(timer);
  }, [armed, index]);

  const notifySettled = useCallback(() => setImgSettled(true), []);

  return { ref, armed, ready: armed && imgSettled && minTimeDone, notifySettled };
}
