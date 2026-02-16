# AEON X - UNIBEN Pharmacy Mastery Engine

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with Prisma
- **PDF Parsing**: `pdf-parse` (Modern fork)
- **UI**: Tailwind CSS 4, Lucide Icons

## Core Logic
- **PDF Ingestion**: `src/lib/pdf-parser.ts` extracts questions from uploaded PDFs.
- **Topic Mapping**: `src/lib/topic-classifier.ts` assigns topics based on keywords.
- **Mastery Testing**: `src/app/api/questions/route.ts` implements failure-prevention logic by prioritizing weak questions (40% of the test set).
- **Progress Tracking**: `src/app/api/progress/route.ts` calculates mastery based on correct/incorrect attempts stored in `UserProgress` table.

## Development
- `npm run dev`: Start development server.
- `npx prisma migrate dev`: Apply schema changes.
- `node prisma/seed.js`: Seed initial topics.

## Future Extensions
- **Leaderboards**: Add a `Score` table and a `/leaderboard` page.
- **Cohort Analytics**: Group users by year and show aggregate topic performance.
- **Lecturer Mode**: Add a `/admin` section to manually edit questions and view student analytics.
- **OCR Support**: Integrate Tesseract.js for scanned PDFs that don't have text layers.
