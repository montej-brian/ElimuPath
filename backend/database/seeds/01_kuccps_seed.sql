-- ==============================================================================
-- Seeds: 01_kuccps_seed.sql
-- Description: Sample 2024 KUCCPS courses, their 4 cluster subjects and cut-offs.
-- ==============================================================================

-- Create a dummy university if none exists
INSERT INTO universities (id, name, type, location)
VALUES ('00000000-0000-0000-0000-000000000001', 'University of Nairobi', 'Public', 'Nairobi')
ON CONFLICT DO NOTHING;

-- 1. Bachelor of Medicine and Bachelor of Surgery (MBChB)
-- -------------------------------------------------------------
INSERT INTO courses (id, university_id, name, type, duration, cut_off_points)
VALUES ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Bachelor of Medicine and Bachelor of Surgery', 'Degree', '6 Years', 43.158)
ON CONFLICT (id) DO UPDATE SET cut_off_points = EXCLUDED.cut_off_points;

INSERT INTO course_cluster_subjects (course_id, subject, position) VALUES
('11111111-1111-1111-1111-111111111111', 'Biology', 1),
('11111111-1111-1111-1111-111111111111', 'Chemistry', 2),
('11111111-1111-1111-1111-111111111111', 'Mathematics', 3),
('11111111-1111-1111-1111-111111111111', 'English / Kiswahili', 4)
ON CONFLICT DO NOTHING;


-- 2. Bachelor of Science in Computer Science
-- -------------------------------------------------------------
INSERT INTO courses (id, university_id, name, type, duration, cut_off_points)
VALUES ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Bachelor of Science (Computer Science)', 'Degree', '4 Years', 38.652)
ON CONFLICT (id) DO UPDATE SET cut_off_points = EXCLUDED.cut_off_points;

INSERT INTO course_cluster_subjects (course_id, subject, position) VALUES
('22222222-2222-2222-2222-222222222222', 'Mathematics', 1),
('22222222-2222-2222-2222-222222222222', 'Physics / Chemistry', 2),
('22222222-2222-2222-2222-222222222222', 'Group II Subject (Biology / Physics / Chemistry)', 3),
('22222222-2222-2222-2222-222222222222', 'Any Other Group II / III / IV / V Subject', 4)
ON CONFLICT DO NOTHING;


-- 3. Bachelor of Commerce (BCom)
-- -------------------------------------------------------------
INSERT INTO courses (id, university_id, name, type, duration, cut_off_points)
VALUES ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'Bachelor of Commerce', 'Degree', '4 Years', 32.140)
ON CONFLICT (id) DO UPDATE SET cut_off_points = EXCLUDED.cut_off_points;

INSERT INTO course_cluster_subjects (course_id, subject, position) VALUES
('33333333-3333-3333-3333-333333333333', 'Mathematics / Business Studies', 1),
('33333333-3333-3333-3333-333333333333', 'English / Kiswahili', 2),
('33333333-3333-3333-3333-333333333333', 'Any Subject 3', 3),
('33333333-3333-3333-3333-333333333333', 'Any Subject 4', 4)
ON CONFLICT DO NOTHING;
