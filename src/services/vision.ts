import type { PhotoSignature } from '../types';

/**
 * Extracts a compact visual signature (structural hash + color grid) from an HTML Image or Video source.
 */
export function extractPhotoSignature(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
): { signature: PhotoSignature; snapshotUrl: string } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Set canvas size for processing
  const width = 320;
  const height = 240;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(source, 0, 0, width, height);

  // 1. Create Data URL Snapshot for visual preview thumbnail
  const snapshotUrl = canvas.toDataURL('image/jpeg', 0.7);

  // 2. Compute 8x8 Grayscale Perceptual Luminance Hash (Average Hash)
  const hashCanvas = document.createElement('canvas');
  hashCanvas.width = 8;
  hashCanvas.height = 8;
  const hashCtx = hashCanvas.getContext('2d')!;
  hashCtx.drawImage(canvas, 0, 0, 8, 8);

  const imgData = hashCtx.getImageData(0, 0, 8, 8);
  const data = imgData.data;

  let totalLuminance = 0;
  const luminances: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Rec. 601 Luma
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    luminances.push(lum);
    totalLuminance += lum;
  }

  const avgLum = totalLuminance / 64;
  let hashBits = '';
  for (let i = 0; i < 64; i++) {
    hashBits += luminances[i] >= avgLum ? '1' : '0';
  }

  // 3. Compute 4x4 Spatial Color Grid Signature (Color distribution)
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = 4;
  colorCanvas.height = 4;
  const colorCtx = colorCanvas.getContext('2d')!;
  colorCtx.drawImage(canvas, 0, 0, 4, 4);

  const colorData = colorCtx.getImageData(0, 0, 4, 4).data;
  const colorGrid: number[] = [];

  for (let i = 0; i < colorData.length; i += 4) {
    const r = colorData[i] / 255;
    const g = colorData[i + 1] / 255;
    const b = colorData[i + 2] / 255;
    // Fast Hue/Sat component score
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    const brightness = max;
    colorGrid.push(Math.round((saturation * 0.5 + brightness * 0.5) * 100));
  }

  return {
    signature: {
      hash: hashBits,
      colorGrid,
    },
    snapshotUrl,
  };
}

/**
 * Compares two photo signatures and returns a similarity percentage (0 to 100).
 */
export function calculateSignatureMatch(sig1: PhotoSignature, sig2: PhotoSignature): number {
  if (!sig1 || !sig2 || !sig1.hash || !sig2.hash) return 0;

  // 1. Hamming distance on 64-bit luminance hash
  let hammingDistance = 0;
  for (let i = 0; i < 64; i++) {
    if (sig1.hash[i] !== sig2.hash[i]) {
      hammingDistance++;
    }
  }

  const hashSimilarity = (64 - hammingDistance) / 64; // 0 to 1

  // 2. Color grid distance (16 cells)
  let colorDiffTotal = 0;
  const len = Math.min(sig1.colorGrid.length, sig2.colorGrid.length, 16);
  for (let i = 0; i < len; i++) {
    colorDiffTotal += Math.abs(sig1.colorGrid[i] - sig2.colorGrid[i]);
  }
  const maxColorDiff = len * 100;
  const colorSimilarity = (maxColorDiff - colorDiffTotal) / maxColorDiff;

  // Weighted total: 75% structural hash + 25% color palette similarity
  const totalScore = hashSimilarity * 0.75 + colorSimilarity * 0.25;

  return Math.round(totalScore * 100);
}
