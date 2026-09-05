import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./App.css"
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import WishlistProvider from './context/WishlistContext'
import BasketProvider from './context/BasketContext'
import { AuthProvider } from './context/AuthContext'


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <WishlistProvider>
            <BasketProvider>
              <App />
            </BasketProvider>
          </WishlistProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)