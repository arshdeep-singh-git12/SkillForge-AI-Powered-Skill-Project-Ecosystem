const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certification.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, certificationController.getUserCertifications);
router.post('/', protect, certificationController.addExternalCertification);

module.exports = router;
