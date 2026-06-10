// ============================================================
// MOCK DATA — Metropolitan University, Sylhet — CSE Dept
// Batch 61 | Section F | Tri-Semester System
// ============================================================

// ---------- GRADING SCALE (Bangladesh UGC) ----------
export const GRADE_SCALE = [
  { grade: 'A+',  point: 4.00, minMark: 80 },
  { grade: 'A',   point: 3.75, minMark: 75 },
  { grade: 'A-',  point: 3.50, minMark: 70 },
  { grade: 'B+',  point: 3.25, minMark: 65 },
  { grade: 'B',   point: 3.00, minMark: 60 },
  { grade: 'B-',  point: 2.75, minMark: 55 },
  { grade: 'C+',  point: 2.50, minMark: 50 },
  { grade: 'C',   point: 2.25, minMark: 45 },
  { grade: 'D',   point: 2.00, minMark: 40 },
  { grade: 'F',   point: 0.00, minMark: 0  },
];

export const getGradeFromMark = (mark) => {
  for (const g of GRADE_SCALE) {
    if (mark >= g.minMark) return g;
  }
  return GRADE_SCALE[GRADE_SCALE.length - 1];
};

export const getGradeFromLetter = (letter) => {
  return GRADE_SCALE.find(g => g.grade === letter) || GRADE_SCALE[GRADE_SCALE.length - 1];
};

// ---------- USERS ----------
export const ADMIN_CREDENTIALS = {
  email: 'admin@metrouni.edu.bd',
  password: 'admin123',
  name: 'Dr. Admin',
  role: 'admin',
};

export const INITIAL_STUDENTS = [
  {
    id: 'STU001',
    name: 'Arif Hossain',
    email: 'arif.hossain@student.metrouni.edu.bd',
    password: 'student123',
    studentId: '2021010061001',
    batch: 61,
    section: 'F',
    dept: 'CSE',
    phone: '01711234567',
    role: 'student',
    registeredAt: '2024-01-15',
  },
  {
    id: 'STU002',
    name: 'Sadia Islam',
    email: 'sadia.islam@student.metrouni.edu.bd',
    password: 'student123',
    studentId: '2021010061002',
    batch: 61,
    section: 'F',
    dept: 'CSE',
    phone: '01812345678',
    role: 'student',
    registeredAt: '2024-01-15',
  },
  {
    id: 'STU003',
    name: 'Rakibul Islam',
    email: 'rakibul.islam@student.metrouni.edu.bd',
    password: 'student123',
    studentId: '2021010061003',
    batch: 61,
    section: 'F',
    dept: 'CSE',
    phone: '01913456789',
    role: 'student',
    registeredAt: '2024-01-15',
  },
];

// ---------- FACULTY ----------
export const INITIAL_FACULTY = [
  {
    id: 'FAC001',
    name: 'Dr. Md. Rafiqul Islam',
    designation: 'Professor & Head',
    dept: 'CSE',
    email: 'rafiqul.islam@metrouni.edu.bd',
    phone: '01711000001',
    subjects: ['Data Structures', 'Algorithm Design'],
    education: 'PhD (Computer Science) — BUET',
    office: 'Room 301, CSE Building',
    photo: null,
  },
  {
    id: 'FAC002',
    name: 'Md. Shahriar Hossain',
    designation: 'Associate Professor',
    dept: 'CSE',
    email: 'shahriar.hossain@metrouni.edu.bd',
    phone: '01811000002',
    subjects: ['Database Management Systems', 'Software Engineering'],
    education: 'MSc (CS) — SUST',
    office: 'Room 305, CSE Building',
    photo: null,
  },
  {
    id: 'FAC003',
    name: 'Farhana Akter',
    designation: 'Assistant Professor',
    dept: 'CSE',
    email: 'farhana.akter@metrouni.edu.bd',
    phone: '01911000003',
    subjects: ['Operating Systems', 'Computer Networks'],
    education: 'MSc (CS) — DU',
    office: 'Room 308, CSE Building',
    photo: null,
  },
  {
    id: 'FAC004',
    name: 'Rezaul Karim',
    designation: 'Assistant Professor',
    dept: 'CSE',
    email: 'rezaul.karim@metrouni.edu.bd',
    phone: '01611000004',
    subjects: ['Web Technology', 'Mobile Application Development'],
    education: 'MSc (IT) — KUET',
    office: 'Room 310, CSE Building',
    photo: null,
  },
  {
    id: 'FAC005',
    name: 'Nasreen Sultana',
    designation: 'Lecturer',
    dept: 'CSE',
    email: 'nasreen.sultana@metrouni.edu.bd',
    phone: '01511000005',
    subjects: ['Discrete Mathematics', 'Theory of Computation'],
    education: 'BSc (CSE) — MU',
    office: 'Room 312, CSE Building',
    photo: null,
  },
  {
    id: 'FAC006',
    name: 'Md. Jahirul Islam',
    designation: 'Lecturer',
    dept: 'CSE',
    email: 'jahirul.islam@metrouni.edu.bd',
    phone: '01411000006',
    subjects: ['Digital Logic Design', 'Computer Architecture'],
    education: 'BSc (CSE) — MU',
    office: 'Room 315, CSE Building',
    photo: null,
  },
];

