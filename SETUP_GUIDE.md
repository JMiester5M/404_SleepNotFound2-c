# 🎯 Complete Next.js Migration - Setup Guide

## ✅ What's Already Done

Your Next.js app (`najah-nextjs`) is 80% complete! Here's what's working:

### ✅ Core Infrastructure
 - Next.js project with pages router
 - All CSS styles copied
 - All music files and assets in `/dist`
- Secure API routes for AI chat and task management
- Components: Navigation, VolumeControl, DashboardCard, CloudDecoration
- audioService utility (music player)

### ✅ Working Pages
- **Home Page** (`/`) - Dashboard with tasks overview
- **Homework Help** (`/homework-help`) - AI chat with SECURE API

### ⚠️ Need to Complete
Three pages have placeholder files but need code:
- `pages/timer.js`
- `pages/tasks.js`
- `pages/profile.js`

---

## 🚀 Quick Start

```bash
cd najah-nextjs
npm install
npm run dev
```

Open http://localhost:3000

**IMPORTANT:** Add your API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_key_here
```

---

## 📝 How to Complete the Remaining Pages

### Option 1: Copy & Adapt (Recommended)

For each remaining page, follow this pattern:

#### 1. Timer Page (`pages/timer.js`)

```javascript
// Copy from: src/Pages/TimerPage.jsx
// Changes needed:
// - Remove: import '../Styles/Pages.css' (already global)
// - Keep: All useState, useEffect, localStorage
// - Keep: audioService imports and logic
// - No routing changes needed (client-side only)
```

**Key sections to copy:**
- Timer countdown logic (lines 1-200)
- Music player controls (lines 200-350)
- Playlist UI (lines 350-506)

#### 2. Tasks Page (`pages/tasks.js`)

```javascript
// Copy from: src/Pages/TasksPage.jsx
// CRITICAL CHANGES - Replace localStorage with API:

// OLD (localStorage):
const [tasks, setTasks] = useState(() => {
  const raw = localStorage.getItem("tasks_v1");
  return raw ? JSON.parse(raw) : [];
});

// NEW (API):
const [tasks, setTasks] = useState([]);
useEffect(() => {
  fetch('/api/tasks')
    .then(res => res.json())
    .then(setTasks);
}, []);

// For CREATE:
fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newTask)
});

// For UPDATE:
fetch('/api/tasks', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedTask)
});

// For DELETE:
fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
```

#### 3. Profile Page (`pages/profile.js`)

```javascript
// Copy from: src/Pages/ProfilePage.jsx
// Changes needed:
// - Remove CSS import
// - localStorage for profile data can stay (or extend API)
// - All other logic stays the same
```

---

## 🔑 Key Differences to Remember

| Original (Vite + React Router) | New (Next.js) |
|-------------------------------|---------------|
| `import { Link } from 'react-router-dom'` | `import Link from 'next/link'` |
| `import '../Styles/Pages.css'` | ❌ Remove (global CSS) |
| `<Link to="/page">` | `<Link href="/page">` |
| `useLocation()` from react-router | `useRouter()` from next/router |
| localStorage for tasks | API routes (`/api/tasks`) |
| Exposed API key | Secure server-side API |

---

## 🎨 Styling Notes

- ✅ All CSS already in `styles/globals.css`
- ✅ No need to import CSS in components
- ✅ All class names work exactly the same
- ✅ Bubbles, animations, everything preserved

---

## 🗂️ File Reference Guide

### Where to find original code:
```
../src/Pages/TimerPage.jsx    → Copy to pages/timer.js
../src/Pages/TasksPage.jsx    → Copy to pages/tasks.js
../src/Pages/ProfilePage.jsx  → Copy to pages/profile.js
```

### API Routes (already done):
```
pages/api/chat.js   → Handles AI requests (SECURE)
pages/api/tasks.js  → CRUD for tasks
```

### Components (already done):
```
components/Navigation.js
components/VolumeControl.js
components/DashboardCard.js
components/CloudDecoration.js
```

---

## 🧪 Testing Checklist

After completing the pages:

```bash
# Start the dev server
npm run dev
```

Test each feature:
- [ ] Navigate to all pages via bottom nav
- [ ] Home page shows tasks
- [ ] Timer countdown works
- [ ] Music plays/pauses
- [ ] Tasks can be added/edited/deleted
- [ ] AI chat responds (check .env.local has API key!)
- [ ] Profile page loads
- [ ] Volume control works

---

## 🔐 Security Improvements

### Before (Original App):
```javascript
// ❌ BAD - API key visible in browser
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
fetch(`https://...?key=${apiKey}`)
```

### After (Next.js):
```javascript
// ✅ GOOD - API key stays on server
// Client:
fetch('/api/chat', { method: 'POST', body: ... })

// Server (pages/api/chat.js):
const apiKey = process.env.GEMINI_API_KEY; // Never sent to client!
```

---

## 📊 Project Status

```
✅ Project Setup     [████████████] 100%
✅ API Routes        [████████████] 100%
✅ Components        [████████████] 100%
✅ Styles            [████████████] 100%
⚠️  Pages            [████████░░░░]  60%
                     (2/5 complete)
```

**Total Progress: ~80% Complete**

---

## 🎯 Next Steps

1. **Complete Timer Page**
   - Open `pages/timer.js`
   - Copy code from `src/Pages/TimerPage.jsx`
   - Remove CSS imports
   - Test timer countdown and music

2. **Complete Tasks Page**  
   - Open `pages/tasks.js`
   - Copy from `src/Pages/TasksPage.jsx`
   - **Replace all localStorage with API fetches**
   - Test CRUD operations

3. **Complete Profile Page**
   - Open `pages/profile.js`
   - Copy from `src/Pages/ProfilePage.jsx`
   - Test profile settings

4. **Final Testing**
   - Test all navigation
   - Verify API key is secure
   - Check all features work

---

## 💡 Tips

### If music doesn't play:
- Check browser console for errors
 - Make sure all .mp3 files are in `/dist`

Note: A startup helper script (`scripts/ensureDistAndPublic.js`) will rename `public` to `dist` on first run and recreate `public` for Next.js compatibility. Use `npm run dev` as normal.
- Try clicking play button (browser may block autoplay)

### If API doesn't work:
- Verify `.env.local` exists with `GEMINI_API_KEY=...`
- Restart dev server after adding .env.local
- Check browser network tab for API errors

### If styles look wrong:
- Make sure `styles/globals.css` exists
- Check `_app.js` imports it
- Hard refresh browser (Ctrl+Shift+R)

---

## 🎉 When Complete

You'll have:
- ✅ Exact same app visually
- ✅ Secure API key (not exposed)
- ✅ Database-ready task storage
- ✅ Better SEO with Next.js
- ✅ Easy to deploy (Vercel, etc.)

**The app looks identical but is much more secure and professional!**
