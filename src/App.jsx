import { useEffect } from 'react'
import AppRouter from './component/provider/AppRouter'
import { useBasket } from './context/BasketContext'
import { useDataContext } from './context/DataContext'
import { SizeSelectionModal, AddedToBagDrawer } from './component/pages/BasketModalDrawer'
import RouteTransitionLoader from './component/inc/RouteTransitionLoader'

function App() {
  const { openSizeModal } = useBasket();
  const { fetchContent } = useDataContext();

  // All static content needed by Header, Footer, Main, and other pages
  // (menu, banners, footer links, etc.) is fetched once from the Vercel
  // API when the app opens.
  useEffect(() => {
    if (fetchContent) fetchContent();
  }, [fetchContent]);

  return (
    <>
      <RouteTransitionLoader />
      {/* Header and Footer now live inside Layout.jsx, shown for every page
          except login/register (see AppRouter.jsx) */}
      <AppRouter onAddToCart={openSizeModal} />
      <SizeSelectionModal />
      <AddedToBagDrawer />
    </>
  )
}

export default App