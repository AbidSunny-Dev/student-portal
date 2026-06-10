import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { calculateGPA, calculateCGPA } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  GraduationCap, Bell, ClipboardList, BookOpen, TrendingUp,
  Clock, CheckCircle, AlertCircle, Calendar, Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, sub, color, to }) => (
  <Link to={to} className="stat-card glass-card-hover cursor-pointer">
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <span className="text-xs text-white/30">→</span>
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-white">{value}</p>
      <p className="text-sm text-white/50 font-medium">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
    </div>
  </Link>
);

const CountdownTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) { setTimeLeft('Overdue'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(d > 0 ? `${d}d ${h}h left` : `${h}h ${m}m left`);
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, [deadline]);
  const isUrgent = new Date(deadline) - new Date() < 86400000 * 2;
  return (
    <span className={`text-xs font-medium ${isUrgent ? 'text-red-400' : 'text-white/50'}`}>
      <Clock size={12} className="inline mr-1" />{timeLeft}
    </span>
  );
};

export const DashboardPage = () => {
  const { currentUser, notices, assignments, results } = useAuth();

  // Get student's results
  const studentResults = results.map(sem => ({
    name: sem.semesterName,
    gpa: sem.studentResults?.[currentUser?.id]
      ? calculateGPA(sem.studentResults[currentUser.id])
      : null,
    results: sem.studentResults?.[currentUser?.id] || [],
  })).filter(s => s.gpa !== null);

  const cgpa = calculateCGPA(studentResults.map(s => s.results));
  const pendingAssignments = assignments.filter(a => !a.submittedBy?.includes(currentUser?.id));
  const newNotices = notices.filter(n => n.isNew);

  const chartData = studentResults.map(s => ({ name: s.name.replace('Semester ', ''), gpa: s.gpa }));

  const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#6366f1', '#4f46e5'];

  const today = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-surface-700 border border-primary-500/20 p-6 glow-primary">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <GraduationCap size={200} className="absolute -right-10 -top-10 text-white" />
        </div>
        <div className="relative z-10">
          <p className="text-primary-300 text-sm font-medium mb-1">Welcome back,</p>
          <h1 className="font-display text-3xl font-bold text-white mb-2">{currentUser?.name} 👋</h1>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="badge-blue">CSE | Batch 61</span>
            <span className="badge-blue">Section F</span>
            <span className="badge-blue">Semester 3.1</span>
            <span className="badge-blue">ID: {currentUser?.studentId}</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Award}
          label="Current CGPA"
          value={cgpa.toFixed(2)}
          sub={`Out of 4.00`}
          color="bg-gradient-to-br from-primary-500 to-primary-700"
          to="/cgpa"
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Tasks"
          value={pendingAssignments.length}
          sub="Assignments due"
          color="bg-gradient-to-br from-accent-500 to-accent-600"
          to="/assignments"
        />
        <StatCard
          icon={Bell}
          label="New Notices"
          value={newNotices.length}
          sub="Unread announcements"
          color="bg-gradient-to-br from-purple-500 to-purple-700"
          to="/notices"
        />
        <StatCard
          icon={TrendingUp}
          label="Semesters Done"
          value={studentResults.length}
          sub="Results available"
          color="bg-gradient-to-br from-emerald-500 to-emerald-700"
          to="/results"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPA Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-bold text-white">GPA Progress</h2>
              <p className="text-white/40 text-xs">Semester-wise performance</p>
            </div>
            <span className="badge-blue text-xs">CGPA: {cgpa.toFixed(2)}</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="name" tick={{ fill: '#ffffff40', fontSize: 11 }} />
                <YAxis domain={[0, 4]} tick={{ fill: '#ffffff40', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1929', border: '1px solid #ffffff10', borderRadius: 12, color: '#fff' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="gpa" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/30 text-sm">
              No result data available yet
            </div>
          )}
        </div>

        {/* Today's classes */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-primary-400" />
            <h2 className="font-display text-lg font-bold text-white">Today — {today}</h2>
          </div>
          {/* We'll import and use routine here */}
          <TodaySchedule day={today} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming assignments */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-white">Upcoming Assignments</h2>
            <Link to="/assignments" className="text-xs text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {pendingAssignments.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-700/50 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                  <ClipboardList size={14} className="text-accent-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{a.title}</p>
                  <p className="text-xs text-white/40">{a.subjectCode}</p>
                  <CountdownTimer deadline={a.deadline} />
                </div>
                <span className="badge-orange flex-shrink-0">{a.totalMarks}m</span>
              </div>
            ))}
            {pendingAssignments.length === 0 && (
              <div className="text-center py-6 text-white/30 text-sm">
                <CheckCircle size={32} className="mx-auto mb-2 text-emerald-500/50" />
                All assignments submitted!
              </div>
            )}
          </div>
        </div>

        {/* Latest notices */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-white">Latest Notices</h2>
            <Link to="/notices" className="text-xs text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 4).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-700/50 border border-white/5">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  n.priority === 'high' ? 'bg-red-400' :
                  n.priority === 'medium' ? 'bg-yellow-400' : 'bg-emerald-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{n.title}</p>
                  <p className="text-xs text-white/40">{new Date(n.postedAt).toLocaleDateString()}</p>
                </div>
                {n.isNew && <span className="badge-green flex-shrink-0">New</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Today's schedule mini-component
const TodaySchedule = ({ day }) => {
  const { routine } = useAuth();
  const slots = routine[day] || [];
  const colorMap = {
    primary: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    accent: 'bg-accent-500/20 text-accent-400 border-accent-500/30',
  };

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-sm">
        <Calendar size={32} className="mx-auto mb-2 opacity-50" />
        No classes today
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slots.map((slot, i) => (
        <div key={i} className={`p-3 rounded-xl border ${colorMap[slot.color] || colorMap.primary}`}>
          <p className="text-xs font-medium opacity-70 mb-1">{slot.time}</p>
          <p className="text-sm font-semibold text-white">{slot.subject}</p>
          <p className="text-xs opacity-60">{slot.room} · {slot.code}</p>
        </div>
      ))}
    </div>
  );
};
