function SkeletonBlock({ className = "", rounded = "rounded-md" }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${rounded} ${className}`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[skeleton-shimmer_1.4s_ease-in-out_infinite]" />
    </div>
  );
}

export default SkeletonBlock;