// ---------- SUBJECTS (Semester 3.1) ----------
export const CURRENT_SUBJECTS = [
  { code: 'CSE301', name: 'Database Management Systems', credit: 3, faculty: 'FAC002' },
  { code: 'CSE302', name: 'Operating Systems', credit: 3, faculty: 'FAC003' },
  { code: 'CSE303', name: 'Algorithm Design & Analysis', credit: 3, faculty: 'FAC001' },
  { code: 'CSE304', name: 'Computer Networks', credit: 3, faculty: 'FAC003' },
  { code: 'CSE305', name: 'Software Engineering', credit: 3, faculty: 'FAC002' },
  { code: 'CSE306L', name: 'DBMS Lab', credit: 1.5, faculty: 'FAC002' },
  { code: 'CSE307L', name: 'OS Lab', credit: 1.5, faculty: 'FAC003' },
];

// ---------- CLASS ROUTINE (Semester 3.1, Section F) ----------
export const CLASS_ROUTINE = {
  Sunday: [
    { time: '08:00 - 09:30', subject: 'Database Management Systems', code: 'CSE301', room: 'Room 201', faculty: 'Md. Shahriar Hossain', color: 'primary' },
    { time: '09:30 - 11:00', subject: 'Algorithm Design & Analysis', code: 'CSE303', room: 'Room 201', faculty: 'Dr. Md. Rafiqul Islam', color: 'purple' },
    { time: '11:00 - 12:30', subject: 'DBMS Lab', code: 'CSE306L', room: 'Lab 101', faculty: 'Md. Shahriar Hossain', color: 'accent' },
  ],
  Monday: [
    { time: '08:00 - 09:30', subject: 'Operating Systems', code: 'CSE302', room: 'Room 202', faculty: 'Farhana Akter', color: 'green' },
    { time: '09:30 - 11:00', subject: 'Computer Networks', code: 'CSE304', room: 'Room 202', faculty: 'Farhana Akter', color: 'teal' },
    { time: '02:00 - 04:00', subject: 'OS Lab', code: 'CSE307L', room: 'Lab 102', faculty: 'Farhana Akter', color: 'green' },
  ],
  Tuesday: [
    { time: '08:00 - 09:30', subject: 'Software Engineering', code: 'CSE305', room: 'Room 203', faculty: 'Md. Shahriar Hossain', color: 'yellow' },
    { time: '09:30 - 11:00', subject: 'Database Management Systems', code: 'CSE301', room: 'Room 201', faculty: 'Md. Shahriar Hossain', color: 'primary' },
  ],
  Wednesday: [
    { time: '08:00 - 09:30', subject: 'Algorithm Design & Analysis', code: 'CSE303', room: 'Room 201', faculty: 'Dr. Md. Rafiqul Islam', color: 'purple' },
    { time: '09:30 - 11:00', subject: 'Computer Networks', code: 'CSE304', room: 'Room 202', faculty: 'Farhana Akter', color: 'teal' },
    { time: '11:00 - 12:30', subject: 'Software Engineering', code: 'CSE305', room: 'Room 203', faculty: 'Md. Shahriar Hossain', color: 'yellow' },
  ],
  Thursday: [
    { time: '08:00 - 09:30', subject: 'Operating Systems', code: 'CSE302', room: 'Room 202', faculty: 'Farhana Akter', color: 'green' },
    { time: '09:30 - 11:00', subject: 'Algorithm Design & Analysis', code: 'CSE303', room: 'Room 201', faculty: 'Dr. Md. Rafiqul Islam', color: 'purple' },
  ],
};

