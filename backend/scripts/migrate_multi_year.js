const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../src/config/db');

async function migrate() {
  try {
    console.log('🚀 Starting migration for multi-year cut-offs...');
    console.log('🔗 DB URL:', process.env.DATABASE_URL ? 'FOUND' : 'NOT FOUND');

    // 1. Create course_cutoffs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS course_cutoffs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        year INTEGER NOT NULL,
        cut_off_points DECIMAL(5,3) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(course_id, year)
      )
    `);
    console.log('✅ Created course_cutoffs table');

    // 2. Migrate existing cut_off_points from courses to course_cutoffs for 2024
    const courses = await db.query('SELECT id, cut_off_points FROM courses WHERE cut_off_points IS NOT NULL');
    
    let migratedCount = 0;
    for (const course of courses.rows) {
      await db.query(`
        INSERT INTO course_cutoffs (course_id, year, cut_off_points)
        VALUES ($1, $2, $3)
        ON CONFLICT (course_id, year) DO UPDATE SET cut_off_points = EXCLUDED.cut_off_points
      `, [course.id, 2024, course.cut_off_points]);
      migratedCount++;
    }
    
    console.log(`✅ Migrated ${migratedCount} courses to 2024 cut-offs`);
    console.log('✨ Migration completed successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    process.exit();
  }
}

migrate();
