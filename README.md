# Αρχιφύλακας 2026 — Εφαρμογή Μελέτης Άρθρων

React + Vite εφαρμογή για μελέτη 382 νομικών άρθρων (ΠΚ, ΚΠΔ, Αστυνομικό Δίκαιο) για τις εξετάσεις Αρχιφυλάκων Νοεμβρίου 2026.

## Εγκατάσταση

```bash
npm install
npm run dev
```

Άνοιξε το browser στο `http://localhost:5173`

## Build για production

```bash
npm run build
npm run preview
```

## Δομή Project

```
src/
├── components/
│   ├── Nav.jsx              # Πλοήγηση
│   └── ArticleModal.jsx     # Modal προβολής άρθρου
├── pages/
│   ├── ArticleList.jsx      # Λίστα όλων των άρθρων
│   ├── Flashcards.jsx       # Μελέτη με κάρτες
│   ├── Quiz.jsx             # Quiz 4 επιλογών
│   └── StudyPlan.jsx        # Εβδομαδιαίο πλάνο
├── hooks/
│   └── useStorage.js        # localStorage hook
├── data/
│   └── articles.json        # 382 άρθρα από το PDF
└── utils.js                 # Βοηθητικές συναρτήσεις
```

## Λειτουργίες

- **Άρθρα**: Λίστα, αναζήτηση, φίλτρα ανά κατηγορία
- **Flashcards**: Spaced repetition, αξιολόγηση (ξέρω/σχεδόν/δεν ξέρω)
- **Quiz**: Ερωτήσεις 4 επιλογών, αυτόματη σήμανση δύσκολων
- **Πλάνο**: Countdown μέχρι 1/11/2026 + εβδομαδιαίο πλάνο
- Πρόοδος αποθηκεύεται αυτόματα στον browser

## Πλήκτρα (στο Modal)

- `←` / `→` — Προηγούμενο / Επόμενο άρθρο
- `L` — Σήμανση ως "Ξέρω"
- `F` — Σήμανση ως "Δύσκολο"
- `Esc` — Κλείσιμο
