import { useState } from 'react'
import Nav from './components/Nav'
import ArticleList from './pages/ArticleList'
import Flashcards from './pages/Flashcards'
import Quiz from './pages/Quiz'
import StudyPlan from './pages/StudyPlan'
import ArticleModal from './components/ArticleModal'
import ARTICLES from './data/articles.json'
import { useStorage } from './hooks/useStorage'

export default function App() {
  const [page, setPage] = useState('list')
  const [learned, setLearned] = useStorage('learned', [])
  const [flagged, setFlagged] = useStorage('flagged', [])

  // For opening an article from StudyPlan
  const [planModalId, setPlanModalId] = useState(null)

  function toggleLearned(id) {
    setLearned(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function toggleFlag(id) {
    setFlagged(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function addFlag(id) {
    setFlagged(prev => prev.includes(id) ? prev : [...prev, id])
  }

  return (
    <>
      <Nav activePage={page} onNavigate={setPage} />

      {page === 'list' && (
        <ArticleList
          learned={learned}
          flagged={flagged}
          onToggleLearned={toggleLearned}
          onToggleFlag={toggleFlag}
        />
      )}

      {page === 'flash' && (
        <Flashcards
          flagged={flagged}
        />
      )}

      {page === 'quiz' && (
        <Quiz
          flagged={flagged}
          onFlag={addFlag}
        />
      )}

      {page === 'plan' && (
        <StudyPlan
          learned={learned}
          flagged={flagged}
          onOpenArticle={(id) => setPlanModalId(id)}
        />
      )}

      {planModalId !== null && (
        <ArticleModal
          articleId={planModalId}
          onClose={() => setPlanModalId(null)}
          onNext={() => setPlanModalId(id => (id + 1) % ARTICLES.length)}
          onPrev={() => setPlanModalId(id => (id - 1 + ARTICLES.length) % ARTICLES.length)}
          learned={learned}
          flagged={flagged}
          onToggleLearned={toggleLearned}
          onToggleFlag={toggleFlag}
        />
      )}
    </>
  )
}
