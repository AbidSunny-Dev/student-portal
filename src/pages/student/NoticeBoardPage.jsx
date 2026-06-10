import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Filter, ChevronDown, ChevronUp, Calendar, User, Tag } from 'lucide-react';

const priorityConfig = {
  high:   { label: 'High',   cls: 'badge-red',    dot: 'bg-red-400' },
  medium: { label: 'Medium', cls: 'badge-yellow',  dot: 'bg-yellow-400' },
  low:    { label: 'Low',    cls: 'badge-green',   dot: 'bg-emerald-400' },
};

const NoticeCard = ({ notice }) => {
  const [expanded, setExpanded] = useState(false);
  const p = priorityConfig[notice.priority] || priorityConfig.low;

  return (
    <div className={`glass-card p-5 transition-all duration-300 ${notice.isNew ? 'border-primary-500/20' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${p.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-white text-sm leading-tight">{notice.title}</h3>
                {notice.isNew && <span className="badge-blue">New</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                <span className="flex items-center gap-1"><User size={11} />{notice.postedBy}</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{new Date(notice.postedAt).toLocaleDateString('en-BD', { day:'numeric', month:'short', year:'numeric' })}</span>
                <span className={p.cls}>{p.label} Priority</span>
                <span className="badge-purple">{notice.category}</span>
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-white/40 hover:text-white transition-colors flex-shrink-0"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-white/5 text-sm text-white/70 leading-relaxed animate-fade-in">
              {notice.content}
            </div>
          )}
          {!expanded && (
            <p className="mt-2 text-sm text-white/50 line-clamp-2">{notice.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const NoticeBoardPage = () => {
  const { notices } = useAuth();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(notices.map(n => n.category))];

  const filtered = notices.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                        n.content.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === 'all' || n.priority === priorityFilter;
    const matchCategory = categoryFilter === 'all' || n.category === categoryFilter;
    return matchSearch && matchPriority && matchCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Bell size={20} className="text-primary-400" />
        </div>
        <div>
          <h1 className="section-title">Notice Board</h1>
          <p className="section-subtitle">{notices.length} notices · {notices.filter(n=>n.isNew).length} new</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="select-field sm:w-40"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="select-field sm:w-40"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-white/40">
        <Filter size={12} />
        {Object.entries(priorityConfig).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${v.dot}`} />
            {v.label}
          </span>
        ))}
      </div>

      {/* Notices */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-white/30">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>No notices found.</p>
          </div>
        ) : (
          filtered.map(n => <NoticeCard key={n.id} notice={n} />)
        )}
      </div>
    </div>
  );
};
