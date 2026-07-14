import { useEffect } from 'react'
import ARTICLES from '../data/articles.json'
import styles from './ArticleModal.module.css'

export default function ArticleModal({ articleId, onClose, onNext, onPrev, learned, flagged, onToggleLearned, onToggleFlag }) {
  const article = ARTICLES[articleId]

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'l' || e.key === 'L') onToggleLearned(articleId)
      if (e.key === 'f' || e.key === 'F') onToggleFlag(articleId)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [articleId, onClose, onNext, onPrev, onToggleLearned, onToggleFlag])

  if (!article) return null

  const isLearned = learned.includes(article.id)
  const isFlagged = flagged.includes(article.id)

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>ESC ✕</button>
        <div className={styles.num}>{article.category} · Άρθρο {article.number}</div>
        <div className={styles.title}>{article.title}</div>
        <div className={styles.content}>{article.content}</div>
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.learned} ${isLearned ? styles.active : ''}`}
            onClick={() => onToggleLearned(article.id)}
          >
            {isLearned ? '✓ Ξέρεις ήδη!' : '✓ Το ξέρω'}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.flag} ${isFlagged ? styles.active : ''}`}
            onClick={() => onToggleFlag(article.id)}
          >
            {isFlagged ? '★ Δύσκολο (αφαίρεση)' : '★ Δύσκολο'}
          </button>
          <button className={`${styles.actionBtn} ${styles.nav}`} onClick={onPrev}>← Προηγ.</button>
          <button className={`${styles.actionBtn} ${styles.nav}`} onClick={onNext}>Επόμ. →</button>
        </div>
        <div className={styles.shortcuts}>
          Πλήκτρα: <kbd>L</kbd> μάθατε · <kbd>F</kbd> δύσκολο · <kbd>←→</kbd> πλοήγηση · <kbd>Esc</kbd> κλείσιμο
        </div>
      </div>
    </div>
  )
}
