const db = require('../config/db');
const { calculatePoints } = require('../utils/gradeUtils');

class MatchingService {
  static async findMatches(resultId) {
    // 1. Fetch student results
    const resultRes = await db.query('SELECT * FROM student_results WHERE id = $1', [resultId]);
    if (resultRes.rows.length === 0) throw new Error('Result not found');
    const studentResult = resultRes.rows[0];
    const studentSubjects = studentResult.subjects;

    // 2. Fetch all courses and their requirements
    const coursesRes = await db.query(`
      SELECT c.*, u.name as university_name, u.location as university_location,
             json_agg(cr.*) as requirements
      FROM courses c
      JOIN universities u ON c.university_id = u.id
      LEFT JOIN course_requirements cr ON c.id = cr.course_id
      WHERE c.is_active = true
      GROUP BY c.id, u.id
    `);
    const courses = coursesRes.rows;

    const matches = [];

    // 3. For each course, check eligibility
    for (const course of courses) {
      const { requirements } = course;
      let isEligible = true;
      let reasons = [];

      if (requirements && requirements[0] !== null) {
        for (const req of requirements) {
          const studentGrade = studentSubjects[req.subject_code];
          
          if (!studentGrade) {
            isEligible = false;
            reasons.push(`Missing required subject: ${req.subject_code}`);
          } else {
            const studentPoints = calculatePoints(studentGrade);
            const requiredPoints = calculatePoints(req.min_grade);
            
            if (studentPoints < requiredPoints) {
              isEligible = false;
              reasons.push(`${req.subject_code} grade ${studentGrade} is below required ${req.min_grade}`);
            }
          }
        }
      }

      const match = {
        course_id: course.id,
        course_name: course.name,
        university_name: course.university_name,
        university_location: course.university_location,
        eligibility_status: isEligible ? 'eligible' : 'ineligible',
        reason: reasons.join(', ') || 'Meets all requirements'
      };

      matches.push(match);

      // 4. Save match to DB
      await db.query(`
        INSERT INTO eligibility_matches (student_result_id, course_id, eligibility_status, reason)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (student_result_id, course_id) DO UPDATE 
        SET eligibility_status = EXCLUDED.eligibility_status, reason = EXCLUDED.reason
      `, [resultId, course.id, match.eligibility_status, match.reason]);
    }

    return matches;
  }
}

module.exports = MatchingService;
