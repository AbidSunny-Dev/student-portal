import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Helper to verify passwords (supports both bcrypt and legacy plain-text check)
function verifyPassword(plainText, dbPassword) {
  if (dbPassword.startsWith('$2a$') || dbPassword.startsWith('$2b$')) {
    return bcrypt.compareSync(plainText, dbPassword);
  }
  return plainText === dbPassword;
}

// -------------------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check Admin Table
    const [admins] = await db.query('SELECT * FROM Admin WHERE email = ?', [email]);
    if (admins.length > 0) {
      const admin = admins[0];
      if (verifyPassword(password, admin.password)) {
        const { password, ...userWithoutPassword } = admin;
        return res.json({ success: true, role: 'admin', user: userWithoutPassword });
      }
    }

    // 2. Check Student Table
    const [students] = await db.query('SELECT * FROM Student WHERE email = ?', [email]);
    if (students.length > 0) {
      const student = students[0];
      if (verifyPassword(password, student.password)) {
        const { password, ...userWithoutPassword } = student;
        // Map student_id back to studentId for React frontend compatibility
        userWithoutPassword.studentId = student.student_id;
        userWithoutPassword.registeredAt = student.registered_at;
        return res.json({ success: true, role: 'student', user: userWithoutPassword });
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, studentId, phone, password } = req.body;
  try {
    // Check if duplicate student exists
    const [existing] = await db.query(
      'SELECT id FROM Student WHERE email = ? OR student_id = ?',
      [email, studentId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Email or Student ID already registered.' });
    }

    // Generate new STUXXX ID
    const [lastStudent] = await db.query('SELECT id FROM Student ORDER BY id DESC LIMIT 1');
    let nextNum = 1;
    if (lastStudent.length > 0) {
      const lastId = lastStudent[0].id;
      const match = lastId.match(/STU(\d+)/);
      if (match) {
        nextNum = parseInt(match[1]) + 1;
      }
    }
    const newId = `STU${String(nextNum).padStart(3, '0')}`;
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert student
    await db.query(
      `INSERT INTO Student (id, name, email, password, student_id, batch, section, dept, phone, role) 
       VALUES (?, ?, ?, ?, ?, 61, 'F', 'CSE', ?, 'student')`,
      [newId, name, email, hashedPassword, studentId, phone]
    );

    return res.status(201).json({ success: true, message: 'Registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, error: 'Server error during registration.' });
  }
});

// POST /api/auth/profile
app.post('/api/auth/profile', async (req, res) => {
  const { id, role, name, phone } = req.body;
  try {
    if (role === 'admin') {
      await db.query('UPDATE Admin SET name = ? WHERE id = ?', [name, id]);
    } else {
      await db.query('UPDATE Student SET name = ?, phone = ? WHERE id = ?', [name, phone, id]);
    }
    return res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ success: false, error: 'Server error during profile update.' });
  }
});

// POST /api/auth/change-password
app.post('/api/auth/change-password', async (req, res) => {
  const { id, role, currentPassword, newPassword } = req.body;
  try {
    const table = role === 'admin' ? 'Admin' : 'Student';
    const [users] = await db.query(`SELECT password FROM ${table} WHERE id = ?`, [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const user = users[0];
    if (!verifyPassword(currentPassword, user.password)) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect.' });
    }

    const hashedNew = bcrypt.hashSync(newPassword, 10);
    await db.query(`UPDATE ${table} SET password = ? WHERE id = ?`, [hashedNew, id]);
    return res.json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ success: false, error: 'Server error during password change.' });
  }
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = bcrypt.hashSync(password, 10);

    // Try resetting student password first
    const [sResult] = await db.query('UPDATE Student SET password = ? WHERE email = ?', [hashed, email]);
    if (sResult.affectedRows > 0) {
      return res.json({ success: true, message: 'Student password reset successfully.' });
    }

    // Try resetting admin password
    const [aResult] = await db.query('UPDATE Admin SET password = ? WHERE email = ?', [hashed, email]);
    if (aResult.affectedRows > 0) {
      return res.json({ success: true, message: 'Admin password reset successfully.' });
    }

    return res.status(404).json({ success: false, error: 'No account registered with this email.' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ success: false, error: 'Server error during password reset.' });
  }
});


