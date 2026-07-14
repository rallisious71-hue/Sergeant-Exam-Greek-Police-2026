import { useState } from 'react'
import ARTICLES from '../data/articles.json'
import ArticleModal from '../components/ArticleModal'
import { catClass, catShort } from '../utils'
import styles from './ArticleList.module.css'

const FILTERS = [
  { id: 'all', label: 'Όλα', cls: 'all' },
  { id: 'pk', label: 'ΠΚ', cls: 'pk' },
  { id: 'kpd', label: 'ΚΠΔ', cls: 'kpd' },
  { id: 'ast', label: 'Αστ.Δ', cls: 'ast' },
  { id: 'flagged', label: '★ Δύσκολα', cls: 'flagged' },
  { id: 'pending', label: '◌ Εκκρεμή', cls: 'pending' },
]

export default function ArticleList({ learned, flagged, onToggleLearned, onToggleFlag }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [modalId, setModalId] = useState(null)

  const filtered = ARTICLES.filter(a => {
    if (filter === 'pk' && catClass(a.category) !== 'pk') return false
    if (filter === 'kpd' && catClass(a.category) !== 'kpd') return false
    if (filter === 'ast' && catClass(a.category) !== 'ast') return false
    if (filter === 'flagged' && !flagged.includes(a.id)) return false
    if (filter === 'pending' && learned.includes(a.id)) return false
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.number.includes(search)) return false
    return true
  })

  const pct = Math.round(learned.length / ARTICLES.length * 100)

  const handleModalNext = () => {
    if (modalId === null) return
    setModalId((modalId + 1) % ARTICLES.length)
  }

  const handleModalPrev = () => {
    if (modalId === null) return
    setModalId((modalId - 1 + ARTICLES.length) % ARTICLES.length)
  }

  return (
    <div className={styles.page}>
      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{ARTICLES.length}</div>
          <div className={styles.statLbl}>Σύνολο</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--accent3)' }}>{learned.length}</div>
          <div className={styles.statLbl}>Μάθατε</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--accent2)' }}>{flagged.length}</div>
          <div className={styles.statLbl}>Δύσκολα</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{pct}%</div>
          <div className={styles.statLbl}>Πρόοδος</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <input
          type="text"
          placeholder="Αναζήτηση άρθρου ή τίτλου..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`${styles.pill} ${styles[f.cls]} ${filter === f.id ? styles.active : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            Δεν βρέθηκαν άρθρα
          </div>
        ) : filtered.map(a => {
          const cc = catClass(a.category)
          const isLearned = learned.includes(a.id)
          const isFlagged = flagged.includes(a.id)
          return (
            <div
              key={a.id}
              className={`${styles.item} ${isLearned ? styles.itemLearned : ''} ${isFlagged ? styles.itemFlagged : ''}`}
              onClick={() => setModalId(a.id)}
            >
              <span className={styles.artNum}>Άρθρο {a.number}</span>
              <span className={styles.artTitle}>{a.title}</span>
              <span className={`${styles.artCat} ${styles[cc]}`}>{catShort(a.category)}</span>
              <span className={styles.artStatus}>
                {isLearned ? '✓' : isFlagged ? '★' : ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {modalId !== null && (
        <ArticleModal
          articleId={modalId}
          onClose={() => setModalId(null)}
          onNext={handleModalNext}
          onPrev={handleModalPrev}
          learned={learned}
          flagged={flagged}
          onToggleLearned={onToggleLearned}
          onToggleFlag={onToggleFlag}
        />
      )}
    </div>
  )
}