// ---------- NOTICES ----------
export const INITIAL_NOTICES = [
  {
    id: 'NOT001',
    title: 'Mid-Term Examination Schedule — Semester 3.1',
    content: 'The mid-term examinations for Semester 3.1 (Batch 61, Section F) will commence from July 15, 2025. All students are advised to collect their admit cards from the department office by July 10, 2025. Bring your student ID on every exam day.',
    priority: 'high',
    category: 'Exam',
    postedBy: 'Admin',
    postedAt: '2025-06-28T09:00:00Z',
    isNew: true,
  },
  {
    id: 'NOT002',
    title: 'DBMS Project Submission Deadline Extended',
    content: 'Due to the upcoming Eid holiday, the DBMS project submission deadline has been extended from June 30 to July 5, 2025. Submit your project report in PDF format along with the GitHub/source code link.',
    priority: 'high',
    category: 'Assignment',
    postedBy: 'Md. Shahriar Hossain',
    postedAt: '2025-06-25T11:30:00Z',
    isNew: true,
  },
  {
    id: 'NOT003',
    title: 'Guest Lecture: AI & Machine Learning in Industry',
    content: 'A special guest lecture will be held on July 3, 2025 from 2:00 PM – 4:00 PM in the Seminar Hall. The speaker is Dr. Tanvir Ahmed (Google DeepMind, UK). All CSE students are encouraged to attend. Attendance will be marked.',
    priority: 'medium',
    category: 'Event',
    postedBy: 'Admin',
    postedAt: '2025-06-22T14:00:00Z',
    isNew: false,
  },
  {
    id: 'NOT004',
    title: 'University Closed — Eid-ul-Adha Holiday',
    content: 'Metropolitan University will remain closed from June 16–21, 2025 on the occasion of Eid-ul-Adha. Regular classes will resume from June 22, 2025. Eid Mubarak to all students and faculty!',
    priority: 'medium',
    category: 'Holiday',
    postedBy: 'Admin',
    postedAt: '2025-06-10T08:00:00Z',
    isNew: false,
  },
  {
    id: 'NOT005',
    title: 'Class Routine Update for Section F',
    content: 'The Operating Systems class on Wednesday (11:00 AM slot) has been shifted to Thursday 9:30 AM slot effective from July 1, 2025. Please update your routine accordingly.',
    priority: 'low',
    category: 'Routine',
    postedBy: 'Farhana Akter',
    postedAt: '2025-06-08T10:00:00Z',
    isNew: false,
  },
  {
    id: 'NOT006',
    title: 'Library Book Return Reminder',
    content: 'All students who have borrowed books from the university library must return them by June 30, 2025 to avoid a fine. Failure to return will result in a hold on your semester registration.',
    priority: 'low',
    category: 'General',
    postedBy: 'Admin',
    postedAt: '2025-06-05T09:00:00Z',
    isNew: false,
  },
];

