const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getEvents)
  .post(upload.array('foto', 30), createEvent);

router
  .route('/:id')
  .get(getEvent)
  .put(upload.array('foto', 30), updateEvent)
  .delete(deleteEvent);

module.exports = router;