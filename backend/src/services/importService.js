const fs = require('fs');
const csv = require('csv-parser');
const db = require('../config/db');

class ImportService {
  static async importUniversities(filePath) {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          let count = 0;
          for (const row of results) {
            try {
              // Expecting headers: name, type, location
              // ID is assigned by db UUID if new, otherwise we update matching names
              const name = row.name ? row.name.trim() : null;
              if (!name) continue;
              
              const type = row.type ? row.type.trim() : null;
              const location = row.location ? row.location.trim() : null;
              
              const existing = await db.query('SELECT id FROM universities WHERE name = $1', [name]);
              if (existing.rows.length === 0) {
                await db.query(`INSERT INTO universities (name, type, location) VALUES ($1, $2, $3)`, [name, type, location]);
                count++;
              } else {
                await db.query(`UPDATE universities SET type = $1, location = $2 WHERE id = $3`, [type, location, existing.rows[0].id]);
                count++;
              }
            } catch (err) {
              console.error(`Failed to import university ${row.name}`, err);
            }
          }
          resolve({ count });
        })
        .on('error', (err) => reject(err));
    });
  }

  static async importCourses(filePath) {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          let count = 0;
          let errors = [];
          for (const row of results) {
            try {
              // Expecting headers: university_name, course_name, type, duration
              const universityName = row.university_name ? row.university_name.trim() : null;
              const courseName = row.course_name ? row.course_name.trim() : null;
              const type = row.type ? row.type.trim() : 'Degree'; // default
              const duration = row.duration ? row.duration.trim() : null;
              
              if (!universityName || !courseName) continue;
              
              // Relational lookup: Map text string back to unique UUID 
              const uniLookup = await db.query('SELECT id FROM universities WHERE name = $1', [universityName]);
              if (uniLookup.rows.length === 0) {
                errors.push(`Could not find university: ${universityName}`);
                continue;
              }
              const universityId = uniLookup.rows[0].id;
              
              const existing = await db.query('SELECT id FROM courses WHERE university_id = $1 AND name = $2', [universityId, courseName]);
              if (existing.rows.length === 0) {
                await db.query(
                  `INSERT INTO courses (university_id, name, type, duration) VALUES ($1, $2, $3, $4)`, 
                  [universityId, courseName, type, duration]
                );
                count++;
              } else {
                await db.query(
                  `UPDATE courses SET type = $1, duration = $2 WHERE id = $3`, 
                  [type, duration, existing.rows[0].id]
                );
                count++;
              }
            } catch (err) {
              console.error(`Failed to import course ${row.course_name}`, err);
            }
          }
          resolve({ count, errors });
        })
        .on('error', (err) => reject(err));
    });
  }

  static async importRequirements(filePath) {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          let count = 0;
          let errors = [];
          for (const row of results) {
            try {
              // Expecting headers: course_name, weight, subject_1, min_grade_1, subject_2, min_grade_2, subject_3, min_grade_3
              const courseName = row.course_name ? row.course_name.trim() : null;
              const weight = row.weight ? parseFloat(row.weight.trim()) : null;
              
              if (!courseName) continue;
              
              const subjectsArr = [
                { subject: row.subject_1, grade: row.min_grade_1 },
                { subject: row.subject_2, grade: row.min_grade_2 },
                { subject: row.subject_3, grade: row.min_grade_3 }
              ];
              
              // Relational lookup: Map text title to underlying UUID 
              const courseLookup = await db.query('SELECT id FROM courses WHERE name = $1 LIMIT 1', [courseName]);
              if (courseLookup.rows.length === 0) {
                errors.push(`Could not find course: ${courseName}`);
                continue;
              }
              const courseId = courseLookup.rows[0].id;
              
              for (const item of subjectsArr) {
                const subject = item.subject ? item.subject.trim() : null;
                const minGrade = item.grade ? item.grade.trim() : null;
                
                if (!subject || !minGrade) continue; // skip empty pairs
                
                const existing = await db.query(
                  'SELECT id FROM course_requirements WHERE course_id = $1 AND subject_code = $2', 
                  [courseId, subject]
                );
                
                if (existing.rows.length === 0) {
                  await db.query(
                    `INSERT INTO course_requirements (course_id, subject_code, min_grade, cluster_weight) VALUES ($1, $2, $3, $4)`, 
                    [courseId, subject, minGrade, weight]
                  );
                  count++;
                } else {
                  await db.query(
                    `UPDATE course_requirements SET min_grade = $1, cluster_weight = $2 WHERE id = $3`, 
                    [minGrade, weight, existing.rows[0].id]
                  );
                  count++;
                }
              }
            } catch (err) {
              console.error(`Failed to process requirement row for course ${row.course_name}`, err);
            }
          }
          resolve({ count, errors });
        })
        .on('error', (err) => reject(err));
    });
  }
}

module.exports = ImportService;
