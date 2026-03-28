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

    // 3b. Fetch ALL requirements at once (bulk)
    const allReqsRes = await db.query('SELECT * FROM course_requirements');
    const reqsByCourse = {};
    for (const req of allReqsRes.rows) {
      if (!reqsByCourse[req.course_id]) reqsByCourse[req.course_id] = [];
      reqsByCourse[req.course_id].push(req);
    }

    const matches = [];

    // Arrays to collect data for a single bulk UPSERT
    const bulkStudentResultIds = [];
    const bulkCourseIds = [];
    const bulkStatuses = [];
    const bulkReasons = [];

    // 4. For each course, check eligibility entirely IN-MEMORY
    for (const course of courses) {
      const requirements = reqsByCourse[course.id] || [];

      let isEligible = true;
      let detailedReasons = [];

      if (requirements.length > 0) {
        for (const req of requirements) {
          const studentGrade = studentSubjects[req.subject_code];
          
          const requirementDetail = {
            subject: req.subject_code,
            required: req.min_grade,
            student: studentGrade || '--',
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

      bulkStudentResultIds.push(resultId);
      bulkCourseIds.push(course.id);
      bulkStatuses.push(match.eligibility_status);
      bulkReasons.push(match.reason);
    }

    // 5. Save/Update ALL matches in ONE single bulk database trip
    if (matches.length > 0) {
      const upsertQuery = `
        INSERT INTO eligibility_matches (student_result_id, course_id, eligibility_status, reason)
        SELECT * FROM UNNEST ($1::uuid[], $2::uuid[], $3::varchar[], $4::text[])
        ON CONFLICT (student_result_id, course_id) DO UPDATE 
        SET eligibility_status = EXCLUDED.eligibility_status, reason = EXCLUDED.reason
      `;
      await db.query(upsertQuery, [bulkStudentResultIds, bulkCourseIds, bulkStatuses, bulkReasons]);
    }

    // 6. Cache the final matches array
    await cache.setMatches(resultId, matches);

    return matches;
  }
}

module.exports = MatchingService;
