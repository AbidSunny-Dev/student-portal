import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCog, Search, Trash2, Edit2, PlusCircle, Mail, Hash, Phone, UserPlus, Save, X } from 'lucide-react';

const emptyStudent = {
  name: '',
  email: '',
  studentId: '',
  phone: '01700000000',
  batch: 61,
  section: 'F',
  password: 'password123',
};

export const ManageStudents = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useAuth();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyStudent);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.includes(search) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name || '',
      email: student.email || '',
      studentId: student.studentId || '',
      phone: student.phone || '',
      batch: student.batch || 61,
      section: student.section || 'F',
      password: student.password || 'password123',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(emptyStudent);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateStudent(editingId, form);
    } else {
      addStudent(form);
    }
    handleCancel();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <UserCog size={20} className="text-primary-400" />
          </div>
          <div>
            <h1 className="section-title">Manage Students</h1>
            <p className="section-subtitle">CSE | Batch 61 | Section F — {students.length} registered students</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm(emptyStudent); setShowForm(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={16} /> Add Student
        </button>
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

      {showForm && (
        <div className="glass-card p-6 border-primary-500/20 animate-slide-up">
          <h2 className="font-display font-bold text-white mb-4">
            {editingId ? 'Edit Student Record' : 'Register New Student'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Full Name</label>
                <input
                  type="text" required placeholder="Student Name" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Student ID</label>
                <input
                  type="text" required placeholder="06122201053..." value={form.studentId}
                  onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Email</label>
                <input
                  type="email" required placeholder="student@metrouni.edu.bd" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Phone Number</label>
                <input
                  type="text" placeholder="017..." value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Batch</label>
                <input
                  type="number" value={form.batch}
                  onChange={e => setForm(p => ({ ...p, batch: Number(e.target.value) }))} className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Section</label>
                <input
                  type="text" maxLength={2} value={form.section}
                  onChange={e => setForm(p => ({ ...p, section: e.target.value.toUpperCase() }))} className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={15}/> {editingId ? 'Update Student' : 'Save Student'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

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
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(s)} className="text-white/60 hover:text-white p-1 transition-colors" title="Edit Student"><Edit2 size={14}/></button>
                    <button onClick={() => deleteStudent(s.id)} className="text-red-400/60 hover:text-red-400 p-1 transition-colors" title="Delete Student"><Trash2 size={14}/></button>
                  </div>
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
