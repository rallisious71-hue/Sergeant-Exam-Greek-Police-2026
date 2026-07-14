import { useState, useEffect } from 'react'
import ARTICLES from '../data/articles.json'
import { catClass, shuffle } from '../utils'
import { useStorage } from '../hooks/useStorage'
import styles from './Flashcards.module.css'

const FILTERS = [
  { id: 'all', label: 'Όλα' },
  { id: 'pk', label: 'ΠΚ' },
  { id: 'kpd', label: 'ΚΠΔ' },
  { id: 'ast', label: 'Αστ.Δ' },
  { id: 'flagged', label: '★ Δύσκολα' },
]

export default function Flashcards({ flagged }) {
  const [filter, setFilter] = useState('all')
  const [deck, setDeck] = useState([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reviews, setReviews] = useStorage('fcReview', {})

  useEffect(() => {
    buildDeck(filter)
  }, [filter, flagged])

  function buildDeck(f) {
    let pool = ARTICLES
    if (f === 'pk') pool = ARTICLES.filter(a => catClass(a.category) === 'pk')
    else if (f === 'kpd') pool = ARTICLES.filter(a => catClass(a.category) === 'kpd')
    else if (f === 'ast') pool = ARTICLES.filter(a => catClass(a.category) === 'ast')
    else if (f === 'flagged') pool = ARTICLES.filter(a => flagged.includes(a.id))

    const order = { wrong: 0, unsure: 1, right: 3 }
    const sorted = [...pool].sort((a, b) =>
      (order[reviews[a.id]] ?? 2) - (order[reviews[b.id]] ?? 2)
    )
    setDeck(sorted)
    setIdx(0)
    setFlipped(false)
  }

  function doShuffle() {
    setDeck(d => shuffle(d))
    setIdx(0)
    setFlipped(false)
  }

  function rate(r) {
    const a = deck[idx]
    if (a) {
      const updated = { ...reviews, [a.id]: r }
      setReviews(updated)
    }
    next()
  }

  function next() {
    if (idx < deck.length - 1) {
      setIdx(i => i + 1)
      setFlipped(false)
    } else {
      buildDeck(filter)
    }
  }

  function prev() {
    if (idx > 0) {
      setIdx(i => i - 1)
      setFlipped(false)
    }
  }

  const article = deck[idx]
  const pct = deck.length ? ((idx + 1) / deck.length) * 100 : 0

  const ratedRight = Object.values(reviews).filter(v => v === 'right').length
  const ratedWrong = Object.values(reviews).filter(v => v === 'wrong').length

  return (
    <div className={styles.page}>
      {/* Filter bar */}
      <div className={styles.controls}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`${styles.pill} ${styles[f.id]} ${filter === f.id ? styles.active : ''}`}
            onClick={() => { setFilter(f.id); buildDeck(f.id) }}
          >
            {f.label}
          </button>
        ))}
        <button className={styles.shuffleBtn} onClick={doShuffle}>⇌ Ανακάτεμα</button>
        <div className={styles.fcInfo}>
          <span style={{ color: 'var(--accent3)' }}>✓ {ratedRight}</span>
          {' / '}
          <span style={{ color: 'var(--danger)' }}>✗ {ratedWrong}</span>
          {' · '}
          {idx + 1}/{deck.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>

      {/* Flashcard */}
      {article ? (
        <>
          <div
            className={`${styles.card} ${flipped ? styles.flipped : ''}`}
            onClick={() => setFlipped(f => !f)}
          >
            <div className={styles.badge}>{article.category}</div>
            <div className={styles.artNum}>Άρθρο {article.number}</div>
            <div className={styles.artTitle}>{article.title}</div>
            {flipped && (
              <div className={styles.artContent}>{article.content}</div>
            )}
            {!flipped && (
              <div className={styles.hint}>👆 Κλικ για να δεις το κείμενο</div>
            )}
          </div>

          {flipped && (
            <div className={styles.rateButtons}>
              <button className={`${styles.rateBtn} ${styles.wrong}`} onClick={() => rate('wrong')}>✗ Δεν το ξέρω</button>
              <button className={`${styles.rateBtn} ${styles.unsure}`} onClick={() => rate('unsure')}>~ Σχεδόν</button>
              <button className={`${styles.rateBtn} ${styles.right}`} onClick={() => rate('right')}>✓ Το ξέρω</button>
            </div>
          )}

          <div className={styles.navButtons}>
            <button className={`${styles.navBtn}`} onClick={prev}>← Προηγ.</button>
            <button className={`${styles.navBtn}`} onClick={() => setFlipped(f => !f)}>↕ Flip</button>
            <button className={`${styles.navBtn}`} onClick={next}>Επόμ. →</button>
          </div>
        </>
      ) : (
        <div className={styles.empty}>Δεν υπάρχουν άρθρα σε αυτή την κατηγορία</div>
      )}
    </div>
  )
}
