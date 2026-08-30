import { Outlet, useLocation } from 'react-router-dom';
import Header from '../component/inc/Header';
import Footer from '../component/inc/Footer';
import ErrorBoundary from '../component/ErrorBoundary';

function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Header, page content and Footer are in separate boundaries: if one
          of them throws, the other two keep working instead of the whole
          page going blank. resetKey clears a crashed boundary automatically
          once the user navigates elsewhere. */}
      <ErrorBoundary resetKey={location.pathname} fallback={null}>
        <Header />
      </ErrorBoundary>

      {/* Keying by pathname re-triggers the fade-in animation (defined in
          App.css) on every navigation, so pages ease in instead of
          snapping into view instantly. */}
      <ErrorBoundary resetKey={location.pathname}>
        <div key={location.pathname} className="route-fade-in">
          <Outlet />
        </div>
      </ErrorBoundary>

      <ErrorBoundary resetKey={location.pathname} fallback={null}>
        <Footer />
      </ErrorBoundary>
    </>
  );
}

export default Layout;
