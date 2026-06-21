const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { analyzeResume, getHistory, deleteAnalysis } = require('../controllers/analyzeController');

// Multer setup - memory storage to process file buffer directly without writing to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Protected routes
router.post('/', protect, upload.single('resume'), analyzeResume);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;
