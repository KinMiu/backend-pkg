const express = require('express');
const router = express.Router();
const {
  getPengumuman,
  getPengumumanById,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
} = require('../controllers/pengumumanController');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getPengumuman)
  .post(upload.array('foto', 30), createPengumuman);

router
  .route('/:id')
  .get(getPengumumanById)
  .put(upload.array('foto', 30), updatePengumuman)
  .delete(deletePengumuman);

module.exports = router;
