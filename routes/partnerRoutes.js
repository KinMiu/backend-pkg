const express = require('express');
const router = express.Router();
const {
  getPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner
} = require('../controllers/partnerController');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getPartners)
  .post(upload.single('logo'), createPartner);

router
  .route('/:id')
  .get(getPartner)
  .put(upload.single('logo'), updatePartner)
  .delete(deletePartner);

module.exports = router;