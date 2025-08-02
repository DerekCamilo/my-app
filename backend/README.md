# 🐍 Backend Setup (FastAPI)

This backend runs on **FastAPI** using **Uvicorn**.  
You can run it with or without a virtual environment, but using a `.venv` keeps things clean and avoids conflicts with other projects.

---

## ✅ 1️⃣ Install Python

Make sure you have **Python 3.9+** installed:  
👉 [Download Python](https://www.python.org/downloads/) if needed.

---

## ✅ 2️⃣ Create a virtual environment

Run this **inside the `backend/` folder** (one time only):

```bash
python -m venv .venv
```

---

## 📄 `frontend/README.md`

```markdown
# ⚛️ Frontend Setup (React + Vite)

This frontend runs on **React** using **Vite** for the dev server.  
It talks to the **FastAPI backend** at `http://localhost:8000`.

---

## ✅ 1️⃣ Install Node.js

Make sure you have **Node.js 18+** installed:  
👉 [Download Node.js](https://nodejs.org/en/download/) if needed.

✅ Check versions:
```bash
node -v
npm -v

