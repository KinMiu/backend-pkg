const express = require('express');
const router = express.Router();

const {
  getAllSurat,
  getSuratById,
  createSurat,
  updateSurat,
  deleteSurat,
} = require('../controllers/suratController');

const uploadPdf = require('../middleware/suratPdfUploadMiddleware');

router.route('/').get(getAllSurat).post(uploadPdf.single('pdfFile'), createSurat);

router
  .route('/:id')
  .get(getSuratById)
  .put(uploadPdf.single('pdfFile'), updateSurat)
  .delete(deleteSurat);

module.exports = router;