// -------------------------------------------------------------
// 2. STUDENT CRUD ENDPOINTS
// -------------------------------------------------------------

// GET /api/students
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Student ORDER BY id ASC');
    const mapped = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      password: r.password,
      studentId: r.student_id,
      batch: r.batch,
      section: r.section,
      dept: r.dept,
      phone: r.phone,
      role: r.role,
      registeredAt: r.registered_at
    }));
    return res.json(mapped);
  } catch (error) {
    console.error('Fetch students error:', error);
    return res.status(500).json({ error: 'Server error fetching students.' });
  }
});

// POST /api/students
app.post('/api/students', async (req, res) => {
  const { name, email, studentId, phone, batch, section, password } = req.body;
  try {
    const [lastStudent] = await db.query('SELECT id FROM Student ORDER BY id DESC LIMIT 1');
    let nextNum = 1;
    if (lastStudent.length > 0) {
      const match = lastStudent[0].id.match(/STU(\d+)/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    const newId = `STU${String(nextNum).padStart(3, '0')}`;
    const hashPass = bcrypt.hashSync(password || 'password123', 10);

    await db.query(
      `INSERT INTO Student (id, name, email, password, student_id, batch, section, phone, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'student')`,
      [newId, name, email, hashPass, studentId, batch || 61, section || 'F', phone]
    );

    const [created] = await db.query('SELECT * FROM Student WHERE id = ?', [newId]);
    const r = created[0];
    return res.status(201).json({
      success: true,
      data: {
        id: r.id,
        name: r.name,
        email: r.email,
        password: r.password,
        studentId: r.student_id,
        batch: r.batch,
        section: r.section,
        dept: r.dept,
        phone: r.phone,
        role: r.role,
        registeredAt: r.registered_at
      }
    });
  } catch (error) {
    console.error('Create student error:', error);
    return res.status(500).json({ success: false, error: 'Server error creating student.' });
  }
});

// PUT /api/students/:id
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, studentId, phone, batch, section } = req.body;
  try {
    await db.query(
      `UPDATE Student SET name = ?, email = ?, student_id = ?, phone = ?, batch = ?, section = ? 
       WHERE id = ?`,
      [name, email, studentId, phone, batch, section, id]
    );
    return res.json({ success: true, message: 'Student updated successfully.' });
  } catch (error) {
    console.error('Update student error:', error);
    return res.status(500).json({ success: false, error: 'Server error updating student.' });
  }
});

// DELETE /api/students/:id
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Student WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({ success: false, error: 'Server error deleting student.' });
  }
});


// -------------------------------------------------------------
// 3. NOTICE BOARD ENDPOINTS
// -------------------------------------------------------------

// GET /api/notices
app.get('/api/notices', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Notice ORDER BY posted_at DESC');
    const mapped = rows.map(r => ({
      id: r.id,
      title: r.title,
      content: r.content,
      priority: r.priority,
      category: r.category,
      postedBy: r.posted_by,
      postedAt: r.posted_at
    }));
    return res.json(mapped);
  } catch (error) {
    console.error('Fetch notices error:', error);
    return res.status(500).json({ error: 'Server error fetching notices.' });
  }
});

// POST /api/notices
app.post('/api/notices', async (req, res) => {
  const { title, content, priority, category } = req.body;
  try {
    const newId = `NOT${Date.now()}`;
    await db.query(
      `INSERT INTO Notice (id, title, content, priority, category, posted_by) 
       VALUES (?, ?, ?, ?, ?, 'Admin')`,
      [newId, title, content, priority, category]
    );
    const [created] = await db.query('SELECT * FROM Notice WHERE id = ?', [newId]);
    const r = created[0];
    return res.status(201).json({
      id: r.id,
      title: r.title,
      content: r.content,
      priority: r.priority,
      category: r.category,
      postedBy: r.posted_by,
      postedAt: r.posted_at
    });
  } catch (error) {
    console.error('Create notice error:', error);
    return res.status(500).json({ error: 'Server error creating notice.' });
  }
});

