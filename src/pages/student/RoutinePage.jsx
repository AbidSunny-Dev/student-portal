import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

const colorMap = {
  primary: { bg: 'bg-primary-500/20', text: 'text-primary-400', border: 'border-primary-500/30' },
  purple:  { bg: 'bg-purple-500/20',  text: 'text-purple-400',  border: 'border-purple-500/30' },
  green:   { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  teal:    { bg: 'bg-teal-500/20',    text: 'text-teal-400',    border: 'border-teal-500/30' },
  yellow:  { bg: 'bg-yellow-500/20',  text: 'text-yellow-400',  border: 'border-yellow-500/30' },
  accent:  { bg: 'bg-accent-500/20',  text: 'text-accent-400',  border: 'border-accent-500/30' },
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

const ClassSlot = ({ slot }) => {
  const c = colorMap[slot.color] || colorMap.primary;
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-3 mb-2 transition-all duration-200 hover:-translate-y-0.5`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Clock size={11} className={c.text} />
        <span className={`text-xs font-medium ${c.text}`}>{slot.time}</span>
      </div>
      <p className="text-sm font-semibold text-white leading-tight">{slot.subject}</p>
      <p className="text-xs text-white/40 mt-0.5">{slot.code}</p>
      <div className="flex items-center gap-3 mt-1.5 text-xs text-white/30">
        <span className="flex items-center gap-1"><MapPin size={10} />{slot.room}</span>
        <span className="flex items-center gap-1"><User size={10} />{slot.faculty.split(' ').slice(-1)[0]}</span>
      </div>
    </div>
  );
};

export const RoutinePage = () => {
  const { routine } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Calendar size={20} className="text-purple-400" />
        </div>
        <div>
          <h1 className="section-title">Class Routine</h1>
          <p className="section-subtitle">Semester 3.1 — CSE | Batch 61 | Section F</p>
        </div>
      </div>

      {/* Info strip */}
      <div className="glass-card p-4 flex items-center gap-4 flex-wrap text-sm">
        <div className="flex items-center gap-2 text-white/60">
          <BookOpen size={15} className="text-primary-400" />
          <span>7 subjects this semester</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2 text-white/60">
          <Clock size={15} className="text-accent-400" />
          <span>Classes: 8:00 AM – 4:00 PM</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2 text-white/60">
          <Calendar size={15} className="text-emerald-400" />
          <span>Today: <span className="text-white font-medium">{todayName}</span></span>
        </div>
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(colorMap).map(([key, val]) => (
          <div key={key} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${val.bg} border ${val.border}`}>
            <span className={`w-2 h-2 rounded-full ${val.bg.replace('bg-', 'bg-').replace('/20', '')} border ${val.border}`} />
            <span className={val.text}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </div>
        ))}
      </div>

      {/* Weekly grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {days.map(day => {
          const slots = routine[day] || [];
          const isToday = day === todayName;
          return (
            <div
              key={day}
              className={`glass-card p-4 transition-all duration-200 ${isToday ? 'border-primary-500/30 glow-primary' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-white text-sm">{day}</h3>
                {isToday && <span className="badge-blue text-xs">Today</span>}
                <span className="text-xs text-white/30">{slots.length} class{slots.length !== 1 ? 'es' : ''}</span>
              </div>

              {slots.length === 0 ? (
                <div className="text-center py-6 text-white/20 text-xs">
                  <Calendar size={24} className="mx-auto mb-1 opacity-30" />
                  No classes
                </div>
              ) : (
                slots.map((slot, i) => <ClassSlot key={i} slot={slot} />)
              )}
            </div>
          );
        })}
      </div>

      {/* Full detail table */}
      <div className="glass-card p-6">
        <h2 className="font-display text-lg font-bold text-white mb-4">Detailed Schedule</h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Code</th>
                <th>Room</th>
                <th>Faculty</th>
              </tr>
            </thead>
            <tbody>
              {days.flatMap(day =>
                (routine[day] || []).map((slot, i) => (
                  <tr key={`${day}-${i}`} className={day === todayName ? 'bg-primary-500/5' : ''}>
                    <td className="font-medium text-white/80">
                      {i === 0 ? day : ''}
                      {day === todayName && i === 0 && <span className="ml-2 badge-blue text-xs">Today</span>}
                    </td>
                    <td className="font-mono text-xs text-white/60">{slot.time}</td>
                    <td className="text-white">{slot.subject}</td>
                    <td><span className="badge-blue">{slot.code}</span></td>
                    <td className="text-white/60">{slot.room}</td>
                    <td className="text-white/60">{slot.faculty}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
