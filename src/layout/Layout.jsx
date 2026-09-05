import { Outlet, useLocation } from 'react-router-dom';
import Header from '../component/inc/Header';
import Footer from '../component/inc/Footer';
import ErrorBoundary from '../component/ErrorBoundary';

function Layout() {
  const location = useLocation();

  return (
    <>
      <ErrorBoundary resetKey={location.pathname} fallback={null}>
        <Header />
      </ErrorBoundary>
      
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
