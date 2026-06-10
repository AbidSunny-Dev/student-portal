import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileQuestion, Search, ChevronDown, ChevronUp, Filter, BookOpen } from 'lucide-react';

const examColors = { Final: 'badge-red', Mid: 'badge-yellow', Quiz: 'badge-blue' };

const QuestionSetCard = ({ qSet }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-white/3 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={examColors[qSet.examType] || 'badge-blue'}>{qSet.examType} Exam</span>
            <span className="badge-blue">{qSet.subjectCode}</span>
            <span className="badge-purple">Sem {qSet.semester}</span>
            <span className="badge text-white/40 bg-surface-700 border-white/10">Year: {qSet.year}</span>
          </div>
          <h3 className="font-semibold text-white">{qSet.subject}</h3>
          <p className="text-xs text-white/30 mt-1">
            {qSet.questions.length} question{qSet.questions.length !== 1 ? 's' : ''}
            {qSet.fileUrl && ' · PDF available'}
            · Posted by {qSet.uploadedBy}
          </p>
        </div>
        <div className="text-white/40 flex-shrink-0 mt-1">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 animate-fade-in">
          <div className="mt-4 space-y-3">
            {qSet.questions.map((q, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-white/80 leading-relaxed pt-0.5">{q}</p>
              </div>
            ))}
          </div>
          {qSet.fileUrl && (
            <a
              href={qSet.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 btn-secondary text-sm"
            >
              <BookOpen size={14} /> Download PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export const QuestionBankPage = () => {
  const { questions } = useAuth();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [examFilter, setExamFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const subjects = ['all', ...new Set(questions.map(q => q.subjectCode))];
  const years = ['all', ...new Set(questions.map(q => q.year)).values()].sort().reverse();
  const examTypes = ['all', 'Final', 'Mid', 'Quiz'];

  const filtered = questions.filter(q => {
    const matchSearch = q.subject.toLowerCase().includes(search.toLowerCase()) ||
                        q.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
                        q.questions.some(qs => qs.toLowerCase().includes(search.toLowerCase()));
    const matchSubject = subjectFilter === 'all' || q.subjectCode === subjectFilter;
    const matchExam = examFilter === 'all' || q.examType === examFilter;
    const matchYear = yearFilter === 'all' || q.year === yearFilter;
    return matchSearch && matchSubject && matchExam && matchYear;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
          <FileQuestion size={20} className="text-red-400" />
        </div>
        <div>
          <h1 className="section-title">Question Bank</h1>
          <p className="section-subtitle">{questions.length} question sets · Previous exam questions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="select-field sm:w-40">
          {subjects.map(s => <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>)}
        </select>
        <select value={examFilter} onChange={e => setExamFilter(e.target.value)} className="select-field sm:w-36">
          {examTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All Exams' : t}</option>)}
        </select>
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="select-field sm:w-32">
          {years.map(y => <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>)}
        </select>
      </div>

      <p className="text-xs text-white/30">{filtered.length} question set{filtered.length !== 1 ? 's' : ''} found</p>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-white/30">
            <FileQuestion size={40} className="mx-auto mb-3 opacity-30" />
            <p>No questions found.</p>
          </div>
        ) : (
          filtered.map(q => <QuestionSetCard key={q.id} qSet={q} />)
        )}
      </div>
    </div>
  );
};
