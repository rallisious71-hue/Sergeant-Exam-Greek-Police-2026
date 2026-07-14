import styles from './Nav.module.css'

const TABS = [
  { id: 'list', label: 'Άρθρα' },
  { id: 'flash', label: 'Flashcards' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'plan', label: 'Πλάνο' },
]

export default function Nav({ activePage, onNavigate }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        ΑΡΧ<span>/</span>2026
      </div>
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tabBtn} ${activePage === tab.id ? styles.active : ''}`}
          onClick={() => onNavigate(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
