"""BudgetLens FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import categories, finance_settings, summary, transactions

settings = get_settings()

app = FastAPI(
    title="BudgetLens API",
    description="Personal finance tracking API — RSL Mini-Hack '26",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health_check():
    return {"status": "ok"}


app.include_router(categories.router)
app.include_router(transactions.router)
app.include_router(finance_settings.router)
app.include_router(summary.router)