// PUT /api/notices/:id
app.put('/api/notices/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, priority, category } = req.body;
  try {
    await db.query(
      'UPDATE Notice SET title = ?, content = ?, priority = ?, category = ? WHERE id = ?',
      [title, content, priority, category, id]
    );
    return res.json({ success: true });
  } catch (error) {
    console.error('Update notice error:', error);
    return res.status(500).json({ error: 'Server error updating notice.' });
  }
});

// DELETE /api/notices/:id
app.delete('/api/notices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Notice WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete notice error:', error);
    return res.status(500).json({ error: 'Server error deleting notice.' });
  }
});


// -------------------------------------------------------------
// 4. ASSIGNMENT ENDPOINTS
// -------------------------------------------------------------

// GET /api/assignments
app.get('/api/assignments', async (req, res) => {
  try {
    // Get all assignments with faculty name
    const [assigns] = await db.query(
      `SELECT A.*, F.name as faculty_name 
       FROM Assignment A 
       LEFT JOIN Faculty F ON A.faculty_id = F.id 
       ORDER BY A.posted_at DESC`
    );

    // Get all submissions to populate submittedBy arrays
    const [subs] = await db.query('SELECT assignment_id, student_id FROM AssignmentSubmission');

    const mapped = assigns.map(a => {
      const submittedBy = subs
        .filter(s => s.assignment_id === a.id)
        .map(s => s.student_id);

      return {
        id: a.id,
        title: a.title,
        subjectCode: a.subject_code,
        // Fallback to query name or local mock subject lookup
        subject: a.subject_code === 'CSE301' ? 'Database Management Systems' :
                 a.subject_code === 'CSE302' ? 'Operating Systems' :
                 a.subject_code === 'CSE303' ? 'Algorithm Design & Analysis' :
                 a.subject_code === 'CSE304' ? 'Computer Networks' :
                 a.subject_code === 'CSE305' ? 'Software Engineering' :
                 a.subject_code === 'CSE306L' ? 'DBMS Lab' :
                 a.subject_code === 'CSE307L' ? 'OS Lab' : 'Course Subject',
        description: a.description,
        deadline: a.deadline,
        totalMarks: a.total_marks,
        submissionType: a.submission_type,
        submittedBy,
        postedAt: a.posted_at,
        faculty: a.faculty_name || 'Department Faculty'
      };
    });

    return res.json(mapped);
  } catch (error) {
    console.error('Fetch assignments error:', error);
    return res.status(500).json({ error: 'Server error fetching assignments.' });
  }
});

