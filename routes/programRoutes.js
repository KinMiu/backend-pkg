const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} = require('../controllers/programController');

router.route('/').get(getPrograms).post(createProgram);

router.route('/:id').get(getProgram).put(updateProgram).delete(deleteProgram);

module.exports = router;

