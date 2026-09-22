const sharp = require('sharp');
const fs = require('fs');
fs.mkdirSync('scratch-check', { recursive: true });
(async () => {
  for (const name of process.argv.slice(2)) {
    const src = `public/images/${name}`;
    const { width: W, height: H } = await sharp(src).metadata();
    let lines = '';
    for (let x = 0; x <= W; x += 50) {
      const major = x % 100 === 0;
      lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${major ? '#ff0000' : '#00ffff'}" stroke-width="${major ? 3 : 1}" opacity="0.75"/>`;
      if (major) lines += `<text x="${x + 4}" y="34" font-family="monospace" font-size="30" font-weight="bold" fill="#ff0000" stroke="#fff" stroke-width="1">${x}</text>`;
    }
    for (let y = 0; y <= H; y += 50) {
      const major = y % 100 === 0;
      lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${major ? '#ff0000' : '#00ffff'}" stroke-width="${major ? 3 : 1}" opacity="0.75"/>`;
      if (major) lines += `<text x="4" y="${y - 6}" font-family="monospace" font-size="30" font-weight="bold" fill="#ff0000" stroke="#fff" stroke-width="1">${y}</text>`;
    }
    const svg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${lines}</svg>`);
    await sharp(src).composite([{ input: svg }]).jpeg({ quality: 88 })
      .toFile(`scratch-check/ruler-${name.replace(/\.\w+$/, '')}.jpg`);
    console.log('ruler', name, W + 'x' + H);
  }
})();
