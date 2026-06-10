import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Mail, Phone, MapPin, BookOpen, GraduationCap } from 'lucide-react';

const designationOrder = ['Professor & Head', 'Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];

const FacultyCard = ({ faculty }) => (
  <div className="glass-card-hover p-6">
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg shadow-primary-500/20">
        {faculty.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-white text-base leading-tight">{faculty.name}</h3>
        <p className="text-primary-400 text-xs font-medium mt-0.5">{faculty.designation}</p>
        <p className="text-white/30 text-xs mt-0.5">{faculty.dept} Department</p>
      </div>
    </div>

    <div className="mt-4 space-y-2 text-xs text-white/50">
      <div className="flex items-center gap-2">
        <Mail size={12} className="text-primary-400 flex-shrink-0" />
        <a href={`mailto:${faculty.email}`} className="truncate hover:text-primary-400 transition-colors">{faculty.email}</a>
      </div>
      <div className="flex items-center gap-2">
        <Phone size={12} className="text-emerald-400 flex-shrink-0" />
        <span>{faculty.phone}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={12} className="text-accent-400 flex-shrink-0" />
        <span>{faculty.office}</span>
      </div>
      <div className="flex items-center gap-2">
        <GraduationCap size={12} className="text-purple-400 flex-shrink-0" />
        <span className="truncate">{faculty.education}</span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-white/5">
      <p className="text-xs text-white/30 mb-2 flex items-center gap-1"><BookOpen size={11} />Subjects</p>
      <div className="flex flex-wrap gap-1.5">
        {faculty.subjects.map((s, i) => (
          <span key={i} className="badge-blue text-xs">{s}</span>
        ))}
      </div>
    </div>
  </div>
);

export const FacultyPage = () => {
  const { faculty } = useAuth();
  const [search, setSearch] = useState('');
  const [desigFilter, setDesigFilter] = useState('all');

  const sorted = [...faculty].sort((a, b) =>
    designationOrder.indexOf(a.designation) - designationOrder.indexOf(b.designation)
  );

  const filtered = sorted.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                        f.subjects.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
                        f.designation.toLowerCase().includes(search.toLowerCase());
    const matchDesig = desigFilter === 'all' || f.designation === desigFilter;
    return matchSearch && matchDesig;
  });

  const designations = ['all', ...new Set(sorted.map(f => f.designation))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Users size={20} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="section-title">Faculty</h1>
          <p className="section-subtitle">CSE Department — {faculty.length} faculty members</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={desigFilter}
          onChange={e => setDesigFilter(e.target.value)}
          className="select-field sm:w-52"
        >
          {designations.map(d => (
            <option key={d} value={d}>{d === 'all' ? 'All Designations' : d}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-white/30">{filtered.length} faculty members found</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(f => <FacultyCard key={f.id} faculty={f} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 glass-card p-12 text-center text-white/30">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>No faculty found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
