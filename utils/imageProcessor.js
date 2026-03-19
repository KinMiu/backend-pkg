const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// Process image, save optimized WebP into /public/uploads/<folderName>
// and return relative path (e.g. "testimonial/xxxx.webp") to be stored in DB
const processImage = async (filePath, folderName = 'general', width = 800) => {
  try {
    if (!fsSync.existsSync(filePath)) {
      throw new Error('Source file does not exist');
    }

    const uploadsRoot = path.join(__dirname, '../public/uploads');
    const targetDir = path.join(uploadsRoot, folderName);

    if (!fsSync.existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true });
    }

    const fileName = `${path.basename(filePath, path.extname(filePath))}.webp`;
    const targetPath = path.join(targetDir, fileName);

    await sharp(filePath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 80 })
      .toFile(targetPath);

    // Delete original temp file from multer
    await deleteFile(filePath);

    // Store relative path in DB, using POSIX separators
    const relativePath = path.posix.join(folderName, fileName);
    return relativePath;
  } catch (error) {
    console.error('Image processing error:', error);
    await deleteFile(filePath);
    throw new Error('Failed to process image');
  }
};

// Function to delete file
const deleteFile = async (filePath) => {
  try {
    if (fsSync.existsSync(filePath)) {
      await fs.unlink(filePath);
      console.log(`Original file ${filePath} deleted successfully.`);
    } else {
      console.log(`File ${filePath} not found, skipping delete.`);
    }
  } catch (error) {
    console.warn('Warning: Could not delete file:', error.message);
  }
};

module.exports = {
  processImage,
};