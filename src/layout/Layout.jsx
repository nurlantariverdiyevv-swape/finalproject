import { Outlet, useLocation } from 'react-router-dom';
import Header from '../component/inc/Header';
import Footer from '../component/inc/Footer';

function Layout() {
  const location = useLocation();

  return (
    <>
      <Header />
      {/* Keying by pathname re-triggers the fade-in animation (defined in
          App.css) on every navigation, so pages ease in instead of
          snapping into view instantly. */}
      <div key={location.pathname} className="route-fade-in">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default Layout;
