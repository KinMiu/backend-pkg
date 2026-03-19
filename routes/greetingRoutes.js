const express = require('express');
const router = express.Router();

const {
  getGreetings,
  getLatestGreeting,
  getGreeting,
  createGreeting,
  updateGreeting,
  deleteGreeting,
} = require('../controllers/greetingController');
const upload = require('../middleware/uploadMiddleware');

router.route('/latest').get(getLatestGreeting);

router.route('/').get(getGreetings).post(upload.single('foto'), createGreeting);

router
  .route('/:id')
  .get(getGreeting)
  .put(upload.single('foto'), updateGreeting)
  .delete(deleteGreeting);

module.exports = router;

