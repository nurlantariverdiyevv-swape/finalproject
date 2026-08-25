import { Outlet } from 'react-router-dom';
import Header from '../component/inc/Header';
import Footer from '../component/inc/Footer';

// Login/Register xaricindəki bütün səhifələr üçün ortaq Header + Footer.
// Login və Register isə AppRouter-də bu Layout-un kənarında, ayrıca,
// tamamilə "təmiz" bir səhifə kimi render olunur (heç bir header/footer olmadan).
function Layout({ onAddToCart }) {
  return (
    <>
      <Header />
      <Outlet context={{ onAddToCart }} />
      <Footer />
    </>
  );
}

export default Layout;
