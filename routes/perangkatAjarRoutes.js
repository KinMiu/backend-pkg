const express = require('express');
const router = express.Router();

const {
  getAllPerangkatAjar,
  getPerangkatAjarById,
  createPerangkatAjar,
  updatePerangkatAjar,
  deletePerangkatAjar,
  checkPerangkatAjarPassword,
} = require('../controllers/perangkatAjarController');

const upload = require('../middleware/perangkatAjarUploadMiddleware');

router
  .route('/')
  .get(getAllPerangkatAjar)
  .post(upload.single('file'), createPerangkatAjar);

router
  .route('/:id')
  .get(getPerangkatAjarById)
  .put(upload.single('file'), updatePerangkatAjar)
  .delete(deletePerangkatAjar);

// Public password-only check (no login required)
router.post('/check-password', checkPerangkatAjarPassword);

module.exports = router;

