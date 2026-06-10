import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Student Pages
import { DashboardPage as StudentDashboard } from './pages/student/DashboardPage';
import { NoticeBoardPage } from './pages/student/NoticeBoardPage';
import { AssignmentsPage } from './pages/student/AssignmentsPage';
import { RoutinePage } from './pages/student/RoutinePage';
import { FacultyPage } from './pages/student/FacultyPage';
import { StudyMaterialsPage } from './pages/student/StudyMaterialsPage';
import { ResultsPage } from './pages/student/ResultsPage';
import { CGPACalculatorPage } from './pages/student/CGPACalculatorPage';
import { QuestionBankPage } from './pages/student/QuestionBankPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageNotices } from './pages/admin/ManageNotices';
import { ManageAssignments } from './pages/admin/ManageAssignments';
import { ManageFaculty } from './pages/admin/ManageFaculty';
import { ManageMaterials } from './pages/admin/ManageMaterials';
import { ManageResults } from './pages/admin/ManageResults';
import { ManageQuestions } from './pages/admin/ManageQuestions';
import { ManageStudents } from './pages/admin/ManageStudents';
import { ManageRoutine } from './pages/admin/ManageRoutine';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute requiredRole="student">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="notices" element={<NoticeBoardPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="routine" element={<RoutinePage />} />
            <Route path="faculty" element={<FacultyPage />} />
            <Route path="materials" element={<StudyMaterialsPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="cgpa" element={<CGPACalculatorPage />} />
            <Route path="question-bank" element={<QuestionBankPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="notices" element={<ManageNotices />} />
            <Route path="assignments" element={<ManageAssignments />} />
            <Route path="faculty" element={<ManageFaculty />} />
            <Route path="materials" element={<ManageMaterials />} />
            <Route path="results" element={<ManageResults />} />
            <Route path="questions" element={<ManageQuestions />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="routine" element={<ManageRoutine />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
