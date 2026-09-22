import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { CartProvider } from './lib/cart';
import { ToastProvider } from './lib/toast';

/** Rendered once per route at build time by scripts/prerender.mjs.
 *  Every browser API in the app sits inside an effect, so the tree renders
 *  cleanly on the server with an empty cart and no toasts. */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <ToastProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ToastProvider>
      </StaticRouter>
    </StrictMode>
  );
}

export { seoForPath, indexableRoutes, allRoutes, ORIGIN } from './lib/seo';
