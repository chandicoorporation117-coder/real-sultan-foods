import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './lib/cart';
import { ToastProvider } from './lib/toast';
import './index.css';

// HashRouter keeps deep links working on GitHub Pages without any server
// rewrite rules. Swap to BrowserRouter if you move to a host that can
// fall back to index.html.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>
);
