import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./App.css"
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import WishlistProvider from './context/WishlistContext'
import BasketProvider from './context/BasketContext'
import { AuthProvider } from './context/AuthContext'

// Registers public/sw.js. That file no longer does any caching (a previous
// version tried to cache images and ended up breaking some cross-origin
// image loads) - registering it here just makes sure any browser that
// already installed the old, buggy version gets cleaned up automatically.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Non-critical: nothing depends on this succeeding.
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