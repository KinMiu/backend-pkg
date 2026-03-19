const express = require('express');
const router = express.Router();
const {
  getAllRps,
  getRpsById,
  createRps,
  updateRps,
  deleteRps
} = require('../controllers/rpsController');
const uploadPdf = require('../middleware/pdfUploadMiddleware');

router
  .route('/')
  .get(getAllRps)
  .post(uploadPdf.single('pdfFile'), createRps);

router
  .route('/:id')
  .get(getRpsById)
  .put(uploadPdf.single('pdfFile'), updateRps)
  .delete(deleteRps);

module.exports = router;
