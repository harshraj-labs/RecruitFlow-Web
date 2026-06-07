const express = require('express');
const router = express.Router();
const { getStats, getApplicants, downloadCSV } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);
router.get('/applicants', protect, getApplicants);
router.get('/download', protect, downloadCSV); 

module.exports = router;