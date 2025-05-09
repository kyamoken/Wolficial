from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .ws import router as ws_router

app = FastAPI(title="Wolficial Game API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ws_router)  # ← これを追加
app.include_router(ws_router)


@app.get("/health")
async def health():
    return {"status": "ok", "project": "wolficial"}