import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, PlusCircle, Trash2, Edit3, Save, X, Search } from 'lucide-react';

const CATEGORIES = ['General', 'Exam', 'Assignment', 'Event', 'Holiday', 'Routine', 'Result'];
const PRIORITIES = ['high', 'medium', 'low'];

const emptyNotice = { title: '', content: '', priority: 'medium', category: 'General' };

export const ManageNotices = () => {
  const { notices, addNotice, updateNotice, deleteNotice } = useAuth();
  const [form, setForm] = useState(emptyNotice);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateNotice(editId, form);
      setEditId(null);
    } else {
      addNotice(form);
    }
    setForm(emptyNotice);
    setShowForm(false);
  };

  const startEdit = (n) => {
    setForm({ title: n.title, content: n.content, priority: n.priority, category: n.category });
    setEditId(n.id);
    setShowForm(true);
  };

  const cancel = () => { setForm(emptyNotice); setEditId(null); setShowForm(false); };

  const filtered = notices.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  const priorityColors = { high: 'badge-red', medium: 'badge-yellow', low: 'badge-green' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Bell size={20} className="text-purple-400" />
          </div>
          <div>
            <h1 className="section-title">Manage Notices</h1>
            <p className="section-subtitle">{notices.length} notices total</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyNotice); }}
          className="btn-primary flex items-center gap-2">
          <PlusCircle size={16} /> Add Notice
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6 border-primary-500/20 animate-slide-up">
          <h2 className="font-display font-bold text-white mb-4">{editId ? 'Edit Notice' : 'New Notice'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text" required placeholder="Notice title"
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input-field"
            />
            <textarea
              required rows={4} placeholder="Notice content..."
              value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              className="input-field resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="select-field">
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="select-field">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2"><Save size={15}/>{editId ? 'Update' : 'Post'} Notice</button>
              <button type="button" onClick={cancel} className="btn-secondary flex items-center gap-2"><X size={15}/>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input type="text" placeholder="Search notices..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Title</th><th>Category</th><th>Priority</th><th>Posted</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(n => (
              <tr key={n.id}>
                <td className="max-w-xs">
                  <p className="text-white font-medium truncate">{n.title}</p>
                  <p className="text-white/30 text-xs truncate">{n.content.slice(0, 60)}...</p>
                </td>
                <td><span className="badge-purple">{n.category}</span></td>
                <td><span className={priorityColors[n.priority]}>{n.priority}</span></td>
                <td className="text-white/40 text-xs">{new Date(n.postedAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(n)} className="text-primary-400 hover:text-primary-300 transition-colors p-1"><Edit3 size={14}/></button>
                    <button onClick={() => deleteNotice(n.id)} className="text-red-400/60 hover:text-red-400 transition-colors p-1"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center text-white/30 py-8">No notices found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
