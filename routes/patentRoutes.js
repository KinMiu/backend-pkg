const express = require('express');
const router = express.Router();
const {
  getPatents,
  getPatent,
  createPatent,
  updatePatent,
  deletePatent
} = require('../controllers/patentController');

router
  .route('/')
  .get(getPatents)
  .post(createPatent);

router
  .route('/:id')
  .get(getPatent)
  .put(updatePatent)
  .delete(deletePatent);

module.exports = router;