// POST /api/assignments
app.post('/api/assignments', async (req, res) => {
  const { title, subjectCode, description, deadline, totalMarks, submissionType, faculty } = req.body;
  try {
    const newId = `ASN${Date.now()}`;

    // Lookup faculty ID from name
    const [facList] = await db.query('SELECT id FROM Faculty WHERE name = ?', [faculty]);
    const facultyId = facList.length > 0 ? facList[0].id : 'FAC002'; // default fallback

    await db.query(
      `INSERT INTO Assignment (id, title, subject_code, description, deadline, total_marks, submission_type, faculty_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, title, subjectCode, description, deadline, totalMarks, submissionType, facultyId]
    );

    const [created] = await db.query(
      `SELECT A.*, F.name as faculty_name 
       FROM Assignment A 
       LEFT JOIN Faculty F ON A.faculty_id = F.id 
       WHERE A.id = ?`,
      [newId]
    );
    const r = created[0];

    return res.status(201).json({
      id: r.id,
      title: r.title,
      subjectCode: r.subject_code,
      subject: req.body.subject || 'Course Subject',
      description: r.description,
      deadline: r.deadline,
      totalMarks: r.total_marks,
      submissionType: r.submission_type,
      submittedBy: [],
      postedAt: r.posted_at,
      faculty: r.faculty_name || 'Department Faculty'
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    return res.status(500).json({ error: 'Server error creating assignment.' });
  }
});

// PUT /api/assignments/:id
app.put('/api/assignments/:id', async (req, res) => {
  const { id } = req.params;
  const { title, subjectCode, description, deadline, totalMarks, submissionType, faculty } = req.body;
  try {
    // Lookup faculty ID
    const [facList] = await db.query('SELECT id FROM Faculty WHERE name = ?', [faculty]);
    const facultyId = facList.length > 0 ? facList[0].id : 'FAC002';

    await db.query(
      `UPDATE Assignment SET title = ?, subject_code = ?, description = ?, deadline = ?, 
       total_marks = ?, submission_type = ?, faculty_id = ? 
       WHERE id = ?`,
      [title, subjectCode, description, deadline, totalMarks, submissionType, facultyId, id]
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('Update assignment error:', error);
    return res.status(500).json({ error: 'Server error updating assignment.' });
  }
});

// DELETE /api/assignments/:id
app.delete('/api/assignments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Assignment WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete assignment error:', error);
    return res.status(500).json({ error: 'Server error deleting assignment.' });
  }
});

// POST /api/assignments/:id/submit
app.post('/api/assignments/:id/submit', async (req, res) => {
  const { id } = req.params;
  const { studentId } = req.body;
  try {
    await db.query(
      'INSERT IGNORE INTO AssignmentSubmission (assignment_id, student_id) VALUES (?, ?)',
      [id, studentId]
    );
    return res.json({ success: true });
  } catch (error) {
    console.error('Submit assignment error:', error);
    return res.status(500).json({ error: 'Server error recording submission.' });
  }
});

// POST /api/assignments/:id/unsubmit
app.post('/api/assignments/:id/unsubmit', async (req, res) => {
  const { id } = req.params;
  const { studentId } = req.body;
  try {
    await db.query(
      'DELETE FROM AssignmentSubmission WHERE assignment_id = ? AND student_id = ?',
      [id, studentId]
    );
    return res.json({ success: true });
  } catch (error) {
    console.error('Unsubmit assignment error:', error);
    return res.status(500).json({ error: 'Server error removing submission.' });
  }
});


// -------------------------------------------------------------
// 5. FACULTY ENDPOINTS
// -------------------------------------------------------------

// GET /api/faculty
app.get('/api/faculty', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT F.*, S.name as subject_name 
       FROM Faculty F 
       LEFT JOIN Subject S ON S.faculty_id = F.id`
    );

    // Group rows by faculty member
    const grouped = {};
    for (const r of rows) {
      if (!grouped[r.id]) {
        grouped[r.id] = {
          id: r.id,
          name: r.name,
          designation: r.designation,
          dept: r.dept,
          email: r.email,
          phone: r.phone,
          education: r.education,
          office: r.office,
          photo: r.photo,
          subjects: []
        };
      }
      if (r.subject_name) {
        grouped[r.id].subjects.push(r.subject_name);
      }
    }

    return res.json(Object.values(grouped));
  } catch (error) {
    console.error('Fetch faculty error:', error);
    return res.status(500).json({ error: 'Server error fetching faculty.' });
  }
});

