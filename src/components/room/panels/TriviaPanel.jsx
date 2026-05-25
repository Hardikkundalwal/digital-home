import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useGameScores } from '../../../hooks/useGameScores';

const CATEGORIES = [
  { label: 'General', id: 9 },
  { label: 'Science', id: 17 },
  { label: 'History', id: 23 },
  { label: 'Tech', id: 18 },
  { label: 'Sports', id: 21 },
];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

function decodeHtml(str) {
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────
function SetupScreen({ onStart, scores }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState(9);

  const avg = scores && scores.totalGames > 0
    ? Math.round(scores.totalScore / scores.totalGames)
    : null;

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Trivia challenge</h3>

      <p style={{ fontSize: '0.8rem', marginBottom: '0.4rem' }} className="muted">Difficulty</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {DIFFICULTIES.map((d) => (
          <button key={d} className={`pill-btn ${difficulty === d ? 'active' : ''}`}
            onClick={() => setDifficulty(d)} style={{ textTransform: 'capitalize' }}>{d}</button>
        ))}
      </div>

      <p style={{ fontSize: '0.8rem', marginBottom: '0.4rem' }} className="muted">Category</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`pill-btn ${category === c.id ? 'active' : ''}`}
            onClick={() => setCategory(c.id)}>{c.label}</button>
        ))}
      </div>

      <button className="btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }}
        onClick={() => onStart(difficulty, category)}>
        Start game <ArrowRight size={16} strokeWidth={1.5} />
      </button>

      {scores && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Stat label="High Score" value={scores.highScore} />
          <Stat label="Games" value={scores.totalGames} />
          {avg !== null && <Stat label="Avg Score" value={avg} />}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>{value}</p>
      <p className="muted" style={{ fontSize: '0.75rem' }}>{label}</p>
    </div>
  );
}

// ─── Playing Screen ───────────────────────────────────────────────────────────
const TIMER_SECONDS = 15;

function PlayingScreen({ questions, onFinish }) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [answers, setAnswers] = useState([]);
  const timerRef = useRef(null);

  const q = questions[qIndex];

  const prepAnswers = useCallback((question) => {
    return shuffle([
      ...question.incorrect_answers.map(decodeHtml),
      decodeHtml(question.correct_answer),
    ]);
  }, []);

  useEffect(() => {
    setAnswers(prepAnswers(q));
    setSelected(null);
    setTimeLeft(TIMER_SECONDS);
  }, [qIndex, q, prepAnswers]);

  useEffect(() => {
    if (selected !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qIndex, selected]);

  const handleAnswer = (ans) => {
    clearInterval(timerRef.current);
    const correct = decodeHtml(q.correct_answer);
    const isCorrect = ans === correct;
    setSelected(ans ?? '__timeout__');
    if (isCorrect) setScore((s) => s + 10);

    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        onFinish(isCorrect ? score + 10 : score);
      } else {
        setQIndex((i) => i + 1);
      }
    }, 1000);
  };

  const correct = decodeHtml(q.correct_answer);
  const timerPct = timeLeft / TIMER_SECONDS;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span className="muted" style={{ fontSize: '0.8rem' }}>{qIndex + 1} / {questions.length}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{score} pts</span>
      </div>

      {/* Timer bar */}
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '1rem' }}>
        <div style={{
          height: '100%', borderRadius: '2px',
          background: timerPct > 0.4 ? '#22c55e' : timerPct > 0.2 ? '#f59e0b' : '#ef4444',
          width: `${timerPct * 100}%`,
          transition: 'width 1s linear, background 0.3s',
        }} />
      </div>

      <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.4 }}>
        {decodeHtml(q.question)}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {answers.map((ans) => {
          let bg = 'var(--surface)';
          if (selected !== null) {
            if (ans === correct) bg = '#22c55e22';
            else if (ans === selected) bg = '#ef444422';
          }
          return (
            <motion.button key={ans}
              className="answer-btn"
              style={{ background: bg, border: '1px solid var(--border)', borderRadius: '8px', padding: '0.6rem 0.9rem', textAlign: 'left', cursor: selected ? 'default' : 'pointer', fontSize: '0.875rem' }}
              onClick={() => selected === null && handleAnswer(ans)}
              animate={{ backgroundColor: bg }}
              transition={{ duration: 0.3 }}
            >
              {ans}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen({ score, questions, onReplay, onMenu }) {
  const correct = Math.round(score / 10);
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{score} pts</p>
      <p className="muted" style={{ marginBottom: '1.5rem' }}>{correct} / {questions.length} correct</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button className="btn-primary" onClick={onReplay}>Play again</button>
        <button className="btn-small" onClick={onMenu}>Change settings</button>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function TriviaPanel() {
  const { scores, saveScore } = useGameScores();
  const [phase, setPhase] = useState('setup'); // setup | loading | playing | results
  const [questions, setQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [lastConfig, setLastConfig] = useState(null);
  const [error, setError] = useState('');

  const fetchQuestions = async (difficulty, category) => {
    setPhase('loading');
    setError('');
    try {
      const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.results?.length) throw new Error('No questions returned');
      setQuestions(data.results);
      setLastConfig({ difficulty, category });
      setPhase('playing');
    } catch {
      setError('Could not load questions. Check your connection and try again.');
      setPhase('setup');
    }
  };

  const handleFinish = async (score) => {
    setFinalScore(score);
    await saveScore(score);
    setPhase('results');
  };

  return (
    <AnimatePresence mode="wait">
      {phase === 'setup' && (
        <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
          <SetupScreen onStart={fetchQuestions} scores={scores} />
        </motion.div>
      )}
      {phase === 'loading' && (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <p className="muted" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading questions…</p>
        </motion.div>
      )}
      {phase === 'playing' && (
        <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <PlayingScreen questions={questions} onFinish={handleFinish} />
        </motion.div>
      )}
      {phase === 'results' && (
        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ResultsScreen
            score={finalScore}
            questions={questions}
            onReplay={() => lastConfig && fetchQuestions(lastConfig.difficulty, lastConfig.category)}
            onMenu={() => setPhase('setup')}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
