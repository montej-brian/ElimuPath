const express = require('express');
const router = express.Router();
const MatchingService = require('../services/matchingService');
const db = require('../config/db');

// @route   GET /api/results/:id/matches
// @desc    Get eligibility matches for a specific result
// @access  Public (tracked by session or user)
router.get('/:id/matches', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const matches = await MatchingService.findMatches(req.params.id);
    
    // Simple in-memory pagination for cached results
    const paginatedMatches = matches.slice(offset, offset + parseInt(limit));
    
    res.json({
      total: matches.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginatedMatches
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate matches' });
  }
});

// @route   GET /api/matches/:id/points
// @desc    Get aggregate points and raw computation map for courses
// @access  Public 
router.get('/:id/points', async (req, res) => {
  try {
    const studentRes = await db.query('SELECT aggregate_points FROM student_results WHERE id = $1', [req.params.id]);
    if (studentRes.rows.length === 0) return res.status(404).json({ error: 'Result not found' });
    
    // We leverage the service which fully computes arrays in-memory instantly in O(1) bulk fetch
    const matches = await MatchingService.findMatches(req.params.id);

    const simplifiedCourses = matches.map(m => ({
      course_name: m.course_name,
      computed_points: m.computed_points,
      cut_off: m.cut_off_points
    }));

    res.json({
      result_id: req.params.id,
      aggregate_points: studentRes.rows[0].aggregate_points || 0,
      courses: simplifiedCourses
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch points' });
  }
});

module.exports = router;
