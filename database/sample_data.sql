-- ============================================================
-- ACADEMIC MANAGEMENT PLATFORM — SAMPLE DATA (DML)
-- Metropolitan University, Sylhet — Department of CSE
-- ============================================================

USE academic_management;

-- 1. INSERT ADMINDATA
INSERT INTO Admin (id, name, email, password, role)
VALUES ('ADM001', 'Dr. Admin', 'admin@metrouni.edu.bd', 'admin123', 'admin');

-- 2. INSERT FACULTY MEMBERS
INSERT INTO Faculty (id, name, designation, dept, email, phone, education, office, photo)
VALUES 
('FAC001', 'Dr. Md. Rafiqul Islam', 'Professor & Head', 'CSE', 'rafiqul.islam@metrouni.edu.bd', '01711000001', 'PhD (Computer Science) — BUET', 'Room 301, CSE Building', NULL),
('FAC002', 'Md. Shahriar Hossain', 'Associate Professor', 'CSE', 'shahriar.hossain@metrouni.edu.bd', '01811000002', 'MSc (CS) — SUST', 'Room 305, CSE Building', NULL),
('FAC003', 'Farhana Akter', 'Assistant Professor', 'CSE', 'farhana.akter@metrouni.edu.bd', '01911000003', 'MSc (CS) — DU', 'Room 308, CSE Building', NULL),
('FAC004', 'Rezaul Karim', 'Assistant Professor', 'CSE', 'rezaul.karim@metrouni.edu.bd', '01611000004', 'MSc (IT) — KUET', 'Room 310, CSE Building', NULL),
('FAC005', 'Nasreen Sultana', 'Lecturer', 'CSE', 'nasreen.sultana@metrouni.edu.bd', '01511000005', 'BSc (CSE) — MU', 'Room 312, CSE Building', NULL),
('FAC006', 'Md. Jahirul Islam', 'Lecturer', 'CSE', 'jahirul.islam@metrouni.edu.bd', '01411000006', 'BSc (CSE) — MU', 'Room 315, CSE Building', NULL);

-- 3. INSERT STUDENTS
INSERT INTO Student (id, name, email, password, student_id, batch, section, dept, phone, role, registered_at)
VALUES 
('STU001', 'Arif Hossain', 'arif.hossain@student.metrouni.edu.bd', 'student123', '2021010061001', 61, 'F', 'CSE', '01711234567', 'student', '2024-01-15 00:00:00'),
('STU002', 'Sadia Islam', 'sadia.islam@student.metrouni.edu.bd', 'student123', '2021010061002', 61, 'F', 'CSE', '01812345678', 'student', '2024-01-15 00:00:00'),
('STU003', 'Rakibul Islam', 'rakibul.islam@student.metrouni.edu.bd', 'student123', '2021010061003', 61, 'F', 'CSE', '01913456789', 'student', '2024-01-15 00:00:00');

-- 4. INSERT SEMESTERS
INSERT INTO Semester (id, name, year)
VALUES
('SEM_1_1', 'Semester 1.1', 2022),
('SEM_1_2', 'Semester 1.2', 2022),
('SEM_1_3', 'Semester 1.3', 2023),
('SEM_2_1', 'Semester 2.1', 2023),
('SEM_2_2', 'Semester 2.2', 2024),
('SEM_2_3', 'Semester 2.3', 2024),
('SEM_3_1', 'Semester 3.1', 2025);

-- 5. INSERT ALL SUBJECTS (TO SUPPORT FOREIGN KEY IN RELATIONAL SCHEMA)
INSERT INTO Subject (code, name, credit, faculty_id)
VALUES
-- Semester 1.1 Subjects
('CSE101', 'Introduction to Programming', 3.00, 'FAC001'),
('CSE102', 'Discrete Mathematics', 3.00, 'FAC005'),
('CSE103', 'Digital Logic Design', 3.00, 'FAC006'),
('MAT101', 'Calculus', 3.00, NULL),
('ENG101', 'English Communication', 2.00, NULL),
('CSE104L', 'Programming Lab', 1.50, 'FAC001'),

-- Semester 1.2 Subjects
('CSE201', 'Object Oriented Programming', 3.00, 'FAC004'),
('CSE202', 'Data Structures', 3.00, 'FAC001'),
('CSE203', 'Computer Architecture', 3.00, 'FAC006'),
('MAT201', 'Linear Algebra', 3.00, NULL),
('PHY101', 'Physics', 3.00, NULL),
('CSE205L', 'OOP Lab', 1.50, 'FAC004'),

