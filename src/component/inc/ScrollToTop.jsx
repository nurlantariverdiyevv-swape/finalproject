import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Without this, the browser keeps whatever scroll position you were at on
// the PREVIOUS page. So if you were scrolled halfway down the shop page and
// clicked a product, you'd land on the product page already scrolled down
// (which feels like the site "throws you down"). This resets the scroll
// position to the very top every time the route (pathname) changes.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
