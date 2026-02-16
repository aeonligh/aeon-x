# AEON X - Pharmacy Mastery Engine

An intelligent study and testing engine for UNIBEN Pharmacy students. Designed as a "recipe" for academic mastery.

## Features
- **PDF Ingestion**: Upload past questions and extract them automatically.
- **Topic Mapping**: Questions are classified by syllabus topics.
- **Mastery Testing**: CBT-style interface with Practice and Exam modes.
- **Failure-Prevention**: Weak questions are prioritized with a 24-72h reinforcement rule.
- **Progress Intelligence**: Visual dashboard tracking your mastery levels.
- **Minimalist UI**: UNIBEN-aligned mobile-first design.

## Tech Stack
- **Next.js 15+** (App Router)
- **Prisma** with **SQLite**
- **Tailwind CSS 4**
- **Lucide Icons**
- **pdf-parse** (Modern fork)

## Getting Started

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd aeon-x
npm install
```

### 2. Database Setup
```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

### 3. Run Development Server
```bash
npm run dev
```

## Creator Credit
Built by **Anthony Adogbeji Odjegba (AEONLight ✨)**.
Designed specifically for the University of Benin (UNIBEN) Pharmacy curriculum.

## License
MIT
