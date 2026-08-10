-- ============================================================
-- ACADEMIC MANAGEMENT PLATFORM — DATABASE SCHEMA (DDL)
-- Metropolitan University, Sylhet — Department of CSE
-- Tri-Semester System — MySQL Workbench Compatible
-- ============================================================

CREATE DATABASE IF NOT EXISTS academic_management;
USE academic_management;

-- Disable foreign key checks temporarily to drop tables in any order
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS AssignmentSubmission;
DROP TABLE IF EXISTS ClassRoutine;
DROP TABLE IF EXISTS Result;
DROP TABLE IF EXISTS QuestionBank;
DROP TABLE IF EXISTS StudyMaterial;
DROP TABLE IF EXISTS Assignment;
DROP TABLE IF EXISTS Notice;
DROP TABLE IF EXISTS Subject;
DROP TABLE IF EXISTS Semester;
DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS Admin;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. ADMIN TABLE
CREATE TABLE Admin (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. STUDENT TABLE
CREATE TABLE Student (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    batch INT NOT NULL,
    section CHAR(2) NOT NULL,
    dept VARCHAR(50) DEFAULT 'CSE',
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'student',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_student_section CHECK (section REGEXP '^[A-Z]$'),
    CONSTRAINT chk_student_batch CHECK (batch > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. FACULTY TABLE
CREATE TABLE Faculty (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    dept VARCHAR(50) DEFAULT 'CSE',
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(50),
    education TEXT,
    office VARCHAR(100),
    photo VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. SUBJECT TABLE
CREATE TABLE Subject (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    credit DECIMAL(3,2) NOT NULL,
    faculty_id VARCHAR(10),
    CONSTRAINT fk_subject_faculty FOREIGN KEY (faculty_id) 
        REFERENCES Faculty(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_subject_credit CHECK (credit > 0.0 AND credit <= 6.0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. SEMESTER TABLE
CREATE TABLE Semester (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    CONSTRAINT chk_semester_year CHECK (year >= 2000 AND year <= 2100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. RESULT TABLE
CREATE TABLE Result (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    semester_id VARCHAR(20) NOT NULL,
    subject_code VARCHAR(10) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    grade_point DECIMAL(3,2) NOT NULL,
    UNIQUE KEY uq_student_semester_subject (student_id, semester_id, subject_code),
    CONSTRAINT fk_result_student FOREIGN KEY (student_id) 
        REFERENCES Student(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_result_semester FOREIGN KEY (semester_id) 
        REFERENCES Semester(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_result_subject FOREIGN KEY (subject_code) 
        REFERENCES Subject(code) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_result_gp CHECK (grade_point >= 0.00 AND grade_point <= 4.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. ASSIGNMENT TABLE
CREATE TABLE Assignment (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subject_code VARCHAR(10) NOT NULL,
    description TEXT,
    deadline DATETIME NOT NULL,
    total_marks INT NOT NULL,
    submission_type VARCHAR(50) NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    faculty_id VARCHAR(10),
    CONSTRAINT fk_assignment_subject FOREIGN KEY (subject_code) 
        REFERENCES Subject(code) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_assignment_faculty FOREIGN KEY (faculty_id) 
        REFERENCES Faculty(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_assignment_marks CHECK (total_marks > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. NOTICE TABLE
CREATE TABLE Notice (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    posted_by VARCHAR(100) NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_notice_priority CHECK (priority IN ('high', 'medium', 'low'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. STUDY MATERIAL TABLE
CREATE TABLE StudyMaterial (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    subject_code VARCHAR(10) NOT NULL,
    semester_id VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    url VARCHAR(255) NULL,
    file_name VARCHAR(255) NULL,
    size VARCHAR(20) NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_material_subject FOREIGN KEY (subject_code) 
        REFERENCES Subject(code) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_material_semester FOREIGN KEY (semester_id) 
        REFERENCES Semester(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_material_type CHECK (type IN ('slide', 'book', 'notes', 'link', 'lab'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. QUESTION BANK TABLE
CREATE TABLE QuestionBank (
    id VARCHAR(20) PRIMARY KEY,
    subject_code VARCHAR(10) NOT NULL,
    year INT NOT NULL,
    exam_type VARCHAR(10) NOT NULL,
    questions JSON NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_subject FOREIGN KEY (subject_code) 
        REFERENCES Subject(code) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_question_exam_type CHECK (exam_type IN ('Mid', 'Final')),
    CONSTRAINT chk_question_year CHECK (year >= 2000 AND year <= 2100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. ASSIGNMENT SUBMISSION TABLE
CREATE TABLE AssignmentSubmission (
    assignment_id VARCHAR(20) NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (assignment_id, student_id),
    CONSTRAINT fk_submission_assignment FOREIGN KEY (assignment_id) 
        REFERENCES Assignment(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_submission_student FOREIGN KEY (student_id) 
        REFERENCES Student(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. CLASS ROUTINE TABLE
CREATE TABLE ClassRoutine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day VARCHAR(15) NOT NULL,
    time VARCHAR(50) NOT NULL,
    subject_code VARCHAR(10) NOT NULL,
    room VARCHAR(50) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    CONSTRAINT fk_routine_subject FOREIGN KEY (subject_code) 
        REFERENCES Subject(code) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================

-- Fast lookup for student login and credentials
CREATE INDEX idx_student_email ON Student(email);
-- Fast filtering of results by student and semester
CREATE INDEX idx_result_student_sem ON Result(student_id, semester_id);
-- Indexing assignments by deadline for order and date filter
CREATE INDEX idx_assignment_deadline ON Assignment(deadline);
-- Indexing notices by priority for notice board filtering
CREATE INDEX idx_notice_priority ON Notice(priority);
-- Indexing study materials by subject
CREATE INDEX idx_material_subject ON StudyMaterial(subject_code);
