const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Convert uploaded image file to base64 (WebP, resized).
 * Reads from temp path, optimizes with sharp, returns data URL string.
 * Deletes temp file after processing.
 * @param {string} filePath - path to temp image file
 * @param {number} [width=800] - max width (height auto), withoutEnlargement
 * @returns {Promise<string>} data:image/webp;base64,...
 */
async function imageFileToBase64(filePath, width = 800) {
  if (!filePath) return null;
  try {
    const buffer = await sharp(filePath)
      .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 80 })
      .toBuffer();
    await fs.unlink(filePath).catch(() => {});
    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('imageFileToBase64 error:', err);
    await fs.unlink(filePath).catch(() => {});
    throw new Error('Failed to convert image to base64');
  }
}

/**
 * Convert uploaded PDF (or any file) to base64 data URL.
 * Deletes temp file after reading.
 * @param {string} filePath - path to temp file
 * @returns {Promise<string>} data:application/pdf;base64,...
 */
async function pdfFileToBase64(filePath) {
  if (!filePath) return null;
  try {
    const buffer = await fs.readFile(filePath);
    await fs.unlink(filePath).catch(() => {});
    return `data:application/pdf;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('pdfFileToBase64 error:', err);
    await fs.unlink(filePath).catch(() => {});
    throw new Error('Failed to convert PDF to base64');
  }
}

module.exports = {
  imageFileToBase64,
  pdfFileToBase64,
};
