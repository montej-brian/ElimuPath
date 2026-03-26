const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// @route   POST /api/results/associate
// @desc    Associate a guest result with the authenticated user
// @access  Private
router.post('/associate', auth, async (req, res) => {
  const { resultId } = req.body;
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  try {
    // 1. Check if the result exists and is currently a guest result
    const checkRes = await db.query('SELECT * FROM student_results WHERE id = $1', [resultId]);
    if (checkRes.rows.length === 0) return res.status(404).json({ error: 'Result not found' });
    
    const result = checkRes.rows[0];
    if (result.user_id) return res.status(400).json({ error: 'Result is already associated with a user' });

    // 2. Update the result with the user_id
    const updateRes = await db.query(
      'UPDATE student_results SET user_id = $1 WHERE id = $2 RETURNING *',
      [req.user.id, resultId]
    );

    res.json({ message: 'Result associated successfully', data: updateRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to associate result' });
  }
});

module.exports = router;
