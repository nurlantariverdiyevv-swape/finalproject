import { Link } from 'react-router-dom';

function AuthTopBar() {
  return (
    <div className="w-full bg-black">
      <div className="max-w-md mx-auto px-4 py-5 flex items-center justify-center">
        <Link to="/" className="inline-block">
          <img src="/assets/img/runovalogo-white.png" alt="Runova" className="h-8 w-auto object-contain" />
        </Link>
      </div>
    </div>
  );
}

export default AuthTopBar;
