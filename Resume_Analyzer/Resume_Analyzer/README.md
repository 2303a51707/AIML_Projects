<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./frontend/src/assets/ResuMatch%20logo.png">
    <source media="(prefers-color-scheme: light)" srcset="./frontend/src/assets/ResuMatch%20logo.png">
    <img alt="ResuMatch.ai — AI-Powered ATS Resume Analyzer" src="./frontend/src/assets/ResuMatch%20logo.png" width="140" style="border-radius: 20px;">
  </picture>
</p>

<h1 align="center">ResuMatch<span style="color:#6366f1">.ai</span></h1>

<p align="center">
  <strong>AI-Powered ATS Resume Analyzer — Strict, Fair, and Grounded in Real Data</strong>
</p>

<p align="center">
  <a href="https://resumatch-hub.vercel.app"><img src="https://img.shields.io/badge/🚀_Live_Demo-resumatch--hub.vercel.app-6366f1?style=for-the-badge&labelColor=0f172a" alt="Live Demo"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-6366f1?style=flat&logo=react&labelColor=0f172a">
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=nodedotjs&labelColor=0f172a">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&labelColor=0f172a">
  <img src="https://img.shields.io/badge/Gemini_1.5_Flash-AI-4285f4?style=flat&logo=googlegemini&labelColor=0f172a">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat&logo=tailwindcss&labelColor=0f172a">
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel&labelColor=0f172a">
</p>

<br>

---

## 📌 Overview

**ResuMatch.ai** is a full-stack AI-powered ATS resume checker that analyzes your resume against any job description in seconds. It eliminates recruiter bias and LLM score inflation by enforcing a strict **mathematical scoring formula** — no guesswork, no inflated results.

Upload a PDF resume → paste required skills → get an objective ATS compatibility report instantly.

Whether you're a fresh graduate trying to pass automated screening, or an experienced professional optimizing for a specific role — ResuMatch.ai gives you the **honest, data-driven feedback** that most tools are too polite to share.

---

## ❗ Problem Statement

Most resume scanners either:
- Give vague, generic feedback with no actionable steps
- Use AI that **inflates scores out of politeness**
- Fail to detect **spelling mismatches** (e.g. `NodeJS` vs `Node.js`)

ResuMatch.ai solves all three with server-side keyword verification, fuzzy spell-check detection, and detailed revision suggestions.

---

## 🖥️ UI Preview

<p align="center">
  <img src="https://raw.githubusercontent.com/muhammadkhuzaima25/Ai_Resume_Analyzer/main/frontend/src/assets/hero.png" alt="ResuMatch.ai — ATS Resume Analyzer Dashboard" width="85%" style="border-radius:16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
</p>

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📊 **Fair ATS Scoring** | `Score = (Matched / Total) × 10` — server-side override prevents AI inflation |
| 🔍 **Fuzzy Keyword Match** | Detects `NodeJS` ↔ `Node.js`, `ReactJS` ↔ `React.js` as the same skill |
| 🔤 **Spell Mismatch Detection** | Flags wrong spellings in your resume vs. what ATS systems expect |
| 📝 **Detailed Suggestions** | Tells you *exactly* which section to update and how |
| 📂 **Section-by-Section Feedback** | Honest analysis of Skills, Experience & Education sections |
| 🔐 **Secure Auth** | Email/password + Google OAuth 2.0 + reCAPTCHA v3 |
| 📜 **Analysis History** | All past reports saved per user account |
| ⚡ **AI Fallback Chain** | Gemini → OpenRouter → Keyword Mock — always returns a result |

---

## 🧮 Scoring Formula

```
Score = (Matched Keywords / Total Required Keywords) × 10
```

| Score Range | Label |
|---|---|
| 8.0 – 10.0 | ✅ Strong Match |
| 5.0 – 7.9 | ⚠️ Moderate Match |
| 0.0 – 4.9 | ❌ Low Match |

> Max 12 keywords accepted per analysis for accuracy and token efficiency.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite 8
- Tailwind CSS 3.4
- React Router v6
- `@react-oauth/google` for Google OAuth login

**Backend**
- Node.js 20 + Express.js 5
- MongoDB Atlas + Mongoose 9
- JWT Authentication
- `pdf-parse` for in-memory PDF text extraction

**AI Providers (with auto-fallback)**
- Primary → **Google Gemini 1.5 Flash**
- Fallback → **OpenRouter** (Meta LLaMA 3 70B)
- If both fail → **Keyword-based mock analysis**

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key
- Google OAuth 2.0 Client ID
- reCAPTCHA v3 site key + secret

### 1. Clone the repo
```bash
git clone https://github.com/muhammadkhuzaima25/Ai_Resume_Analyzer.git
cd Ai_Resume_Analyzer
```

### 2. Install dependencies
```bash
npm run install-all
```

### 3. Copy env files and fill in your keys
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

> All required keys are listed in `.env.example` files inside each folder.

### 4. Start dev servers
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
Ai_Resume_Analyzer/
├── backend/
│   ├── config/          # DB + email config
│   ├── controllers/     # Auth, Analyze, Contact logic
│   ├── middleware/      # JWT auth guard
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProtectedRoute
│   │   ├── pages/       # Login, Register, Analyze, History...
│   │   └── utils/       # Axios API client
│   └── vite.config.js
│
└── package.json         # Root scripts
```

---

## 🔮 Future Work

- [ ] ATS-optimized resume templates (downloadable)
- [ ] Skill gap heatmap visualization
- [ ] Multi-language resume support
- [ ] Resume rewrite suggestions via AI
- [ ] LinkedIn profile analyzer
- [ ] Credit-based billing system — free tier with limited analyses per month, paid plans for unlimited access

---

## 🔍 SEO Keywords

> *For discoverability — these are the real problems ResuMatch.ai solves.*

`ATS resume checker` · `AI resume analyzer` · `resume keyword scanner` · `ATS score calculator` · `resume parser` · `job description matcher` · `resume optimization tool` · `ATS-friendly resume` · `resume screening tool` · `keyword match resume` · `resume feedback AI` · `resume checker free` · `AI resume scoring` · `applicant tracking system resume` · `resume analysis MERN stack` · `full stack AI project` · `Google Gemini resume analyzer` · `React resume checker` · `Node.js resume API` · `MongoDB resume history` · `fuzzy keyword matching resume` · `spell mismatch ATS` · `resume vs job description` · `AI career tools` · `open source resume analyzer`

---

## 👤 Author

**Muhammad Khuzaima**  
Graphic Designer · Logo & Brand Identity Expert · UI/UX Designer · MERN Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin&labelColor=0f172a)](https://www.linkedin.com/in/muhammad-khuzaima-991a08313)
[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-resumatch--hub.vercel.app-6366f1?style=flat&labelColor=0f172a)](https://resumatch-hub.vercel.app)

---

## 📄 License

**All Rights Reserved.** Copyright © 2026 Muhammad Khuzaima.  
This project is for **viewing and evaluation only.** See [LICENSE](./LICENSE) for full terms.

---

<p align="center">
  <strong>⭐ If this project saved you time or just impressed you — please consider leaving a star!</strong><br>
  <sub>It took real hours of debugging, designing, and grinding to build ResuMatch.ai from scratch.<br>
  A star costs you nothing but means everything to a developer. 🙏</sub>
</p>

<p align="center">
  <a href="https://github.com/muhammadkhuzaima25/Ai_Resume_Analyzer">
    <img src="https://img.shields.io/badge/⭐_Star_this_repo-Show_some_love-f59e0b?style=for-the-badge&labelColor=0f172a" alt="Star this repo">
  </a>
</p>
