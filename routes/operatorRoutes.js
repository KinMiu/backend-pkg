const express = require('express');
const router = express.Router();
const {
  getOperators,
  getOperator,
  createOperator,
  updateOperator,
  deleteOperator,
  importOperatorsFromExcel,
  downloadOperatorsTemplate,
} = require('../controllers/operatorController');
const uploadExcel = require('../middleware/uploadExcelMiddleware');

router
  .route('/')
  .get(getOperators)
  .post(createOperator);

router.post('/import-excel', uploadExcel.single('file'), importOperatorsFromExcel);
router.get('/import-template', downloadOperatorsTemplate);

router
  .route('/:id')
  .get(getOperator)
  .put(updateOperator)
  .delete(deleteOperator);

module.exports = router;

