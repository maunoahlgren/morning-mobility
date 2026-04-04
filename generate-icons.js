#!/usr/bin/env node
// Generates icon-192.png and icon-512.png — pure Node.js, no dependencies
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// ── PNG encoder ───────────────────────────────────────────────────────────────
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const t   = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePNG(w, h, rgba) {
  // Build raw scanlines (filter byte 0 = None per row)
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0;
    rgba.copy(raw, y * (1 + w * 4) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

// ── pixel helpers ─────────────────────────────────────────────────────────────
function setPixel(buf, w, x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= w || y >= w) return;
  const i = (y * w + x) * 4;
  buf[i]=r; buf[i+1]=g; buf[i+2]=b; buf[i+3]=a;
}

function fillRect(buf, w, x0, y0, x1, y1, r, g, b) {
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++)
      setPixel(buf, w, x, y, r, g, b);
}

function fillCircle(buf, w, cx, cy, radius, r, g, b) {
  const r2 = radius * radius;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++)
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx, dy = y - cy;
      if (dx*dx + dy*dy <= r2) setPixel(buf, w, x, y, r, g, b);
    }
}

// Anti-aliased circle edge
function fillCircleAA(buf, w, cx, cy, radius, r, g, b) {
  for (let y = Math.floor(cy - radius - 1); y <= Math.ceil(cy + radius + 1); y++)
    for (let x = Math.floor(cx - radius - 1); x <= Math.ceil(cx + radius + 1); x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const alpha = Math.max(0, Math.min(1, radius + 0.5 - dist));
      if (alpha > 0) {
        const i = (y * w + x) * 4;
        if (y < 0 || x < 0 || x >= w || y >= w) continue;
        buf[i]   = Math.round(buf[i]   * (1-alpha) + r * alpha);
        buf[i+1] = Math.round(buf[i+1] * (1-alpha) + g * alpha);
        buf[i+2] = Math.round(buf[i+2] * (1-alpha) + b * alpha);
        buf[i+3] = 255;
      }
    }
}

// Draw a thick line segment
function drawLine(buf, w, x0, y0, x1, y1, thick, r, g, b) {
  const steps = Math.ceil(Math.max(Math.abs(x1-x0), Math.abs(y1-y0)) * 2);
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const px = x0 + (x1-x0)*t;
    const py = y0 + (y1-y0)*t;
    fillCircle(buf, w, px, py, thick/2, r, g, b);
  }
}

// ── icon design ───────────────────────────────────────────────────────────────
// Ilves colours
const GR = [0x00, 0x69, 0x34]; // #006934 green
const YL = [0xFF, 0xCB, 0x05]; // #FFCB05 yellow
const WH = [0xFF, 0xFF, 0xFF]; // white

function generateIcon(size) {
  const buf = Buffer.alloc(size * size * 4, 0);

  // 1. Green background
  fillRect(buf, size, 0, 0, size, size, ...GR);

  // 2. Yellow circle (badge/puck feel)
  const cx = size / 2, cy = size / 2;
  const circR = size * 0.36;
  fillCircleAA(buf, size, cx, cy, circR, ...YL);

  // 3. Draw "M" in green on yellow circle
  // Letter bounds inside circle
  const lx = size * 0.285;   // left edge
  const ly = size * 0.285;   // top
  const lw = size * 0.43;    // total width
  const lh = size * 0.43;    // total height
  const sw = size * 0.085;   // stroke width

  // Left vertical bar
  fillRect(buf, size,
    Math.round(lx), Math.round(ly),
    Math.round(lx + sw), Math.round(ly + lh),
    ...GR);

  // Right vertical bar
  fillRect(buf, size,
    Math.round(lx + lw - sw), Math.round(ly),
    Math.round(lx + lw), Math.round(ly + lh),
    ...GR);

  // Left diagonal: top-left → center-bottom of the V
  const midX = lx + lw / 2;
  const midY = ly + lh * 0.52;
  drawLine(buf, size, lx + sw/2, ly, midX, midY, sw, ...GR);

  // Right diagonal: top-right → center-bottom of the V
  drawLine(buf, size, lx + lw - sw/2, ly, midX, midY, sw, ...GR);

  return encodePNG(size, size, buf);
}

// ── write files ───────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, 'icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
fs.writeFileSync(path.join(outDir, 'icon-192.png'), generateIcon(192));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), generateIcon(512));
console.log('✓ icon-192.png and icon-512.png written');
