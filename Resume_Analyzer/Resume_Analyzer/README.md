

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


