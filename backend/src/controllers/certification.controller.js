const Certification = require("../models/Certification");

// Add a new certificate
const addCertification = async (req, res) => {
  try {
    const {
      userId,
      title,
      issuer,
      issueDate,
      verificationLink,
    } = req.body;

    if (!userId || !title || !issuer || !issueDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const certification = await Certification.create({
      userId,
      title,
      issuer,
      issueDate,
      verificationLink,
      type: "external",
    });

    res.status(201).json({
      success: true,
      message: "Certificate added successfully!",
      certification,
    });
  } catch (error) {
    console.error("Add certification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add certificate.",
      error: error.message,
    });
  }
};


// Get all certificates of a user
const getCertifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const certifications = await Certification.find({ userId })
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      certifications,
    });
  } catch (error) {
    console.error("Get certifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates.",
      error: error.message,
    });
  }
};


// Delete a certificate
const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;

    const certification = await Certification.findByIdAndDelete(id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully.",
    });
  } catch (error) {
    console.error("Delete certification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete certificate.",
      error: error.message,
    });
  }
};


module.exports = {
  addCertification,
  getCertifications,
  deleteCertification,
};