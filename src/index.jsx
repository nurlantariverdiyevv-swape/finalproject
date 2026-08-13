import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./App.css"
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import WishlistProvider from './context/WishlistContext'
import BasketContextWrapper from './context/BasketContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <WishlistProvider>
          <BasketContextWrapper>
            <App />
          </BasketContextWrapper>
        </WishlistProvider>
      </DataProvider>
    </BrowserRouter>
  </StrictMode>
)