-- Semester 1.3 Subjects
('CSE211', 'Web Technology', 3.00, 'FAC004'),
('CSE212', 'Theory of Computation', 3.00, 'FAC005'),
('CSE213', 'Numerical Methods', 3.00, NULL),
('CSE214', 'Computer Graphics', 3.00, 'FAC004'),
('CSE215L', 'Web Tech Lab', 1.50, 'FAC004'),

-- Semester 2.1 Subjects
('CSE251', 'Microprocessors & Assembly', 3.00, 'FAC006'),
('CSE252', 'File Organization', 3.00, 'FAC002'),
('CSE253', 'System Analysis & Design', 3.00, 'FAC002'),
('CSE254', 'Statistics for CS', 3.00, NULL),
('CSE255L', 'Microprocessor Lab', 1.50, 'FAC006'),

-- Semester 2.2 Subjects
('CSE261', 'Artificial Intelligence', 3.00, 'FAC001'),
('CSE262', 'Compiler Design', 3.00, 'FAC005'),
('CSE263', 'Information Security', 3.00, 'FAC003'),
('CSE264', 'Technical Writing', 2.00, NULL),
('CSE265L', 'AI Lab', 1.50, 'FAC001'),

-- Semester 2.3 Subjects
('CSE271', 'Machine Learning', 3.00, 'FAC001'),
('CSE272', 'Mobile Application Dev', 3.00, 'FAC004'),
('CSE273', 'Parallel Computing', 3.00, 'FAC006'),
('CSE274', 'IoT & Embedded Systems', 3.00, 'FAC006'),
('CSE275L', 'ML Lab', 1.50, 'FAC001'),

-- Semester 3.1 Subjects
('CSE301', 'Database Management Systems', 3.00, 'FAC002'),
('CSE302', 'Operating Systems', 3.00, 'FAC003'),
('CSE303', 'Algorithm Design & Analysis', 3.00, 'FAC001'),
('CSE304', 'Computer Networks', 3.00, 'FAC003'),
('CSE305', 'Software Engineering', 3.00, 'FAC002'),
('CSE306L', 'DBMS Lab', 1.50, 'FAC002'),
('CSE307L', 'OS Lab', 1.50, 'FAC003');

-- 6. INSERT SEMESTER RESULTS FOR STU001 AND STU002
INSERT INTO Result (student_id, semester_id, subject_code, grade, grade_point)
VALUES
-- STU001 Results (Semesters 1.1 to 2.3)
('STU001', 'SEM_1_1', 'CSE101', 'A+', 4.00),
('STU001', 'SEM_1_1', 'CSE102', 'A', 3.75),
('STU001', 'SEM_1_1', 'CSE103', 'A-', 3.50),
('STU001', 'SEM_1_1', 'MAT101', 'B+', 3.25),
('STU001', 'SEM_1_1', 'ENG101', 'A', 3.75),
('STU001', 'SEM_1_1', 'CSE104L', 'A+', 4.00),

('STU001', 'SEM_1_2', 'CSE201', 'A+', 4.00),
('STU001', 'SEM_1_2', 'CSE202', 'A', 3.75),
('STU001', 'SEM_1_2', 'CSE203', 'A-', 3.50),
('STU001', 'SEM_1_2', 'MAT201', 'B+', 3.25),
('STU001', 'SEM_1_2', 'PHY101', 'B', 3.00),
('STU001', 'SEM_1_2', 'CSE205L', 'A+', 4.00),

('STU001', 'SEM_1_3', 'CSE211', 'A+', 4.00),
('STU001', 'SEM_1_3', 'CSE212', 'A-', 3.50),
('STU001', 'SEM_1_3', 'CSE213', 'B+', 3.25),
('STU001', 'SEM_1_3', 'CSE214', 'A', 3.75),
('STU001', 'SEM_1_3', 'CSE215L', 'A+', 4.00),

('STU001', 'SEM_2_1', 'CSE251', 'B+', 3.25),
('STU001', 'SEM_2_1', 'CSE252', 'A', 3.75),
('STU001', 'SEM_2_1', 'CSE253', 'A+', 4.00),
('STU001', 'SEM_2_1', 'CSE254', 'A-', 3.50),
('STU001', 'SEM_2_1', 'CSE255L', 'B+', 3.25),

