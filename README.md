# Recipe Finder Frontend 🧑🏻‍🍳

Recipe Finder is a Vue 3 single-page application for discovering, filtering, saving, and sharing recipes. Users sign in with Google, browse recipes from the backend API, open recipe details in a modal, and manage saved recipes from the same interface.

## Features 📝

- Google sign-in with a persistent user session
- Recipe search and filtering by diet type
- Saved recipes view with bulk clear support
- Share recipe details through the browser share sheet or clipboard fallback
- Firebase integration for app services configured through environment variables

## Tech Stack 🛠️

| Technology       | Purpose                                                                       |
| ---------------- | ----------------------------------------------------------------------------- |
| **Vue 3**        | Progressive JavaScript framework for building the UI                          |
| **Vite**         | Next-generation frontend build tool for fast development and optimized builds |
| **Pinia**        | State management library for Vue (stores authentication and recipe state)     |
| **Axios**        | Promise-based HTTP client for API requests                                    |
| **Tailwind CSS** | Utility-first CSS framework for responsive styling                            |
| **Firebase**     | Backend services for authentication and real-time data (optional)             |

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher) and npm installed locally. [Download Node.js](https://nodejs.org/)
- **Git** for version control
- **A running backend API** that exposes recipe search, favorites, and Google auth endpoints
- **Google OAuth 2.0 credentials** for sign-in integration ([Set up via Google Cloud Console](https://console.cloud.google.com/))
- **Firebase project** (optional, for enhanced backend services)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd recipe-finder-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** (see Environment Variables section below)

   ```bash
   cp .env.example .env  # if available, or create .env manually
   ```

4. **Verify the setup**
   ```bash
   npm run dev
   ```
   The app should be accessible at `http://localhost:5173` (or the URL shown by Vite)

### Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint (if configured)
- `npm run type-check` - Run TypeScript type checking (if configured)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Google OAuth Configuration (Required for sign-in)
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# Firebase Configuration (Optional - for backend services)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
```

#### Environment Variable Details

| Variable                | Required | Description                                       | Default                 |
| ----------------------- | -------- | ------------------------------------------------- | ----------------------- |
| `VITE_API_BASE_URL`     | ❌ No    | Base URL for backend API requests                 | `http://localhost:3000` |
| `VITE_GOOGLE_CLIENT_ID` | ✅ Yes   | Google OAuth 2.0 Client ID for authentication     | —                       |
| `VITE_FIREBASE_*`       | ❌ No    | Firebase project credentials for backend services | —                       |

**Note:** All `VITE_` prefixed variables are exposed to the client-side code. Do **not** store sensitive secrets here.

## Project Structure

```
src/
├── App.vue                 # Main application shell and routing
├── components/             # Reusable Vue components
│   ├── RecipeCard.vue     # Individual recipe display
│   ├── RecipeModal.vue    # Recipe details modal
│   ├── SearchBar.vue      # Recipe search input
│   ├── FilterPanel.vue    # Diet type filtering
│   └── SavedRecipes.vue   # Saved recipes view
├── store/                  # Pinia state management
│   ├── authStore.js       # Google auth and user session state
│   └── recipeStore.js     # Recipe search and favorites state
├── firebase.js             # Firebase initialization and config
├── main.js                 # Vue app entry point
└── style.css              # Global styles

public/                     # Static assets
├── logo.png               # App logo
└── login-video.mp4        # Login screen video

.env                        # Environment variables (create locally)
vite.config.js             # Vite configuration
tailwind.config.js         # Tailwind CSS configuration
```

## Development

### Running the Development Server

```bash
npm run dev
```

The app runs with Vite's Hot Module Replacement (HMR), so changes are reflected instantly in the browser.

### State Management

The app uses **Pinia** for state management:

- **authStore** - Manages Google sign-in state and user session
- **recipeStore** - Manages recipe search results and saved recipes

Access stores in components with the `useAuthStore()` and `useRecipeStore()` composables.

### API Integration

The app communicates with a backend API at `VITE_API_BASE_URL` for:

- `/api/recipes` - Search and filter recipes
- `/api/recipes/:id` - Fetch recipe details
- `/api/favorites` - Manage saved recipes
- `/api/auth/google` - Google OAuth callback

Ensure your backend implements these endpoints with proper CORS headers.

## Data Storage

- **Session Data** - Stored in `localStorage` under `user-session` and `saved-recipes` keys
- **Authentication** - Google OAuth token stored in memory (persists across browser refreshes via Firebase)
- **UI State** - Pinia stores manage runtime state (cleared on page reload)

## Troubleshooting

### "Google Client ID not found"

- Verify `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Ensure the Client ID is from a Web application credential in Google Cloud Console
- Restart the dev server after updating `.env`

### Backend API requests failing

- Check that `VITE_API_BASE_URL` matches your running backend server
- Verify CORS is enabled on the backend
- Check browser console for detailed error messages
- Ensure the backend is running on the specified port

### Firebase initialization errors

- Firebase credentials are optional; the app will continue without them if Firebase is not configured
- If using Firebase, verify all Firebase environment variables are present
- Check Firebase project settings in Google Cloud Console

### Blank page or "No recipes found"

- Verify the backend API is running and accessible
- Check Network tab in DevTools for failed API requests
- Ensure at least one recipe exists in the backend database

### Styling issues or Tailwind not loading

- Run `npm install` to ensure all dependencies are installed
- Clear browser cache and restart dev server
- Verify `tailwind.config.js` exists and is properly configured

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test thoroughly
3. Commit with clear messages: `git commit -m "Add feature: description"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a pull request with a description of your changes

## Notes

- The app expects a backend that exposes recipe search, diet, favorites, and Google auth endpoints.
- Saved recipes and session data are stored in browser `localStorage`.
- All API requests use Axios with a configured base URL from environment variables.
- The app is fully responsive and works on mobile, tablet, and desktop devices.
