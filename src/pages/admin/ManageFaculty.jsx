import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, PlusCircle, Trash2, Edit3, Save, X } from 'lucide-react';

const DESIGNATIONS = ['Professor & Head', 'Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
const emptyFaculty = { name: '', designation: 'Lecturer', email: '', phone: '', subjects: [], education: '', office: '', dept: 'CSE' };

export const ManageFaculty = () => {
  const { faculty, addFaculty, updateFaculty, deleteFaculty } = useAuth();
  const [form, setForm] = useState(emptyFaculty);
  const [subjectInput, setSubjectInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) { updateFaculty(editId, form); setEditId(null); }
    else addFaculty(form);
    setForm(emptyFaculty); setSubjectInput(''); setShowForm(false);
  };

  const startEdit = (f) => {
    setForm({ name: f.name, designation: f.designation, email: f.email, phone: f.phone, subjects: [...f.subjects], education: f.education, office: f.office, dept: f.dept });
    setEditId(f.id); setShowForm(true);
  };

  const addSubject = () => {
    const s = subjectInput.trim();
    if (s && !form.subjects.includes(s)) {
      setForm(p => ({ ...p, subjects: [...p.subjects, s] }));
      setSubjectInput('');
    }
  };

  const removeSubject = (s) => setForm(p => ({ ...p, subjects: p.subjects.filter(x => x !== s) }));
  const cancel = () => { setForm(emptyFaculty); setSubjectInput(''); setEditId(null); setShowForm(false); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Users size={20} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="section-title">Manage Faculty</h1>
            <p className="section-subtitle">{faculty.length} faculty members</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyFaculty); }} className="btn-primary flex items-center gap-2">
          <PlusCircle size={16} /> Add Faculty
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 border-emerald-500/20 animate-slide-up">
          <h2 className="font-display font-bold text-white mb-4">{editId ? 'Edit Faculty' : 'Add Faculty'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Full Name</label>
                <input type="text" required placeholder="Dr. Name" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Designation</label>
                <select value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} className="select-field">
                  {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="email" required placeholder="email@metrouni.edu.bd" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field" />
              <input type="tel" placeholder="01XXXXXXXXX" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Education (e.g. PhD — BUET)" value={form.education}
                onChange={e => setForm(p => ({ ...p, education: e.target.value }))} className="input-field" />
              <input type="text" placeholder="Office (e.g. Room 301)" value={form.office}
                onChange={e => setForm(p => ({ ...p, office: e.target.value }))} className="input-field" />
            </div>
            {/* Subjects */}
            <div>
              <label className="text-xs text-white/40 mb-1 block">Subjects</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Subject name" value={subjectInput}
                  onChange={e => setSubjectInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                  className="input-field flex-1" />
                <button type="button" onClick={addSubject} className="btn-secondary px-4">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.subjects.map(s => (
                  <span key={s} className="badge-blue flex items-center gap-1">
                    {s}
                    <button type="button" onClick={() => removeSubject(s)} className="ml-1 text-primary-300 hover:text-white"><X size={10}/></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2"><Save size={15}/>{editId ? 'Update' : 'Add'} Faculty</button>
              <button type="button" onClick={cancel} className="btn-secondary flex items-center gap-2"><X size={15}/>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Designation</th><th>Email</th><th>Subjects</th><th>Actions</th></tr></thead>
          <tbody>
            {faculty.map(f => (
              <tr key={f.id}>
                <td className="font-medium text-white">{f.name}</td>
                <td className="text-white/60 text-xs">{f.designation}</td>
                <td className="text-white/40 text-xs">{f.email}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {f.subjects.slice(0, 2).map(s => <span key={s} className="badge-blue text-xs">{s.split(' ').slice(-1)[0]}</span>)}
                    {f.subjects.length > 2 && <span className="text-xs text-white/30">+{f.subjects.length - 2}</span>}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(f)} className="text-primary-400 hover:text-primary-300 p-1"><Edit3 size={14}/></button>
                    <button onClick={() => deleteFaculty(f.id)} className="text-red-400/60 hover:text-red-400 p-1"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
