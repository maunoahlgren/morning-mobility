#!/usr/bin/env node
// Generates PWA icons using the canvas npm package.
// Run: node generate-icons.js
// Requires: npm install canvas

const { createCanvas } = require('canvas');
const fs   = require('fs');
const path = require('path');

const GREEN  = '#006934';
const YELLOW = '#FFCB05';
const WHITE  = '#FFFFFF';

/**
 * Draw the standard icon: green bg, yellow stripe (bottom 20%), white bold "M".
 * @param {number} size  - width/height in pixels
 * @param {boolean} maskable - if true, keep content within the central 80%
 */
function generateIcon(size, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Safe zone: maskable icons must keep content within central 80%
  const pad    = maskable ? size * 0.1 : 0;
  const inner  = size - pad * 2;

  // 1. Green background (full canvas)
  ctx.fillStyle = GREEN;
  ctx.fillRect(0, 0, size, size);

  // 2. Yellow stripe — bottom 20% of the content area
  const stripeH = inner * 0.20;
  const stripeY = size - pad - stripeH;
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, stripeY, size, stripeH + pad); // extend to edge if not maskable

  // 3. White bold "M" — centered in the upper portion (above the stripe)
  const textAreaH = inner - stripeH;
  const centerX   = size / 2;
  const centerY   = pad + textAreaH * 0.55;  // visually centered in green area

  const fontSize = Math.round(inner * 0.52);
  ctx.fillStyle    = WHITE;
  ctx.font         = `bold ${fontSize}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('M', centerX, centerY);

  return canvas.toBuffer('image/png');
}

// ── Write files ──────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, 'icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const icon192       = generateIcon(192, false);
const icon512       = generateIcon(512, false);
const icon512mask   = generateIcon(512, true);

fs.writeFileSync(path.join(outDir, 'icon-192.png'),          icon192);
fs.writeFileSync(path.join(outDir, 'icon-512.png'),          icon512);
fs.writeFileSync(path.join(outDir, 'icon-512-maskable.png'), icon512mask);

console.log('✓ icon-192.png          %d bytes', icon192.length);
console.log('✓ icon-512.png          %d bytes', icon512.length);
console.log('✓ icon-512-maskable.png %d bytes', icon512mask.length);