('STU001', 'SEM_2_2', 'CSE261', 'A', 3.75),
('STU001', 'SEM_2_2', 'CSE262', 'B+', 3.25),
('STU001', 'SEM_2_2', 'CSE263', 'A+', 4.00),
('STU001', 'SEM_2_2', 'CSE264', 'A', 3.75),
('STU001', 'SEM_2_2', 'CSE265L', 'A-', 3.50),

('STU001', 'SEM_2_3', 'CSE271', 'A-', 3.50),
('STU001', 'SEM_2_3', 'CSE272', 'A+', 4.00),
('STU001', 'SEM_2_3', 'CSE273', 'B+', 3.25),
('STU001', 'SEM_2_3', 'CSE274', 'A', 3.75),
('STU001', 'SEM_2_3', 'CSE275L', 'A', 3.75),

-- STU002 Results (Semesters 1.1 to 2.3)
('STU002', 'SEM_1_1', 'CSE101', 'A', 3.75),
('STU002', 'SEM_1_1', 'CSE102', 'A-', 3.50),
('STU002', 'SEM_1_1', 'CSE103', 'B+', 3.25),
('STU002', 'SEM_1_1', 'MAT101', 'A', 3.75),
('STU002', 'SEM_1_1', 'ENG101', 'A+', 4.00),
('STU002', 'SEM_1_1', 'CSE104L', 'A', 3.75),

('STU002', 'SEM_1_2', 'CSE201', 'A-', 3.50),
('STU002', 'SEM_1_2', 'CSE202', 'A+', 4.00),
('STU002', 'SEM_1_2', 'CSE203', 'A', 3.75),
('STU002', 'SEM_1_2', 'MAT201', 'B+', 3.25),
('STU002', 'SEM_1_2', 'PHY101', 'B', 3.00),
('STU002', 'SEM_1_2', 'CSE205L', 'A', 3.75),

('STU002', 'SEM_1_3', 'CSE211', 'A', 3.75),
('STU002', 'SEM_1_3', 'CSE212', 'B+', 3.25),
('STU002', 'SEM_1_3', 'CSE213', 'A-', 3.50),
('STU002', 'SEM_1_3', 'CSE214', 'A', 3.75),
('STU002', 'SEM_1_3', 'CSE215L', 'A+', 4.00),

('STU002', 'SEM_2_1', 'CSE251', 'A', 3.75),
('STU002', 'SEM_2_1', 'CSE252', 'A-', 3.50),
('STU002', 'SEM_2_1', 'CSE253', 'A+', 4.00),
('STU002', 'SEM_2_1', 'CSE254', 'B+', 3.25),
('STU002', 'SEM_2_1', 'CSE255L', 'A-', 3.50),

('STU002', 'SEM_2_2', 'CSE261', 'A+', 4.00),
('STU002', 'SEM_2_2', 'CSE262', 'A', 3.75),
('STU002', 'SEM_2_2', 'CSE263', 'A-', 3.50),
('STU002', 'SEM_2_2', 'CSE264', 'A+', 4.00),
('STU002', 'SEM_2_2', 'CSE265L', 'A', 3.75),

('STU002', 'SEM_2_3', 'CSE271', 'A+', 4.00),
('STU002', 'SEM_2_3', 'CSE272', 'A', 3.75),
('STU002', 'SEM_2_3', 'CSE273', 'A-', 3.50),
('STU002', 'SEM_2_3', 'CSE274', 'B+', 3.25),
('STU002', 'SEM_2_3', 'CSE275L', 'A+', 4.00);

