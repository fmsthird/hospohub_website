# Hospo Hub - Auckland Council Licensing Prototype

A complete React JS prototype for an Auckland Council-style hospitality licensing service portal.

## Tech Stack
- React JS
- Vite
- React Router DOM
- Tailwind CSS
- React Icons
- LocalStorage (Mock Database)

## Features
- **Public Service Portal:** Clean, government-style interface for finding requirements, applying, and tracking applications.
- **Requirements Wizard:** Multi-step tool to determine necessary licences based on business type and activities.
- **Application Flow:** Standardized forms for submitting applications and uploading supporting documents.
- **Application Tracker:** Timeline UI to check the status of submitted applications.
- **Logged-in Business Portal:** Comprehensive dashboard for hospitality operators.
- **Document Vault:** Manage uploaded compliance documents, licences, and certificates.
- **Training Centre:** Track required compliance training (e.g. Food Safety, Host Responsibility).
- **Messages Inbox:** Mock communication interface with council licensing teams.

## Run locally

```bash
npm install
npm run dev
```

The app will start at `http://localhost:5173`.

## Prototype Limitations
- This is a UI prototype. No backend is implemented.
- Data persistence uses `localStorage`. Refreshing the page preserves state, but clearing browser data resets it.
- No login is required. Public, operator and prototype staff routes can be opened directly for demonstration purposes.
