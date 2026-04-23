# Mahmoud Tolba Portfolio

Portfolio website for Mahmoud Tolba, a Senior Flutter Developer focused on scalable Android and iOS delivery.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Motion + Anime.js
- Firebase (optional)

## Local Development

```bash
npm install
npm run dev
```

## Content

The portfolio content is managed from:

- `src/data/portfolioData.ts`

This file contains personal info, tech stack, experience, education, certifications, and projects.

## Firebase

Firebase is optional. The site now works in `local-only` mode without credentials.

If you want live contact forms, booking, analytics, and the private dashboard, add a `.env.local` file based on `.env.example`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## GitHub Pages

The repository includes a GitHub Actions workflow for Pages deployment:

- Static export builds into `dist/`
- Base path is computed automatically from the repository name
- `404.html` is generated from `index.html` so client-side routing still works on Pages

Push to `main` after enabling GitHub Pages in the repository settings and the workflow will deploy automatically.