-- 7. INSERT NOTICES
INSERT INTO Notice (id, title, content, priority, category, posted_by, posted_at)
VALUES 
('NOT001', 'Mid-Term Examination Schedule — Semester 3.1', 'The mid-term examinations for Semester 3.1 (Batch 61, Section F) will commence from July 15, 2025. All students are advised to collect their admit cards from the department office by July 10, 2025. Bring your student ID on every exam day.', 'high', 'Exam', 'Admin', '2025-06-28 09:00:00'),
('NOT002', 'DBMS Project Submission Deadline Extended', 'Due to the upcoming Eid holiday, the DBMS project submission deadline has been extended from June 30 to July 5, 2025. Submit your project report in PDF format along with the GitHub/source code link.', 'high', 'Assignment', 'Md. Shahriar Hossain', '2025-06-25 11:30:00'),
('NOT003', 'Guest Lecture: AI & Machine Learning in Industry', 'A special guest lecture will be held on July 3, 2025 from 2:00 PM – 4:00 PM in the Seminar Hall. The speaker is Dr. Tanvir Ahmed (Google DeepMind, UK). All CSE students are encouraged to attend. Attendance will be marked.', 'medium', 'Event', 'Admin', '2025-06-22 14:00:00'),
('NOT004', 'University Closed — Eid-ul-Adha Holiday', 'Metropolitan University will remain closed from June 16–21, 2025 on the occasion of Eid-ul-Adha. Regular classes will resume from June 22, 2025. Eid Mubarak to all students and faculty!', 'medium', 'Holiday', 'Admin', '2025-06-10 08:00:00'),
('NOT005', 'Class Routine Update for Section F', 'The Operating Systems class on Wednesday (11:00 AM slot) has been shifted to Thursday 9:30 AM slot effective from July 1, 2025. Please update your routine accordingly.', 'low', 'Routine', 'Farhana Akter', '2025-06-08 10:00:00'),
('NOT006', 'Library Book Return Reminder', 'All students who have borrowed books from the university library must return them by June 30, 2025 to avoid a fine. Failure to return will result in a hold on your semester registration.', 'low', 'General', 'Admin', '2025-06-05 09:00:00');

-- 8. INSERT ASSIGNMENTS
INSERT INTO Assignment (id, title, subject_code, description, deadline, total_marks, submission_type, posted_at, faculty_id)
VALUES
('ASN001', 'ER Diagram & Relational Schema Design', 'CSE301', 'Design a complete ER diagram for a Hospital Management System. Convert it into relational schema and normalize up to 3NF. Submit as PDF.', '2025-07-05 23:59:00', 20, 'pdf', '2025-06-20 09:00:00', 'FAC002'),
('ASN002', 'Process Scheduling Simulation', 'CSE302', 'Implement CPU scheduling algorithms (FCFS, SJF, Round Robin, Priority) in C/C++ and compare them using Gantt charts. Submit source code + report PDF.', '2025-07-08 23:59:00', 25, 'pdf+code', '2025-06-22 10:00:00', 'FAC003'),
('ASN003', 'Graph Algorithm Implementation', 'CSE303', 'Implement Dijkstra''s and Bellman-Ford algorithms. Analyze time complexity and compare performance with different graph inputs.', '2025-07-12 23:59:00', 20, 'pdf+code', '2025-06-25 08:00:00', 'FAC001'),
('ASN004', 'Network Protocol Analysis using Wireshark', 'CSE304', 'Capture and analyze network packets using Wireshark. Identify TCP, UDP, HTTP, DNS protocols and explain the handshaking process.', '2025-07-15 23:59:00', 15, 'pdf', '2025-06-28 11:00:00', 'FAC003'),
('ASN005', 'Software Requirements Specification (SRS)', 'CSE305', 'Write a complete SRS document for a Library Management System following IEEE 830 standards. Include use case diagrams, DFD, and system architecture.', '2025-07-20 23:59:00', 30, 'pdf', '2025-06-30 09:00:00', 'FAC002');

-- 9. INSERT STUDY MATERIALS
INSERT INTO StudyMaterial (id, title, subject_code, semester_id, type, file_type, url, file_name, size, uploaded_by, uploaded_at)
VALUES
('MAT001', 'DBMS — Chapter 1-5 Lecture Slides', 'CSE301', 'SEM_3_1', 'slide', 'pdf', NULL, 'DBMS_Ch1-5_Slides.pdf', '4.2 MB', 'Md. Shahriar Hossain', '2025-06-01 09:00:00'),
('MAT002', 'Operating Systems — Silberschatz Textbook (PDF)', 'CSE302', 'SEM_3_1', 'book', 'pdf', NULL, 'OS_Silberschatz_10th.pdf', '12.8 MB', 'Farhana Akter', '2025-06-03 10:00:00'),
('MAT003', 'Algorithm Design — CLRS Reference Notes', 'CSE303', 'SEM_3_1', 'notes', 'pdf', NULL, 'Algorithm_CLRS_Notes.pdf', '6.5 MB', 'Dr. Md. Rafiqul Islam', '2025-06-05 11:00:00'),
('MAT004', 'Computer Networks — Tanenbaum Summary', 'CSE304', 'SEM_3_1', 'notes', 'pdf', NULL, 'Networks_Tanenbaum_Summary.pdf', '3.8 MB', 'Farhana Akter', '2025-06-07 09:00:00'),
('MAT005', 'SE — UML Diagrams & Design Patterns Slides', 'CSE305', 'SEM_3_1', 'slide', 'pdf', NULL, 'SE_UML_DesignPatterns.pdf', '5.1 MB', 'Md. Shahriar Hossain', '2025-06-10 10:00:00'),
('MAT006', 'DBMS Lab Manual — MySQL Exercises', 'CSE306L', 'SEM_3_1', 'lab', 'pdf', NULL, 'DBMS_Lab_Manual.pdf', '2.3 MB', 'Md. Shahriar Hossain', '2025-06-12 09:00:00'),
('MAT007', 'SQL Tutorial — W3Schools Reference', 'CSE301', 'SEM_3_1', 'link', 'link', 'https://www.w3schools.com/sql/', NULL, NULL, 'Md. Shahriar Hossain', '2025-06-15 08:00:00');

