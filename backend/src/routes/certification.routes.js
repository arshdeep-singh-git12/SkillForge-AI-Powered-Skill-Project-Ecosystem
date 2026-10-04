const express = require("express");

const {
  addCertification,
  getCertifications,
  deleteCertification,
} = require("../controllers/certification.controller");

const router = express.Router();


// Add certificate
router.post("/", addCertification);


// Get user's certificates
router.get("/user/:userId", getCertifications);


// Delete certificate
router.delete("/:id", deleteCertification);


module.exports = router;