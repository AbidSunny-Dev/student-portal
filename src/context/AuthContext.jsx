import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

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

const DEFAULT_ROUTINE = { Sunday: [], Monday: [], Tuesday: [], Wednesday: [], Thursday: [] };

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => LS.get('mu_current_user', null));
  const [students, setStudents]       = useState([]);
  const [notices, setNotices]         = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials]     = useState([]);
  const [questions, setQuestions]     = useState([]);
  const [results, setResults]         = useState([]);
  const [faculty, setFaculty]         = useState([]);
  const [subjects, setSubjects]       = useState([]);
  const [routine, setRoutine]         = useState(DEFAULT_ROUTINE);
  const [loading, setLoading]         = useState(true);

  // Sync currentUser session status
  useEffect(() => {
    LS.set('mu_current_user', currentUser);
  }, [currentUser]);

  // Load all initial academic data from local MySQL backend on mount
  useEffect(() => {
    const loadAcademicData = async () => {
      try {
        setLoading(true);
        const [
          stuList,
          notList,
          asnList,
          matList,
          qsnList,
          resList,
          facList,
          subList,
          rotList
        ] = await Promise.all([
          api.students.getAll().catch(e => { console.error(e); return []; }),
          api.notices.getAll().catch(e => { console.error(e); return []; }),
          api.assignments.getAll().catch(e => { console.error(e); return []; }),
          api.materials.getAll().catch(e => { console.error(e); return []; }),
          api.questions.getAll().catch(e => { console.error(e); return []; }),
          api.results.getAll().catch(e => { console.error(e); return []; }),
          api.faculty.getAll().catch(e => { console.error(e); return []; }),
          api.subjects.getAll().catch(e => { console.error(e); return []; }),
          api.routine.getAll().catch(e => { console.error(e); return DEFAULT_ROUTINE; })
        ]);

        setStudents(stuList);
        setNotices(notList);
        setAssignments(asnList);
        setMaterials(matList);
        setQuestions(qsnList);
        setResults(resList);
        setFaculty(facList);
        setSubjects(subList);
        setRoutine(rotList);
      } catch (error) {
        console.error('Error loading academic data from backend:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAcademicData();
  }, []);

  // ---- AUTH ----
  const login = async (email, password) => {
    try {
      const res = await api.auth.login(email, password);
      if (res.success) {
        setCurrentUser(res.user);
        return { success: true, role: res.role };
      }
      return { success: false, error: res.message || 'Invalid email or password.' };
    } catch (error) {
      console.error('Login request failed:', error);
      return { success: false, error: error.message || 'Connection to backend failed.' };
    }
  };

  const register = async (data) => {
    try {
      const res = await api.auth.register(data);
      if (res.success) {
        // Fetch students again to update local list
        const updatedStudents = await api.students.getAll();
        setStudents(updatedStudents);
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed.' };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message || 'Connection to backend failed.' };
    }
  };

  const logout = () => setCurrentUser(null);

  // ---- PROFILE & ACCOUNT ----
  const updateUserProfile = async (data) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    try {
      const payload = { ...currentUser, ...data };
      const res = await api.auth.updateProfile(payload);
      if (res.success) {
        setCurrentUser(payload);
        if (currentUser.role === 'student') {
          setStudents(prev => prev.map(s => s.id === currentUser.id ? { ...s, ...data } : s));
        }
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to update profile.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    try {
      const res = await api.auth.changePassword({
        id: currentUser.id,
        role: currentUser.role,
        currentPassword,
        newPassword
      });
      if (res.success) {
        const updated = { ...currentUser, password: newPassword };
        setCurrentUser(updated);
        if (currentUser.role === 'student') {
          setStudents(prev => prev.map(s => s.id === currentUser.id ? { ...s, password: newPassword } : s));
        }
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to change password.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resetPasswordWithOTP = async (email, newPassword) => {
    try {
      const res = await api.auth.resetPassword(email, newPassword);
      if (res.success) {
        // Refresh local student lists
        const updatedStudents = await api.students.getAll();
        setStudents(updatedStudents);
        
        if (currentUser?.email?.toLowerCase() === email.toLowerCase()) {
          setCurrentUser(prev => ({ ...prev, password: newPassword }));
        }
        return { success: true, message: res.message || 'Password reset successfully!' };
      }
      return { success: false, error: res.error || 'Password reset failed.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ---- NOTICES ----
  const addNotice = async (notice) => {
    try {
      const created = await api.notices.create(notice);
      setNotices(prev => [created, ...prev]);
    } catch (error) {
      console.error('Failed to add notice:', error);
    }
  };

  const updateNotice = async (id, data) => {
    try {
      await api.notices.update(id, data);
      setNotices(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
    } catch (error) {
      console.error('Failed to update notice:', error);
    }
  };

  const deleteNotice = async (id) => {
    try {
      await api.notices.delete(id);
      setNotices(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notice:', error);
    }
  };

  // ---- ASSIGNMENTS ----
  const addAssignment = async (assignment) => {
    try {
      const created = await api.assignments.create(assignment);
      setAssignments(prev => [created, ...prev]);
    } catch (error) {
      console.error('Failed to add assignment:', error);
    }
  };

  const updateAssignment = async (id, data) => {
    try {
      await api.assignments.update(id, data);
      setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await api.assignments.delete(id);
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  const markSubmitted = async (assignmentId, studentId) => {
    try {
      await api.assignments.submit(assignmentId, studentId);
      setAssignments(prev => prev.map(a =>
        a.id === assignmentId ? { ...a, submittedBy: [...(a.submittedBy || []), studentId] } : a
      ));
    } catch (error) {
      console.error('Failed to submit assignment:', error);
    }
  };

  // ---- MATERIALS ----
  const addMaterial = async (material) => {
    try {
      const created = await api.materials.create(material);
      setMaterials(prev => [created, ...prev]);
    } catch (error) {
      console.error('Failed to add study material:', error);
    }
  };

  const updateMaterial = async (id, data) => {
    try {
      await api.materials.update(id, data);
      setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    } catch (error) {
      console.error('Failed to update study material:', error);
    }
  };

  const deleteMaterial = async (id) => {
    try {
      await api.materials.delete(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete study material:', error);
    }
  };

  // ---- QUESTIONS ----
  const addQuestion = async (question) => {
    try {
      const created = await api.questions.create(question);
      setQuestions(prev => [created, ...prev]);
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };

  const updateQuestion = async (id, data) => {
    try {
      await api.questions.update(id, data);
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...data } : q));
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await api.questions.delete(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  // ---- RESULTS ----
  const addSemesterResult = async (semesterData) => {
    try {
      // semesterData shape: { semesterId, studentResults: { [studentId]: subjectResults } }
      const studentId = Object.keys(semesterData.studentResults)[0];
      const subjectResults = semesterData.studentResults[studentId];
      await api.results.save(semesterData.semesterId, studentId, subjectResults);
      
      // Refresh results list from database to ensure consistency
      const updated = await api.results.getAll();
      setResults(updated);
    } catch (error) {
      console.error('Failed to add semester result:', error);
    }
  };

  const updateStudentResult = async (semesterId, studentId, subjectResults) => {
    try {
      await api.results.save(semesterId, studentId, subjectResults);
      const updated = await api.results.getAll();
      setResults(updated);
    } catch (error) {
      console.error('Failed to update student result:', error);
    }
  };

  const deleteSemesterResult = async (semesterId) => {
    try {
      await api.results.deleteSemester(semesterId);
      setResults(prev => prev.filter(r => r.semesterId !== semesterId));
    } catch (error) {
      console.error('Failed to delete semester results:', error);
    }
  };

  const deleteStudentResult = async (semesterId, studentId) => {
    try {
      await api.results.deleteStudent(semesterId, studentId);
      setResults(prev => prev.map(sem => {
        if (sem.semesterId !== semesterId) return sem;
        const updatedStudentResults = { ...sem.studentResults };
        delete updatedStudentResults[studentId];
        return { ...sem, studentResults: updatedStudentResults };
      }));
    } catch (error) {
      console.error('Failed to delete student result:', error);
    }
  };

  // ---- FACULTY ----
  const addFaculty = async (f) => {
    try {
      const created = await api.faculty.create(f);
      setFaculty(prev => [...prev, created]);
    } catch (error) {
      console.error('Failed to add faculty member:', error);
    }
  };

  const updateFaculty = async (id, data) => {
    try {
      await api.faculty.update(id, data);
      const updated = await api.faculty.getAll();
      setFaculty(updated);
    } catch (error) {
      console.error('Failed to update faculty member:', error);
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await api.faculty.delete(id);
      setFaculty(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error('Failed to delete faculty member:', error);
    }
  };

  // ---- STUDENTS ----
  const addStudent = async (data) => {
    try {
      const res = await api.students.create(data);
      if (res.success) {
        setStudents(prev => [...prev, res.data]);
        return { success: true };
      }
      return { success: false, error: 'Failed to save student' };
    } catch (error) {
      console.error('Failed to add student:', error);
      return { success: false, error: error.message };
    }
  };

  const updateStudent = async (id, data) => {
    try {
      await api.students.update(id, data);
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    } catch (error) {
      console.error('Failed to update student:', error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await api.students.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  // ---- SUBJECTS ----
  const addSubject = async (sub) => {
    // Subjects are read-only/reference data in current model, but let's support state-syncing
    setSubjects(prev => [...prev, sub]);
  };
  const updateSubject = async (code, data) => {
    setSubjects(prev => prev.map(s => s.code === code ? { ...s, ...data } : s));
  };
  const deleteSubject = async (code) => {
    setSubjects(prev => prev.filter(s => s.code !== code));
  };

  // ---- ROUTINE ----
  const updateRoutine = async (day, slots) => {
    try {
      await api.routine.update(day, slots);
      setRoutine(prev => ({ ...prev, [day]: slots }));
    } catch (error) {
      console.error('Failed to update routine:', error);
    }
  };

  const value = {
    loading, currentUser, login, logout, register, updateUserProfile, changePassword, resetPasswordWithOTP,
    students, addStudent, updateStudent, deleteStudent,
    notices, addNotice, updateNotice, deleteNotice,
    assignments, addAssignment, updateAssignment, deleteAssignment, markSubmitted,
    materials, addMaterial, updateMaterial, deleteMaterial,
    questions, addQuestion, updateQuestion, deleteQuestion,
    results, addSemesterResult, updateStudentResult, deleteSemesterResult, deleteStudentResult,
    faculty, addFaculty, updateFaculty, deleteFaculty,
    subjects, addSubject, updateSubject, deleteSubject,
    routine, updateRoutine,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
