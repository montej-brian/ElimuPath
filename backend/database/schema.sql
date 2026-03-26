-- ElimuPath PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== USERS TABLE =====
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== UNIVERSITIES TABLE =====
CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- Public, Private, TVET
    location VARCHAR(255),
    website_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== COURSES TABLE =====
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Degree, Diploma, Certificate
    description TEXT,
    duration VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== COURSE REQUIREMENTS TABLE =====
CREATE TABLE IF NOT EXISTS course_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    subject_code VARCHAR(10) NOT NULL, -- ENG, MAT, BIO, etc.
    min_grade VARCHAR(2) NOT NULL,
    is_mandatory BOOLEAN DEFAULT true,
    cluster_weight DECIMAL(3,2), -- Weight for cluster calculation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== STUDENT RESULTS TABLE =====
CREATE TABLE IF NOT EXISTS student_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255), -- For guest users
    results_hash VARCHAR(64) UNIQUE NOT NULL,
    mean_grade VARCHAR(2) NOT NULL,
    mean_points DECIMAL(4,2) NOT NULL,
    total_points INTEGER NOT NULL,
    subjects JSONB NOT NULL, -- Array of {code, name, grade, points}
    certificate_file_url TEXT,
    parsed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== ELIGIBILITY MATCHES TABLE =====
CREATE TABLE IF NOT EXISTS eligibility_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_result_id UUID REFERENCES student_results(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    eligibility_status VARCHAR(50) NOT NULL, -- eligible, partially_eligible, ineligible
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== ANALYSIS TABLE (LEGACY COMPATIBILITY) =====
CREATE TABLE IF NOT EXISTS analysis (
    id SERIAL PRIMARY KEY,
    results_hash VARCHAR(64) UNIQUE NOT NULL,
    mean_grade VARCHAR(2) NOT NULL,
    mean_points DECIMAL(4,2) NOT NULL,
    total_points INTEGER NOT NULL,
    subjects JSONB NOT NULL,
    clusters JSONB NOT NULL,
    is_paid BOOLEAN DEFAULT false,
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== PAYMENT TABLE =====
CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    analysis_id INTEGER REFERENCES analysis(id) ON DELETE CASCADE,
    phone_number VARCHAR(15) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    mpesa_checkout_request_id VARCHAR(100) UNIQUE,
    mpesa_receipt_number VARCHAR(50),
    transaction_date VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_student_results_user_id ON student_results(user_id);
CREATE INDEX IF NOT EXISTS idx_student_results_session_id ON student_results(session_id);
CREATE INDEX IF NOT EXISTS idx_courses_university_id ON courses(university_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_matches_result_id ON eligibility_matches(student_result_id);
