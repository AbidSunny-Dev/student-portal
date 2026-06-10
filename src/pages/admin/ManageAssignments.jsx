import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, PlusCircle, Trash2, Edit3, Save, X } from 'lucide-react';

const SUBJECTS = [
  { code: 'CSE301', name: 'Database Management Systems' },
  { code: 'CSE302', name: 'Operating Systems' },
  { code: 'CSE303', name: 'Algorithm Design & Analysis' },
  { code: 'CSE304', name: 'Computer Networks' },
  { code: 'CSE305', name: 'Software Engineering' },
  { code: 'CSE306L', name: 'DBMS Lab' },
  { code: 'CSE307L', name: 'OS Lab' },
];

const emptyAssignment = {
  title: '', subject: 'Database Management Systems', subjectCode: 'CSE301',
  description: '', deadline: '', totalMarks: 20, submissionType: 'pdf', faculty: '',
};

export const ManageAssignments = () => {
  const { assignments, addAssignment, updateAssignment, deleteAssignment } = useAuth();
  const [form, setForm] = useState(emptyAssignment);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubjectChange = (code) => {
    const s = SUBJECTS.find(s => s.code === code);
    setForm(p => ({ ...p, subjectCode: code, subject: s?.name || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) { updateAssignment(editId, form); setEditId(null); }
    else addAssignment(form);
    setForm(emptyAssignment);
    setShowForm(false);
  };

  const startEdit = (a) => {
    setForm({ title: a.title, subject: a.subject, subjectCode: a.subjectCode, description: a.description,
      deadline: a.deadline?.slice(0, 16), totalMarks: a.totalMarks, submissionType: a.submissionType, faculty: a.faculty });
    setEditId(a.id);
    setShowForm(true);
  };

  const cancel = () => { setForm(emptyAssignment); setEditId(null); setShowForm(false); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
            <ClipboardList size={20} className="text-accent-400" />
          </div>
          <div>
            <h1 className="section-title">Manage Assignments</h1>
            <p className="section-subtitle">{assignments.length} assignments total</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyAssignment); }} className="btn-primary flex items-center gap-2">
          <PlusCircle size={16} /> Add Assignment
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 border-accent-500/20 animate-slide-up">
          <h2 className="font-display font-bold text-white mb-4">{editId ? 'Edit Assignment' : 'New Assignment'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" required placeholder="Assignment title" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Subject</label>
                <select value={form.subjectCode} onChange={e => handleSubjectChange(e.target.value)} className="select-field">
                  {SUBJECTS.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Faculty</label>
                <input type="text" placeholder="Faculty name" value={form.faculty}
                  onChange={e => setForm(p => ({ ...p, faculty: e.target.value }))} className="input-field" />
              </div>
            </div>
            <textarea required rows={3} placeholder="Assignment description..." value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-field resize-none" />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Deadline</label>
                <input type="datetime-local" required value={form.deadline}
                  onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                  className="input-field [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Total Marks</label>
                <input type="number" min={1} value={form.totalMarks}
                  onChange={e => setForm(p => ({ ...p, totalMarks: parseInt(e.target.value) }))} className="input-field" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Submission Type</label>
                <select value={form.submissionType} onChange={e => setForm(p => ({ ...p, submissionType: e.target.value }))} className="select-field">
                  <option value="pdf">PDF</option>
                  <option value="pdf+code">PDF + Code</option>
                  <option value="link">Link</option>
                  <option value="handwritten">Handwritten</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2"><Save size={15}/>{editId ? 'Update' : 'Post'}</button>
              <button type="button" onClick={cancel} className="btn-secondary flex items-center gap-2"><X size={15}/>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Title</th><th>Subject</th><th>Deadline</th><th>Marks</th><th>Submissions</th><th>Actions</th></tr></thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td><p className="text-white font-medium text-sm">{a.title}</p></td>
                <td><span className="badge-blue">{a.subjectCode}</span></td>
                <td className="text-white/50 text-xs">{new Date(a.deadline).toLocaleDateString()}</td>
                <td className="text-white/60">{a.totalMarks}</td>
                <td><span className="badge-green">{a.submittedBy?.length || 0} submitted</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(a)} className="text-primary-400 hover:text-primary-300 p-1"><Edit3 size={14}/></button>
                    <button onClick={() => deleteAssignment(a.id)} className="text-red-400/60 hover:text-red-400 p-1"><Trash2 size={14}/></button>
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
