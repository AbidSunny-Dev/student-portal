import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCog, Search, Trash2, Mail, Hash, Phone } from 'lucide-react';

export const ManageStudents = () => {
  const { students, deleteStudent } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.includes(search) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <UserCog size={20} className="text-primary-400" />
        </div>
        <div>
          <h1 className="section-title">Manage Students</h1>
          <p className="section-subtitle">CSE | Batch 61 | Section F — {students.length} registered students</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-white">{students.length}</p>
          <p className="text-xs text-white/40 mt-1">Total Students</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-primary-400">61</p>
          <p className="text-xs text-white/40 mt-1">Batch</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-accent-400">F</p>
          <p className="text-xs text-white/40 mt-1">Section</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input type="text" placeholder="Search by name, ID, or email..." value={search}
          onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Student ID</th><th>Email</th><th>Phone</th><th>Registered</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id}>
                <td className="text-white/30">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <span className="font-medium text-white">{s.name}</span>
                  </div>
                </td>
                <td>
                  <span className="font-mono text-xs text-white/60 flex items-center gap-1">
                    <Hash size={11}/>{s.studentId}
                  </span>
                </td>
                <td>
                  <a href={`mailto:${s.email}`} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
                    <Mail size={11}/>{s.email}
                  </a>
                </td>
                <td className="text-white/40 text-xs">
                  <span className="flex items-center gap-1"><Phone size={11}/>{s.phone}</span>
                </td>
                <td className="text-white/30 text-xs">{new Date(s.registeredAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => deleteStudent(s.id)} className="text-red-400/60 hover:text-red-400 p-1 transition-colors">
                    <Trash2 size={14}/>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center text-white/30 py-8">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
