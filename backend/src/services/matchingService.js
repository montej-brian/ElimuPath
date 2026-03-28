const db = require('../config/db');
const { calculatePoints } = require('../utils/gradeUtils');
const cache = require('../utils/cache');

class MatchingService {
  static async findMatches(resultId) {
    // 1. Check if final matches are already cached
    const cachedMatches = await cache.getMatches(resultId);
    if (cachedMatches) {
      console.log('⚡ Using cached matches for:', resultId);
      return cachedMatches;
    }

    // 2. Fetch student results
    const resultRes = await db.query('SELECT * FROM student_results WHERE id = $1', [resultId]);
    if (resultRes.rows.length === 0) throw new Error('Result not found');
    const studentResult = resultRes.rows[0];
    const studentSubjects = studentResult.subjects;

    // 3. Fetch all active courses
    const coursesRes = await db.query(`
      SELECT c.*, u.name as university_name, u.location as university_location
      FROM courses c
      JOIN universities u ON c.university_id = u.id
      WHERE c.is_active = true
    `);
    const courses = coursesRes.rows;

    const matches = [];

    // 4. For each course, check eligibility
    for (const course of courses) {
      // Check individual requirement cache
      let requirements = await cache.getRequirements(course.id);
      
      if (!requirements) {
        const reqRes = await db.query('SELECT * FROM course_requirements WHERE course_id = $1', [course.id]);
        requirements = reqRes.rows;
        await cache.setRequirements(course.id, requirements);
      }

      let isEligible = true;
      let detailedReasons = [];

      if (requirements && requirements.length > 0) {
        for (const req of requirements) {
          const studentGrade = studentSubjects[req.subject_code];
          
          const requirementDetail = {
            subject: req.subject_code,
            required: req.min_grade,
            student: studentGrade || 'N/A',
            status: 'pending',
            message: ''
          };

          if (!studentGrade) {
            isEligible = false;
            requirementDetail.status = 'failed';
            requirementDetail.message = `Missing required subject: ${req.subject_code}`;
          } else {
            const studentPoints = calculatePoints(studentGrade);
            const requiredPoints = calculatePoints(req.min_grade);
            
            if (studentPoints < requiredPoints) {
              isEligible = false;
              requirementDetail.status = 'failed';
              requirementDetail.message = `${req.subject_code} grade ${studentGrade} is below required ${req.min_grade}`;
            } else {
              requirementDetail.status = 'met';
              requirementDetail.message = `${req.subject_code} requirement met`;
            }
          }
          detailedReasons.push(requirementDetail);
        }
      }

      const match = {
        course_id: course.id,
        course_name: course.name,
        university_name: course.university_name,
        university_location: course.university_location,
        eligibility_status: isEligible ? 'eligible' : 'ineligible',
        detailed_reasons: detailedReasons,
        reason: JSON.stringify(detailedReasons)
      };

      matches.push(match);

      // 5. Save/Update match result in database
      await db.query(`
        INSERT INTO eligibility_matches (student_result_id, course_id, eligibility_status, reason)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (student_result_id, course_id) DO UPDATE 
        SET eligibility_status = EXCLUDED.eligibility_status, reason = EXCLUDED.reason
      `, [resultId, course.id, match.eligibility_status, match.reason]);
    }

    // 6. Cache the final matches array
    await cache.setMatches(resultId, matches);

    return matches;
  }
}

module.exports = MatchingService;
