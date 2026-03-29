const express = require('express');
const router = express.Router();
const StudentResult = require('../models/StudentResult');
const { calculateTotalPoints } = require('../utils/gradeUtils');
const auth = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiters');
const { validate, resultSchemas } = require('../middleware/validation');
const crypto = require('crypto');

// @route   POST /api/results/manual
// @desc    Manual entry of KCSE results
// @access  Public
router.post('/manual', auth, validate(resultSchemas.manual), async (req, res) => {
  const { subjects, meanGrade, meanPoints, aggregatePoints } = req.body;

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
      mean_grade: meanGrade || '--',
      mean_points: meanPoints || (totalPoints / Object.keys(subjects).length).toFixed(2),
      total_points: totalPoints,
      aggregate_points: aggregatePoints,
      subjects
    });

    res.status(201).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save manual results' });
  }
});

// @route   POST /api/results/associate
// @desc    Associate guest results with a newly logged in user
// @access  Private
router.post('/associate', auth, async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'Session ID required.' });
  
  if (!req.user || !req.user.id) return res.status(401).json({ error: 'User must be authenticated.' });

  try {
    const db = require('../config/db');
    const result = await db.query(
      'UPDATE student_results SET user_id = $1, session_id = NULL WHERE session_id = $2 AND user_id IS NULL RETURNING id',
      [req.user.id, sessionId]
    );
    
    res.json({ message: 'Results associated successfully', rowsUpdated: result.rowCount });
  } catch (err) {
    console.error('Error associating results:', err);
    res.status(500).json({ error: 'Failed to associate results' });
  }
});

module.exports = router;
