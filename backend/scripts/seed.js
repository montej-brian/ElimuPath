const db = require('../src/config/db');

const seedData = async () => {
  try {
    console.log('Seeding universities...');
    const u1 = await db.query(`
      INSERT INTO universities (name, type, location, website_url)
      VALUES ($1, $2, $3, $4) RETURNING id
    `, ['University of Nairobi', 'Public', 'Nairobi', 'https://uonbi.ac.ke']);
    
    const u2 = await db.query(`
      INSERT INTO universities (name, type, location, website_url)
      VALUES ($1, $2, $3, $4) RETURNING id
    `, ['JKUAT', 'Public', 'Juja', 'https://jkuat.ac.ke']);

    const u1id = u1.rows[0].id;
    const u2id = u2.rows[0].id;

    console.log('Seeding courses...');
    const c1 = await db.query(`
      INSERT INTO courses (university_id, name, type, description, duration)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `, [u1id, 'Bachelor of Medicine and Bachelor of Surgery', 'Degree', 'Medical training', '6 years']);

    const c2 = await db.query(`
      INSERT INTO courses (university_id, name, type, description, duration)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `, [u2id, 'BSc. Computer Science', 'Degree', 'Software engineering and CS', '4 years']);

    console.log('Seeding requirements...');
    // Medicine requirements: BIO B+, CHEM B+, MAT B, ENG B
    await db.query(`INSERT INTO course_requirements (course_id, subject_code, min_grade) VALUES ($1, $2, $3)`, [c1.rows[0].id, 'BIO', 'B+']);
    await db.query(`INSERT INTO course_requirements (course_id, subject_code, min_grade) VALUES ($1, $2, $3)`, [c1.rows[0].id, 'CHEM', 'B+']);
    await db.query(`INSERT INTO course_requirements (course_id, subject_code, min_grade) VALUES ($1, $2, $3)`, [c1.rows[0].id, 'MAT', 'B']);
    await db.query(`INSERT INTO course_requirements (course_id, subject_code, min_grade) VALUES ($1, $2, $3)`, [c1.rows[0].id, 'ENG', 'B']);

    // CS requirements: MAT B+, PHY B, ENG B
    await db.query(`INSERT INTO course_requirements (course_id, subject_code, min_grade) VALUES ($1, $2, $3)`, [c2.rows[0].id, 'MAT', 'B+']);
    await db.query(`INSERT INTO course_requirements (course_id, subject_code, min_grade) VALUES ($1, $2, $3)`, [c2.rows[0].id, 'PHY', 'B']);
    await db.query(`INSERT INTO course_requirements (course_id, subject_code, min_grade) VALUES ($1, $2, $3)`, [c2.rows[0].id, 'ENG', 'B']);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

require('dotenv').config();
seedData();
