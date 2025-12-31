# Najah — Study Companion

Najah is a calming, productivity-focused study companion built with Next.js. It combines a friendly dashboard, full task management, a Pomodoro-style focus timer with lofi music, and an AI-powered homework helper — all wrapped in a cohesive aesthetic.

## Overview

- Beautiful dashboard with clouds, stats, and recent tasks
- Task management with create, edit, delete, subtasks, priorities, and filters
- Focus timer with editable time, start/pause, reset, and an integrated lofi playlist
- Global audio `VolumeControl` overlay and bottom `Navigation` bar
- AI-powered Homework Helper via a secure server API (Gemini)
- Personal profile: avatar upload, display name, default timer preference, achievements and stats

## Tech Stack

- Next.js 16 (Pages Router)
- React 19
- lucide-react (icons)
- react-markdown (assistant message rendering)

## Features

- Home Dashboard: quick stats, filters, and recent tasks ([pages/index.js](pages/index.js))
- Tasks: CRUD, inline edits, priorities, due dates, and subtasks ([pages/tasks.js](pages/tasks.js))
- Timer: Pomodoro timer with lofi playlist and audio crossfade ([pages/timer.js](pages/timer.js)), powered by [utils/audioService.js](utils/audioService.js)
- Homework Help: chat UI with markdown rendering, backed by Gemini API ([pages/homework-help.js](pages/homework-help.js), [pages/api/chat.js](pages/api/chat.js))
- Profile: avatar upload, name editing with content safeguards, default timer setting, achievements, stats ([pages/profile.js](pages/profile.js))
- Global UI: bottom navigation ([components/Navigation.js](components/Navigation.js)) and floating volume control ([components/VolumeControl.js](components/VolumeControl.js))

## Project Structure

```
components/
	CloudDecoration.js
	DashboardCard.js
	Navigation.js
	VolumeControl.js
data/
	tasks.json
pages/
	_app.js
	_document.js
	homework-help.js
	index.js
	profile.js
	tasks.js
	timer.js
	api/
		chat.js
		hello.js
		tasks.js
public/
	Assets/    # add screenshots and logos here
styles/
	globals.css
	Home.module.css
utils/
	audioService.js
```

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Configure environment variables (for Homework Helper)

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

3) Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Scripts

- `dev`: start Next.js in development
- `build`: build the production bundle
- `start`: run the production server

## API Endpoints

- `POST /api/chat`: server-side proxy to Gemini (requires `GEMINI_API_KEY`)
- `GET /api/tasks`: fetch all tasks
- `POST /api/tasks`: create a task
- `PUT /api/tasks`: update a task
- `DELETE /api/tasks?id=...`: delete a task
- `GET /api/hello`: sample route

## Assets & Media

- Lofi tracks are loaded from the `public` folder (see `pages/timer.js`). Add your audio files there, e.g. `/Lofi.mp3`, `/Lofi1.mp3`, etc.
- The app logo is referenced as `/najah-logo.png` on the home page — place your logo under `public/`.
- For portfolio screenshots, add images to `public/Assets/` and reference them in this README.

## Design Notes

- Cohesive, friendly styling lives in [styles/globals.css](styles/globals.css)
- Reusable stat cards ([components/DashboardCard.js](components/DashboardCard.js)) and decorative clouds ([components/CloudDecoration.js](components/CloudDecoration.js)) support the aesthetic

## Deployment

Najah is a standard Next.js app and can be deployed to any Node-compatible host. Vercel is recommended for simplest deploys.

Basic Vercel deploy:

1) Push the repo to GitHub
2) Import the project in Vercel
3) Add `GEMINI_API_KEY` in Project → Settings → Environment Variables
4) Deploy

## License

See [LICENSE](LICENSE).

## Attribution

- Icons: lucide-react
- Markdown rendering: react-markdown

## Portfolio Blurb

Najah demonstrates a polished end-to-end web app: interactive UI with consistent design, real-time task UX, audio management with crossfades, and a secure server-side AI integration. It highlights product thinking, UX polish, and practical engineering.
