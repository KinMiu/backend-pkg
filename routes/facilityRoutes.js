const express = require('express');
const router = express.Router();
const {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility
} = require('../controllers/facilityController');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getFacilities)
  .post(upload.single('foto'), createFacility);

router
  .route('/:id')
  .get(getFacility)
  .put(upload.single('foto'), updateFacility)
  .delete(deleteFacility);

module.exports = router;
