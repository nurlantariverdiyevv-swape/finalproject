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

  useEffect(() => {
    if (fetchContent) fetchContent();
    if (fetchCategories) fetchCategories();
  }, [fetchContent, fetchCategories]);

  return (
    <>
      <RouteTransitionLoader />
      <ScrollToTop />

      <ErrorBoundary>
        <AppRouter onAddToCart={openSizeModal} />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <SizeSelectionModal />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <AddedToBagDrawer />
      </ErrorBoundary>

      <GlobalErrorNotice />
      <BackToTopButton />
    </>
  )
}

export default App