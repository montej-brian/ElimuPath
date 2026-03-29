const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const cache = require('../utils/cache');
const { validate, adminSchemas } = require('../middleware/validation');
const ImportService = require('../services/importService');
const upload = require('../middleware/upload');

// Middleware to check for Admin role
const adminOnly = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  try {
    const userRes = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    if (userRes.rows.length > 0 && userRes.rows[0].role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
  } catch (err) {
    console.error('Error checking admin role:', err);
    res.status(500).json({ error: 'Server error checkings role.' });
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
router.post('/universities', auth, adminOnly, validate(adminSchemas.university), async (req, res) => {
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
router.put('/universities/:id', auth, adminOnly, validate(adminSchemas.university), async (req, res) => {
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
      SELECT c.*, u.name as university_name,
        COALESCE(
          (SELECT json_agg(css.subject ORDER BY css.position ASC)
           FROM course_cluster_subjects css WHERE css.course_id = c.id), '[]'::json
        ) as clusters
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
router.post('/courses', auth, adminOnly, validate(adminSchemas.course), async (req, res) => {
  const { university_id, name, type, description, duration, cut_off_points } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO courses (university_id, name, type, description, duration, cut_off_points) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [university_id, name, type, description, duration, cut_off_points || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// @route   PUT /api/admin/courses/:id
router.put('/courses/:id', auth, adminOnly, validate(adminSchemas.course), async (req, res) => {
  const { name, type, description, duration, cut_off_points } = req.body;
  try {
    const result = await db.query(
      'UPDATE courses SET name = $1, type = $2, description = $3, duration = $4, cut_off_points = $5 WHERE id = $6 RETURNING *',
      [name, type, description, duration, cut_off_points || null, req.params.id]
    );
    // Invalidate cache
    await cache.invalidateRequirements(req.params.id);
    await cache.clearAll();
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

// @route   GET /api/admin/courses/:id/clusters
router.get('/courses/:id/clusters', auth, adminOnly, async (req, res) => {
  try {
    const result = await db.query('SELECT subject FROM course_cluster_subjects WHERE course_id = $1 ORDER BY position ASC', [req.params.id]);
    res.json(result.rows.map(r => r.subject));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clusters' });
  }
});

// @route   PUT /api/admin/courses/:id/clusters
router.put('/courses/:id/clusters', auth, adminOnly, validate(adminSchemas.clusters), async (req, res) => {
  const { subjects } = req.body; // Array of 4 strings
  try {
    await db.query('BEGIN');
    await db.query('DELETE FROM course_cluster_subjects WHERE course_id = $1', [req.params.id]);
    
    for (let i = 0; i < subjects.length; i++) {
        await db.query(
          'INSERT INTO course_cluster_subjects (course_id, subject, position) VALUES ($1, $2, $3)',
          [req.params.id, subjects[i], i + 1]
        );
    }
    
    await db.query('COMMIT');
    
    // Invalidate caches
    await cache.invalidateRequirements(req.params.id);
    await cache.clearAll();
    
    res.json({ message: 'Clusters updated successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to update clusters' });
  }
});

// @route   GET /api/admin/courses/:id/cutoffs
router.get('/courses/:id/cutoffs', auth, adminOnly, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM course_cutoffs WHERE course_id = $1 ORDER BY year DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course cut-offs' });
  }
});

// @route   POST /api/admin/courses/:id/cutoffs
router.post('/courses/:id/cutoffs', auth, adminOnly, validate(adminSchemas.cutoffYear), async (req, res) => {
  const { year, cut_off_points } = req.body;
  try {
    const result = await db.query(`
      INSERT INTO course_cutoffs (course_id, year, cut_off_points)
      VALUES ($1, $2, $3)
      ON CONFLICT (course_id, year) 
      DO UPDATE SET cut_off_points = EXCLUDED.cut_off_points, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [req.params.id, year, cut_off_points]);
    
    await cache.clearAll();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save cut-off point' });
  }
});

// @route   DELETE /api/admin/cutoffs/:id
router.delete('/cutoffs/:id', auth, adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM course_cutoffs WHERE id = $1', [req.params.id]);
    await cache.clearAll();
    res.json({ message: 'Cut-off record removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete cut-off record' });
  }
});

// ===== BULK IMPORT ROUTES =====
router.post('/bulk/universities', auth, adminOnly, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a CSV file' });
  try {
    const result = await ImportService.importUniversities(req.file.path);
    res.json({ message: `Successfully imported ${result.count} institutions.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process bulk upload for universities' });
  }
});

router.post('/bulk/courses', auth, adminOnly, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a CSV file' });
  try {
    const result = await ImportService.importCourses(req.file.path);
    res.json({ 
      message: `Successfully imported ${result.count} courses.`, 
      issues: result.errors 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process bulk upload for courses' });
  }
});

router.post('/bulk/requirements', auth, adminOnly, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a CSV file' });
  try {
    const result = await ImportService.importRequirements(req.file.path);
    res.json({ 
      message: `Successfully imported ${result.count} requirements.`, 
      issues: result.errors 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process bulk upload for requirements' });
  }
});

module.exports = router;
