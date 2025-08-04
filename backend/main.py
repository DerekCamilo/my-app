from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import items

app = FastAPI(title="MyApp API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items.router)

@app.get("/")
def root():
    return {"message": "Backend is running!"}
