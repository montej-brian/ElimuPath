-- Optimizing Database for Performance

-- Foreign Key Indexes for faster JOINs
CREATE INDEX IF NOT EXISTS idx_courses_university_id_fk ON courses(university_id);
CREATE INDEX IF NOT EXISTS idx_course_requirements_course_id_fk ON course_requirements(course_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_matches_student_result_id_fk ON eligibility_matches(student_result_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_matches_course_id_fk ON eligibility_matches(course_id);

-- Subject Lookup Index
CREATE INDEX IF NOT EXISTS idx_course_requirements_subject_code ON course_requirements(subject_code);

-- User Result History Lookup
CREATE INDEX IF NOT EXISTS idx_student_results_user_id_lookup ON student_results(user_id);
