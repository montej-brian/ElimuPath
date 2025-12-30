-- ElimuPath MySQL Database Schema
-- Run this script to create all required tables

-- ===== ANALYSIS TABLE =====
CREATE TABLE IF NOT EXISTS analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    results_hash VARCHAR(64) UNIQUE NOT NULL,
    mean_grade VARCHAR(2) NOT NULL,
    mean_points DECIMAL(4,2) NOT NULL,
    total_points INTEGER NOT NULL,
    subjects JSON NOT NULL, -- Array of {code, name, grade, points}
    clusters JSON NOT NULL, -- Array of calculated clusters
    is_paid BOOLEAN DEFAULT false,
    payment_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_results_hash (results_hash),
    INDEX idx_is_paid (is_paid),
    INDEX idx_created_at (created_at)
);

-- ===== PAYMENT TABLE =====
CREATE TABLE IF NOT EXISTS payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    analysis_id INTEGER NOT NULL,
    phone_number VARCHAR(12) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    mpesa_checkout_request_id VARCHAR(100) UNIQUE,
    mpesa_receipt_number VARCHAR(50),
    transaction_date VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (analysis_id) REFERENCES analysis(id) ON DELETE CASCADE,
    INDEX idx_analysis_id (analysis_id),
    INDEX idx_checkout_request_id (mpesa_checkout_request_id),
    INDEX idx_status (status)
);

-- ===== COURSES TABLE =====
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    institution TEXT,
    description TEXT,
    duration VARCHAR(50),
    requirements JSON, -- {min_mean_grade, cluster_number, min_cluster_points, required_subjects}
    requirements_text TEXT,
    career_paths JSON, -- Array of career paths (MySQL handles this as JSON)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_is_active (is_active)
);

-- ===== CLUSTERS TABLE =====
CREATE TABLE IF NOT EXISTS clusters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cluster_number INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    subject_formula TEXT,
    typical_courses JSON, -- Array of strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== SEED DATA FOR COURSES =====
INSERT INTO courses (name, type, institution, description, duration, requirements, requirements_text, career_paths) VALUES
('Bachelor of Medicine and Bachelor of Surgery (MBChB)', 'Degree', 'University of Nairobi, Moi University, Kenyatta University', 'Medical doctor training program', '6 years', 
 '{"min_mean_grade": "B+", "cluster_number": 1, "min_cluster_points": 42, "required_subjects": {"BIO": "B+", "CHEM": "B+", "PHY": "B", "ENG": "B", "MAT": "B"}}',
 'Min B+ overall; B+ in Biology and Chemistry, B in Physics, English, and Mathematics',
 '["Healthcare Professional"]'),

('Bachelor of Science in Nursing', 'Degree', 'University of Nairobi, Kenyatta University, Moi University', 'Professional nursing program', '4 years',
 '{"min_mean_grade": "B-", "cluster_number": 1, "min_cluster_points": 35, "required_subjects": {"BIO": "B", "CHEM": "C+", "ENG": "C+"}}',
 'Min B- overall; B in Biology, C+ in Chemistry and English',
 '["Healthcare Professional"]'),

('Bachelor of Engineering (Various)', 'Degree', 'JKUAT, University of Nairobi, Technical University of Kenya', 'Engineering programs in Civil, Mechanical, Electrical, etc.', '4-5 years',
 '{"min_mean_grade": "B", "cluster_number": 1, "min_cluster_points": 38, "required_subjects": {"MAT": "B", "PHY": "B", "CHEM": "C+", "ENG": "C+"}}',
 'Min B overall; B in Mathematics and Physics, C+ in Chemistry and English',
 '["Engineer"]'),

('Bachelor of Science in Computer Science', 'Degree', 'University of Nairobi, Strathmore University, JKUAT', 'Computer science and software development', '4 years',
 '{"min_mean_grade": "B", "cluster_number": 1, "min_cluster_points": 36, "required_subjects": {"MAT": "B", "ENG": "C+"}}',
 'Min B overall; B in Mathematics, C+ in English',
 '["IT/Computer Specialist"]'),

