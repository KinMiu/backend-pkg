const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_ROOT = path.join(__dirname, '../public/uploads');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Map route base URL and field names to folder names
const resolveUploadSubfolder = (req, file) => {
  const baseUrl = req.baseUrl || '';

  // Event images
  if (baseUrl.includes('/api/events')) return 'event';
  // K3SP event images
  if (baseUrl.includes('/api/k3sp-events')) return 'k3sp-event';

  // Pengumuman images
  if (baseUrl.includes('/api/pengumuman')) return 'pengumuman';

  // Partner logos
  if (baseUrl.includes('/api/partners')) return 'partner';

  // Achievement images
  if (baseUrl.includes('/api/achievements')) return 'achievement';

  // Testimonial avatars
  if (baseUrl.includes('/api/testimonials')) return 'testimonial';

  // Facility photos
  if (baseUrl.includes('/api/facilities')) return 'facility';

  // Structural photos
  if (baseUrl.includes('/api/structurals')) return 'structural';

  // Greeting photos
  if (baseUrl.includes('/api/greetings')) return 'greeting';

  // Banner images
  if (baseUrl.includes('/api/banners')) return 'banner';

  // Faculty profile photos and documents: /faculty/<nama_guru>
  if (baseUrl.includes('/api/faculties')) {
    const rawName =
      (req.body && (req.body.name || req.body.nama || req.body.fullName)) || 'unknown';
    const safeName = String(rawName)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'unknown';
    return path.join('faculty', safeName);
  }

  // Default fallback
  return 'misc';
};

// Set up storage engine with per-menu folders
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const subfolder = resolveUploadSubfolder(req, file);
    const targetDir = path.join(UPLOAD_ROOT, subfolder);
    ensureDir(UPLOAD_ROOT);
    ensureDir(targetDir);
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'
      ),
      false
    );
  }
};

// Initialize upload
const upload = multer({
  storage,
  limits: {
    fileSize: 5000000, // 5MB per file
    files: 30, // Allow up to 30 files per request (events can be multi-image)
    fieldSize: 25 * 1024 * 1024, // 25MB per non-file field
  },
  fileFilter,
});

module.exports = upload;