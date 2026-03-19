const express = require('express');
const router = express.Router();
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getBanners).post(upload.single('foto'), createBanner);

router
  .route('/:id')
  .get(getBanner)
  .put(upload.single('foto'), updateBanner)
  .delete(deleteBanner);

module.exports = router;

