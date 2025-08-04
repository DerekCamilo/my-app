## Clone the Repository

```bash
git clone https://github.com/DerekCamilo/my-app.git
```

## Install Python and Node.js
Note: The frontend runs using node.js and the backend uses python with FastAPI and uvicorn

Make sure you have **Python 3.9+** installed

Make sure you have **Node.js 18+** installed

Check versions:
```bash
node -v
npm -v
```
---

## Create a virtual environment


Run this **inside the `backend/` folder** (one time only):

```bash
cd backend/
python -m venv .venv
pip install fastapi uvicorn
python -m uvicorn main:app --reload --port 8000
```

---
Inside of both frontend and my-app 

This frontend runs on **React** using **Vite** for the dev server.  
It talks to the **FastAPI backend** at `http://localhost:8000`.

```bash
npm install
```
Then, 

Run this **inside the `frontend/` folder**

```bash
cd frontend/
npm run dev
```
To run the server follow all directions and see what port vite
decides to run the server on. The base port is `http://localhost:5173`,
however if there is something already running there vite may choose a different port.


