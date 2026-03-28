const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const OCRService = require('../services/ocrService');
const StudentResult = require('../models/StudentResult');
const { calculateTotalPoints } = require('../utils/gradeUtils');
const auth = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiters');
const { validate, resultSchemas } = require('../middleware/validation');
const crypto = require('crypto');

// @route   POST /api/results/upload
// @desc    Upload KCSE certificate and parse results
// @access  Public (Guest or Auth)
router.post('/upload', uploadLimiter, auth, upload.single('certificate'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a file' });
  }

  try {
    // Process file with OCR
    const parsedData = await OCRService.processFile(req.file.path, req.file.mimetype);

    // Generate hash for results to prevent duplicate entries
    const resultsHash = crypto.createHash('sha256').update(JSON.stringify(parsedData.subjects)).digest('hex');

    // Create a guest session ID if not authenticated
    const sessionId = req.user ? null : req.headers['x-session-id'] || `guest-${Date.now()}`;

    // Calculate points if not provided by OCR
    const totalPoints = parsedData.totalPoints || calculateTotalPoints(parsedData.subjects);

    // Save to database
    const result = await StudentResult.create({
      user_id: req.user ? req.user.id : null,
      session_id: sessionId,
      results_hash: resultsHash,
      mean_grade: parsedData.meanGrade || 'N/A',
      mean_points: (totalPoints / Object.keys(parsedData.subjects).length).toFixed(2),
      total_points: totalPoints,
      subjects: parsedData.subjects,
      certificate_file_url: req.file.path // In production, this would be an S3 URL
    });

    res.status(201).json({
      message: 'Result processed successfully',
      data: result,
      parsedName: parsedData.candidateName
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process certificate' });
  }
});

// @route   POST /api/results/manual
// @desc    Manual entry of KCSE results
// @access  Public
router.post('/manual', auth, validate(resultSchemas.manual), async (req, res) => {
  const { subjects, meanGrade, meanPoints } = req.body;

  if (!subjects || Object.keys(subjects).length < 7) {
    return res.status(400).json({ error: 'Please provide at least 7 subjects' });
  }

  try {
    const totalPoints = calculateTotalPoints(subjects);
    const resultsHash = crypto.createHash('sha256').update(JSON.stringify(subjects)).digest('hex');
    const sessionId = req.user ? null : req.headers['x-session-id'] || `guest-${Date.now()}`;

    const result = await StudentResult.create({
      user_id: req.user ? req.user.id : null,
      session_id: sessionId,
      results_hash: resultsHash,
      mean_grade: meanGrade || 'N/A',
      mean_points: meanPoints || (totalPoints / Object.keys(subjects).length).toFixed(2),
      total_points: totalPoints,
      subjects
    });

    res.status(201).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save manual results' });
  }
});

module.exports = router;
