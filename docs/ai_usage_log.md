# AI Usage Log - NOTORY

This log documents the collaboration between the developer and the AI coding assistant (Antigravity) during the development of NOTORY on Day 3.

---

## 1. Prompts Used & Tasks Completed

* **Prompt:** *"moving to the frontend lets create requirements for each page"*
  * **Outcome:** Planned a single-page dashboard inspired by Apple Notes using React.
* **Prompt:** *"we can do view and update in another page cuz it get too complicated when coding"*
  * **Outcome:** Simplified the architecture to use state-based page toggling (`ListView` and `EditorView`) to keep components clean and manageable.
* **Prompt:** *"i installed tailwind cssv4 - npm install tailwindcss @tailwindcss/vite"*
  * **Outcome:** Configured the latest Tailwind CSS v4 in the React frontend.
* **Prompt:** *"im thinking using firebase-admin since i chose option A ?"*
  * **Outcome:** Switched from client-side Firebase to the backend `firebase-admin` SDK for a secure, server-to-server architecture.
* **Prompt:** *"Error: Cannot find module './service-account.json' ... i renamed the file and pasted on the server root"*
  * **Outcome:** Troubleshot relative path imports inside Node.js using `path.resolve` and `__dirname` to prevent location-based resolution crashes.

---

## 2. Key Code Generated
* **React Components:** Created `ListView.jsx` (notes listing, category pills, search bar) and `EditorView.jsx` (writing area, AI tools panel mockup).
* **Express & Firestore routes:** Configured CRUD routes inside `index.js` using `firebase-admin` syntax.
* **ESLint Configuration:** Configured code checking for the backend environment.

---

## 3. Lessons Learned
* **DevOps Best Practices:** Learned the difference between client-side Firebase and `firebase-admin`, ensuring credential files are ignored using `.gitignore`.
* **Path Resolution in Node:** Learned that using raw relative imports (e.g. `./key.json`) can cause crashes depending on where the terminal process is executed from. Using `path.resolve(__dirname, ...)` ensures files are resolved relative to the file location itself.
* **Tailwind v4 Integration:** Explored the simplified Vite configuration of Tailwind v4.