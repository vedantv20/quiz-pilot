const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { uploadQuestionImage } = require('../middleware/upload');
const authenticate = require('../middleware/authenticate');
const { requireRole } = require('../middleware/authorize');

const router = express.Router();

// Upload question image
router.post('/question-image', authenticate, requireRole('teacher', 'admin'), (req, res) => {
  uploadQuestionImage(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB.'
          });
        }
      }
      
      return res.status(400).json({
        success: false,
        message: err.message || 'Upload failed'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the file path relative to the server
    const imageUrl = `/uploads/questions/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  });
});

// Delete question image
router.delete('/question-image/:filename', authenticate, requireRole('teacher', 'admin'), (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/questions', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
});

module.exports = router;