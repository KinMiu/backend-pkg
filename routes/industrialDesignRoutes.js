const express = require('express');
const router = express.Router();
const {
  getIndustrialDesigns,
  getIndustrialDesign,
  createIndustrialDesign,
  updateIndustrialDesign,
  deleteIndustrialDesign
} = require('../controllers/industrialDesignController');

router
  .route('/')
  .get(getIndustrialDesigns)
  .post(createIndustrialDesign);

router
  .route('/:id')
  .get(getIndustrialDesign)
  .put(updateIndustrialDesign)
  .delete(deleteIndustrialDesign);

module.exports = router;