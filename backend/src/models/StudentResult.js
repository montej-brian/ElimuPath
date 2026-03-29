const db = require('../config/db');

class StudentResult {
  static async create(data) {
    const { user_id, session_id, results_hash, mean_grade, mean_points, total_points, aggregate_points, subjects } = data;
    const query = `
      INSERT INTO student_results (user_id, session_id, results_hash, mean_grade, mean_points, total_points, aggregate_points, subjects)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [user_id, session_id, results_hash, mean_grade, mean_points, total_points, aggregate_points, JSON.stringify(subjects)];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await db.query('SELECT * FROM student_results WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }
}

module.exports = StudentResult;