// POST /api/faculty
app.post('/api/faculty', async (req, res) => {
  const { name, designation, dept, email, phone, education, office, subjects } = req.body;
  try {
    const newId = `FAC${Date.now()}`;
    await db.query(
      `INSERT INTO Faculty (id, name, designation, dept, email, phone, education, office) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, name, designation, dept || 'CSE', email, phone, education, office]
    );

    // Associate subjects taught by this faculty member
    if (subjects && subjects.length > 0) {
      await db.query(
        'UPDATE Subject SET faculty_id = ? WHERE name IN (?)',
        [newId, subjects]
      );
    }

    return res.status(201).json({
      id: newId,
      name, designation, dept: dept || 'CSE', email, phone, education, office, photo: null,
      subjects: subjects || []
    });
  } catch (error) {
    console.error('Create faculty error:', error);
    return res.status(500).json({ error: 'Server error creating faculty.' });
  }
});

// PUT /api/faculty/:id
app.put('/api/faculty/:id', async (req, res) => {
  const { id } = req.params;
  const { name, designation, dept, email, phone, education, office, subjects } = req.body;
  try {
    await db.query(
      `UPDATE Faculty SET name = ?, designation = ?, dept = ?, email = ?, phone = ?, 
       education = ?, office = ? WHERE id = ?`,
      [name, designation, dept, email, phone, education, office, id]
    );

    // Reset previous subjects taught and map to new list
    await db.query('UPDATE Subject SET faculty_id = NULL WHERE faculty_id = ?', [id]);
    if (subjects && subjects.length > 0) {
      await db.query(
        'UPDATE Subject SET faculty_id = ? WHERE name IN (?)',
        [id, subjects]
      );
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Update faculty error:', error);
    return res.status(500).json({ error: 'Server error updating faculty.' });
  }
});

// DELETE /api/faculty/:id
app.delete('/api/faculty/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Faculty WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete faculty error:', error);
    return res.status(500).json({ error: 'Server error deleting faculty.' });
  }
});


// -------------------------------------------------------------
// 6. STUDY MATERIALS ENDPOINTS
// -------------------------------------------------------------

// GET /api/materials
app.get('/api/materials', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM StudyMaterial ORDER BY uploaded_at DESC');
    const mapped = rows.map(m => {
      // Convert database schema SEM_3_1 to frontend semester representation 3.1
      const sem = m.semester_id.replace('SEM_', '').replace('_', '.');
      return {
        id: m.id,
        title: m.title,
        subjectCode: m.subject_code,
        // Fallback names for mock frontend consistency
        subject: m.subject_code === 'CSE301' ? 'Database Management Systems' :
                 m.subject_code === 'CSE302' ? 'Operating Systems' :
                 m.subject_code === 'CSE303' ? 'Algorithm Design & Analysis' :
                 m.subject_code === 'CSE304' ? 'Computer Networks' :
                 m.subject_code === 'CSE305' ? 'Software Engineering' :
                 m.subject_code === 'CSE306L' ? 'DBMS Lab' :
                 m.subject_code === 'CSE307L' ? 'OS Lab' : 'Course Subject',
        semester: sem,
        type: m.type,
        fileType: m.file_type,
        url: m.url,
        fileName: m.file_name,
        size: m.size,
        uploadedBy: m.uploaded_by,
        uploadedAt: m.uploaded_at
      };
    });
    return res.json(mapped);
  } catch (error) {
    console.error('Fetch materials error:', error);
    return res.status(500).json({ error: 'Server error fetching materials.' });
  }
});

// POST /api/materials
app.post('/api/materials', async (req, res) => {
  const { title, subjectCode, semester, type, fileType, url, fileName, size } = req.body;
  try {
    const newId = `MAT${Date.now()}`;
    const semId = `SEM_${semester.replace('.', '_')}`;

    await db.query(
      `INSERT INTO StudyMaterial (id, title, subject_code, semester_id, type, file_type, url, file_name, size, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Admin')`,
      [newId, title, subjectCode, semId, type, fileType, url, fileName, size]
    );

    const [created] = await db.query('SELECT * FROM StudyMaterial WHERE id = ?', [newId]);
    const r = created[0];

    return res.status(201).json({
      id: r.id,
      title: r.title,
      subjectCode: r.subject_code,
      subject: req.body.subject || 'Course Subject',
      semester,
      type: r.type,
      fileType: r.file_type,
      url: r.url,
      fileName: r.file_name,
      size: r.size,
      uploadedBy: r.uploaded_by,
      uploadedAt: r.uploaded_at
    });
  } catch (error) {
    console.error('Create material error:', error);
    return res.status(500).json({ error: 'Server error creating material.' });
  }
});

// PUT /api/materials/:id
app.put('/api/materials/:id', async (req, res) => {
  const { id } = req.params;
  const { title, subjectCode, semester, type, fileType, url, fileName, size } = req.body;
  try {
    const semId = `SEM_${semester.replace('.', '_')}`;
    await db.query(
      `UPDATE StudyMaterial SET title = ?, subject_code = ?, semester_id = ?, type = ?, 
       file_type = ?, url = ?, file_name = ?, size = ? 
       WHERE id = ?`,
      [title, subjectCode, semId, type, fileType, url, fileName, size, id]
    );
    return res.json({ success: true });
  } catch (error) {
    console.error('Update material error:', error);
    return res.status(500).json({ error: 'Server error updating material.' });
  }
});

// DELETE /api/materials/:id
app.delete('/api/materials/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM StudyMaterial WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete material error:', error);
    return res.status(500).json({ error: 'Server error deleting material.' });
  }
});


