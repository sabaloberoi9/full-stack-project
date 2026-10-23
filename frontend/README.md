# AI Coding Challenge Hub

An interactive technical assessment platform built with FastAPI, React (Vite), SQLite, and the Google Gemini API. The application dynamically generates multiple-choice programming and system design challenges, enforces rolling daily usage quotas, records user submissions, and tracks live accuracy analytics.

---

## Attribution and Foundation

This project originated from the tutorial [How To Build a FastAPI & React Full Stack App | Clerk, Databases, LLMs & More](https://www.youtube.com/watch?v=13tMEW8r6C0) by Tech With Tim.

The tutorial provided the architectural starting point for connecting a FastAPI backend with Clerk authentication, SQLite persistence, and an LLM generation endpoint. Building upon that foundation, this repository represents an extensive engineering overhaul that introduces domain-specific prompt engineering, database schema evolution for answer tracking, server-side accuracy aggregation, rate throttling, and bug fixes.

---

## Key Features and Architectural Overhaul

While the base tutorial demonstrated basic challenge generation, the following enhancements and systems were engineered independently:

### 1. Google Gemini AI Engine and Domain Specialization
* Shifted the AI orchestration layer to the Google Gemini API (`google-genai`).
* Expanded challenge generation from generic coding questions into four focused technical tracks:
  * Programming (Core Languages and Syntax)
  * Data Structures and Algorithms
  * Large Language Models (Prompting, Architecture, Logits)
  * Cloud Architecture


### 2. State-Driven Answer Tracking and Schema Migrations
* Modified the SQLAlchemy `Challenge` model by adding `selected_option` and `is_correct` database columns.
* Patched existing SQLite database tables safely using runtime migrations without dropping historical data.
* Implemented automatic table creation (`Base.metadata.create_all`) inside the application startup sequence.

### 3. Server-Side Validation and Analytics Engine
* Created the `PATCH /api/challenges/{id}/answer` endpoint to evaluate selected answers server-side, verify against the correct option ID, and persist results.
* Built the `GET /api/stats` endpoint using SQLAlchemy query filters to aggregate:
  * Total questions answered
  * Total correct answers
  * Real-time accuracy percentage
* Integrated an instant-refresh metrics banner directly into the UI header.

### 4. Strict Daily Quota Throttling
* Replaced development quotas with an enforced production-style limit of **5 challenges per 24-hour rolling window**.
* Implemented HTTP 429 rate-limit exception handling in FastAPI with client-side UI lockouts when remaining quota reaches zero.

### 5. Developer GitHub Authentication
* Integrated Clerk SSO Social Connections to enable one-click GitHub OAuth logins for software developers alongside standard email authentication.

### 6. React Component Recycling Bug Fix
* Diagnosed and fixed a critical UI bug where selecting an option on an initial question caused subsequent newly generated questions to render as already answered.
* Implemented strict component lifecycle re-mounting via unique identification keys (`key={challenge.id}`).

---

## The Dark Mode Saga: An Engineering Retrospective

During development, an effort was made to introduce an ambitious slate-and-navy night mode (`#0f172a` canvas, dark inputs, and styled Clerk authentication modals).

What followed was a reminder that theming a hybrid component ecosystem requires careful coordination across styling layers.

### The Conflict
1. **Third-Party Modal Collisions:** Clerk comes with its own robust styling layer. Injecting third-party theme packages collided with custom CSS variables, turning login inputs into low-contrast grey boxes and leaving modal text partially invisible.
2. **Cascading Contrast Collapse:** Applying dark container styles broke local component styling. Text elements, question option buttons, and card borders retained inherited light-theme styles, producing an unreadable UI with white text on off-white backgrounds and washed-out borders.
3. **Cognitive Fatigue:** Instead of looking like a sleek terminal, the interface felt disjointed and painful to navigate. Multiple-choice questions require instant legibility, clean visual feedback, and crisp green and red result indicators.

### The Engineering Decision
Rather than spending hours writing complex CSS specificity overrides to fight third-party iframe and modal layers, the decision was made to scrap the night theme entirely. 

The UI was rolled back and standardized around an intentional, high-contrast light slate theme (`#f8fafc` background, crisp white container cards, deep slate typography, and soft semantic feedback badges). Clean ergonomics, proper contrast, and readable content prioritize user experience over aesthetic complexity.

---

## Tech Stack

* **Backend:** FastAPI (Python 3.12+), Uvicorn
* **Database & ORM:** SQLite, SQLAlchemy
* **AI Provider:** Google Gemini API (`google-genai`)
* **Frontend:** React 18, Vite, JavaScript (ES6+)
* **Authentication:** Clerk Auth (JWT verification, GitHub OAuth, Google SSO)
* **Package Managers:** `uv` (Python), `npm` (Node.js)

---

## Setup and Installation

### Prerequisites
* Python 3.12 or higher
* Node.js 18 or higher
* A Google Gemini API key
* A Clerk account with publishable and secret keys

### Backend Setup
Navigate to the `backend` folder, create a `.env` file with your keys, and start the server:

~~~bash
cd backend
# Add to backend/.env:
# GEMINI_API_KEY=your_gemini_api_key_here
# CLERK_SECRET_KEY=your_clerk_secret_key_here

uv run server.py
~~~

The backend API runs at `http://localhost:8000`.

### Frontend Setup
Navigate to the `frontend` folder, create a `.env` file with your Clerk key, install packages, and start Vite:

~~~bash
cd frontend
# Add to frontend/.env:
# VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

npm install
npm run dev
~~~

The frontend app runs at `http://localhost:5173`.
