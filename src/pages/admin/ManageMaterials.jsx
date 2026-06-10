import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, PlusCircle, Trash2, Link2, FileText, ExternalLink } from 'lucide-react';

const SUBJECTS = [
  { code: 'CSE301', name: 'Database Management Systems' },
  { code: 'CSE302', name: 'Operating Systems' },
  { code: 'CSE303', name: 'Algorithm Design & Analysis' },
  { code: 'CSE304', name: 'Computer Networks' },
  { code: 'CSE305', name: 'Software Engineering' },
  { code: 'CSE306L', name: 'DBMS Lab' },
  { code: 'CSE307L', name: 'OS Lab' },
];
const TYPES = ['slide', 'book', 'notes', 'lab', 'link'];
const SEMESTERS = ['1.1','1.2','1.3','2.1','2.2','2.3','3.1','3.2','3.3'];

const emptyMaterial = { title: '', subjectCode: 'CSE301', subject: 'Database Management Systems', semester: '3.1', type: 'notes', fileType: 'pdf', url: '', fileName: '', size: '' };

export const ManageMaterials = () => {
  const { materials, addMaterial, deleteMaterial } = useAuth();
  const [form, setForm] = useState(emptyMaterial);
  const [showForm, setShowForm] = useState(false);
  const isLink = form.type === 'link';

  const handleSubjectChange = (code) => {
    const s = SUBJECTS.find(s => s.code === code);
    setForm(p => ({ ...p, subjectCode: code, subject: s?.name || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMaterial({ ...form, fileType: isLink ? 'link' : 'pdf', url: isLink ? form.url : null, fileName: isLink ? null : form.fileName });
    setForm(emptyMaterial);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <BookOpen size={20} className="text-teal-400" />
          </div>
          <div>
            <h1 className="section-title">Study Materials</h1>
            <p className="section-subtitle">{materials.length} materials uploaded</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <PlusCircle size={16} /> Upload Material
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 border-teal-500/20 animate-slide-up">
          <h2 className="font-display font-bold text-white mb-4">Add Study Material</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" required placeholder="Material title" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Subject</label>
                <select value={form.subjectCode} onChange={e => handleSubjectChange(e.target.value)} className="select-field">
                  {SUBJECTS.map(s => <option key={s.code} value={s.code}>{s.code}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Semester</label>
                <select value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))} className="select-field">
                  {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="select-field">
                  {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Size / Info</label>
                <input type="text" placeholder="e.g. 4.2 MB" value={form.size}
                  onChange={e => setForm(p => ({ ...p, size: e.target.value }))} className="input-field" />
              </div>
            </div>
            {isLink ? (
              <div>
                <label className="text-xs text-white/40 mb-1 block">URL</label>
                <input type="url" required placeholder="https://..." value={form.url}
                  onChange={e => setForm(p => ({ ...p, url: e.target.value }))} className="input-field" />
              </div>
            ) : (
              <div>
                <label className="text-xs text-white/40 mb-1 block">File Name (PDF)</label>
                <input type="text" placeholder="filename.pdf" value={form.fileName}
                  onChange={e => setForm(p => ({ ...p, fileName: e.target.value }))} className="input-field" />
                <p className="text-xs text-white/30 mt-1">Note: actual file upload requires a backend. Enter the filename for reference.</p>
              </div>
            )}
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2">
                {isLink ? <Link2 size={15}/> : <FileText size={15}/>}
                Add Material
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Title</th><th>Subject</th><th>Type</th><th>Semester</th><th>Uploaded</th><th>Actions</th></tr></thead>
          <tbody>
            {materials.map(m => (
              <tr key={m.id}>
                <td>
                  <p className="text-white font-medium text-sm">{m.title}</p>
                  <p className="text-white/30 text-xs">{m.fileName || m.url}</p>
                </td>
                <td><span className="badge-blue">{m.subjectCode}</span></td>
                <td><span className="badge-purple">{m.type}</span></td>
                <td className="text-white/50 text-xs">Sem {m.semester}</td>
                <td className="text-white/30 text-xs">{new Date(m.uploadedAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {m.url && <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 p-1"><ExternalLink size={14}/></a>}
                    <button onClick={() => deleteMaterial(m.id)} className="text-red-400/60 hover:text-red-400 p-1"><Trash2 size={14}/></button>
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
