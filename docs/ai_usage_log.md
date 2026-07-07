# AI Usage Log - NOTORY

## Day 1 (June 30, 2026) - Project Planning & Conceptualization

### 1. Prompts Used & Tasks Completed
* **Prompt:** Initial scoping of the Proof of Concept.
  * **Outcome:** Defined the project goals for **NOTORY** (an AI note-taking app) and mapped out the required tech stack: React, Tailwind CSS, Node.js, Express, Firebase Firestore, and a Generative AI API.

### 2. Key Decisions Made
* Chose a backend-integrated database setup (Option A) to prevent security exposure of database credentials and LLM keys on the client-side.

---

## Day 2 (July 2, 2026) - Repository Setup & CI Foundation

### 1. Prompts Used & Tasks Completed
* **Prompt:** *"i have added the license but i cant see it in my vs also in my vs the updates arent pushed yet give me instruction to do dont create anthing"*
  * **Outcome:** Synced the MIT License from GitHub, configured a custom `.gitignore` to protect node modules and `.env` files, and wrote a professional `README.md`.
* **Prompt:** Configuration of the initial CI pipeline.
  * **Outcome:** Switched to the `develop` branch and configured `.github/workflows/ci.yml` to verify the Node.js environment automatically on every git push.

### 2. Key Code Generated
* Created the base `.gitignore` and `README.md` templates.
* Created the initial `.github/workflows/ci.yml` runner script.

This log documents the collaboration between the developer and the AI coding assistant (Antigravity) during the development of NOTORY on Day 3. 
**Date:** 02/03 July 2026

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


---

## Day 4 (July 6, 2026) - AI Integration & Security Testing

### 1. Prompts Used & Tasks Completed
* **Prompt:** *"lets start day 4 work someone recommended me using gemini bc i have gemini pro not plus"*
  * **Outcome:** Planned the integration of Gemini API routes for Title Generation, Summarization, and Writing Enhancement.
* **Prompt:** *"its still loading i have a GROQ_API_KEY i used before in project how about we use that ?"*
  * **Outcome:** Pivoted from the Google Gemini SDK to the **Groq SDK** using the `llama-3.1-8b-instant` model due to Google AI Studio registration delays.
* **Prompt:** *"update the index.js as well ... Error: Cannot find module 'groq-sdk' ... ill compare and pull the request now ?"*
  * **Outcome:** Separated the Express app setup (`app.js`) from the listener (`index.js`) to support standalone Jest unit tests, resolved path imports, and fixed missing dependency pushes.
* **Prompt:** *"they lock it right nothing happens to security ?"*
  * **Outcome:** Discussed security best practices for environment variables in cloud hosting environments (Vercel) and updated `firebase.js` to parse JSON strings at runtime rather than requiring static files.

### 2. Key Code Generated
* **AI Endpoints (Groq):** Integrated three Llama 3 endpoints (`/api/ai/title`, `/api/ai/summarize`, `/api/ai/enhance`) in `app.js`.
* **Vercel Serverless Configurations:** Created `vercel.json` routing rules and refactored backend server startup checks.
* **Jest Unit Tests:** Wrote `server/app.test.js` using `supertest` and created mock interfaces for `firebase-admin` to run tests without needing credentials in the CI pipeline.
* **Dynamic API Routing:** Connected the React frontend to the deployed backend dynamically using Vite environment variables (`VITE_API_BASE_URL`).

### 3. Lessons Learned
* **API Redundancy & Flexibility:** Learned how to swap LLM providers (from Gemini to Groq) with minimal changes by encapsulating prompt logic.
* **Mocking in CI Pipelines:** Discovered that database connections should be mocked in unit tests so that CI pipelines can build successfully without exposing secret credential files.
* **Serverless Node Patterns:** Learned how to adapt an Express.js app to run as serverless functions on Vercel without active port listeners.