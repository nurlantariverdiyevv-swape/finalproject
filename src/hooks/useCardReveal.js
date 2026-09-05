import { useState, useRef, useEffect, useCallback } from "react";

const MIN_SKELETON_MS = 900;
const STAGGER_STEP_MS = 60;
const STAGGER_MAX_MS = 480;


export function useCardReveal(index = 0) {
  const ref = useRef(null);
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
