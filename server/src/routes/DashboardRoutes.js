const express = require('express');
const router = express.Router();
const { getStats, getApplicants } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Stats - optional batchId query param
// /api/dashboard/stats          → all batches
// /api/dashboard/stats?batchId=1 → specific batch
router.get('/stats', protect, getStats);
router.get('/applicants', protect, getApplicants);

module.exports = router;