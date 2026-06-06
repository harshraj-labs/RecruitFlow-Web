const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createBatch, uploadFiles, getBatches } = require('../controllers/batchController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all batches
router.get('/', protect, getBatches);

// POST Step 1: Create batch from CSV
router.post('/create', protect, upload.array('files', 10), createBatch);

// POST Step 2: Upload and validate files
router.post('/upload-files', protect, upload.array('files', 100), uploadFiles);

module.exports = router;

// Step 1 & Step 2 cuz we are using 2 step upload, 1st to upload csv and get applicants and 2nd to upload applicants file per batch.