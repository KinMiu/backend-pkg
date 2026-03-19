const express = require('express');
const router = express.Router();

const {
  loginDosen,
  changeDosenPassword,
  loginOperator,
  changeOperatorPassword,
  resetOperatorPassword,
  resetPassword,
  requestResetPassword,
  listResetRequests,
  approveResetRequest,
  rejectResetRequest,
  loginAdmin,
  changeAdminPassword,
  changeAdminUsername,
} = require('../controllers/authController');

router.post('/dosen/login', loginDosen);
router.post('/dosen/change-password', changeDosenPassword);
router.post('/operator/login', loginOperator);
router.post('/operator/change-password', changeOperatorPassword);
router.post('/operator/reset-password', resetOperatorPassword);
router.post('/admin/login', loginAdmin);
router.post('/admin/change-password', changeAdminPassword);
router.post('/admin/change-username', changeAdminUsername);
router.post('/reset-password', resetPassword);
router.post('/request-reset-password', requestResetPassword);
router.get('/reset-requests', listResetRequests);
router.post('/reset-requests/:id/approve', approveResetRequest);
router.post('/reset-requests/:id/reject', rejectResetRequest);

module.exports = router;

