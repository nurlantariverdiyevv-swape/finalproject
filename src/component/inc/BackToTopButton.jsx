import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button type="button" onClick={scrollToTop} aria-label="Back to top" className={`fixed bottom-6 right-4 sm:right-6 z-[90] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black text-white shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-neutral-800 active:scale-95 ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
      <ArrowUp size={20} strokeWidth={2} />
    </button>
  );
}

export default BackToTopButton;