('Bachelor of Education (Arts)', 'Degree', 'Kenyatta University, Moi University, Egerton University', 'Secondary school teacher training', '4 years',
 '{"min_mean_grade": "C+", "cluster_number": 2, "min_cluster_points": 30, "required_subjects": {"ENG": "C+"}}',
 'Min C+ overall; C+ in English and two teaching subjects at C+',
 '["Teacher/Educator"]'),

('Bachelor of Education (Science)', 'Degree', 'Kenyatta University, Egerton University, Maseno University', 'Science teacher training', '4 years',
 '{"min_mean_grade": "C+", "cluster_number": 1, "min_cluster_points": 30, "required_subjects": {"ENG": "C+", "MAT": "C+"}}',
 'Min C+ overall; C+ in English, Mathematics, and two science subjects',
 '["Teacher/Educator"]'),

('Bachelor of Commerce', 'Degree', 'University of Nairobi, Strathmore University, USIU', 'Business and commerce studies', '4 years',
 '{"min_mean_grade": "C+", "cluster_number": 3, "min_cluster_points": 28, "required_subjects": {"ENG": "C+", "MAT": "C+"}}',
 'Min C+ overall; C+ in English and Mathematics',
 '["Business Professional"]'),

('Bachelor of Laws (LLB)', 'Degree', 'University of Nairobi, Moi University, Kenyatta University', 'Legal education program', '4 years',
 '{"min_mean_grade": "B", "cluster_number": 2, "min_cluster_points": 36, "required_subjects": {"ENG": "B"}}',
 'Min B overall; B in English',
 '["Lawyer/Legal Professional"]'),

('Bachelor of Science in Agriculture', 'Degree', 'Egerton University, University of Nairobi, Jomo Kenyatta University', 'Agricultural sciences', '4 years',
 '{"min_mean_grade": "C+", "cluster_number": 1, "min_cluster_points": 30, "required_subjects": {"BIO": "C+", "CHEM": "C+"}}',
 'Min C+ overall; C+ in Biology and Chemistry',
 '["Agriculture/Veterinary"]'),

('Diploma in Clinical Medicine and Surgery', 'Diploma', 'Kenya Medical Training College (KMTC)', 'Clinical officer training', '3 years',
 '{"min_mean_grade": "C", "required_subjects": {"BIO": "C", "CHEM": "C", "ENG": "C"}}',
 'Min C overall; C in Biology, Chemistry, and English',
 '["Healthcare Professional"]'),

('Diploma in Nursing', 'Diploma', 'Kenya Medical Training College (KMTC)', 'Registered nurse training', '3 years',
 '{"min_mean_grade": "C", "required_subjects": {"BIO": "C", "ENG": "C"}}',
 'Min C overall; C in Biology and English',
 '["Healthcare Professional"]'),

('Diploma in Information Technology', 'Diploma', 'Technical University of Kenya, Kenya Technical Trainers College', 'IT and computer systems', '2-3 years',
 '{"min_mean_grade": "C-", "required_subjects": {"MAT": "C-", "ENG": "C-"}}',
 'Min C- overall; C- in Mathematics and English',
 '["IT/Computer Specialist"]'),

('Diploma in Business Management', 'Diploma', 'Kenya Institute of Management, Technical Universities', 'Business administration', '2-3 years',
 '{"min_mean_grade": "C-", "required_subjects": {"ENG": "C-", "MAT": "D+"}}',
 'Min C- overall; C- in English, D+ in Mathematics',
 '["Business Professional"]'),

('Diploma in Civil Engineering', 'Diploma', 'Technical University of Kenya, Kenya Technical Trainers College', 'Civil engineering technology', '3 years',
 '{"min_mean_grade": "C-", "required_subjects": {"MAT": "C", "PHY": "C-"}}',
 'Min C- overall; C in Mathematics, C- in Physics',
 '["Engineer"]'),

