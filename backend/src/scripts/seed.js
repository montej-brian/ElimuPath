const db = require('../config/db');

const universities = [
  { name: 'University of Nairobi', type: 'Public', location: 'Nairobi', website_url: 'https://uonbi.ac.ke' },
  { name: 'JKUAT', type: 'Public', location: 'Juja', website_url: 'https://jkuat.ac.ke' },
  { name: 'Kenyatta University', type: 'Public', location: 'Nairobi', website_url: 'https://ku.ac.ke' },
  { name: 'Strathmore University', type: 'Private', location: 'Nairobi', website_url: 'https://strathmore.edu' }
];

const courses = [
  { universityName: 'University of Nairobi', name: 'Bachelor of Medicine and Bachelor of Surgery', type: 'Degree', duration: '6 Years' },
  { universityName: 'University of Nairobi', name: 'Bachelor of Laws (LLB)', type: 'Degree', duration: '4 Years' },
  { universityName: 'JKUAT', name: 'Bachelor of Science in Computer Science', type: 'Degree', duration: '4 Years' },
  { universityName: 'Strathmore University', name: 'Bachelor of Business Information Technology', type: 'Degree', duration: '4 Years' }
];

const requirements = [
  { courseName: 'Bachelor of Medicine and Bachelor of Surgery', subject_code: 'MAT', min_grade: 'C+', cluster_weight: 1.0 },
  { courseName: 'Bachelor of Medicine and Bachelor of Surgery', subject_code: 'BIO', min_grade: 'B+', cluster_weight: 1.2 },
  { courseName: 'Bachelor of Science in Computer Science', subject_code: 'MAT', min_grade: 'B-', cluster_weight: 1.5 },
  { courseName: 'Bachelor of Science in Computer Science', subject_code: 'PHY', min_grade: 'C+', cluster_weight: 1.0 }
];

async function seed() {
  try {
    console.log('Starting database seeding...');

    // 1. Seed Universities
    for (const uni of universities) {
      await db.query(
        'INSERT INTO universities (name, type, location, website_url) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING',
        [uni.name, uni.type, uni.location, uni.website_url]
      );
    }
    console.log('Universities seeded.');

    // 2. Seed Courses
    for (const course of courses) {
      const uniRes = await db.query('SELECT id FROM universities WHERE name = $1', [course.universityName]);
      if (uniRes.rows.length > 0) {
        await db.query(
          'INSERT INTO courses (university_id, name, type, duration) VALUES ($1, $2, $3, $4) ON CONFLICT (name, university_id) DO NOTHING',
          [uniRes.rows[0].id, course.name, course.type, course.duration]
        );
      }
    }
    console.log('Courses seeded.');

    // 3. Seed Requirements
    for (const req of requirements) {
      const courseRes = await db.query('SELECT id FROM courses WHERE name = $1', [req.courseName]);
      if (courseRes.rows.length > 0) {
        await db.query(
          'INSERT INTO course_requirements (course_id, subject_code, min_grade, cluster_weight) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [courseRes.rows[0].id, req.subject_code, req.min_grade, req.cluster_weight]
        );
      }
    }
    console.log('Requirements seeded.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
