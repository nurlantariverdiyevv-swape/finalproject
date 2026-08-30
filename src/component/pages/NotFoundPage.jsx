import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

// Shown whenever a URL/slug doesn't resolve to anything real: unknown routes
// (the router's catch-all "*"), a /product/:id whose id doesn't match a real
// product, a /shop/:categoryName that doesn't match a real category, etc.
//
// Built entirely with in-app SVG/CSS (no external image) so it always loads
// instantly and matches the rest of the site's look.
function NotFoundPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 py-20 bg-white overflow-hidden">
      {/* Dotted "trail" fading out, tying into the running/outdoor theme */}
      <div className="flex items-center justify-center gap-2 mb-6 select-none" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-300"
            style={{ opacity: 1 - i * 0.15 }}
          />
        ))}
      </div>

      <Compass
        className="w-12 h-12 sm:w-14 sm:h-14 text-black mb-4 animate-[spin_9s_linear_infinite]"
        strokeWidth={1.25}
        aria-hidden="true"
      />

      <h1 className="text-[110px] sm:text-[150px] md:text-[180px] leading-none font-black tracking-tighter text-black select-none">
        404
      </h1>

      <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black mt-2 mb-3">
        You've wandered off the trail
      </h2>
      <p className="text-gray-500 max-w-md mb-10 text-sm sm:text-base">
        This page doesn't exist or may have been moved. Let's get you back on track.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-black text-white font-bold text-sm uppercase px-8 py-3.5 rounded-full hover:bg-gray-800 active:scale-95 transition-all duration-200"
      >
        <ArrowLeft size={16} />
        Go back home
      </Link>
    </div>
  );
}

export default NotFoundPage;