('Diploma in Electrical Engineering', 'Diploma', 'Technical University of Kenya, Mombasa Technical University', 'Electrical engineering technology', '3 years',
 '{"min_mean_grade": "C-", "required_subjects": {"MAT": "C", "PHY": "C"}}',
 'Min C- overall; C in Mathematics and Physics',
 '["Engineer"]'),

('Diploma in Primary Teacher Education (PTE)', 'Diploma', 'Teacher Training Colleges', 'Primary school teacher training', '2 years',
 '{"min_mean_grade": "C-", "required_subjects": {"ENG": "C-"}}',
 'Min C- overall; C- in English',
 '["Teacher/Educator"]'),

('Certificate in Community Health', 'Certificate', 'Kenya Medical Training College (KMTC)', 'Community health worker training', '2 years',
 '{"min_mean_grade": "D+", "required_subjects": {"ENG": "D+"}}',
 'Min D+ overall; D+ in English',
 '["Healthcare Professional"]'),

('Certificate in Information Communication Technology', 'Certificate', 'TVET Institutions', 'Basic ICT skills', '1-2 years',
 '{"min_mean_grade": "D", "required_subjects": {"ENG": "D"}}',
 'Min D overall; D in English',
 '["IT/Computer Specialist"]'),

('Certificate in Electrical Installation', 'Certificate', 'TVET Institutions', 'Electrical wiring and installation', '1-2 years',
 '{"min_mean_grade": "D", "required_subjects": {"MAT": "D"}}',
 'Min D overall; D in Mathematics',
 '["Engineer"]'),

('Certificate in Plumbing', 'Certificate', 'TVET Institutions', 'Plumbing and pipe fitting', '1-2 years',
 '{"min_mean_grade": "D", "required_subjects": {}}',
 'Min D overall',
 '["Engineer"]'),

('Certificate in Automotive Engineering', 'Certificate', 'TVET Institutions', 'Motor vehicle mechanics', '1-2 years',
 '{"min_mean_grade": "D", "required_subjects": {}}',
 'Min D overall',
 '["Engineer"]'),

('Certificate in Food and Beverage Service', 'Certificate', 'TVET Institutions', 'Hospitality and catering', '1 year',
 '{"min_mean_grade": "D", "required_subjects": {}}',
 'Min D overall',
 '["Business Professional"]'),

('Certificate in Hairdressing and Beauty Therapy', 'Certificate', 'TVET Institutions', 'Hair styling and beauty services', '1 year',
 '{"min_mean_grade": "D", "required_subjects": {}}',
 'Min D overall',
 '["Business Professional"]');

-- ===== SEED DATA FOR CLUSTERS =====
INSERT INTO clusters (cluster_number, name, description, subject_formula, typical_courses) VALUES
(1, 'Science Cluster', 'Science and engineering pathways', 'English + Mathematics + Biology/Physics + Chemistry/Physics', 
 '["Medicine", "Nursing", "Engineering", "Pure Sciences", "Pharmacy", "Dentistry"]'),

(2, 'Arts/Humanities Cluster', 'Arts, humanities, and social sciences', 'English + Kiswahili + Mathematics + History/Geography/CRE',
 '["Law", "Education (Arts)", "Social Sciences", "Journalism", "Psychology"]'),

(3, 'Business/Technical Cluster', 'Business and technical fields', 'English + Mathematics + Kiswahili/Any + Business Studies/Geography',
 '["Commerce", "Accounting", "Economics", "Business Administration", "Hospitality"]'),

(4, 'Technical/Applied Cluster', 'Applied sciences and technology', 'English + Mathematics + Physics/Chemistry + Computer/Agriculture',
 '["Engineering Technology", "ICT", "Agriculture", "Architecture", "Surveying"]');
