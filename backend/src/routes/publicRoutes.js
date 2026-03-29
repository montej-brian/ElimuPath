const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/public/universities
// @desc    Fetch all active universities
router.get('/universities', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM universities ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

// @route   GET /api/public/courses
// @desc    Fetch all courses alongside their respective universities
router.get('/courses', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, u.name as university_name
      FROM courses c 
      JOIN universities u ON c.university_id = u.id 
      WHERE c.is_active = true
      ORDER BY u.name ASC, c.name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

module.exports = router;
