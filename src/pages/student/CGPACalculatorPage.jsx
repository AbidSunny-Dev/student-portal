import { useState, useCallback } from 'react';
import { Calculator, PlusCircle, Trash2, Info, Award, RefreshCw } from 'lucide-react';
import { GRADE_SCALE } from '../../data/mockData';

const emptySubject = () => ({ name: '', credit: '', grade: 'A+' });
const emptySemester = () => ({ label: '', subjects: [emptySubject()] });

const calculateSemGPA = (subjects) => {
  let tp = 0, tc = 0;
  subjects.forEach(s => {
    const credit = parseFloat(s.credit);
    const gradeEntry = GRADE_SCALE.find(g => g.grade === s.grade);
    if (!isNaN(credit) && credit > 0 && gradeEntry) {
      tp += gradeEntry.point * credit;
      tc += credit;
    }
  });
  return tc > 0 ? { gpa: (tp / tc).toFixed(2), credits: tc } : { gpa: '—', credits: 0 };
};

const calculateOverallCGPA = (semesters) => {
  let tp = 0, tc = 0;
  semesters.forEach(sem => {
    sem.subjects.forEach(s => {
      const credit = parseFloat(s.credit);
      const gradeEntry = GRADE_SCALE.find(g => g.grade === s.grade);
      if (!isNaN(credit) && credit > 0 && gradeEntry) {
        tp += gradeEntry.point * credit;
        tc += credit;
      }
    });
  });
  return tc > 0 ? { cgpa: (tp / tc).toFixed(2), totalCredits: tc } : { cgpa: '0.00', totalCredits: 0 };
};

const gpaBand = (val) => {
  const v = parseFloat(val);
  if (v >= 3.75) return { label: 'Excellent', color: 'text-emerald-400', bg: 'from-emerald-600 to-emerald-800' };
  if (v >= 3.25) return { label: 'Very Good', color: 'text-primary-400', bg: 'from-primary-600 to-primary-800' };
  if (v >= 2.75) return { label: 'Good', color: 'text-yellow-400', bg: 'from-yellow-600 to-yellow-800' };
  if (v >= 2.00) return { label: 'Average', color: 'text-orange-400', bg: 'from-orange-600 to-orange-800' };
  return { label: 'Below Average', color: 'text-red-400', bg: 'from-red-700 to-red-900' };
};

