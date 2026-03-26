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

module.exports = router;