// -------------------------------------------------------------
// 7. QUESTION BANK ENDPOINTS
// -------------------------------------------------------------

// GET /api/questions
app.get('/api/questions', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT Q.*, S.name as subject_name 
       FROM QuestionBank Q 
       JOIN Subject S ON Q.subject_code = S.code 
       ORDER BY Q.uploaded_at DESC`
    );
    const mapped = rows.map(r => ({
      id: r.id,
      subjectCode: r.subject_code,
      subject: r.subject_name,
      year: String(r.year),
      examType: r.exam_type,
      // Parse database JSON list into JS Array
      questions: typeof r.questions === 'string' ? JSON.parse(r.questions) : r.questions,
      uploadedBy: r.uploaded_by,
      uploadedAt: r.uploaded_at
    }));
    return res.json(mapped);
  } catch (error) {
    console.error('Fetch questions error:', error);
    return res.status(500).json({ error: 'Server error fetching questions.' });
  }
});

// POST /api/questions
app.post('/api/questions', async (req, res) => {
  const { subjectCode, year, examType, questions } = req.body;
  try {
    const newId = `QSN${Date.now()}`;
    const jsonQuestions = JSON.stringify(questions);

    await db.query(
      `INSERT INTO QuestionBank (id, subject_code, year, exam_type, questions, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, 'Admin')`,
      [newId, subjectCode, Number(year), examType, jsonQuestions]
    );

    const [created] = await db.query(
      `SELECT Q.*, S.name as subject_name 
       FROM QuestionBank Q 
       JOIN Subject S ON Q.subject_code = S.code 
       WHERE Q.id = ?`,
      [newId]
    );
    const r = created[0];

    return res.status(201).json({
      id: r.id,
      subjectCode: r.subject_code,
      subject: r.subject_name,
      year: String(r.year),
      examType: r.exam_type,
      questions: JSON.parse(r.questions),
      uploadedBy: r.uploaded_by,
      uploadedAt: r.uploaded_at
    });
  } catch (error) {
    console.error('Create questions error:', error);
    return res.status(500).json({ error: 'Server error creating question bank entry.' });
  }
});

// PUT /api/questions/:id
app.put('/api/questions/:id', async (req, res) => {
  const { id } = req.params;
  const { subjectCode, year, examType, questions } = req.body;
  try {
    const jsonQuestions = JSON.stringify(questions);
    await db.query(
      'UPDATE QuestionBank SET subject_code = ?, year = ?, exam_type = ?, questions = ? WHERE id = ?',
      [subjectCode, Number(year), examType, jsonQuestions, id]
    );
    return res.json({ success: true });
  } catch (error) {
    console.error('Update questions error:', error);
    return res.status(500).json({ error: 'Server error updating question bank entry.' });
  }
});

// DELETE /api/questions/:id
app.delete('/api/questions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM QuestionBank WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete questions error:', error);
    return res.status(500).json({ error: 'Server error deleting question bank entry.' });
  }
});


// -------------------------------------------------------------
// 8. SEMESTER RESULTS ENDPOINTS
// -------------------------------------------------------------

// GET /api/results
app.get('/api/results', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT R.*, S.name as subject_name, S.credit, Sem.name as semester_name, Sem.year 
       FROM Result R 
       JOIN Subject S ON R.subject_code = S.code 
       JOIN Semester Sem ON R.semester_id = Sem.id`
    );

    // Restructure database table rows into nested structure:
    // [{ semesterId, semesterName, year, studentResults: { STU001: [{ subjectCode, subjectName, credit, grade, gradePoint }] } }]
    const semMap = {};
    for (const r of rows) {
      const sId = r.semester_id;
      if (!semMap[sId]) {
        semMap[sId] = {
          semesterId: sId,
          semesterName: r.semester_name,
          year: String(r.year),
          studentResults: {}
        };
      }

      const stuId = r.student_id;
      if (!semMap[sId].studentResults[stuId]) {
        semMap[sId].studentResults[stuId] = [];
      }

      semMap[sId].studentResults[stuId].push({
        subjectCode: r.subject_code,
        subjectName: r.subject_name,
        credit: Number(r.credit),
        grade: r.grade,
        gradePoint: Number(r.grade_point)
      });
    }

    return res.json(Object.values(semMap));
  } catch (error) {
    console.error('Fetch results error:', error);
    return res.status(500).json({ error: 'Server error fetching results.' });
  }
});

