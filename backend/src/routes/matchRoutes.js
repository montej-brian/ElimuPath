const express = require('express');
const router = express.Router();
const MatchingService = require('../services/matchingService');
const db = require('../config/db');

// @route   GET /api/results/:id/matches
// @desc    Get eligibility matches for a specific result
// @access  Public (tracked by session or user)
router.get('/:id/matches', async (req, res) => {
  try {
    const matches = await MatchingService.findMatches(req.params.id);
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate matches' });
  }
});

module.exports = router;