-- 10. INSERT QUESTIONS (QUESTION BANK)
INSERT INTO QuestionBank (id, subject_code, year, exam_type, questions, uploaded_by, uploaded_at)
VALUES
('QSN001', 'CSE301', 2024, 'Final', 
 '["Explain the three levels of data abstraction in DBMS with a diagram.", "What is normalization? Explain 1NF, 2NF, and 3NF with examples.", "Differentiate between DDL and DML with appropriate examples.", "Explain ACID properties of database transactions.", "What is a foreign key? How does it enforce referential integrity?"]',
 'Md. Shahriar Hossain', '2025-01-15 09:00:00'),
('QSN002', 'CSE301', 2024, 'Mid', 
 '["Define DBMS. Explain its advantages over file system.", "Draw an ER diagram for a University Management System.", "Explain the concept of keys: super key, candidate key, primary key.", "What is SQL? Write SQL queries to create and insert into a table."]',
 'Md. Shahriar Hossain', '2025-01-16 10:00:00'),
('QSN003', 'CSE302', 2024, 'Final', 
 '["Explain the process life cycle with state transition diagram.", "Compare preemptive and non-preemptive scheduling algorithms.", "What is deadlock? Explain Banker''s algorithm for deadlock avoidance.", "Explain virtual memory and demand paging mechanism.", "Compare contiguous and non-contiguous memory allocation."]',
 'Farhana Akter', '2025-01-20 09:00:00'),
('QSN004', 'CSE303', 2024, 'Mid', 
 '["Explain Big-O, Big-Omega, and Big-Theta notations.", "Derive the time complexity of Merge Sort using recurrence relation.", "Explain the divide and conquer strategy with an example.", "Compare greedy algorithm and dynamic programming approaches."]',
 'Dr. Md. Rafiqul Islam', '2025-02-01 08:00:00');

-- 11. INSERT CLASS ROUTINE
INSERT INTO ClassRoutine (day, time, subject_code, room, faculty, color)
VALUES
('Sunday', '08:00 - 09:30', 'CSE301', 'Room 201', 'Md. Shahriar Hossain', 'primary'),
('Sunday', '09:30 - 11:00', 'CSE303', 'Room 201', 'Dr. Md. Rafiqul Islam', 'purple'),
('Sunday', '11:00 - 12:30', 'CSE306L', 'Lab 101', 'Md. Shahriar Hossain', 'accent'),
('Monday', '08:00 - 09:30', 'CSE302', 'Room 202', 'Farhana Akter', 'green'),
('Monday', '09:30 - 11:00', 'CSE304', 'Room 202', 'Farhana Akter', 'teal'),
('Monday', '02:00 - 04:00', 'CSE307L', 'Lab 102', 'Farhana Akter', 'green'),
('Tuesday', '08:00 - 09:30', 'CSE305', 'Room 203', 'Md. Shahriar Hossain', 'yellow'),
('Tuesday', '09:30 - 11:00', 'CSE301', 'Room 201', 'Md. Shahriar Hossain', 'primary'),
('Wednesday', '08:00 - 09:30', 'CSE303', 'Room 201', 'Dr. Md. Rafiqul Islam', 'purple'),
('Wednesday', '09:30 - 11:00', 'CSE304', 'Room 202', 'Farhana Akter', 'teal'),
('Wednesday', '11:00 - 12:30', 'CSE305', 'Room 203', 'Md. Shahriar Hossain', 'yellow'),
('Thursday', '08:00 - 09:30', 'CSE302', 'Room 202', 'Farhana Akter', 'green'),
('Thursday', '09:30 - 11:00', 'CSE303', 'Room 201', 'Dr. Md. Rafiqul Islam', 'purple');

