const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// This is a bridge to existing resultRoutes.js but specifically for authenticated history
router.get('/history', auth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Please authenticate to view history' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM student_results WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// @route   DELETE /api/results/history/:id
// @desc    Delete a specific student result and cascade its matches
router.delete('/history/:id', auth, async (req, res) => {
  try {
    const resultId = req.params.id;
    const deleteRes = await db.query(
      'DELETE FROM student_results WHERE id = $1 AND user_id = $2 RETURNING id',
      [resultId, req.user.id]
    );

    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found or access denied' });
    }

    res.json({ message: 'Result successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete result' });
  }
});

module.exports = router;
