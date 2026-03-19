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

ensureDir(UPLOAD_ROOT);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const targetDir = path.join(UPLOAD_ROOT, 'perangkat-ajar');
    ensureDir(targetDir);
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const ALLOWED_EXT = new Set([
  '.pdf',
  '.zip',
  '.rar',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
]);

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.rar',
  'application/x-rar-compressed',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Some clients may send generic mimetype for office/archive files
  'application/octet-stream',
]);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const okByExt = ALLOWED_EXT.has(ext);
  const okByMime = ALLOWED_MIME.has(file.mimetype);

  // If mimetype is octet-stream, rely on extension whitelist
  if (file.mimetype === 'application/octet-stream') {
    return okByExt
      ? cb(null, true)
      : cb(new Error('Invalid file type. Only PDF/ZIP/RAR/DOC/DOCX/PPT/PPTX are allowed.'), false);
  }

  if (okByExt && okByMime) return cb(null, true);
  if (okByExt) return cb(null, true);

  return cb(new Error('Invalid file type. Only PDF/ZIP/RAR/DOC/DOCX/PPT/PPTX are allowed.'), false);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1,
  },
  fileFilter,
});

module.exports = upload;

