const express = require('express');
const router = express.Router();
const {
  getKurikulums,
  getKurikulum,
  createKurikulum,
  updateKurikulum,
  deleteKurikulum
} = require('../controllers/kurikulumController');

router
  .route('/')
  .get(getKurikulums)
  .post(createKurikulum);

router
  .route('/:id')
  .get(getKurikulum)
  .put(updateKurikulum)
  .delete(deleteKurikulum);

module.exports = router;
