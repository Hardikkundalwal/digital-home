import { useState } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useExams } from '../../../hooks/useExams';

const RING_R = 20;
const RING_CIRC = 2 * Math.PI * RING_R;

function countdownColor(days) {
  if (days <= 7) return '#ef4444';
  if (days <= 14) return '#f59e0b';
  return '#22c55e';
}

function ProgressRing({ daysLeft, totalDays }) {
  const pct = Math.max(0, Math.min(1, daysLeft / Math.max(totalDays, 1)));
  const offset = RING_CIRC * (1 - pct);
  const color = countdownColor(daysLeft);
  return (
    <svg width="52" height="52" style={{ flexShrink: 0 }}>
      <circle cx="26" cy="26" r={RING_R} fill="none" stroke="var(--border)" strokeWidth="4" />
      <circle cx="26" cy="26" r={RING_R} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={RING_CIRC} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text x="26" y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{daysLeft}</text>
    </svg>
  );
}

export default function ExamsPanel() {
  const { exams, loading, addExam, deleteExam } = useExams();
  const [form, setForm] = useState({ subject: '', title: '', examDate: '', notes: '' });
  const [adding, setAdding] = useState(false);
  const today = new Date();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addExam(form);
    setForm({ subject: '', title: '', examDate: '', notes: '' });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span className="muted" style={{ fontSize: '0.85rem' }}>{exams.length} exam{exams.length !== 1 ? 's' : ''} tracked</span>
        <button className="btn-small" onClick={() => setAdding(!adding)}>
          {adding ? 'Cancel' : '+ Add exam'}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input className="input" placeholder="Subject (e.g. Math)…" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <input className="input" placeholder="Exam title (e.g. Final Exam)…" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="input" type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} required />
          <input className="input" placeholder="Notes (optional)…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button type="submit" className="btn-primary">Save exam</button>
        </form>
      )}

      {loading && <p className="muted">Loading…</p>}
      {!loading && exams.length === 0 && <p className="muted">No exams added yet. Click "+ Add exam" to track one.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {exams.map((exam) => {
          const daysLeft = differenceInCalendarDays(parseISO(exam.examDate), today);
          const totalDays = 90;
          const color = countdownColor(daysLeft);
          const past = daysLeft < 0;
          return (
            <div key={exam.id} className="exam-card" style={{ opacity: past ? 0.5 : 1 }}>
              <ProgressRing daysLeft={Math.max(0, daysLeft)} totalDays={totalDays} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.15rem' }}>{exam.subject}</p>
                <p className="muted" style={{ fontSize: '0.8rem' }}>{exam.title}</p>
                {exam.notes && <p className="muted" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{exam.notes}</p>}
                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', fontWeight: 700, color }}>
                  {past ? 'Exam passed' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                </p>
              </div>
              <button className="task-delete" onClick={() => deleteExam(exam.id)} title="Remove"><Trash2 size={15} strokeWidth={1.5} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