// ---------- ASSIGNMENTS ----------
export const INITIAL_ASSIGNMENTS = [
  {
    id: 'ASN001',
    title: 'ER Diagram & Relational Schema Design',
    subject: 'Database Management Systems',
    subjectCode: 'CSE301',
    description: 'Design a complete ER diagram for a Hospital Management System. Convert it into relational schema and normalize up to 3NF. Submit as PDF.',
    deadline: '2025-07-05T23:59:00Z',
    totalMarks: 20,
    submissionType: 'pdf',
    submittedBy: [],
    postedAt: '2025-06-20T09:00:00Z',
    faculty: 'Md. Shahriar Hossain',
  },
  {
    id: 'ASN002',
    title: 'Process Scheduling Simulation',
    subject: 'Operating Systems',
    subjectCode: 'CSE302',
    description: 'Implement CPU scheduling algorithms (FCFS, SJF, Round Robin, Priority) in C/C++ and compare them using Gantt charts. Submit source code + report PDF.',
    deadline: '2025-07-08T23:59:00Z',
    totalMarks: 25,
    submissionType: 'pdf+code',
    submittedBy: [],
    postedAt: '2025-06-22T10:00:00Z',
    faculty: 'Farhana Akter',
  },
  {
    id: 'ASN003',
    title: 'Graph Algorithm Implementation',
    subject: 'Algorithm Design & Analysis',
    subjectCode: 'CSE303',
    description: 'Implement Dijkstra\'s and Bellman-Ford algorithms. Analyze time complexity and compare performance with different graph inputs.',
    deadline: '2025-07-12T23:59:00Z',
    totalMarks: 20,
    submissionType: 'pdf+code',
    submittedBy: [],
    postedAt: '2025-06-25T08:00:00Z',
    faculty: 'Dr. Md. Rafiqul Islam',
  },
  {
    id: 'ASN004',
    title: 'Network Protocol Analysis using Wireshark',
    subject: 'Computer Networks',
    subjectCode: 'CSE304',
    description: 'Capture and analyze network packets using Wireshark. Identify TCP, UDP, HTTP, DNS protocols and explain the handshaking process.',
    deadline: '2025-07-15T23:59:00Z',
    totalMarks: 15,
    submissionType: 'pdf',
    submittedBy: [],
    postedAt: '2025-06-28T11:00:00Z',
    faculty: 'Farhana Akter',
  },
  {
    id: 'ASN005',
    title: 'Software Requirements Specification (SRS)',
    subject: 'Software Engineering',
    subjectCode: 'CSE305',
    description: 'Write a complete SRS document for a Library Management System following IEEE 830 standards. Include use case diagrams, DFD, and system architecture.',
    deadline: '2025-07-20T23:59:00Z',
    totalMarks: 30,
    submissionType: 'pdf',
    submittedBy: [],
    postedAt: '2025-06-30T09:00:00Z',
    faculty: 'Md. Shahriar Hossain',
  },
];

