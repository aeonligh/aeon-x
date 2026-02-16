# AEON X - Pharmacy Mastery Engine

An intelligent, closed-loop study and testing engine for UNIBEN Pharmacy students. AEON X converts past examination data into guaranteed mastery outcomes.

## 🚀 Key Features

- **Intelligent PDF Ingestion**: Automated extraction of questions, options, and explanations from past-question PDFs.
- **Topic Mapping**: Automatic classification of questions into the Pharmacy syllabus topics using keyword-based intelligence.
- **Mastery-Based Testing**:
  - **Practice Mode**: Immediate corrective feedback with professional pharmacy explanations.
  - **Exam Mode**: Timed CBT-accurate simulation with locked answers.
- **Failure-Prevention Logic**:
  - Prioritizes weak questions (40% of test sets).
  - Implements a **24-72 hour reinforcement rule** for failed items to ensure long-term retention.
- **Progress Intelligence**: Real-time Mastery Dashboard visualizing conceptual gaps and improvement paths.
- **Minimalist UI**: Zero-distraction, mobile-first design aligned with UNIBEN's professional aesthetic.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strictly Typed)
- **Database**: [SQLite](https://sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Engine**: [pdf-parse](https://www.npmjs.com/package/pdf-parse) (Modern Fork)
- **Validation**: [Zod](https://zod.dev/)

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 20.x or higher
- npm or yarn

### 2. Installation
```bash
git clone <repository-url>
cd aeon-x
npm install
```

### 3. Database Initialization
```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start your mastery journey.

## 🧪 Testing
Run the automated test suite to ensure system integrity:
```bash
npm run test
```

## ✨ Creator Credit
Built by **Anthony Adogbeji Odjegba (AEONLight ✨)**.
Designed for academic excellence in the University of Benin (UNIBEN) Pharmacy curriculum.

## ⚖️ License
MIT
