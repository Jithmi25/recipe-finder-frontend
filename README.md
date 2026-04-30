# Recipe Finder Frontend 🧑🏻‍🍳

Recipe Finder is a Vue 3 single-page application for discovering, filtering, saving, and sharing recipes. Users sign in with Google, browse recipes from the backend API, open recipe details in a modal, and manage saved recipes from the same interface.

## Features 📝

- Google sign-in with a persistent user session
- Recipe search and filtering by diet type
- Saved recipes view with bulk clear support
- Share recipe details through the browser share sheet or clipboard fallback
- Firebase integration for app services configured through environment variables

## Tech Stack 🛠️

- Vue 3
- Vite
- Pinia
- Axios
- Tailwind CSS
- Firebase

## Getting Started

### Prerequisites

- Node.js and npm installed locally
- A backend API running for recipe and auth requests

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a local `.env` file in the project root with the values your backend and Firebase setup require.

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id

VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
```

`VITE_API_BASE_URL` defaults to `http://localhost:3000` if it is not set. `VITE_GOOGLE_CLIENT_ID` is required for Google sign-in.

### Run the App

```bash
npm run dev
```

Open the local development URL shown by Vite in your browser.

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Project Structure

- `src/App.vue` - main application shell and UI flow
- `src/components/` - search, filter, recipe card, modal, and state components
- `src/store/` - Pinia stores for auth and recipe search state
- `src/firebase.js` - Firebase initialization
- `public/` - static assets such as the logo and login video

## Notes

- The app expects a backend that exposes recipe search, diet, favorites, and Google auth endpoints.
- Saved recipes and session data are stored in browser `localStorage`.
