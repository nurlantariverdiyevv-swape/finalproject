import { Link } from 'react-router-dom';

// Login / Register / Forgot Password səhifələrinin yuxarısında görünən,
// yalnız Runova loqosunu göstərən sadə bar (Header/Footer yoxdur, çünki
// bu səhifələr AppRouter-də Layout-un kənarında, tam ayrıca açılır).
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