// ---------- STUDY MATERIALS ----------
export const INITIAL_MATERIALS = [
  {
    id: 'MAT001',
    title: 'DBMS — Chapter 1-5 Lecture Slides',
    subject: 'Database Management Systems',
    subjectCode: 'CSE301',
    semester: '3.1',
    type: 'slide',
    fileType: 'pdf',
    url: null,
    fileName: 'DBMS_Ch1-5_Slides.pdf',
    uploadedBy: 'Md. Shahriar Hossain',
    uploadedAt: '2025-06-01T09:00:00Z',
    size: '4.2 MB',
  },
  {
    id: 'MAT002',
    title: 'Operating Systems — Silberschatz Textbook (PDF)',
    subject: 'Operating Systems',
    subjectCode: 'CSE302',
    semester: '3.1',
    type: 'book',
    fileType: 'pdf',
    url: null,
    fileName: 'OS_Silberschatz_10th.pdf',
    uploadedBy: 'Farhana Akter',
    uploadedAt: '2025-06-03T10:00:00Z',
    size: '12.8 MB',
  },
  {
    id: 'MAT003',
    title: 'Algorithm Design — CLRS Reference Notes',
    subject: 'Algorithm Design & Analysis',
    subjectCode: 'CSE303',
    semester: '3.1',
    type: 'notes',
    fileType: 'pdf',
    url: null,
    fileName: 'Algorithm_CLRS_Notes.pdf',
    uploadedBy: 'Dr. Md. Rafiqul Islam',
    uploadedAt: '2025-06-05T11:00:00Z',
    size: '6.5 MB',
  },
  {
    id: 'MAT004',
    title: 'Computer Networks — Tanenbaum Summary',
    subject: 'Computer Networks',
    subjectCode: 'CSE304',
    semester: '3.1',
    type: 'notes',
    fileType: 'pdf',
    url: null,
    fileName: 'Networks_Tanenbaum_Summary.pdf',
    uploadedBy: 'Farhana Akter',
    uploadedAt: '2025-06-07T09:00:00Z',
    size: '3.8 MB',
  },
  {
    id: 'MAT005',
    title: 'SE — UML Diagrams & Design Patterns Slides',
    subject: 'Software Engineering',
    subjectCode: 'CSE305',
    semester: '3.1',
    type: 'slide',
    fileType: 'pdf',
    url: null,
    fileName: 'SE_UML_DesignPatterns.pdf',
    uploadedBy: 'Md. Shahriar Hossain',
    uploadedAt: '2025-06-10T10:00:00Z',
    size: '5.1 MB',
  },
  {
    id: 'MAT006',
    title: 'DBMS Lab Manual — MySQL Exercises',
    subject: 'DBMS Lab',
    subjectCode: 'CSE306L',
    semester: '3.1',
    type: 'lab',
    fileType: 'pdf',
    url: null,
    fileName: 'DBMS_Lab_Manual.pdf',
    uploadedBy: 'Md. Shahriar Hossain',
    uploadedAt: '2025-06-12T09:00:00Z',
    size: '2.3 MB',
  },
  {
    id: 'MAT007',
    title: 'SQL Tutorial — W3Schools Reference',
    subject: 'Database Management Systems',
    subjectCode: 'CSE301',
    semester: '3.1',
    type: 'link',
    fileType: 'link',
    url: 'https://www.w3schools.com/sql/',
    fileName: null,
    uploadedBy: 'Md. Shahriar Hossain',
    uploadedAt: '2025-06-15T08:00:00Z',
    size: null,
  },
];

// ---------- QUESTION BANK ----------
export const INITIAL_QUESTIONS = [
  {
    id: 'QSN001',
    subject: 'Database Management Systems',
    subjectCode: 'CSE301',
    year: '2024',
    examType: 'Final',
    semester: '3.1',
    questions: [
      'Explain the three levels of data abstraction in DBMS with a diagram.',
      'What is normalization? Explain 1NF, 2NF, and 3NF with examples.',
      'Differentiate between DDL and DML with appropriate examples.',
      'Explain ACID properties of database transactions.',
      'What is a foreign key? How does it enforce referential integrity?',
    ],
    uploadedBy: 'Md. Shahriar Hossain',
    uploadedAt: '2025-01-15T09:00:00Z',
    fileUrl: null,
    fileName: null,
  },
  {
    id: 'QSN002',
    subject: 'Database Management Systems',
    subjectCode: 'CSE301',
    year: '2024',
    examType: 'Mid',
    semester: '2.3',
    questions: [
      'Define DBMS. Explain its advantages over file system.',
      'Draw an ER diagram for a University Management System.',
      'Explain the concept of keys: super key, candidate key, primary key.',
      'What is SQL? Write SQL queries to create and insert into a table.',
    ],
    uploadedBy: 'Md. Shahriar Hossain',
    uploadedAt: '2025-01-16T10:00:00Z',
    fileUrl: null,
    fileName: null,
  },
  {
    id: 'QSN003',
    subject: 'Operating Systems',
    subjectCode: 'CSE302',
    year: '2024',
    examType: 'Final',
    semester: '3.1',
    questions: [
      'Explain the process life cycle with state transition diagram.',
      'Compare preemptive and non-preemptive scheduling algorithms.',
      'What is deadlock? Explain Banker\'s algorithm for deadlock avoidance.',
      'Explain virtual memory and demand paging mechanism.',
      'Compare contiguous and non-contiguous memory allocation.',
    ],
    uploadedBy: 'Farhana Akter',
    uploadedAt: '2025-01-20T09:00:00Z',
    fileUrl: null,
    fileName: null,
  },
  {
    id: 'QSN004',
    subject: 'Algorithm Design & Analysis',
    subjectCode: 'CSE303',
    year: '2024',
    examType: 'Mid',
    semester: '3.1',
    questions: [
      'Explain Big-O, Big-Omega, and Big-Theta notations.',
      'Derive the time complexity of Merge Sort using recurrence relation.',
      'Explain the divide and conquer strategy with an example.',
      'Compare greedy algorithm and dynamic programming approaches.',
    ],
    uploadedBy: 'Dr. Md. Rafiqul Islam',
    uploadedAt: '2025-02-01T08:00:00Z',
    fileUrl: null,
    fileName: null,
  },
];

