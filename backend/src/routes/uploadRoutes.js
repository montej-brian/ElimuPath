const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { parseResultSlip } = require('../services/ocrService');
const StudentResult = require('../models/StudentResult');
const { calculateTotalPoints } = require('../utils/gradeUtils');
const crypto = require('crypto');

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and PDF files are accepted.'), false);
    }
  },
});

// @route   POST /api/results/ocr
// @desc    Upload a KCSE result slip image for OCR extraction
// @access  Public (auth optional)
router.post('/ocr', upload.single('resultSlip'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Please attach your KCSE result slip.' });
  }

  try {
    const parsed = await parseResultSlip(req.file.buffer, req.file.mimetype);

    // Return the extracted data for user confirmation (don't save yet)
    res.json({
      status: 'extracted',
      data: {
        subjects: parsed.subjects,
        meanGrade: parsed.meanGrade,
        aggregatePoints: parsed.aggregatePoints,
        confidence: parsed.confidence,
        subjectCount: Object.keys(parsed.subjects).length,
      },
      message: parsed.confidence >= 0.8
        ? 'Results extracted successfully. Please verify and confirm.'
        : 'Some fields could not be read clearly. Please review and correct before confirming.',
    });
  } catch (err) {
    console.error('OCR upload error:', err);
    res.status(500).json({ error: err.message || 'OCR processing failed' });
  }
});

// @route   POST /api/results/ocr/confirm
// @desc    Confirm OCR-extracted results (user-verified) and save to DB
// @access  Public (auth optional)
router.post('/ocr/confirm', async (req, res) => {
  const { subjects, meanGrade, aggregatePoints } = req.body;

  if (!subjects || typeof subjects !== 'object' || Object.keys(subjects).length < 7) {
    return res.status(400).json({ error: 'At least 7 subjects are required.' });
  }

  const aggPts = parseInt(aggregatePoints, 10);
  if (isNaN(aggPts) || aggPts < 0 || aggPts > 84) {
    return res.status(400).json({ error: 'Aggregate points must be an integer between 0 and 84.' });
  }

  try {
    const totalPoints = calculateTotalPoints(subjects);
    const resultsHash = crypto.createHash('sha256').update(JSON.stringify(subjects)).digest('hex');
    const sessionId = req.user ? null : req.headers['x-session-id'] || `guest-${Date.now()}`;

    const result = await StudentResult.create({
      user_id: req.user ? req.user.id : null,
      session_id: sessionId,
      results_hash: resultsHash,
      mean_grade: meanGrade || '--',
      mean_points: (totalPoints / Object.keys(subjects).length).toFixed(2),
      total_points: totalPoints,
      aggregate_points: aggPts,
      subjects,
    });

    res.status(201).json({ data: result });
  } catch (err) {
    console.error('OCR confirm error:', err);
    res.status(500).json({ error: 'Failed to save confirmed results.' });
  }
});

module.exports = router;
