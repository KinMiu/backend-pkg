const express = require('express');
const router = express.Router();

const {
  getStructurals,
  getStructural,
  createStructural,
  updateStructural,
  deleteStructural,
} = require('../controllers/structuralController');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getStructurals)
  .post(upload.single('foto'), createStructural);

router
  .route('/:id')
  .get(getStructural)
  .put(upload.single('foto'), updateStructural)
  .delete(deleteStructural);

module.exports = router;

