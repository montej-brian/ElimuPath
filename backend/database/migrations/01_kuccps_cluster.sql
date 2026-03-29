-- ==============================================================================
-- Migration: 01_kuccps_cluster.sql
-- Description: Adds structures for official KUCCPS cluster points calculation
-- Formula: C = (r * t) / 84
-- ==============================================================================

-- 1. Add cut_off_points to courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS cut_off_points DECIMAL(5,3);

-- 2. Create course_cluster_subjects table
CREATE TABLE IF NOT EXISTS course_cluster_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    position INTEGER CHECK (position >= 1 AND position <= 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_course_subject UNIQUE (course_id, subject)
);

-- Index for faster queries later during finding matches
CREATE INDEX IF NOT EXISTS idx_course_cluster_subject_id ON course_cluster_subjects(course_id);

-- 3. Add aggregate_points (t) to student_results
ALTER TABLE student_results 
ADD COLUMN IF NOT EXISTS aggregate_points INTEGER CHECK (aggregate_points >= 0 AND aggregate_points <= 84);

-- Note: The legacy 'course_requirements' table is remaining in the database for archival and potential fallback uses.
