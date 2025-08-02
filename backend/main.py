from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import items

app = FastAPI(title="MyApp API")

# ✅ Allow frontend (Vite on port 5173) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routes
app.include_router(items.router)

@app.get("/")
def root():
    return {"message": "Backend is running!"}
