import { useEffect } from 'react'
import AppRouter from './component/provider/AppRouter'
import { useBasket } from './context/BasketContext'
import { useDataContext } from './context/DataContext'
import { SizeSelectionModal, AddedToBagDrawer } from './component/pages/BasketModalDrawer'
import RouteTransitionLoader from './component/inc/RouteTransitionLoader'
import ScrollToTop from './component/inc/ScrollToTop'
import BackToTopButton from './component/inc/BackToTopButton'
import ErrorBoundary from './component/ErrorBoundary'
import GlobalErrorNotice from './component/GlobalErrorNotice'

function App() {
  const { openSizeModal } = useBasket();
  const { fetchContent, fetchCategories } = useDataContext();

  // All static content needed by Header, Footer, Main, and other pages
  // (menu, banners, footer links, etc.) is fetched once from the Vercel
  // API when the app opens. ShopPage's category filter rules/labels come
  // from the same API and are fetched here too so they're ready in time.
  useEffect(() => {
    if (fetchContent) fetchContent();
    if (fetchCategories) fetchCategories();
  }, [fetchContent, fetchCategories]);

  return (
    <>
      <RouteTransitionLoader />
      <ScrollToTop />
      {/* Header and Footer now live inside Layout.jsx, shown for every page
          except login/register (see AppRouter.jsx). Each route already has
          its own ErrorBoundary (see AppRouter.jsx); this outer one is just a
          last-resort net in case something outside the routes themselves
          (e.g. Layout) ever throws. */}
      <ErrorBoundary>
        <AppRouter onAddToCart={openSizeModal} />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <SizeSelectionModal />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <AddedToBagDrawer />
      </ErrorBoundary>
      {/* Catches what ErrorBoundary structurally can't: errors thrown in
          event handlers or async code (see GlobalErrorNotice.jsx). */}
      <GlobalErrorNotice />
      <BackToTopButton />
    </>
  )
}

export default App