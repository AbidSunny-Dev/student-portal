import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Search, Download, ExternalLink, FileText, Link2, FlaskConical, BookMarked, Upload, Filter } from 'lucide-react';

const typeConfig = {
  slide: { icon: FileText,    label: 'Slides',   cls: 'badge-blue'   },
  book:  { icon: BookMarked,  label: 'Book',     cls: 'badge-purple' },
  notes: { icon: BookOpen,    label: 'Notes',    cls: 'badge-green'  },
  lab:   { icon: FlaskConical,label: 'Lab',      cls: 'badge-orange' },
  link:  { icon: Link2,       label: 'Link',     cls: 'badge-yellow' },
};

const MaterialCard = ({ material }) => {
  const cfg = typeConfig[material.type] || typeConfig.notes;
  const Icon = cfg.icon;
  const isLink = material.type === 'link';

  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm leading-tight mb-2">{material.title}</h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={cfg.cls}>{cfg.label}</span>
            <span className="badge-blue">{material.subjectCode}</span>
            <span className="badge-purple">Sem {material.semester}</span>
            {material.size && <span className="badge text-white/40 bg-surface-700 border-white/10">{material.size}</span>}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/30">
              <span>By {material.uploadedBy}</span>
              <span className="mx-2">·</span>
              <span>{new Date(material.uploadedAt).toLocaleDateString()}</span>
            </div>
            {isLink ? (
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium"
              >
                <ExternalLink size={13} />
                Open Link
              </a>
            ) : (
              <button className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                <Download size={13} />
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudyMaterialsPage = () => {
  const { materials } = useAuth();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const subjects = ['all', ...new Set(materials.map(m => m.subjectCode))];
  const types = ['all', ...Object.keys(typeConfig)];

  const filtered = materials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                        m.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
                        m.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === 'all' || m.subjectCode === subjectFilter;
    const matchType = typeFilter === 'all' || m.type === typeFilter;
    return matchSearch && matchSubject && matchType;
  });

  // Group by subject
  const grouped = filtered.reduce((acc, m) => {
    const key = m.subjectCode;
    if (!acc[key]) acc[key] = { name: m.subject, code: m.subjectCode, items: [] };
    acc[key].items.push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
          <BookOpen size={20} className="text-teal-400" />
        </div>
        <div>
          <h1 className="section-title">Study Materials</h1>
          <p className="section-subtitle">{materials.length} materials available — Semester 3.1</p>
        </div>
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.entries(typeConfig).map(([k, v]) => (
          <span key={k} className={v.cls}><v.icon size={10} className="inline mr-1" />{v.label}</span>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="select-field sm:w-44">
          {subjects.map(s => <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="select-field sm:w-36">
          {types.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : typeConfig[t]?.label || t}</option>)}
        </select>
      </div>

      {/* Grouped content */}
      {Object.keys(grouped).length === 0 ? (
        <div className="glass-card p-12 text-center text-white/30">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>No materials found.</p>
        </div>
      ) : (
        Object.values(grouped).map(group => (
          <div key={group.code}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-display font-bold text-white">{group.name}</h2>
              <span className="badge-blue">{group.code}</span>
              <span className="text-xs text-white/30">{group.items.length} file{group.items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.items.map(m => <MaterialCard key={m.id} material={m} />)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
