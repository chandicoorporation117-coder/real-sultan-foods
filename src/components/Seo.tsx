import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoForPath } from '../lib/seo';

/** Keeps a tag in <head> and updates it in place rather than piling up
 *  duplicates as the shopper moves between routes. */
function upsert(selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
}

const meta = (attr: 'name' | 'property', key: string, content: string) =>
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute(attr, key);
      return el;
    },
    (el) => el.setAttribute('content', content)
  );

/** The prerendered HTML already carries the correct head for the first
 *  paint. This only re-syncs it during client-side navigation, so that
 *  sharing or bookmarking a page mid-session still gets the right title. */
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoForPath(pathname);

    document.title = seo.title;
    meta('name', 'description', seo.description);
    meta('name', 'robots', seo.noindex ? 'noindex, follow' : 'index, follow');
    meta('property', 'og:title', seo.title);
    meta('property', 'og:description', seo.description);
    meta('property', 'og:url', seo.canonical);
    meta('property', 'og:image', seo.image);
    meta('name', 'twitter:card', 'summary_large_image');
    meta('name', 'twitter:title', seo.title);
    meta('name', 'twitter:description', seo.description);
    meta('name', 'twitter:image', seo.image);

    upsert(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        return el;
      },
      (el) => el.setAttribute('href', seo.canonical)
    );

    const ldId = 'rsf-jsonld';
    document.getElementById(ldId)?.remove();
    if (seo.jsonLd?.length) {
      const script = document.createElement('script');
      script.id = ldId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': seo.jsonLd });
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}
