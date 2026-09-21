const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseLinkedinPdf } = require('../controllers/linkedin.controller');
const { protect } = require('../middleware/auth.middleware');

// Setup multer for memory storage (buffer)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

router.post('/sync-pdf', protect, upload.single('file'), parseLinkedinPdf);

module.exports = router;
