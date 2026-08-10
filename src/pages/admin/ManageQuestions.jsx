import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileQuestion, PlusCircle, Trash2, Edit2, X, Save } from 'lucide-react';

const SUBJECTS = [
  { code: 'CSE301', name: 'Database Management Systems' },
  { code: 'CSE302', name: 'Operating Systems' },
  { code: 'CSE303', name: 'Algorithm Design & Analysis' },
  { code: 'CSE304', name: 'Computer Networks' },
  { code: 'CSE305', name: 'Software Engineering' },
];
const SEMESTERS = ['1.1','1.2','1.3','2.1','2.2','2.3','3.1','3.2','3.3'];

const emptyQuestion = { subject: 'Database Management Systems', subjectCode: 'CSE301', year: '2024', examType: 'Final', semester: '3.1', questions: [''], fileUrl: '' };

export const ManageQuestions = () => {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useAuth();
  const [form, setForm] = useState(emptyQuestion);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleSubjectChange = (code) => {
    const s = SUBJECTS.find(s => s.code === code);
    setForm(p => ({ ...p, subjectCode: code, subject: s?.name || '' }));
  };

  const addQ = () => setForm(p => ({ ...p, questions: [...p.questions, ''] }));
  const removeQ = (i) => setForm(p => ({ ...p, questions: p.questions.filter((_, j) => j !== i) }));
  const updateQ = (i, val) => setForm(p => ({ ...p, questions: p.questions.map((q, j) => j === i ? val : q) }));

  const handleEdit = (qSet) => {
    setEditingId(qSet.id);
    setForm({
      subject: qSet.subject || '',
      subjectCode: qSet.subjectCode || 'CSE301',
      year: qSet.year || '2024',
      examType: qSet.examType || 'Final',
      semester: qSet.semester || '3.1',
      questions: qSet.questions?.length ? [...qSet.questions] : [''],
      fileUrl: qSet.fileUrl || '',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(emptyQuestion);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedQuestions = form.questions.filter(q => q.trim());
    const payload = { ...form, questions: cleanedQuestions };

    if (editingId) {
      updateQuestion(editingId, payload);
    } else {
      addQuestion(payload);
    }
    handleCancel();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <FileQuestion size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="section-title">Question Bank</h1>
            <p className="section-subtitle">{questions.length} question sets</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm(emptyQuestion); setShowForm(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Questions
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 border-red-500/20 animate-slide-up">
          <h2 className="font-display font-bold text-white mb-4">
            {editingId ? 'Edit Question Set' : 'Add Question Set'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Subject</label>
                <select value={form.subjectCode} onChange={e => handleSubjectChange(e.target.value)} className="select-field">
                  {SUBJECTS.map(s => <option key={s.code} value={s.code}>{s.code}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Exam Type</label>
                <select value={form.examType} onChange={e => setForm(p => ({ ...p, examType: e.target.value }))} className="select-field">
                  <option>Final</option><option>Mid</option><option>Quiz</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Semester</label>
                <select value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))} className="select-field">
                  {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Year</label>
                <input
                  type="number" min={2000} max={2100} value={form.year}
                  onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/40 mb-1 block">PDF URL (optional)</label>
              <input
                type="url" placeholder="https://..." value={form.fileUrl}
                onChange={e => setForm(p => ({ ...p, fileUrl: e.target.value }))} className="input-field"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 mb-2 block">Questions</label>
              <div className="space-y-2">
                {form.questions.map((q, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="w-6 h-9 flex items-center justify-center text-xs text-white/30 font-bold flex-shrink-0">{i+1}.</span>
                    <input
                      type="text" placeholder={`Question ${i+1}`} value={q}
                      onChange={e => updateQ(i, e.target.value)} className="input-field flex-1 text-sm"
                    />
                    <button
                      type="button" onClick={() => removeQ(i)} disabled={form.questions.length === 1}
                      className="text-white/20 hover:text-red-400 transition-colors disabled:opacity-20"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addQ} className="mt-2 text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
                <PlusCircle size={13}/> Add another question
              </button>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={15}/> {editingId ? 'Update Question Set' : 'Save Question Set'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Subject</th><th>Exam</th><th>Semester</th><th>Year</th><th>Questions</th><th>Actions</th></tr></thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id}>
                <td>
                  <p className="text-white text-sm font-medium">{q.subject}</p>
                  <span className="badge-blue text-xs">{q.subjectCode}</span>
                </td>
                <td><span className={q.examType === 'Final' ? 'badge-red' : q.examType === 'Mid' ? 'badge-yellow' : 'badge-blue'}>{q.examType}</span></td>
                <td className="text-white/50 text-sm">Sem {q.semester}</td>
                <td className="text-white/50 text-sm">{q.year}</td>
                <td className="text-white/50 text-sm">{q.questions.length} Qs</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(q)} className="text-white/60 hover:text-white p-1" title="Edit Question Set"><Edit2 size={14}/></button>
                    <button onClick={() => deleteQuestion(q.id)} className="text-red-400/60 hover:text-red-400 p-1" title="Delete Question Set"><Trash2 size={14}/></button>
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
