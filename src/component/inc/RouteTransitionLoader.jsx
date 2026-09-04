import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Footprints } from 'lucide-react';

function RouteTransitionLoader() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    timers.current.forEach(clearTimeout);
    timers.current = [];

    setVisible(true);
    setProgress(12);

    timers.current.push(setTimeout(() => setProgress(45), 90));
    timers.current.push(setTimeout(() => setProgress(72), 220));
    timers.current.push(setTimeout(() => setProgress(88), 380));
    timers.current.push(
      setTimeout(() => {
        setProgress(100);
        timers.current.push(
          setTimeout(() => {
            setVisible(false);
            timers.current.push(setTimeout(() => setProgress(0), 250));
          }, 280)
        );
      }, 520)
    );

    return () => timers.current.forEach(clearTimeout);
  }, [location.pathname]);

  return (
    <div aria-hidden="true" className={`fixed top-0 left-0 w-full h-[3px] z-[300] pointer-events-none transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-black via-neutral-700 to-black transition-[width] duration-300 ease-out relative">
        <div style={{ transform: `translateY(-50%) scaleX(1)` }} className="absolute top-1/2 -right-2.5 -translate-y-1/2 bg-black text-white rounded-full p-[3px] shadow-lg transition-transform duration-300">
          <Footprints size={12} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

export default RouteTransitionLoader;