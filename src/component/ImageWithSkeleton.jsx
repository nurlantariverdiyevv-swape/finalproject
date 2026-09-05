import { useState, useEffect, useRef } from "react";

function ImageWithSkeleton({ src, alt = "", className = "", onSettled, ...rest }) {
  const imgRef = useRef(null);
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    setStatus("loading");
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      const settled = img.naturalWidth > 0 ? "loaded" : "error";
      setStatus(settled);
      onSettled?.(settled);
    }
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {status !== "loaded" && <div className="absolute inset-0 bg-gray-200" />}
      {status !== "error" && src && (
        <img ref={imgRef} src={src} alt={alt} className={`${className} ${status === "loaded" ? "opacity-100" : "opacity-0"}`} onLoad={() => { setStatus("loaded"); onSettled?.("loaded"); }} onError={() => { setStatus("error"); onSettled?.("error"); }} {...rest} />
      )}
    </div>
  );
}

export default ImageWithSkeleton;