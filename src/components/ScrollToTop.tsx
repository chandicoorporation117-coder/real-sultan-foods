import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Routers keep the scroll position between pages; shops shouldn't.
 *  Only the pathname is watched, so changing shop filters (which live in the
 *  query string) doesn't yank the customer back to the top. */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}
