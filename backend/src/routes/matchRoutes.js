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

module.exports = router;
