import { useAuth } from '../../context/AuthContext';
import { calculateGPA } from '../../data/mockData';
import { BarChart2, Award, TrendingUp } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';

const gradeColor = (g) => {
  if (['A+','A'].includes(g)) return 'text-emerald-400';
  if (['A-','B+'].includes(g)) return 'text-primary-400';
  if (['B','B-'].includes(g)) return 'text-yellow-400';
  if (['C+','C'].includes(g)) return 'text-orange-400';
  if (g === 'D') return 'text-red-400';
  return 'text-red-600';
};

const gpaBgColor = (gpa) => {
  if (gpa >= 3.75) return 'from-emerald-500 to-emerald-700';
  if (gpa >= 3.25) return 'from-primary-500 to-primary-700';
  if (gpa >= 2.75) return 'from-yellow-500 to-yellow-700';
  return 'from-red-500 to-red-700';
};

const SemesterResultCard = ({ semester, studentResults }) => {
  const gpa = calculateGPA(studentResults);
  const totalCredits = studentResults.reduce((s, r) => s + r.credit, 0);

  return (
    <div className="glass-card overflow-hidden">
      {/* Semester header */}
      <div className={`bg-gradient-to-r ${gpaBgColor(gpa)} p-4 flex items-center justify-between`}>
        <div>
          <h3 className="font-display font-bold text-white">{semester.semesterName}</h3>
          <p className="text-white/70 text-xs">{semester.year} · {totalCredits} credits</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-display font-bold text-white">{gpa.toFixed(2)}</p>
          <p className="text-white/70 text-xs">GPA / 4.00</p>
        </div>
      </div>

      {/* Results table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject</th>
              <th className="text-center">Credit</th>
              <th className="text-center">Grade</th>
              <th className="text-center">Points</th>
            </tr>
          </thead>
          <tbody>
            {studentResults.map((r, i) => (
              <tr key={i}>
                <td><span className="badge-blue text-xs">{r.subjectCode}</span></td>
                <td className="text-white/80">{r.subjectName}</td>
                <td className="text-center text-white/60">{r.credit}</td>
                <td className="text-center">
                  <span className={`font-bold font-mono text-sm ${gradeColor(r.grade)}`}>{r.grade}</span>
                </td>
                <td className="text-center text-white/60 font-mono">{r.gradePoint.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-white/10">
              <td colSpan={2} className="px-4 py-2 text-white/50 text-xs font-medium">Semester GPA</td>
              <td className="text-center px-4 py-2 text-white/60 font-medium">{totalCredits}</td>
              <td />
              <td className="text-center px-4 py-2 font-bold text-white font-mono">{gpa.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export const ResultsPage = () => {
  const { results, currentUser } = useAuth();

  const studentSemesters = results
    .filter(sem => sem.studentResults?.[currentUser?.id])
    .map(sem => ({
      ...sem,
      myResults: sem.studentResults[currentUser.id],
      gpa: calculateGPA(sem.studentResults[currentUser.id]),
    }));

  const cgpa = studentSemesters.length > 0
    ? (() => {
        let tp = 0, tc = 0;
        studentSemesters.forEach(s => s.myResults.forEach(r => { tp += r.gradePoint * r.credit; tc += r.credit; }));
        return tc > 0 ? (tp / tc).toFixed(2) : '0.00';
      })()
    : '0.00';

  const chartData = studentSemesters.map(s => ({
    name: s.semesterName.replace('Semester ', 'Sem '),
    GPA: s.gpa,
  }));

  const BAR_COLORS = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#6366f1','#f97316'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <BarChart2 size={20} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="section-title">My Results</h1>
          <p className="section-subtitle">Semester-wise academic results — CSE | Batch 61 | Section F</p>
        </div>
      </div>

      {/* CGPA banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-surface-700 border border-primary-500/20 p-6">
        <div className="absolute right-4 top-0 bottom-0 flex items-center opacity-5 pointer-events-none">
          <Award size={160} className="text-white" />
        </div>
        <div className="relative flex items-center gap-6">
          <div>
            <p className="text-white/50 text-sm mb-1">Overall CGPA</p>
            <p className="font-display text-6xl font-bold text-white">{cgpa}</p>
            <p className="text-white/40 text-sm mt-1">out of 4.00 · {studentSemesters.length} semesters</p>
          </div>
          <div className="ml-auto grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-2xl font-bold text-white">{studentSemesters.length}</p>
              <p className="text-xs text-white/40">Semesters</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-2xl font-bold text-white">
                {studentSemesters.reduce((t, s) => t + s.myResults.reduce((a, r) => a + r.credit, 0), 0)}
              </p>
              <p className="text-xs text-white/40">Credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* GPA chart */}
      {chartData.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="font-display text-lg font-bold text-white mb-4">GPA Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" tick={{ fill: '#ffffff40', fontSize: 11 }} />
              <YAxis domain={[0, 4]} tick={{ fill: '#ffffff40', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1a1929', border: '1px solid #ffffff10', borderRadius: 12, color: '#fff' }}
                cursor={{ fill: '#ffffff05' }}
              />
              <Bar dataKey="GPA" radius={[6,6,0,0]}>
                {chartData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Semester cards */}
      {studentSemesters.length === 0 ? (
        <div className="glass-card p-12 text-center text-white/30">
          <BarChart2 size={40} className="mx-auto mb-3 opacity-30" />
          <p>No results available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {studentSemesters.map(sem => (
            <SemesterResultCard
              key={sem.semesterId}
              semester={sem}
              studentResults={sem.myResults}
            />
          ))}
        </div>
      )}
    </div>
  );
};
