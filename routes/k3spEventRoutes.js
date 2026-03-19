const express = require('express');
const router = express.Router();
const {
  getK3spEvents,
  getK3spEvent,
  createK3spEvent,
  updateK3spEvent,
  deleteK3spEvent,
} = require('../controllers/k3spEventController');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getK3spEvents).post(upload.array('foto', 30), createK3spEvent);

router
  .route('/:id')
  .get(getK3spEvent)
  .put(upload.array('foto', 30), updateK3spEvent)
  .delete(deleteK3spEvent);

module.exports = router;

