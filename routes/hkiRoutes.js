const express = require('express');
const router = express.Router();
const {
  getHkis,
  getHki,
  createHki,
  updateHki,
  deleteHki
} = require('../controllers/hkiController');

router
  .route('/')
  .get(getHkis)
  .post(createHki);

router
  .route('/:id')
  .get(getHki)
  .put(updateHki)
  .delete(deleteHki);

module.exports = router;