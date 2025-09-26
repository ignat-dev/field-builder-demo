
# Field Builder Demo

This is a dynamic form builder UI, with Firebase Realtime Database integration, available for preview at:

[https://field-builder-demo.web.app](https://field-builder-demo.web.app)


## 📁 Project Structure

```text
/
├── public/                  # Static assets (favicons, SVGs, etc.)
├── src/                     
│   ├── app/                 # Next.js app directory (routing, pages, layout)
│   │   └── api/             # API route handlers (local dev only)
│   ├── assets/              # Project images, icons, and other assets
│   ├── common/              # Shared constants and helpers
│   ├── components/          # Reusable UI components
│   ├── lib/                 # App logic and utilities
│   │   ├── api.ts           # API client (frontend)
│   │   ├── firebase.ts      # Firebase reusable exports
│   │   └── validation.ts    # Data validation logic
│   ├── services/            # Service modules (external APIs, business logic)
│   ├── styles/              # Global styles and themes
│   └── types/               # TypeScript type definitions
├── eslint.config.js         # ESLint configuration
├── firebase.json            # Firebase hosting configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Project metadata and scripts
└── tsconfig.json            # TypeScript configuration
```


## 🛠️ Tech Stack

- **Next.js:** React framework for server-side rendering, routing, and static export
- **React:** UI library for building interactive user interfaces
- **Bootstrap:** CSS framework for responsive design and UI components
- **TypeScript:** Typed superset of JavaScript for safer and maintainable code
- **SCSS:** CSS preprocessor for writing modular and maintainable styles
- **ESLint:** Linting tool for code quality and consistency
- **Firebase Realtime Database:** Cloud-hosted NoSQL database for real-time data sync
- **Firebase Hosting:** Static site hosting with CDN and HTTPS


## 💻 Local Development

Start the following command to start the dev server and open [http://localhost:3000](http://localhost:3000) to view the app.

```bash
npm run dev
```


## 📦 Commands

| Command                | Description                         |
|------------------------|-------------------------------------|
| `npm run dev`          | Start development server            |
| `npm run build`        | Build for production                |
| `npm run start`        | Start production server             |
| `npm run test`         | Run unit tests                      |
| `npm run test:coverage`| Generate test coverage report       |
| `npm run lint`         | Run ESLint checks                   |
| `npm run lint:fix`     | Fix ESLint issues                   |
| `npm run deploy`       | Deploy to Firebase Hosting          |


## ⚙️ Environment Variables

Copy `.env.template` to `.env.local` (for dev) or `.env.production` (for prod) and set the `NEXT_PUBLIC_API_URL` variable to `/api` for local development, or to a Firebase Realtime Database URL for production. Also, configure the following Firebase-related environment variables, used to initialize the Firebase app:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```


## 🚀 Deployment Instructions

1. Install Firebase CLI:
    ```bash
    npm install -g firebase-tools
    ```

2. Login with Firebase:
    ```bash
    firebase login
    ```

3. Build and deploy:
    ```bash
    npm run deploy
    ```


## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
