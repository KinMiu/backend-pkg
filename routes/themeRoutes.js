const express = require('express');
const router = express.Router();
const { getTheme, updateTheme } = require('../controllers/themeController');

router.route('/theme').get(getTheme).put(updateTheme);

module.exports = router;

