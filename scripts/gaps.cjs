/* Finds the columns between bottles, so crop edges land in clean background.

   Bottles carry labels and text, which means a lot of horizontal detail; the
   banner backdrops (sky, grass, hedge, wood) are smooth left-to-right. So the
   per-column horizontal gradient energy separates the two reliably, where a
   darkness or colour test does not.

   usage: node scripts/gaps.cjs <banner.jpg> <top> <height> [tolerance] */
const sharp = require('sharp');

const file = process.argv[2];
const top = +process.argv[3];
const height = +process.argv[4];
const tol = +(process.argv[5] ?? 6);

(async () => {
  const src = 'public/images/' + file;
  const { width } = await sharp(src).metadata();
  const { data, info } = await sharp(src)
    .extract({ left: 0, top, width, height })
    .greyscale()
    .blur(1.2)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const at = (x, y) => data[y * info.width + x];

  const energy = [];
  for (let x = 0; x < info.width; x++) {
    let sum = 0;
    for (let y = 0; y < info.height; y++) {
      const l = at(Math.max(0, x - 1), y);
      const r = at(Math.min(info.width - 1, x + 1), y);
      sum += Math.abs(r - l);
    }
    energy.push(sum / info.height);
  }

  const runs = [];
  let start = null;
  energy.forEach((e, x) => {
    const ok = e <= tol;
    if (ok && start === null) start = x;
    if (!ok && start !== null) {
      if (x - start >= 3) runs.push([start, x - 1]);
      start = null;
    }
  });
  if (start !== null) runs.push([start, energy.length - 1]);

  console.log(file.padEnd(32), `y ${top}..${top + height}  tol ${tol}`);
  console.log('  background runs:', runs.map(([a, b]) => `${a}-${b}`).join('  ') || '(none)');
  console.log('  midpoints:', runs.map(([a, b]) => Math.round((a + b) / 2)).join(', '));
})();
