import { createContext, useContext, useState, useEffect } from 'react';
import {
  ADMIN_CREDENTIALS,
  INITIAL_STUDENTS,
  INITIAL_NOTICES,
  INITIAL_ASSIGNMENTS,
  INITIAL_MATERIALS,
  INITIAL_QUESTIONS,
  INITIAL_RESULTS,
  INITIAL_FACULTY,
  CURRENT_SUBJECTS,
  CLASS_ROUTINE,
} from '../data/mockData';

const AuthContext = createContext(null);

const LS = {
  get: (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => LS.get('mu_current_user', null));
  const [students, setStudents]       = useState(() => LS.get('mu_students', INITIAL_STUDENTS));
  const [notices, setNotices]         = useState(() => LS.get('mu_notices', INITIAL_NOTICES));
  const [assignments, setAssignments] = useState(() => LS.get('mu_assignments', INITIAL_ASSIGNMENTS));
  const [materials, setMaterials]     = useState(() => LS.get('mu_materials', INITIAL_MATERIALS));
  const [questions, setQuestions]     = useState(() => LS.get('mu_questions', INITIAL_QUESTIONS));
  const [results, setResults]         = useState(() => LS.get('mu_results', INITIAL_RESULTS));
  const [faculty, setFaculty]         = useState(() => LS.get('mu_faculty', INITIAL_FACULTY));
  const [subjects, setSubjects]       = useState(() => LS.get('mu_subjects', CURRENT_SUBJECTS));
  const [routine, setRoutine]         = useState(() => LS.get('mu_routine', CLASS_ROUTINE));

  // Persist all state to localStorage
  useEffect(() => { LS.set('mu_current_user', currentUser); }, [currentUser]);
  useEffect(() => { LS.set('mu_students', students); }, [students]);
  useEffect(() => { LS.set('mu_notices', notices); }, [notices]);
  useEffect(() => { LS.set('mu_assignments', assignments); }, [assignments]);
  useEffect(() => { LS.set('mu_materials', materials); }, [materials]);
  useEffect(() => { LS.set('mu_questions', questions); }, [questions]);
  useEffect(() => { LS.set('mu_results', results); }, [results]);
  useEffect(() => { LS.set('mu_faculty', faculty); }, [faculty]);
  useEffect(() => { LS.set('mu_subjects', subjects); }, [subjects]);
  useEffect(() => { LS.set('mu_routine', routine); }, [routine]);

  // ---- AUTH ----
  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setCurrentUser(ADMIN_CREDENTIALS);
      return { success: true, role: 'admin' };
    }
    const student = students.find(s => s.email === email && s.password === password);
    if (student) {
      setCurrentUser(student);
      return { success: true, role: 'student' };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const register = (data) => {
    const exists = students.find(s => s.email === data.email || s.studentId === data.studentId);
    if (exists) return { success: false, error: 'Email or Student ID already registered.' };
    const newStudent = {
      ...data,
      id: `STU${String(students.length + 1).padStart(3, '0')}`,
      role: 'student',
      registeredAt: new Date().toISOString(),
      batch: 61,
      section: 'F',
      dept: 'CSE',
    };
    setStudents(prev => [...prev, newStudent]);
    return { success: true };
  };

  const logout = () => setCurrentUser(null);

  // ---- NOTICES ----
  const addNotice = (notice) => {
    const n = { ...notice, id: `NOT${Date.now()}`, postedAt: new Date().toISOString(), postedBy: 'Admin', isNew: true };
    setNotices(prev => [n, ...prev]);
  };
  const updateNotice = (id, data) => setNotices(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
  const deleteNotice = (id) => setNotices(prev => prev.filter(n => n.id !== id));

  // ---- ASSIGNMENTS ----
  const addAssignment = (assignment) => {
    const a = { ...assignment, id: `ASN${Date.now()}`, postedAt: new Date().toISOString(), submittedBy: [] };
    setAssignments(prev => [a, ...prev]);
  };
  const updateAssignment = (id, data) => setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  const deleteAssignment = (id) => setAssignments(prev => prev.filter(a => a.id !== id));
  const markSubmitted = (assignmentId, studentId) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId ? { ...a, submittedBy: [...(a.submittedBy || []), studentId] } : a
    ));
  };

  // ---- MATERIALS ----
  const addMaterial = (material) => {
    const m = { ...material, id: `MAT${Date.now()}`, uploadedAt: new Date().toISOString(), uploadedBy: 'Admin' };
    setMaterials(prev => [m, ...prev]);
  };
  const deleteMaterial = (id) => setMaterials(prev => prev.filter(m => m.id !== id));

  // ---- QUESTIONS ----
  const addQuestion = (question) => {
    const q = { ...question, id: `QSN${Date.now()}`, uploadedAt: new Date().toISOString(), uploadedBy: 'Admin' };
    setQuestions(prev => [q, ...prev]);
  };
  const deleteQuestion = (id) => setQuestions(prev => prev.filter(q => q.id !== id));

  // ---- RESULTS ----
  const addSemesterResult = (semesterData) => {
    setResults(prev => {
      const exists = prev.find(r => r.semesterId === semesterData.semesterId);
      if (exists) {
        return prev.map(r => r.semesterId === semesterData.semesterId ? { ...r, ...semesterData } : r);
      }
      return [...prev, semesterData];
    });
  };
  const updateStudentResult = (semesterId, studentId, subjectResults) => {
    setResults(prev => prev.map(sem => {
      if (sem.semesterId !== semesterId) return sem;
      return {
        ...sem,
        studentResults: {
          ...sem.studentResults,
          [studentId]: subjectResults,
        },
      };
    }));
  };

  // ---- FACULTY ----
  const addFaculty = (f) => {
    const newF = { ...f, id: `FAC${Date.now()}` };
    setFaculty(prev => [...prev, newF]);
  };
  const updateFaculty = (id, data) => setFaculty(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  const deleteFaculty = (id) => setFaculty(prev => prev.filter(f => f.id !== id));

  // ---- STUDENTS ----
  const updateStudent = (id, data) => setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteStudent = (id) => setStudents(prev => prev.filter(s => s.id !== id));

  // ---- SUBJECTS ----
  const addSubject = (sub) => setSubjects(prev => [...prev, sub]);
  const deleteSubject = (code) => setSubjects(prev => prev.filter(s => s.code !== code));

  // ---- ROUTINE ----
  const updateRoutine = (day, slots) => setRoutine(prev => ({ ...prev, [day]: slots }));

  const value = {
    currentUser, login, logout, register,
    students, updateStudent, deleteStudent,
    notices, addNotice, updateNotice, deleteNotice,
    assignments, addAssignment, updateAssignment, deleteAssignment, markSubmitted,
    materials, addMaterial, deleteMaterial,
    questions, addQuestion, deleteQuestion,
    results, addSemesterResult, updateStudentResult,
    faculty, addFaculty, updateFaculty, deleteFaculty,
    subjects, addSubject, deleteSubject,
    routine, updateRoutine,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
