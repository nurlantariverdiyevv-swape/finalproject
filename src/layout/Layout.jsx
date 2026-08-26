import { Outlet } from 'react-router-dom';
import Header from '../component/inc/Header';
import Footer from '../component/inc/Footer';

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