// POST /api/results
app.post('/api/results', async (req, res) => {
  const { semesterId, studentId, subjectResults } = req.body;
  try {
    // 1. Ensure the semester exists in the database
    // Auto-derive name and year if not existing
    const semName = semesterId.replace('SEM_', 'Semester ').replace('_', '.');
    const semYear = 2025; // default fallback

    await db.query(
      'INSERT IGNORE INTO Semester (id, name, year) VALUES (?, ?, ?)',
      [semesterId, semName, semYear]
    );

    // 2. Perform insert/update for each subject result in the payload
    for (const r of subjectResults) {
      await db.query(
        `INSERT INTO Result (student_id, semester_id, subject_code, grade, grade_point) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE grade = VALUES(grade), grade_point = VALUES(grade_point)`,
        [studentId, semesterId, r.subjectCode, r.grade, Number(r.gradePoint)]
      );
    }

    return res.json({ success: true, message: 'Grades saved successfully.' });
  } catch (error) {
    console.error('Save results error:', error);
    return res.status(500).json({ success: false, error: 'Server error saving results.' });
  }
});

// DELETE /api/results/:semesterId
app.delete('/api/results/:semesterId', async (req, res) => {
  const { semesterId } = req.params;
  try {
    await db.query('DELETE FROM Result WHERE semester_id = ?', [semesterId]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete semester results error:', error);
    return res.status(500).json({ error: 'Server error deleting results.' });
  }
});

// DELETE /api/results/:semesterId/:studentId
app.delete('/api/results/:semesterId/:studentId', async (req, res) => {
  const { semesterId, studentId } = req.params;
  try {
    await db.query('DELETE FROM Result WHERE semester_id = ? AND student_id = ?', [semesterId, studentId]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete student results error:', error);
    return res.status(500).json({ error: 'Server error deleting student results.' });
  }
});


// -------------------------------------------------------------
// 9. CLASS ROUTINE ENDPOINTS
// -------------------------------------------------------------

// GET /api/routine
app.get('/api/routine', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT R.*, S.name as subject_name 
       FROM ClassRoutine R 
       JOIN Subject S ON R.subject_code = S.code`
    );

    // Group slots by Day
    const routineObj = { Sunday: [], Monday: [], Tuesday: [], Wednesday: [], Thursday: [] };
    for (const r of rows) {
      if (routineObj[r.day]) {
        routineObj[r.day].push({
          time: r.time,
          subject: r.subject_name,
          code: r.subject_code,
          room: r.room,
          faculty: r.faculty,
          color: r.color
        });
      }
    }

    return res.json(routineObj);
  } catch (error) {
    console.error('Fetch routine error:', error);
    return res.status(500).json({ error: 'Server error fetching class routine.' });
  }
});

// PUT /api/routine/:day
app.put('/api/routine/:day', async (req, res) => {
  const { day } = req.params;
  const slots = req.body; // array of slot objects: [{ time, code, room, faculty, color }]
  try {
    // Delete existing slots for day
    await db.query('DELETE FROM ClassRoutine WHERE day = ?', [day]);

    // Insert new slots
    if (slots && slots.length > 0) {
      for (const slot of slots) {
        await db.query(
          `INSERT INTO ClassRoutine (day, time, subject_code, room, faculty, color) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [day, slot.time, slot.code, slot.room, slot.faculty, slot.color]
        );
      }
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Update routine error:', error);
    return res.status(500).json({ error: 'Server error updating class routine.' });
  }
});


// -------------------------------------------------------------
// 10. SUBJECT LISTING (READ-ONLY)
// -------------------------------------------------------------
app.get('/api/subjects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Subject');
    const mapped = rows.map(r => ({
      code: r.code,
      name: r.name,
      credit: Number(r.credit),
      facultyId: r.faculty_id
    }));
    return res.json(mapped);
  } catch (error) {
    console.error('Fetch subjects error:', error);
    return res.status(500).json({ error: 'Server error fetching subjects.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Express backend server running on http://localhost:${PORT}`);
});
