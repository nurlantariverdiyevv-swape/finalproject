import { useEffect } from 'react'
import AppRouter from './component/provider/AppRouter'
import { useBasket } from './context/BasketContext'
import { useDataContext } from './context/DataContext'
import { SizeSelectionModal, AddedToBagDrawer } from './component/pages/BasketModalDrawer'

function App() {
  const { openSizeModal } = useBasket();
  const { fetchContent } = useDataContext();

  // Header, Footer, Main və digər səhifələr üçün lazım olan bütün statik
  // məzmun (menyu, banner, footer linkləri və s.) tətbiq açılan kimi
  // vercel API-dən bir dəfə çəkilir.
  useEffect(() => {
    if (fetchContent) fetchContent();
  }, [fetchContent]);

  return (
    <>
      {/* Header və Footer indi Layout.jsx daxilində, yalnız login/register
          xaricindəki səhifələr üçün göstərilir (bax: AppRouter.jsx) */}
      <AppRouter onAddToCart={openSizeModal} />
      <SizeSelectionModal />
      <AddedToBagDrawer />
    </>
  )
}

export default App