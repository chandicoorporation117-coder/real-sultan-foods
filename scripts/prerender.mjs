/**
 * Renders every route to a real HTML file after `vite build`.
 *
 * Why this exists: the site used to ship an empty <div id="root"> and draw
 * itself with JavaScript, so search engines had nothing to read. This walks
 * the route table, renders each page with react-dom/server, injects the
 * per-page <head> from src/lib/seo.ts, and writes dist/<route>/index.html.
 * The client then hydrates that markup instead of repainting it.
 *
 * Also emits sitemap.xml so Search Console has something to submit.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');
const SSR_ENTRY = pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href;

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** </script> inside JSON-LD would close the tag early. */
const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

function buildHead(seo) {
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${seo.noindex ? 'noindex, follow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${esc(seo.canonical)}" />`,
    `<meta property="og:site_name" content="Real Sultan Foods" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="en_PK" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${esc(seo.canonical)}" />`,
    `<meta property="og:image" content="${esc(seo.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${esc(seo.image)}" />`,
  ];

  if (seo.jsonLd?.length) {
    tags.push(
      `<script type="application/ld+json" id="rsf-jsonld">${safeJson({
        '@context': 'https://schema.org',
        '@graph': seo.jsonLd,
      })}</script>`
    );
  }

  return tags.join('\n    ');
}

const outputPath = (route) =>
  route === '/' ? join(DIST, 'index.html') : join(DIST, route.replace(/^\//, ''), 'index.html');

async function main() {
  const template = await readFile(join(DIST, 'index.html'), 'utf8');

  if (!template.includes('<!--app-html-->')) {
    throw new Error('dist/index.html is missing the <!--app-html--> marker — check index.html');
  }

  const { render, seoForPath, allRoutes, indexableRoutes, ORIGIN } = await import(SSR_ENTRY);

  const routes = allRoutes();
  let written = 0;

  for (const route of routes) {
    const seo = seoForPath(route);
    let html;
    try {
      html = render(route);
    } catch (err) {
      console.error(`  ✗ ${route} — render failed:`, err.message);
      throw err;
    }

    const page = template
      .replace('<!--app-head-->', buildHead(seo))
      .replace('<!--app-html-->', html);

    const file = outputPath(route);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, page, 'utf8');
    written += 1;
  }

  /* Vercel serves 404.html for any path that isn't a real file, which keeps
     unknown URLs returning a genuine 404 instead of a soft one. */
  const notFoundSeo = seoForPath('/__not-found__');
  await writeFile(
    join(DIST, '404.html'),
    template
      .replace('<!--app-head-->', buildHead(notFoundSeo))
      .replace('<!--app-html-->', render('/__not-found__')),
    'utf8'
  );

  /* sitemap.xml — indexable routes only, so the cart and checkout stay out. */
  const today = new Date().toISOString().slice(0, 10);
  const priority = (route) => {
    if (route === '/') return '1.0';
    if (route === '/shop' || route === '/wholesale') return '0.9';
    if (route.startsWith('/product/')) return '0.8';
    return '0.6';
  };

  const urls = indexableRoutes()
    .map((route) => {
      const loc = route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`;
      return [
        '  <url>',
        `    <loc>${esc(loc)}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>weekly</changefreq>`,
        `    <priority>${priority(route)}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  await writeFile(
    join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf8'
  );

  console.log(`\n  Prerendered ${written} routes + 404.html`);
  console.log(`  Sitemap: ${indexableRoutes().length} indexable URLs\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
