import { useAuth } from '../../context/AuthContext';
import { calculateGPA } from '../../data/mockData';
import { Users, Bell, ClipboardList, BookOpen, BarChart2, GraduationCap, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { students, notices, assignments, materials, results, faculty } = useAuth();

  const totalCredits = results.reduce((total, sem) => {
    const firstStudent = Object.values(sem.studentResults || {})[0] || [];
    return total + firstStudent.reduce((s, r) => s + r.credit, 0);
  }, 0);

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users,       color: 'from-primary-500 to-primary-700', to: '/admin/students' },
    { label: 'Notices',        value: notices.length,  icon: Bell,        color: 'from-purple-500 to-purple-700',  to: '/admin/notices' },
    { label: 'Assignments',    value: assignments.length, icon: ClipboardList, color: 'from-accent-500 to-accent-600', to: '/admin/assignments' },
    { label: 'Faculty',        value: faculty.length,  icon: GraduationCap, color: 'from-emerald-500 to-emerald-700', to: '/admin/faculty' },
    { label: 'Materials',      value: materials.length, icon: BookOpen,   color: 'from-teal-500 to-teal-700',     to: '/admin/materials' },
    { label: 'Result Sets',    value: results.length,  icon: BarChart2,   color: 'from-yellow-500 to-yellow-700', to: '/admin/results' },
  ];

  const recentNotices = notices.slice(0, 5);
  const upcomingDeadlines = [...assignments]
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .filter(a => new Date(a.deadline) > new Date())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-700 via-primary-900 to-surface-700 border border-primary-500/20 p-6">
        <div className="absolute right-4 opacity-5 top-0 bottom-0 flex items-center pointer-events-none">
          <Shield size={160} />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-accent-400" />
            <span className="text-accent-400 font-medium text-sm">Administrator</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-white/40 text-sm">Metropolitan University, Sylhet · CSE Dept · Batch 61 | Section F</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="glass-card-hover p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{value}</p>
              <p className="text-sm text-white/50">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent notices */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-white">Recent Notices</h2>
            <Link to="/admin/notices" className="text-xs text-primary-400 hover:text-primary-300">Manage →</Link>
          </div>
          <div className="space-y-2">
            {recentNotices.map(n => (
              <div key={n.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/50 border border-white/5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  n.priority === 'high' ? 'bg-red-400' : n.priority === 'medium' ? 'bg-yellow-400' : 'bg-emerald-400'
                }`} />
                <p className="text-sm text-white/80 flex-1 truncate">{n.title}</p>
                <span className="text-xs text-white/30 flex-shrink-0">{new Date(n.postedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-white">Upcoming Deadlines</h2>
            <Link to="/admin/assignments" className="text-xs text-primary-400 hover:text-primary-300">Manage →</Link>
          </div>
          <div className="space-y-2">
            {upcomingDeadlines.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/50 border border-white/5">
                <ClipboardList size={14} className="text-accent-400 flex-shrink-0" />
                <p className="text-sm text-white/80 flex-1 truncate">{a.title}</p>
                <span className="text-xs text-white/30 flex-shrink-0">{new Date(a.deadline).toLocaleDateString()}</span>
              </div>
            ))}
            {upcomingDeadlines.length === 0 && (
              <p className="text-sm text-white/30 text-center py-4">No upcoming deadlines</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
