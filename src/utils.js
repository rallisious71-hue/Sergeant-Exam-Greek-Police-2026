export function catClass(category) {
  if (category.includes('ΠΚ') || category.includes('Ουσιαστικό')) return 'pk'
  if (category.includes('ΚΠΔ') || category.includes('Δικονομικό')) return 'kpd'
  return 'ast'
}

export function catShort(category) {
  if (category.includes('ΠΚ') || category.includes('Ουσιαστικό')) return 'ΠΚ'
  if (category.includes('ΚΠΔ') || category.includes('Δικονομικό')) return 'ΚΠΔ'
  return 'Αστ.Δ'
}

export function catColor(category) {
  const c = catClass(category)
  if (c === 'pk') return 'var(--pk)'
  if (c === 'kpd') return 'var(--kpd)'
  return 'var(--ast)'
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function daysUntil(dateStr) {
  const target = new Date(dateStr)
  const now = new Date()
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24))
}
