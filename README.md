# Real Sultan Foods — online store

A mobile-first storefront for Real Sultan Foods (Lahore): 26 products across four
labels, a searchable and filterable catalogue, product pages with galleries and
pack variants, a persistent cart, and cash-on-delivery checkout that hands the
order to the owner's WhatsApp.

Built as a static React site so it can be hosted anywhere, including GitHub Pages.

---

## Running it

```bash
npm install
npm run dev
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck + production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Typecheck only |

---

## How ordering works

The site is static — there is no server — so the order is delivered through the
customer's own WhatsApp:

1. Customer fills in name, phone, address and city at checkout. Payment method is
   Cash on Delivery; there is no card or online payment path.
2. Pressing **Place order on WhatsApp** builds a formatted order message and opens
   `https://wa.me/923104181750?text=…` in a new tab.
3. The customer presses send in WhatsApp; the message lands in the owner's inbox.
4. The site shows an order-confirmed page with the order number, a **Send on
   WhatsApp** button (in case the tab was blocked) and a **Copy order details**
   button.

The message the owner receives looks like this:

```
*NEW ORDER — Real Sultan Foods*
Order: *RSF-260922-9584*
22 Sep 2026, 11:29 am

*CUSTOMER DETAILS*
Name: Ahmed Raza Khan
Phone: +923001234567
Address: House 12, Street 4, Block C
Area: Johar Town
City: Lahore
Notes: Please call before arriving

*ORDER*
1. Diamond Way Mango — Single · 290 ml
   1 × Rs 120 = Rs 120

Subtotal: Rs 120
Delivery: Rs 250
*TOTAL: Rs 370*

Payment: *Cash on Delivery*
```

### Worth knowing

Because the customer's device sends the message, an order only reaches the owner
once the customer presses **send**. If you want the order recorded server-side
regardless — so nothing is lost when someone abandons the WhatsApp tab — that
needs a backend (a form endpoint, or the WhatsApp Business Cloud API sending the
message from your own number). The checkout code is already structured for it:
`createOrder()` in [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts) returns the whole
order object, so a `fetch()` to an API route drops straight in next to the
`window.open` call in [`src/pages/Checkout.tsx`](src/pages/Checkout.tsx).

---

## Editing the shop

Everything an owner normally changes lives in two files.

**[`src/data/site.ts`](src/data/site.ts)** — business details:

```ts
whatsappNumber: '923104181750',   // digits only, international format
deliveryFee: 250,
freeDeliveryThreshold: 3000,      // free delivery above this
```

**[`src/data/catalog.ts`](src/data/catalog.ts)** — products. Most are generated
from small flavour tables, so changing every Mary Diamond PET price is one edit:

```ts
variants: [
  { id: '500ml',  label: '500 ml',   price: 90,  compareAt: 100, units: 1 },
  { id: '1500ml', label: '1.5 litre', price: 180, compareAt: 200, units: 1 },
],
```

- `compareAt` is the was-price — it renders the strikethrough and the `−10%` badge.
- `units` drives the "Rs 115 per bottle" line on multi-packs.
- `popularity` (0–100) orders the Best sellers rail and the default sort.
- `isNew: true` adds the New badge and puts it in New arrivals.

> **Prices are placeholders.** They were set to plausible retail figures so the
> store is usable end to end — check every one before going live.

---

## Product photography

The only source images are the nine marketing banners in `public/images/`, each
showing several bottles at once. [`scripts/crop.cjs`](scripts/crop.cjs) cuts them
into the 26 individual 4:5 product shots in `public/images/products/`:

```bash
node scripts/crop.cjs            # regenerate product shots
node scripts/crop.cjs --check    # …and write contact sheets to scratch-check/
```

Each bottle is a tall, narrow strip, so the crop has to be widened to reach 4:5.
The script repeats the crop's edge columns outward and then blurs those bands, so
the padding keeps the banner's own colours and reads as depth of field instead of
a streak. Crop boxes are in the `JOBS` table at the top of the file.

Two helpers made those boxes measurable rather than guesswork:

```bash
node scripts/ruler.cjs <banner.jpg>              # overlay a labelled pixel grid
node scripts/gaps.cjs <banner.jpg> <top> <height> # find the gaps between bottles
```

`gaps.cjs` scores each column by horizontal gradient energy: labels and text carry
detail, the sky/grass/hedge backdrops don't, so the low-energy runs are the gaps
where a crop edge can safely land.

To swap in real product photography, drop 4:5 images into
`public/images/products/` under the same names and the script becomes unnecessary.

---

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

1. Push the repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`.

The workflow sets `BASE_PATH` to `/<repo-name>/` automatically, which
[`vite.config.ts`](vite.config.ts) uses for the asset base. A custom domain or a
`<user>.github.io` repo serves from the root instead — set `BASE_PATH: /` in the
workflow for those.

Routing uses `HashRouter` (`/#/shop`), which means deep links work on GitHub Pages
with no server rewrite rules. On a host that can fall back to `index.html`
(Netlify, Vercel, Cloudflare Pages), swap it for `BrowserRouter` in
[`src/main.tsx`](src/main.tsx) for cleaner URLs.

---

## Project layout

```
src/
  data/site.ts        business details, WhatsApp number, delivery rules
  data/catalog.ts     all 26 products, brands, categories, filters
  lib/cart.tsx        cart context, persisted to localStorage
  lib/whatsapp.ts     order message + wa.me links
  lib/format.ts       PKR formatting, asset paths, PK phone validation
  lib/toast.tsx       toast notifications
  components/         header, footer, cart drawer, product card, icons
  pages/              home, shop, product, cart, checkout, confirmation, about, contact
scripts/              banner cropping + the measuring tools behind it
public/images/        source banners, logo, and generated product shots
```

Stack: React 18, TypeScript, Vite 5, Tailwind CSS 4, React Router 6. No backend,
no analytics, no third-party scripts beyond Google Fonts and the Google Maps embed
on the contact page.
