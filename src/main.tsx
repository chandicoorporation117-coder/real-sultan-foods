import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './lib/cart';
import { ToastProvider } from './lib/toast';
import './index.css';

// BrowserRouter gives every page a real, crawlable URL
// (/shop, /product/mango). The old HashRouter put everything behind "#",
// which search engines drop entirely — the whole site looked like one page.
// Deep links are served by the prerendered HTML in dist/, with vercel.json
// falling back to the SPA for anything else.
const tree = (
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById('root')!;

// Prerendered pages arrive with markup already in place, so attach to it
// instead of throwing it away and repainting.
if (root.hasChildNodes()) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