export const CGPACalculatorPage = () => {
  const [semesters, setSemesters] = useState([
    { label: 'Semester 1.1', subjects: [emptySubject()] },
  ]);
  const [showScale, setShowScale] = useState(false);

  const addSemester = () => setSemesters(p => [...p, { label: `Semester ${p.length + 1}`, subjects: [emptySubject()] }]);
  const removeSemester = (si) => setSemesters(p => p.filter((_, i) => i !== si));

  const updateSemLabel = (si, val) =>
    setSemesters(p => p.map((s, i) => i === si ? { ...s, label: val } : s));

  const addSubject = (si) =>
    setSemesters(p => p.map((s, i) => i === si ? { ...s, subjects: [...s.subjects, emptySubject()] } : s));

  const removeSubject = (si, sj) =>
    setSemesters(p => p.map((s, i) => i === si
      ? { ...s, subjects: s.subjects.filter((_, j) => j !== sj) }
      : s));

  const updateSubject = (si, sj, field, val) =>
    setSemesters(p => p.map((s, i) => i === si
      ? { ...s, subjects: s.subjects.map((sub, j) => j === sj ? { ...sub, [field]: val } : sub) }
      : s));

  const reset = () => setSemesters([{ label: 'Semester 1.1', subjects: [emptySubject()] }]);

  const { cgpa, totalCredits } = calculateOverallCGPA(semesters);
  const band = gpaBand(cgpa);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
            <Calculator size={20} className="text-accent-400" />
          </div>
          <div>
            <h1 className="section-title">CGPA Calculator</h1>
            <p className="section-subtitle">Calculate overall CGPA across all semesters</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowScale(!showScale)} className="btn-secondary flex items-center gap-2 text-sm">
            <Info size={15} /> Grade Scale
          </button>
          <button onClick={reset} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw size={15} /> Reset
          </button>
        </div>
      </div>

      {/* Grade scale table */}
      {showScale && (
        <div className="glass-card p-5 animate-slide-up">
          <h3 className="font-display font-bold text-white mb-3">Bangladesh UGC Grading Scale</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Grade</th><th>Points</th><th>Mark Range</th><th>Class</th></tr></thead>
              <tbody>
                {GRADE_SCALE.map(g => (
                  <tr key={g.grade}>
                    <td><span className="font-bold text-white font-mono">{g.grade}</span></td>
                    <td><span className="font-mono text-primary-400">{g.point.toFixed(2)}</span></td>
                    <td className="text-white/60">{g.minMark}+</td>
                    <td className="text-white/40 text-xs">
                      {g.point >= 3.75 ? 'Excellent' : g.point >= 3.25 ? 'Very Good' : g.point >= 2.75 ? 'Good' : g.point >= 2.00 ? 'Average' : 'Fail'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live CGPA display */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${band.bg} border border-white/10 p-6`}>
        <div className="absolute right-4 top-0 bottom-0 flex items-center opacity-5 pointer-events-none">
          <Award size={160} />
        </div>
        <div className="relative flex items-center gap-8 flex-wrap">
          <div>
            <p className="text-white/60 text-sm mb-1">Overall CGPA</p>
            <p className="font-display text-6xl font-bold text-white">{cgpa}</p>
            <p className="text-white/50 text-sm mt-1">out of 4.00</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-white">{semesters.length}</p>
              <p className="text-xs text-white/50">Semesters</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-white">{totalCredits}</p>
              <p className="text-xs text-white/50">Credits</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-white">{band.label}</p>
              <p className="text-xs text-white/50">Class</p>
            </div>
          </div>
        </div>
      </div>

      {/* Semester blocks */}
      <div className="space-y-4">
        {semesters.map((sem, si) => {
          const { gpa, credits } = calculateSemGPA(sem.subjects);
          return (
            <div key={si} className="glass-card p-5">
              {/* Semester header */}
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="text"
                  value={sem.label}
                  onChange={e => updateSemLabel(si, e.target.value)}
                  placeholder="Semester name (e.g. Semester 1.1)"
                  className="input-field flex-1 font-display font-bold"
                />
                <div className="text-right flex-shrink-0">
                  <span className="text-xl font-display font-bold text-white">{gpa}</span>
                  <span className="text-xs text-white/40 ml-1">GPA</span>
                  <p className="text-xs text-white/30">{credits} cr</p>
                </div>
                {semesters.length > 1 && (
                  <button onClick={() => removeSemester(si)} className="text-red-400/60 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Subjects */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 px-1 text-xs text-white/30 font-medium">
                  <div className="col-span-5">Subject Name</div>
                  <div className="col-span-3">Credit Hours</div>
                  <div className="col-span-3">Grade</div>
                  <div className="col-span-1" />
                </div>
                {sem.subjects.map((sub, sj) => (
                  <div key={sj} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={sub.name}
                      onChange={e => updateSubject(si, sj, 'name', e.target.value)}
                      placeholder="e.g. DBMS"
                      className="input-field col-span-5 text-xs py-2"
                    />
                    <input
                      type="number"
                      value={sub.credit}
                      onChange={e => updateSubject(si, sj, 'credit', e.target.value)}
                      placeholder="3"
                      min="0.5" max="6" step="0.5"
                      className="input-field col-span-3 text-xs py-2"
                    />
                    <select
                      value={sub.grade}
                      onChange={e => updateSubject(si, sj, 'grade', e.target.value)}
                      className="select-field col-span-3 text-xs py-2"
                    >
                      {GRADE_SCALE.map(g => (
                        <option key={g.grade} value={g.grade}>{g.grade} ({g.point})</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeSubject(si, sj)}
                      disabled={sem.subjects.length === 1}
                      className="col-span-1 text-white/20 hover:text-red-400 transition-colors disabled:opacity-20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addSubject(si)}
                className="mt-3 flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                <PlusCircle size={14} /> Add Subject
              </button>
            </div>
          );
        })}
      </div>

      <button onClick={addSemester} className="btn-primary flex items-center gap-2 w-full justify-center">
        <PlusCircle size={16} /> Add Semester
      </button>
    </div>
  );
};
