import { useState, useEffect, useRef } from "react";

/**
 * Drop-in replacement for <img>. Shows a plain grey placeholder in the
 * image's spot while it loads, then swaps to the real image the instant
 * it's ready (no fade/shimmer animation, so it never feels slower than a
 * normal <img> would). Falls back to a plain empty placeholder if the image
 * fails to load at all.
 *
 * Usage: same props as <img> (src, alt, className, ...), used inside a
 * parent that already has a defined size (aspect-square, fixed height,
 * etc.) - this component fills that parent with w-full h-full.
 */
function ImageWithSkeleton({ src, alt = "", className = "", onSettled, ...rest }) {
  const imgRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | loaded | error

  // If the src changes (e.g. switching a colour swatch) show the placeholder
  // again instead of keeping the previous image frozen in place.
  useEffect(() => {
    setStatus("loading");
  }, [src]);

  // If the browser already has this image in its cache (very common right
  // after a page refresh), the <img> can finish loading before this effect
  // even runs - in some cases the `load` event never fires again for an
  // already-complete image. Without this check the skeleton would then be
  // stuck showing forever even though the image is actually ready, which is
  // exactly what was happening on refresh.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      const settled = img.naturalWidth > 0 ? "loaded" : "error";
      setStatus(settled);
      onSettled?.(settled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {status !== "loaded" && <div className="absolute inset-0 bg-gray-200" />}
      {status !== "error" && src && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
          onLoad={() => {
            setStatus("loaded");
            onSettled?.("loaded");
          }}
          onError={() => {
            setStatus("error");
            onSettled?.("error");
          }}
          {...rest}
        />
      )}
    </div>
  );
}

export default ImageWithSkeleton;
