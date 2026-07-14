import ARTICLES from '../data/articles.json'
import { catClass, daysUntil } from '../utils'
import styles from './StudyPlan.module.css'

const EXAM_DATE = '2026-11-01'

const PLAN = [
  {
    label: 'Εβδ. 1',
    topic: 'Ουσιαστικό Ποινικό Δίκαιο — Γενικό Μέρος',
    filter: (arts) => arts.filter(a => catClass(a.category) === 'pk').slice(0, Math.ceil(arts.filter(a => catClass(a.category) === 'pk').length / 3)),
    color: 'var(--pk)',
  },
  {
    label: 'Εβδ. 2',
    topic: 'Ουσιαστικό Ποινικό Δίκαιο — Ειδικό Μέρος',
    filter: (arts) => {
      const pk = arts.filter(a => catClass(a.category) === 'pk')
      return pk.slice(Math.ceil(pk.length / 3))
    },
    color: 'var(--pk)',
  },
  {
    label: 'Εβδ. 3-4',
    topic: 'Δικονομικό Ποινικό Δίκαιο (ΚΠΔ)',
    filter: (arts) => arts.filter(a => catClass(a.category) === 'kpd'),
    color: 'var(--kpd)',
  },
  {
    label: 'Εβδ. 5',
    topic: 'Αστυνομικό Δίκαιο',
    filter: (arts) => arts.filter(a => catClass(a.category) === 'ast'),
    color: 'var(--ast)',
  },
  {
    label: 'Εβδ. 6',
    topic: '🔁 Επανάληψη Δύσκολων Άρθρων',
    filter: (arts, flagged) => arts.filter(a => flagged.includes(a.id)),
    color: 'var(--accent2)',
  },
]

const CATS = [
  { name: 'ΠΚ', key: 'pk', color: 'var(--pk)' },
  { name: 'ΚΠΔ', key: 'kpd', color: 'var(--kpd)' },
  { name: 'Αστ.Δ', key: 'ast', color: 'var(--ast)' },
]

export default function StudyPlan({ learned, flagged, onOpenArticle }) {
  const days = daysUntil(EXAM_DATE)

  return (
    <div className={styles.page}>
      {/* Countdown */}
      <div className={styles.countdown}>
        <div>
          <div className={styles.daysNum}>{Math.max(0, days)}</div>
          <div className={styles.daysLbl}>
            Μέρες μέχρι τις εξετάσεις
            <br />
            <span className={styles.examDate}>1 Νοεμβρίου 2026</span>
          </div>
        </div>
        <div className={styles.bars}>
          {CATS.map(c => {
            const arts = ARTICLES.filter(a => catClass(a.category) === c.key)
            const done = arts.filter(a => learned.includes(a.id)).length
            const pct = arts.length ? Math.round(done / arts.length * 100) : 0
            return (
              <div key={c.key} className={styles.barRow}>
                <div className={styles.barLbl}>{c.name}</div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${pct}%`, background: c.color }} />
                </div>
                <div className={styles.barPct}>{pct}%</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly plan */}
      {PLAN.map((p, i) => {
        const arts = p.filter(ARTICLES, flagged)
        const done = arts.filter(a => learned.includes(a.id)).length
        return (
          <div key={i} className={styles.planCard}>
            <div className={styles.planHeader}>
              <div
                className={styles.weekBadge}
                style={{ color: p.color, background: `${p.color}1a` }}
              >
                {p.label}
              </div>
              <div className={styles.planTopic}>{p.topic}</div>
              <div className={styles.planCount}>
                <span style={{ color: 'var(--accent3)' }}>{done}</span>
                /{arts.length} άρθρα
              </div>
            </div>
            <div className={styles.chips}>
              {arts.map(a => (
                <button
                  key={a.id}
                  className={`${styles.chip} ${learned.includes(a.id) ? styles.chipDone : ''}`}
                  onClick={() => onOpenArticle(a.id)}
                  title={a.title}
                >
                  Άρθ.{a.number}{learned.includes(a.id) ? ' ✓' : ''}
                </button>
              ))}
              {arts.length === 0 && (
                <span className={styles.noArts}>—</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
