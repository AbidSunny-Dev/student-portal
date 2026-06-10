import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, PlusCircle, Trash2, Save, X } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const COLOR_OPTIONS = ['primary', 'purple', 'green', 'teal', 'yellow', 'accent'];
const SUBJECT_OPTIONS = [
  { code: 'CSE301', name: 'Database Management Systems' },
  { code: 'CSE302', name: 'Operating Systems' },
  { code: 'CSE303', name: 'Algorithm Design & Analysis' },
  { code: 'CSE304', name: 'Computer Networks' },
  { code: 'CSE305', name: 'Software Engineering' },
  { code: 'CSE306L', name: 'DBMS Lab' },
  { code: 'CSE307L', name: 'OS Lab' },
];

const colorMap = {
  primary: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
  purple:  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  green:   'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  teal:    'bg-teal-500/20 text-teal-400 border-teal-500/30',
  yellow:  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  accent:  'bg-accent-500/20 text-accent-400 border-accent-500/30',
};

const emptySlot = { time: '', subject: 'Database Management Systems', code: 'CSE301', room: '', faculty: '', color: 'primary' };

export const ManageRoutine = () => {
  const { routine, updateRoutine } = useAuth();
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [editSlots, setEditSlots] = useState(null);
  const [saved, setSaved] = useState(false);

  const startEdit = (day) => {
    setSelectedDay(day);
    setEditSlots([...(routine[day] || []).map(s => ({ ...s }))]);
  };

  const addSlot = () => setEditSlots(p => [...p, { ...emptySlot }]);
  const removeSlot = (i) => setEditSlots(p => p.filter((_, j) => j !== i));
  const updateSlot = (i, field, val) => setEditSlots(p => p.map((s, j) => j === i ? { ...s, [field]: val } : s));
  const handleSubjectChange = (i, code) => {
    const s = SUBJECT_OPTIONS.find(s => s.code === code);
    updateSlot(i, 'code', code);
    updateSlot(i, 'subject', s?.name || '');
  };

  const handleSave = () => {
    updateRoutine(selectedDay, editSlots);
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditSlots(null); }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Calendar size={20} className="text-purple-400" />
        </div>
        <div>
          <h1 className="section-title">Manage Routine</h1>
          <p className="section-subtitle">Class schedule — CSE | Batch 61 | Section F | Semester 3.1</p>
        </div>
      </div>

      {/* Day cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS.map(day => {
          const slots = routine[day] || [];
          return (
            <div key={day} className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-white">{day}</h3>
                <button onClick={() => startEdit(day)} className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  Edit
                </button>
              </div>
              {slots.length === 0 ? (
                <p className="text-xs text-white/20 text-center py-3">No classes</p>
              ) : (
                slots.map((slot, i) => (
                  <div key={i} className={`mb-2 p-2 rounded-lg border ${colorMap[slot.color] || colorMap.primary} text-xs`}>
                    <p className="font-medium opacity-70 mb-0.5">{slot.time}</p>
                    <p className="font-semibold text-white">{slot.subject}</p>
                    <p className="opacity-50">{slot.room} · {slot.code}</p>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Edit panel */}
      {editSlots && (
        <div className="glass-card p-6 border-primary-500/20 animate-slide-up">
          <h2 className="font-display font-bold text-white mb-4">Editing: {selectedDay}</h2>
          <div className="space-y-3">
            {editSlots.map((slot, i) => (
              <div key={i} className="p-4 bg-surface-700/50 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/60">Slot {i + 1}</span>
                  <button onClick={() => removeSlot(i)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Time</label>
                    <input type="text" placeholder="08:00 - 09:30" value={slot.time}
                      onChange={e => updateSlot(i, 'time', e.target.value)} className="input-field text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Subject</label>
                    <select value={slot.code} onChange={e => handleSubjectChange(i, e.target.value)} className="select-field text-xs">
                      {SUBJECT_OPTIONS.map(s => <option key={s.code} value={s.code}>{s.code}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Room</label>
                    <input type="text" placeholder="Room 201" value={slot.room}
                      onChange={e => updateSlot(i, 'room', e.target.value)} className="input-field text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Faculty</label>
                    <input type="text" placeholder="Faculty name" value={slot.faculty}
                      onChange={e => updateSlot(i, 'faculty', e.target.value)} className="input-field text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Color</label>
                    <select value={slot.color} onChange={e => updateSlot(i, 'color', e.target.value)} className="select-field text-xs">
                      {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addSlot} className="btn-secondary flex items-center gap-2 text-sm"><PlusCircle size={14}/>Add Slot</button>
            <button onClick={handleSave} className={`btn-primary flex items-center gap-2 text-sm ${saved ? 'opacity-80' : ''}`}>
              <Save size={14}/>{saved ? 'Saved!' : 'Save Routine'}
            </button>
            <button onClick={() => setEditSlots(null)} className="btn-secondary flex items-center gap-2 text-sm"><X size={14}/>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
