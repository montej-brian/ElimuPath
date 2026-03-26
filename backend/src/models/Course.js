const db = require('../config/db');

class Course {
  static async findAll() {
    const result = await db.query('SELECT * FROM courses WHERE is_active = true');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findWithRequirements(id) {
    const query = `
      SELECT c.*, json_agg(cr.*) as requirements
      FROM courses c
      LEFT JOIN course_requirements cr ON c.id = cr.course_id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Course;
