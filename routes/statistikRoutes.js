const express = require('express');
const router = express.Router();
const {
  getStatistik,
  getStatistikById,
  createStatistik,
  updateStatistik,
  deleteStatistik,
} = require('../controllers/statistikController');

router.route('/').get(getStatistik).post(createStatistik);
router.route('/:id').get(getStatistikById).put(updateStatistik).delete(deleteStatistik);

module.exports = router;
