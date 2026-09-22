/* Cuts individual product shots out of the Sultan Foods marketing banners.
   Every output is 4:5 (800x1000).

   The bottles sit in tall, narrow strips, so each crop has to be widened to
   reach 4:5. Two ways of doing that:

   - default: repeat the crop's edge columns outward. The boxes below are cut in
     the clean background *between* bottles, so the repeated column is the
     banner's own sky / grass / floor gradient and the join is invisible.
   - widen:   grow the box sideways with real source pixels instead. Used on the
     single-product banners, which have empty space around the bottle.

   node scripts/crop.cjs           -> public/images/products
   node scripts/crop.cjs --check   -> also writes contact sheets to scratch-check */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'public/images';
const OUT = 'public/images/products';
const CHECK = process.argv.includes('--check');
const ASPECT = 0.8;

// name, left, top, width, height  (source pixels), optional { patch }
const JOBS = {
  'mary-diamond-pet-banner.jpg': {
    crops: [
      ['mary-diamond-pet-peach', 40, 196, 271, 566],
      ['mary-diamond-pet-pomegranate', 311, 196, 227, 566],
      ['mary-diamond-pet-mango', 538, 186, 226, 576],
      ['mary-diamond-pet-apple', 764, 196, 228, 566],
      ['mary-diamond-pet-guava', 992, 196, 248, 566],
    ],
  },
  'mary-diamond-glass-banner.jpg': {
    crops: [
      ['mary-diamond-glass-peach', 90, 336, 210, 710],
      ['mary-diamond-glass-lychee', 300, 326, 205, 720],
      ['mary-diamond-glass-mango', 505, 264, 246, 782],
      ['mary-diamond-glass-apple', 751, 336, 192, 710],
      ['mary-diamond-glass-pomegranate', 943, 342, 202, 704],
    ],
  },
  'diamond-way-basil-banner.jpg': {
    crops: [
      ['diamond-way-basil-strawberry', 18, 408, 206, 722],
      ['diamond-way-basil-lychee', 232, 396, 148, 734],
      ['diamond-way-basil-green-apple', 378, 386, 176, 744],
      ['diamond-way-basil-mango', 552, 366, 198, 764],
      ['diamond-way-basil-cocktail', 750, 382, 170, 748],
      ['diamond-way-basil-pineapple', 920, 392, 172, 738],
    ],
  },
  'diamond-way-juice-banner.jpg': {
    crops: [
      ['diamond-way-juice-mango', 20, 262, 315, 606],
      ['diamond-way-juice-apple', 335, 262, 287, 606],
      ['diamond-way-juice-pomegranate', 622, 262, 285, 606],
      ['diamond-way-juice-peach', 907, 262, 303, 606],
    ],
  },
  'ab-e-hayat-banner.jpg': {
    crops: [['ab-e-hayat', 380, 34, 410, 858, { patch: [0, 0, 92, 52] }]],
  },
  'mary-diamond-tetra-banner.jpg': {
    crops: [
      ['mary-diamond-tetra-mango', 30, 112, 640, 968],
      ['mary-diamond-tetra-apple', 670, 112, 630, 968],
    ],
  },
  'gold-lychee-banner.jpg': { widen: true, crops: [['gold-lychee', 348, 164, 542, 826]] },
  'gold-apple-banner.jpg': { widen: true, crops: [['gold-apple', 348, 164, 542, 826]] },
  'gold-power-banner.jpg': { widen: true, crops: [['gold-power', 396, 206, 478, 768]] },
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

async function build(src, cfg, [name, left, top, width, height, opts = {}]) {
  const file = path.join(SRC, src);
  const meta = await sharp(file).metadata();
  if (left < 0 || top < 0 || left + width > meta.width || top + height > meta.height) {
    throw new Error(`${name}: crop box outside ${src} (${meta.width}x${meta.height})`);
  }

  const canvasW = Math.round(height * ASPECT);
  let out;

  if (cfg.widen) {
    const w = clamp(canvasW, 1, meta.width);
    const l = clamp(Math.round(left + width / 2 - w / 2), 0, meta.width - w);
    out = sharp(file).extract({ left: l, top, width: w, height });
  } else {
    let buf = await sharp(file).extract({ left, top, width, height }).png().toBuffer();

    if (opts.patch) {
      // Blur out banner artwork (a contact strip, a logo) that clips into the crop.
      // Done before padding so the edge column that gets repeated is clean too.
      const [px, py, pw, ph] = opts.patch;
      const cover = await sharp(buf)
        .extract({ left: px, top: py, width: pw, height: ph })
        .blur(26)
        .png()
        .toBuffer();
      buf = await sharp(buf).composite([{ input: cover, left: px, top: py }]).png().toBuffer();
    }

    // Widen the frame by repeating the crop's edge columns outward, then blurring
    // those bands. The repeat keeps the colours of the banner's own backdrop; the
    // blur turns the inevitable streaks into a soft, out-of-focus wash, which
    // reads as depth of field rather than a smear.
    const pad = Math.max(0, Math.round((canvasW - width) / 2));
    if (pad > 0) {
      buf = await sharp(buf)
        .extend({ left: pad, right: pad, extendWith: 'copy' })
        .png()
        .toBuffer();

      const softness = Math.max(12, Math.round(pad / 3));
      const bands = await Promise.all(
        [0, pad + width].map((bandLeft) =>
          sharp(buf)
            .extract({ left: bandLeft, top: 0, width: pad, height })
            .blur(softness)
            .png()
            .toBuffer()
        )
      );
      buf = await sharp(buf)
        .composite([
          { input: bands[0], left: 0, top: 0 },
          { input: bands[1], left: pad + width, top: 0 },
        ])
        .png()
        .toBuffer();
    }
    out = sharp(buf);
  }

  const dest = path.join(OUT, name + '.jpg');
  await out.resize(800, 1000, { fit: 'fill' }).jpeg({ quality: 86, mozjpeg: true }).toFile(dest);
  return dest;
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  if (CHECK) fs.mkdirSync('scratch-check', { recursive: true });

  for (const [src, cfg] of Object.entries(JOBS)) {
    const written = [];
    for (const job of cfg.crops) written.push(await build(src, cfg, job));
    console.log(src.padEnd(34), '->', cfg.crops.length);
    if (CHECK) {
      const tiles = await Promise.all(written.map((f) => sharp(f).resize(240, 300).toBuffer()));
      await sharp({
        create: { width: 240 * tiles.length, height: 300, channels: 3, background: '#ffffff' },
      })
        .composite(tiles.map((input, i) => ({ input, left: i * 240, top: 0 })))
        .jpeg({ quality: 82 })
        .toFile(path.join('scratch-check', src.replace('.jpg', '') + '-sheet.jpg'));
    }
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
