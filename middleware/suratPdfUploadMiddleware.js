const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_ROOT = path.join(__dirname, '../public/uploads');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(UPLOAD_ROOT);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const suratDir = path.join(UPLOAD_ROOT, 'surat');
    ensureDir(suratDir);
    cb(null, suratDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

const uploadPdf = multer({
  storage,
  limits: {
    fileSize: 20000000,
  },
  fileFilter,
});

module.exports = uploadPdf;

