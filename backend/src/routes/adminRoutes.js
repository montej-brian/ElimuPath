const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Middleware to check for Admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
};

// @route   GET /api/admin/universities
router.get('/universities', auth, adminOnly, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM universities ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

// @route   POST /api/admin/universities
router.post('/universities', auth, adminOnly, async (req, res) => {
  const { name, type, location, website_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO universities (name, type, location, website_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, location, website_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create university' });
  }
});

// @route   PUT /api/admin/universities/:id
router.put('/universities/:id', auth, adminOnly, async (req, res) => {
  const { name, type, location, website_url } = req.body;
  try {
    const result = await db.query(
      'UPDATE universities SET name = $1, type = $2, location = $3, website_url = $4 WHERE id = $5 RETURNING *',
      [name, type, location, website_url, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update university' });
  }
});

// @route   DELETE /api/admin/universities/:id
router.delete('/universities/:id', auth, adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM universities WHERE id = $1', [req.params.id]);
    res.json({ message: 'University deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete university' });
  }
});

// @route   GET /api/admin/courses
router.get('/courses', auth, adminOnly, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, u.name as university_name 
      FROM courses c 
      JOIN universities u ON c.university_id = u.id 
      ORDER BY u.name ASC, c.name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// @route   POST /api/admin/courses
router.post('/courses', auth, adminOnly, async (req, res) => {
  const { university_id, name, type, description, duration } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO courses (university_id, name, type, description, duration) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [university_id, name, type, description, duration]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// @route   PUT /api/admin/courses/:id
router.put('/courses/:id', auth, adminOnly, async (req, res) => {
  const { name, type, description, duration } = req.body;
  try {
    const result = await db.query(
      'UPDATE courses SET name = $1, type = $2, description = $3, duration = $4 WHERE id = $5 RETURNING *',
      [name, type, description, duration, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// @route   DELETE /api/admin/courses/:id
router.delete('/courses/:id', auth, adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM courses WHERE id = $1', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// @route   GET /api/admin/courses/:id/requirements
router.get('/courses/:id/requirements', auth, adminOnly, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM course_requirements WHERE course_id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});

// @route   POST /api/admin/courses/:id/requirements
router.post('/courses/:id/requirements', auth, adminOnly, async (req, res) => {
  const { subject_code, min_grade, cluster_weight } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO course_requirements (course_id, subject_code, min_grade, cluster_weight) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.params.id, subject_code, min_grade, cluster_weight]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create requirement' });
  }
});

// @route   DELETE /api/admin/requirements/:id
router.delete('/requirements/:id', auth, adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM course_requirements WHERE id = $1', [req.params.id]);
    res.json({ message: 'Requirement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete requirement' });
  }
});

module.exports = router;
