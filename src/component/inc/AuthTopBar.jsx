import { Link } from 'react-router-dom';

// A simple bar shown above the Login / Register / Forgot Password pages,
// showing only the Runova logo (no Header/Footer, since these pages
// render fully standalone in AppRouter, outside of Layout).
function AuthTopBar() {
  return (
    <div className="w-full border-b border-gray-100 bg-white">
      <div className="max-w-md mx-auto px-4 py-5 flex items-center justify-center">
        <Link to="/" className="inline-block">
          <img src="/assets/img/runovalogo.png" alt="Runova" className="h-8 w-auto object-contain" />
        </Link>
      </div>
    </div>
  );
}

export default AuthTopBar;
