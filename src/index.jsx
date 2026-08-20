import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./App.css"
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import WishlistProvider from './context/WishlistContext'
import BasketProvider from './context/BasketContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <WishlistProvider>
          <BasketProvider>
            <App />
          </BasketProvider>
        </WishlistProvider>
      </DataProvider>
    </BrowserRouter>
  </StrictMode>
)