/* ═══════════════════════════════════════════
   generate-icons.js – creates the Office add-in ribbon icons
   (pure Node: manual PNG encoding + zlib, no dependencies)

   Run:  node scripts/generate-icons.js
   Output: assets/icon-{16,32,64,80}.png  (blue rounded square + white "S")
   ═══════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/* ── PNG encoding helpers ── */
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
};

const encodePNG = (width, height, rgba) => {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type: RGBA
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // filter: none
    rgba.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
};

/* ── Icon design ── */
// 5x7 bitmap for the letter "S"
const GLYPH = [
  '11110',
  '10000',
  '10000',
  '11110',
  '00001',
  '00001',
  '11110',
];
const GLYPH_W = 5;
const GLYPH_H = 7;

const BLUE = [0x25, 0x63, 0xeb, 255];
const WHITE = [255, 255, 255, 255];
const CLEAR = [0, 0, 0, 0];

function makeIcon(size) {
  const px = Buffer.alloc(size * size * 4);
  const radius = Math.round(size * 0.2);
  const pad = Math.round(size * 0.06);
  const scale = Math.max(1, Math.floor((size - pad * 2) / GLYPH_W));
  const gx0 = Math.floor((size - GLYPH_W * scale) / 2);
  const gy0 = Math.floor((size - GLYPH_H * scale) / 2);

  const insideRoundedRect = (x, y) => {
    const minX = pad, maxX = size - 1 - pad, minY = pad, maxY = size - 1 - pad;
    if (x < minX || x > maxX || y < minY || y > maxY) return false;
    const cx = Math.min(Math.max(x, minX + radius), maxX - radius);
    const cy = Math.min(Math.max(y, minY + radius), maxY - radius);
    const dx = x - cx, dy = y - cy;
    return dx * dx + dy * dy <= radius * radius;
  };

  const onGlyph = (x, y) => {
    const gx = Math.floor((x - gx0) / scale);
    const gy = Math.floor((y - gy0) / scale);
    if (gx < 0 || gx >= GLYPH_W || gy < 0 || gy >= GLYPH_H) return false;
    return GLYPH[gy][gx] === '1';
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      let color = CLEAR;
      if (insideRoundedRect(x, y)) color = BLUE;
      if (onGlyph(x, y)) color = WHITE;
      px[i] = color[0];
      px[i + 1] = color[1];
      px[i + 2] = color[2];
      px[i + 3] = color[3];
    }
  }
  return encodePNG(size, size, px);
}

const outDir = path.resolve(__dirname, '../assets');
fs.mkdirSync(outDir, { recursive: true });
for (const size of [16, 32, 64, 80]) {
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, makeIcon(size));
  console.log(`wrote ${file} (${size}x${size})`);
}
