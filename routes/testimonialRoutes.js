const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getTestimonials)
  .post(upload.single('image'), createTestimonial);

router
  .route('/:id')
  .get(getTestimonial)
  .put(upload.single('image'), updateTestimonial)
  .delete(deleteTestimonial);

module.exports = router;