const db = require('../config/db');
const { calculatePoints } = require('../utils/gradeUtils');
const cache = require('../utils/cache');
const { parseSubjectString, extractAnyOtherFromGroups } = require('../utils/knecGroups');

class MatchingService {
  static async findMatches(resultId, year = null) {
    const cacheKey = year ? `${resultId}:${year}` : resultId;
    // 1. Check if final matches are already cached
    const cachedMatches = await cache.getMatches(cacheKey);
    if (cachedMatches) {
      console.log('⚡ Using cached matches for:', cacheKey);
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

    // 3b. Fetch cluster requirements natively
    const allClustersRes = await db.query('SELECT * FROM course_cluster_subjects ORDER BY position ASC');
    const clustersByCourse = {};
    for (const c of allClustersRes.rows) {
      if (!clustersByCourse[c.course_id]) clustersByCourse[c.course_id] = [];
      clustersByCourse[c.course_id].push(c);
    }

    // 3c. Fetch cut-offs for the specified year (or latest)
    let cutoffsRes;
    if (year) {
      cutoffsRes = await db.query('SELECT course_id, cut_off_points FROM course_cutoffs WHERE year = $1', [year]);
    } else {
      // Default to latest year available in the system
      cutoffsRes = await db.query(`
        SELECT cc.course_id, cc.cut_off_points 
        FROM course_cutoffs cc
        INNER JOIN (
          SELECT course_id, MAX(year) as max_year 
          FROM course_cutoffs 
          GROUP BY course_id
        ) latest ON cc.course_id = latest.course_id AND cc.year = latest.max_year
      `);
    }

    const cutoffsByCourse = {};
    for (const row of cutoffsRes.rows) {
      cutoffsByCourse[row.course_id] = row.cut_off_points;
    }

    const matches = [];

    // Arrays to collect data for a single bulk UPSERT
    const bulkStudentResultIds = [];
    const bulkCourseIds = [];
    const bulkStatuses = [];
    const bulkReasons = [];
    const bulkComputed = [];
    const bulkCutOff = [];

    const t = studentResult.aggregate_points || 0;

    // 4. For each course, check eligibility entirely IN-MEMORY
    for (const course of courses) {
      const clusters = clustersByCourse[course.id] || [];

      let r = 0;
      let usedSubjects = [];
      let detailedReasons = [];

      if (clusters.length > 0) {
        for (const req of clusters) {
          let possibleCodes = parseSubjectString(req.subject);
          if (req.subject.toLowerCase().includes('any')) {
             possibleCodes = extractAnyOtherFromGroups(req.subject, usedSubjects);
          }

          let bestCode = null;
          let bestPoints = -1;

          for (const code of possibleCodes) {
             if (!usedSubjects.includes(code) && studentSubjects[code]) {
                 const pts = calculatePoints(studentSubjects[code]);
                 if (pts > bestPoints) {
                     bestPoints = pts;
                     bestCode = code;
                 }
             }
          }

          if (bestCode) {
             r += bestPoints;
             usedSubjects.push(bestCode);
             detailedReasons.push(`Assigned ${bestCode} (${bestPoints} pts) for Cluster: ${req.subject}`);
          } else {
             detailedReasons.push(`Missing valid subject for Cluster: ${req.subject}`);
          }
        }
      } else {
         detailedReasons.push('No clusters registered for this course.');
      }

      // Mathematical computation: C = (r * t) / 84
      const computedPoints = Number(((r * t) / 84).toFixed(3));
      const cutOffPoints = Number(cutoffsByCourse[course.id] || course.cut_off_points || 0);
      const isEligible = computedPoints >= cutOffPoints && clusters.length > 0;
      
      const reasonStr = isEligible 
          ? `You exceeded the cut-off by ${(computedPoints - cutOffPoints).toFixed(3)} points.` 
          : `You missed the cut-off by ${(cutOffPoints - computedPoints).toFixed(3)} points (Your C: ${computedPoints}, Needed: ${cutOffPoints}).`;

      const match = {
        course_id: course.id,
        course_name: course.name,
        university_name: course.university_name,
        university_location: course.university_location,
        computed_points: computedPoints,
        cut_off_points: cutOffPoints,
        eligibility_status: isEligible ? 'eligible' : 'ineligible',
        reason: reasonStr,
        detailed_reasons: detailedReasons
      };

      matches.push(match);

      bulkStudentResultIds.push(resultId);
      bulkCourseIds.push(course.id);
      bulkStatuses.push(match.eligibility_status);
      bulkReasons.push(match.reason);
      bulkComputed.push(match.computed_points);
      bulkCutOff.push(match.cut_off_points);
    }

    // 5. Save/Update ALL matches in ONE single bulk database trip
    if (matches.length > 0) {
      const upsertQuery = `
        INSERT INTO eligibility_matches (student_result_id, course_id, eligibility_status, reason, computed_points, cut_off_points)
        SELECT * FROM UNNEST ($1::uuid[], $2::uuid[], $3::varchar[], $4::text[], $5::decimal[], $6::decimal[])
        ON CONFLICT (student_result_id, course_id) DO UPDATE 
        SET eligibility_status = EXCLUDED.eligibility_status, reason = EXCLUDED.reason, computed_points = EXCLUDED.computed_points, cut_off_points = EXCLUDED.cut_off_points
      `;
      await db.query(upsertQuery, [bulkStudentResultIds, bulkCourseIds, bulkStatuses, bulkReasons, bulkComputed, bulkCutOff]);
    }

    // 6. Cache the final matches array
    await cache.setMatches(cacheKey, matches);

    return matches;
  }
}

module.exports = MatchingService;
