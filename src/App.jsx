import Header from './component/inc/Header'
import AppRouter from './component/provider/AppRouter'
import Footer from './component/inc/Footer'
import { useBasket } from './context/BasketContext'
import { SizeSelectionModal, AddedToBagDrawer } from './component/pages/BasketModalDrawer'

function App() {
  const { openSizeModal } = useBasket();

  return (
    <>
      <Header />
      <AppRouter onAddToCart={openSizeModal} />
      <Footer />
      <SizeSelectionModal />
      <AddedToBagDrawer />
    </>
  )
}

export default App