// ---------- SEMESTER RESULTS ----------
export const INITIAL_RESULTS = [
  {
    semesterId: 'SEM_1_1',
    semesterName: 'Semester 1.1',
    year: '2022',
    studentResults: {
      STU001: [
        { subjectCode: 'CSE101', subjectName: 'Introduction to Programming', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE102', subjectName: 'Discrete Mathematics', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE103', subjectName: 'Digital Logic Design', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'MAT101', subjectName: 'Calculus', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'ENG101', subjectName: 'English Communication', credit: 2, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE104L', subjectName: 'Programming Lab', credit: 1.5, grade: 'A+', gradePoint: 4.00 },
      ],
      STU002: [
        { subjectCode: 'CSE101', subjectName: 'Introduction to Programming', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE102', subjectName: 'Discrete Mathematics', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'CSE103', subjectName: 'Digital Logic Design', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'MAT101', subjectName: 'Calculus', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'ENG101', subjectName: 'English Communication', credit: 2, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE104L', subjectName: 'Programming Lab', credit: 1.5, grade: 'A', gradePoint: 3.75 },
      ],
    },
  },
  {
    semesterId: 'SEM_1_2',
    semesterName: 'Semester 1.2',
    year: '2022',
    studentResults: {
      STU001: [
        { subjectCode: 'CSE201', subjectName: 'Object Oriented Programming', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE202', subjectName: 'Data Structures', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE203', subjectName: 'Computer Architecture', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'MAT201', subjectName: 'Linear Algebra', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'PHY101', subjectName: 'Physics', credit: 3, grade: 'B', gradePoint: 3.00 },
        { subjectCode: 'CSE205L', subjectName: 'OOP Lab', credit: 1.5, grade: 'A+', gradePoint: 4.00 },
      ],
      STU002: [
        { subjectCode: 'CSE201', subjectName: 'Object Oriented Programming', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'CSE202', subjectName: 'Data Structures', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE203', subjectName: 'Computer Architecture', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'MAT201', subjectName: 'Linear Algebra', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'PHY101', subjectName: 'Physics', credit: 3, grade: 'B', gradePoint: 3.00 },
        { subjectCode: 'CSE205L', subjectName: 'OOP Lab', credit: 1.5, grade: 'A', gradePoint: 3.75 },
      ],
    },
  },
  {
    semesterId: 'SEM_1_3',
    semesterName: 'Semester 1.3',
    year: '2023',
    studentResults: {
      STU001: [
        { subjectCode: 'CSE211', subjectName: 'Web Technology', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE212', subjectName: 'Theory of Computation', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'CSE213', subjectName: 'Numerical Methods', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'CSE214', subjectName: 'Computer Graphics', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE215L', subjectName: 'Web Tech Lab', credit: 1.5, grade: 'A+', gradePoint: 4.00 },
      ],
      STU002: [
        { subjectCode: 'CSE211', subjectName: 'Web Technology', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE212', subjectName: 'Theory of Computation', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'CSE213', subjectName: 'Numerical Methods', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'CSE214', subjectName: 'Computer Graphics', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE215L', subjectName: 'Web Tech Lab', credit: 1.5, grade: 'A+', gradePoint: 4.00 },
      ],
    },
  },
  {
    semesterId: 'SEM_2_1',
    semesterName: 'Semester 2.1',
    year: '2023',
    studentResults: {
      STU001: [
        { subjectCode: 'CSE251', subjectName: 'Microprocessors & Assembly', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'CSE252', subjectName: 'File Organization', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE253', subjectName: 'System Analysis & Design', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE254', subjectName: 'Statistics for CS', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'CSE255L', subjectName: 'Microprocessor Lab', credit: 1.5, grade: 'B+', gradePoint: 3.25 },
      ],
      STU002: [
        { subjectCode: 'CSE251', subjectName: 'Microprocessors & Assembly', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE252', subjectName: 'File Organization', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'CSE253', subjectName: 'System Analysis & Design', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE254', subjectName: 'Statistics for CS', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'CSE255L', subjectName: 'Microprocessor Lab', credit: 1.5, grade: 'A-', gradePoint: 3.50 },
      ],
    },
  },
  {
    semesterId: 'SEM_2_2',
    semesterName: 'Semester 2.2',
    year: '2024',
    studentResults: {
      STU001: [
        { subjectCode: 'CSE261', subjectName: 'Artificial Intelligence', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE262', subjectName: 'Compiler Design', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'CSE263', subjectName: 'Information Security', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE264', subjectName: 'Technical Writing', credit: 2, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE265L', subjectName: 'AI Lab', credit: 1.5, grade: 'A-', gradePoint: 3.50 },
      ],
      STU002: [
        { subjectCode: 'CSE261', subjectName: 'Artificial Intelligence', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE262', subjectName: 'Compiler Design', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE263', subjectName: 'Information Security', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'CSE264', subjectName: 'Technical Writing', credit: 2, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE265L', subjectName: 'AI Lab', credit: 1.5, grade: 'A', gradePoint: 3.75 },
      ],
    },
  },
  {
    semesterId: 'SEM_2_3',
    semesterName: 'Semester 2.3',
    year: '2024',
    studentResults: {
      STU001: [
        { subjectCode: 'CSE271', subjectName: 'Machine Learning', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'CSE272', subjectName: 'Mobile Application Dev', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE273', subjectName: 'Parallel Computing', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'CSE274', subjectName: 'IoT & Embedded Systems', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE275L', subjectName: 'ML Lab', credit: 1.5, grade: 'A', gradePoint: 3.75 },
      ],
      STU002: [
        { subjectCode: 'CSE271', subjectName: 'Machine Learning', credit: 3, grade: 'A+', gradePoint: 4.00 },
        { subjectCode: 'CSE272', subjectName: 'Mobile Application Dev', credit: 3, grade: 'A', gradePoint: 3.75 },
        { subjectCode: 'CSE273', subjectName: 'Parallel Computing', credit: 3, grade: 'A-', gradePoint: 3.50 },
        { subjectCode: 'CSE274', subjectName: 'IoT & Embedded Systems', credit: 3, grade: 'B+', gradePoint: 3.25 },
        { subjectCode: 'CSE275L', subjectName: 'ML Lab', credit: 1.5, grade: 'A+', gradePoint: 4.00 },
      ],
    },
  },
];

// ---------- UTILITY: Calculate GPA ----------
export const calculateGPA = (results) => {
  if (!results || results.length === 0) return 0;
  const totalPoints = results.reduce((sum, r) => sum + r.gradePoint * r.credit, 0);
  const totalCredits = results.reduce((sum, r) => sum + r.credit, 0);
  return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
};

// ---------- UTILITY: Calculate CGPA ----------
export const calculateCGPA = (allSemesterResults) => {
  if (!allSemesterResults || allSemesterResults.length === 0) return 0;
  let totalPoints = 0;
  let totalCredits = 0;
  allSemesterResults.forEach(semResults => {
    semResults.forEach(r => {
      totalPoints += r.gradePoint * r.credit;
      totalCredits += r.credit;
    });
  });
  return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
};
