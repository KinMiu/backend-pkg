const express = require('express');
const router = express.Router();
const {
  getFaculties,
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  setResearchVisibilityAll,
  importFacultiesFromExcel,
  downloadFacultiesTemplate,
} = require('../controllers/facultyController');
const upload = require('../middleware/uploadMiddleware');
const uploadExcel = require('../middleware/uploadExcelMiddleware');

router
  .route('/')
  .get(getFaculties)
  .post(upload.single('foto'), createFaculty);

router
  .route('/research-visibility')
  .put(setResearchVisibilityAll);

router.post('/import-excel', uploadExcel.single('file'), importFacultiesFromExcel);
router.get('/import-template', downloadFacultiesTemplate);

router
  .route('/:id')
  .get(getFaculty)
  .put(upload.single('foto'), updateFaculty)
  .delete(deleteFaculty);

module.exports = router;