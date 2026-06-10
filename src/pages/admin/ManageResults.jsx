import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart2, PlusCircle, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateGPA, GRADE_SCALE } from '../../data/mockData';

const SUBJECTS_BY_SEM = {
  '1.1': [
    { code: 'CSE101', name: 'Introduction to Programming', credit: 3 },
    { code: 'CSE102', name: 'Discrete Mathematics', credit: 3 },
    { code: 'CSE103', name: 'Digital Logic Design', credit: 3 },
    { code: 'MAT101', name: 'Calculus', credit: 3 },
    { code: 'ENG101', name: 'English Communication', credit: 2 },
    { code: 'CSE104L', name: 'Programming Lab', credit: 1.5 },
  ],
  '3.1': [
    { code: 'CSE301', name: 'Database Management Systems', credit: 3 },
    { code: 'CSE302', name: 'Operating Systems', credit: 3 },
    { code: 'CSE303', name: 'Algorithm Design & Analysis', credit: 3 },
    { code: 'CSE304', name: 'Computer Networks', credit: 3 },
    { code: 'CSE305', name: 'Software Engineering', credit: 3 },
    { code: 'CSE306L', name: 'DBMS Lab', credit: 1.5 },
    { code: 'CSE307L', name: 'OS Lab', credit: 1.5 },
  ],
};

const SEMESTERS = [
  { id: 'SEM_3_1', name: 'Semester 3.1', year: '2025', subjects: SUBJECTS_BY_SEM['3.1'] },
];

export const ManageResults = () => {
  const { results, students, updateStudentResult, addSemesterResult } = useAuth();
  const [selectedSem, setSelectedSem] = useState('SEM_3_1');
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [grades, setGrades] = useState({});
  const [expandedSem, setExpandedSem] = useState(null);
  const [saved, setSaved] = useState(false);

  const semConfig = SEMESTERS.find(s => s.id === selectedSem);
  const existingResult = results.find(r => r.semesterId === selectedSem);
  const existingStudentResult = existingResult?.studentResults?.[selectedStudent] || [];

  const getGrade = (code) => {
    const custom = grades[`${selectedSem}_${selectedStudent}_${code}`];
    if (custom) return custom;
    const existing = existingStudentResult.find(r => r.subjectCode === code);
    return existing?.grade || 'A';
  };

  const handleSave = () => {
    if (!semConfig || !selectedStudent) return;
    const subjectResults = semConfig.subjects.map(s => {
      const grade = getGrade(s.code);
      const gradeEntry = GRADE_SCALE.find(g => g.grade === grade) || GRADE_SCALE[0];
      return { subjectCode: s.code, subjectName: s.name, credit: s.credit, grade, gradePoint: gradeEntry.point };
    });

    if (!existingResult) {
      addSemesterResult({
        semesterId: selectedSem,
        semesterName: semConfig.name,
        year: semConfig.year,
        studentResults: { [selectedStudent]: subjectResults },
      });
    } else {
      updateStudentResult(selectedSem, selectedStudent, subjectResults);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const previewGPA = () => {
    if (!semConfig) return '—';
    const subjectResults = semConfig.subjects.map(s => {
      const grade = getGrade(s.code);
      const gradeEntry = GRADE_SCALE.find(g => g.grade === grade) || GRADE_SCALE[0];
      return { grade, gradePoint: gradeEntry.point, credit: s.credit };
    });
    return calculateGPA(subjectResults).toFixed(2);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <BarChart2 size={20} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="section-title">Manage Results</h1>
          <p className="section-subtitle">Enter and update student grades per semester</p>
        </div>
      </div>

      {/* Selectors */}
      <div className="glass-card p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 mb-2 block">Select Semester</label>
          <select value={selectedSem} onChange={e => setSelectedSem(e.target.value)} className="select-field">
            {SEMESTERS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.year})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-white/40 mb-2 block">Select Student</label>
          <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="select-field">
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
          </select>
        </div>
      </div>

      {/* Grade entry */}
      {semConfig && selectedStudent && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="font-display font-bold text-white">{semConfig.name} — Grade Entry</h2>
              <p className="text-xs text-white/40">{students.find(s => s.id === selectedStudent)?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-white/40">Preview GPA</p>
                <p className="text-2xl font-display font-bold text-primary-400">{previewGPA()}</p>
              </div>
              <button onClick={handleSave} className={`btn-primary flex items-center gap-2 ${saved ? 'bg-emerald-600' : ''}`}>
                <Save size={15} />{saved ? 'Saved!' : 'Save Grades'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Code</th><th>Subject</th><th className="text-center">Credit</th><th className="text-center">Grade</th><th className="text-center">Points</th></tr></thead>
              <tbody>
                {semConfig.subjects.map(s => {
                  const grade = getGrade(s.code);
                  const gp = GRADE_SCALE.find(g => g.grade === grade)?.point || 0;
                  const key = `${selectedSem}_${selectedStudent}_${s.code}`;
                  return (
                    <tr key={s.code}>
                      <td><span className="badge-blue text-xs">{s.code}</span></td>
                      <td className="text-white/80">{s.name}</td>
                      <td className="text-center text-white/60">{s.credit}</td>
                      <td className="text-center">
                        <select
                          value={grade}
                          onChange={e => setGrades(p => ({ ...p, [key]: e.target.value }))}
                          className="bg-surface-700 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          {GRADE_SCALE.map(g => <option key={g.grade} value={g.grade}>{g.grade} ({g.point})</option>)}
                        </select>
                      </td>
                      <td className="text-center font-mono text-primary-400">{gp.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Existing results overview */}
      <div className="glass-card p-6">
        <h2 className="font-display font-bold text-white mb-4">Existing Results Overview</h2>
        <div className="space-y-3">
          {results.map(sem => (
            <div key={sem.semesterId} className="border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedSem(expandedSem === sem.semesterId ? null : sem.semesterId)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-white">{sem.semesterName}</span>
                  <span className="text-xs text-white/30">{sem.year}</span>
                  <span className="badge-blue">{Object.keys(sem.studentResults || {}).length} students</span>
                </div>
                {expandedSem === sem.semesterId ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
              </button>
              {expandedSem === sem.semesterId && (
                <div className="border-t border-white/5 p-4 animate-fade-in">
                  {Object.entries(sem.studentResults || {}).map(([stuId, res]) => {
                    const stu = students.find(s => s.id === stuId);
                    const gpa = calculateGPA(res);
                    return (
                      <div key={stuId} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-sm text-white/70">{stu?.name || stuId}</span>
                        <span className="font-mono font-bold text-primary-400">{gpa.toFixed(2)} GPA</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
