const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getAchievements)
  .post(upload.single('foto'), createAchievement);

router
  .route('/:id')
  .get(getAchievement)
  .put(upload.single('foto'), updateAchievement)
  .delete(deleteAchievement);

module.exports = router;