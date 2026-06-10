import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, Clock, CheckCircle, AlertTriangle, Search, Filter } from 'lucide-react';

const Countdown = ({ deadline }) => {
  const [timeStr, setTimeStr] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const update = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) { setTimeStr('Overdue'); setStatus('overdue'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (d < 2) setStatus('urgent');
      else setStatus('pending');
      setTimeStr(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [deadline]);

  const colors = {
    pending: 'text-white/50',
    urgent: 'text-orange-400',
    overdue: 'text-red-400',
  };

  return (
    <div className={`flex items-center gap-1.5 text-sm font-mono font-medium ${colors[status]}`}>
      <Clock size={14} />
      {timeStr}
    </div>
  );
};

const AssignmentCard = ({ assignment, isSubmitted, onToggleSubmit }) => {
  const [expanded, setExpanded] = useState(false);
  const isOverdue = new Date(assignment.deadline) < new Date();

  return (
    <div className={`glass-card p-5 transition-all duration-300 ${isSubmitted ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${isSubmitted ? 'bg-emerald-500/20' : isOverdue ? 'bg-red-500/20' : 'bg-accent-500/20'}`}>
          {isSubmitted
            ? <CheckCircle size={18} className="text-emerald-400" />
            : isOverdue
            ? <AlertTriangle size={18} className="text-red-400" />
            : <ClipboardList size={18} className="text-accent-400" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-white text-sm">{assignment.title}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="badge-blue">{assignment.subjectCode}</span>
                <span className="badge-purple">{assignment.subject}</span>
                <span className="badge-orange">{assignment.totalMarks} Marks</span>
                {isSubmitted && <span className="badge-green">Submitted</span>}
                {!isSubmitted && isOverdue && <span className="badge-red">Overdue</span>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Countdown deadline={assignment.deadline} />
              <p className="text-xs text-white/30">
                Due: {new Date(assignment.deadline).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-white/5 animate-fade-in">
              <p className="text-sm text-white/70 leading-relaxed mb-3">{assignment.description}</p>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span>👤 {assignment.faculty}</span>
                <span>📄 {assignment.submissionType.toUpperCase()}</span>
                <span>📅 Posted: {new Date(assignment.postedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              {expanded ? 'Show less' : 'View details'}
            </button>
            <button
              onClick={() => onToggleSubmit(assignment.id)}
              className={isSubmitted ? 'btn-danger text-xs py-1.5 px-3' : 'btn-success text-xs py-1.5 px-3'}
            >
              {isSubmitted ? 'Mark Unsubmitted' : 'Mark as Submitted'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AssignmentsPage = () => {
  const { assignments, currentUser, markSubmitted, updateAssignment } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleToggle = (assignmentId) => {
    const a = assignments.find(a => a.id === assignmentId);
    const isSubmitted = a?.submittedBy?.includes(currentUser?.id);
    if (isSubmitted) {
      updateAssignment(assignmentId, { submittedBy: a.submittedBy.filter(id => id !== currentUser?.id) });
    } else {
      markSubmitted(assignmentId, currentUser?.id);
    }
  };

  const filtered = assignments.filter(a => {
    const isSubmitted = a.submittedBy?.includes(currentUser?.id);
    const isOverdue = new Date(a.deadline) < new Date();
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                        a.subjectCode.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'pending') return !isSubmitted && !isOverdue;
    if (filter === 'submitted') return isSubmitted;
    if (filter === 'overdue') return isOverdue && !isSubmitted;
    return true;
  });

  const stats = {
    total: assignments.length,
    submitted: assignments.filter(a => a.submittedBy?.includes(currentUser?.id)).length,
    pending: assignments.filter(a => !a.submittedBy?.includes(currentUser?.id) && new Date(a.deadline) > new Date()).length,
    overdue: assignments.filter(a => !a.submittedBy?.includes(currentUser?.id) && new Date(a.deadline) < new Date()).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
          <ClipboardList size={20} className="text-accent-400" />
        </div>
        <div>
          <h1 className="section-title">Assignments</h1>
          <p className="section-subtitle">Track and manage your assignment submissions</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', val: stats.total, cls: 'text-white' },
          { label: 'Submitted', val: stats.submitted, cls: 'text-emerald-400' },
          { label: 'Pending', val: stats.pending, cls: 'text-yellow-400' },
          { label: 'Overdue', val: stats.overdue, cls: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-display font-bold ${s.cls}`}>{s.val}</p>
            <p className="text-xs text-white/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'submitted', 'overdue'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-surface-700 text-white/50 hover:text-white border border-white/5'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-white/30">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
            <p>No assignments match your filter.</p>
          </div>
        ) : (
          filtered.map(a => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              isSubmitted={a.submittedBy?.includes(currentUser?.id)}
              onToggleSubmit={handleToggle}
            />
          ))
        )}
      </div>
    </div>
  );
};
