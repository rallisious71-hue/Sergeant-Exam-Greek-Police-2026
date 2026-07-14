import { useState } from 'react'
import ARTICLES from '../data/articles.json'
import { catClass, shuffle } from '../utils'
import styles from './Quiz.module.css'

export default function Quiz({ flagged, onFlag }) {
  const [phase, setPhase] = useState('setup') // setup | active | result
  const [catSel, setCatSel] = useState('all')
  const [count, setCount] = useState(10)
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [chosen, setChosen] = useState(null)

  function startQuiz() {
    let pool = ARTICLES
    if (catSel === 'pk') pool = ARTICLES.filter(a => catClass(a.category) === 'pk')
    else if (catSel === 'kpd') pool = ARTICLES.filter(a => catClass(a.category) === 'kpd')
    else if (catSel === 'ast') pool = ARTICLES.filter(a => catClass(a.category) === 'ast')
    else if (catSel === 'flagged') pool = ARTICLES.filter(a => flagged.includes(a.id))

    if (pool.length < 4) { alert('Δεν υπάρχουν αρκετά άρθρα για quiz!'); return }

    const selected = shuffle(pool).slice(0, Math.min(count, pool.length))
    const qs = selected.map(a => {
      const type = Math.random() > 0.5 ? 'num2title' : 'title2num'
      const samecat = pool.filter(x => x.id !== a.id && catClass(x.category) === catClass(a.category))
      const wrongs = shuffle(samecat).slice(0, 3)

      if (type === 'num2title') {
        const options = shuffle([a.title, ...wrongs.map(w => w.title)])
        return {
          q: `Τι ορίζει το Άρθρο ${a.number};`,
          correct: a.title,
          options,
          explanation: `Άρθρο ${a.number}: ${a.title}\n\n${a.content.slice(0, 350)}${a.content.length > 350 ? '...' : ''}`,
          articleId: a.id,
        }
      } else {
        const options = shuffle([`Άρθρο ${a.number}`, ...wrongs.map(w => `Άρθρο ${w.number}`)])
        return {
          q: `Σε ποιο άρθρο ορίζεται: "${a.title}";`,
          correct: `Άρθρο ${a.number}`,
          options,
          explanation: `Άρθρο ${a.number}: ${a.title}\n\n${a.content.slice(0, 350)}${a.content.length > 350 ? '...' : ''}`,
          articleId: a.id,
        }
      }
    })

    setQuestions(qs)
    setQIdx(0)
    setScore(0)
    setAnswered(false)
    setChosen(null)
    setPhase('active')
  }

  function answer(opt) {
    if (answered) return
    setAnswered(true)
    setChosen(opt)
    const q = questions[qIdx]
    const correct = opt === q.correct
    if (correct) setScore(s => s + 1)
    else if (!flagged.includes(q.articleId)) onFlag(q.articleId)
  }

  function next() {
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1)
      setAnswered(false)
      setChosen(null)
    } else {
      setPhase('result')
    }
  }

  const q = questions[qIdx]
  const pct = questions.length ? (qIdx / questions.length) * 100 : 0
  const scorePct = questions.length ? Math.round(score / questions.length * 100) : 0

  return (
    <div className={styles.page}>
      {phase === 'setup' && (
        <div className={styles.setup}>
          <h3>⚡ Γρήγορο Quiz</h3>
          <div className={styles.setupRow}>
            <label>Κατηγορία:</label>
            <select value={catSel} onChange={e => setCatSel(e.target.value)}>
              <option value="all">Όλες</option>
              <option value="pk">Ουσιαστικό Ποινικό (ΠΚ)</option>
              <option value="kpd">Δικονομικό Ποινικό (ΚΠΔ)</option>
              <option value="ast">Αστυνομικό Δίκαιο</option>
              <option value="flagged">Μόνο Δύσκολα ★</option>
            </select>
          </div>
          <div className={styles.setupRow}>
            <label>Αριθμός ερωτήσεων:</label>
            <input
              type="number"
              value={count}
              min={5}
              max={50}
              onChange={e => setCount(parseInt(e.target.value) || 10)}
            />
          </div>
          <button className={styles.primaryBtn} onClick={startQuiz}>Έναρξη Quiz →</button>
        </div>
      )}

      {phase === 'active' && q && (
        <>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <div className={styles.questionCard}>
            <div className={styles.qHeader}>
              <span className={styles.qNum}>Ερώτηση {qIdx + 1}/{questions.length}</span>
              <span className={styles.qScore} style={{ color: 'var(--accent3)' }}>✓ {score}</span>
            </div>
            <div className={styles.qText}>{q.q}</div>
            <div className={styles.options}>
              {q.options.map(opt => {
                let cls = styles.option
                if (answered) {
                  if (opt === q.correct) cls += ' ' + styles.correct
                  else if (opt === chosen) cls += ' ' + styles.wrong
                }
                return (
                  <button
                    key={opt}
                    className={cls}
                    onClick={() => answer(opt)}
                    disabled={answered}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className={styles.explanation}>{q.explanation}</div>
            )}
            {answered && (
              <button className={styles.primaryBtn} onClick={next} style={{ marginTop: 16 }}>
                {qIdx < questions.length - 1 ? 'Επόμενη →' : 'Δες αποτελέσματα →'}
              </button>
            )}
          </div>
        </>
      )}

      {phase === 'result' && (
        <div className={styles.result}>
          <div className={styles.bigScore}>{score}/{questions.length}</div>
          <div className={styles.bigLbl}>Αποτέλεσμα Quiz</div>
          <div className={styles.msg}>
            {scorePct >= 80 ? '🎉 Εξαιρετική επίδοση!' : scorePct >= 60 ? '👍 Καλή δουλειά! Συνέχισε!' : '💪 Χρειάζεται περισσότερη μελέτη!'}
          </div>
          <div className={styles.resultActions}>
            <button className={styles.primaryBtn} onClick={startQuiz}>🔄 Νέο Quiz</button>
            <button className={styles.secondaryBtn} onClick={() => setPhase('setup')}>← Ρυθμίσεις</button>
          </div>
        </div>
      )}
    </div>
  )
}
