import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

function WishlistToast() {
  const { toast, setToast } = useWishlist();

  if (!toast.show) return null;

  const handleClose = () => {
    setToast({ show: false, message: '', type: 'add' });
  };

  return (
    <div className="fixed top-32 right-6 z-[9999] flex items-start gap-3 bg-white text-black p-4 rounded-lg shadow-xl border border-gray-200 min-w-[300px] max-w-[360px] animate-[slideIn_0.3s_ease-out]">
      <div className="w-6 h-6 rounded-full bg-[#1b7a5a] flex items-center justify-center shrink-0 mt-0.5">
        <Check className="w-4 h-4 text-white stroke-[3]" />
      </div>

      <div className="flex flex-col flex-grow text-xs sm:text-sm font-medium pr-2">
        <span className="text-gray-900 font-semibold leading-tight">
          {toast.message}
        </span>
        <Link to="/wishlist" onClick={handleClose} className="text-gray-900 underline font-semibold mt-2 hover:text-black w-max text-xs">
          See my wishlist
        </Link>
      </div>

      <button type="button" onClick={handleClose} className="text-gray-400 hover:text-black transition-colors cursor-pointer p-0.5" aria-label="Close notification">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default WishlistToast;