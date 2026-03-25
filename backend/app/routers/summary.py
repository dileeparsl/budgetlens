"""Summary / stats endpoints for the landing page and dashboard charts."""

from datetime import date, timedelta
from typing import Dict, List, Optional, Tuple

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from supabase import Client

from app.deps import get_current_user_id, get_supabase

router = APIRouter(prefix="/api/summary", tags=["summary"])


# ── Response schemas ──────────────────────────────────────────────────────────


class CategoryBreakdown(BaseModel):
    category_id: str
    category_name: Optional[str] = None
    total_cents: int
    count: int


class MonthlySummary(BaseModel):
    month: str  # "YYYY-MM"
    total_income_cents: int
    total_expense_cents: int
    balance_cents: int
    budget_cents: int
    budget_used_pct: float
    category_breakdown: List[CategoryBreakdown]


class TrendPoint(BaseModel):
    month: str
    total_income_cents: int
    total_expense_cents: int


class DashboardData(BaseModel):
    current_month: MonthlySummary
    trends: List[TrendPoint]


# ── Helpers ──────────────────────────────────────────────────────────────────


def _month_range(year: int, month: int) -> Tuple[str, str]:
    first = date(year, month, 1)
    if month == 12:
        last = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        last = date(year, month + 1, 1) - timedelta(days=1)
    return first.isoformat(), last.isoformat()


# ── Routes ───────────────────────────────────────────────────────────────────


@router.get("/monthly", response_model=MonthlySummary)
def monthly_summary(
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
    year: int = Query(default_factory=lambda: date.today().year),
    month: int = Query(default_factory=lambda: date.today().month, ge=1, le=12),
):
    start, end = _month_range(year, month)

    txn_res = (
        db.table("transactions")
        .select("*, categories(name)")
        .eq("user_id", user_id)
        .gte("date", start)
        .lte("date", end)
        .execute()
    )
    txns = txn_res.data or []

    settings_res = (
        db.table("finance_settings")
        .select("monthly_budget_cents")
        .eq("user_id", user_id)
        .execute()
    )
    budget = (settings_res.data[0]["monthly_budget_cents"] if settings_res.data else 0)

    total_income = sum(t["amount_cents"] for t in txns if t["type"] == "income")
    total_expense = sum(t["amount_cents"] for t in txns if t["type"] == "expense")

    cat_map: Dict[str, CategoryBreakdown] = {}
    for t in txns:
        if t["type"] != "expense":
            continue
        cid = t["category_id"]
        cat_obj = t.get("categories")
        cname = cat_obj["name"] if cat_obj else None
        if cid not in cat_map:
            cat_map[cid] = CategoryBreakdown(
                category_id=cid, category_name=cname, total_cents=0, count=0,
            )
        cat_map[cid].total_cents += t["amount_cents"]
        cat_map[cid].count += 1

    breakdown = sorted(cat_map.values(), key=lambda c: c.total_cents, reverse=True)

    return MonthlySummary(
        month=f"{year:04d}-{month:02d}",
        total_income_cents=total_income,
        total_expense_cents=total_expense,
        balance_cents=total_income - total_expense,
        budget_cents=budget,
        budget_used_pct=round((total_expense / budget) * 100, 1) if budget else 0.0,
        category_breakdown=breakdown,
    )


@router.get("/dashboard", response_model=DashboardData)
def dashboard_data(
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
    months: int = Query(6, ge=1, le=24),
):
    today = date.today()

    period_starts: List[Tuple[int, int]] = []
    y, m = today.year, today.month
    for _ in range(months):
        period_starts.append((y, m))
        m -= 1
        if m == 0:
            m = 12
            y -= 1
    period_starts.reverse()

    oldest_start, _ = _month_range(*period_starts[0])
    _, newest_end = _month_range(*period_starts[-1])

    txn_res = (
        db.table("transactions")
        .select("amount_cents, type, date, category_id, categories(name)")
        .eq("user_id", user_id)
        .gte("date", oldest_start)
        .lte("date", newest_end)
        .order("date")
        .execute()
    )
    txns = txn_res.data or []

    month_buckets: Dict[str, Dict[str, int]] = {}
    for yr, mo in period_starts:
        key = f"{yr:04d}-{mo:02d}"
        month_buckets[key] = {"income": 0, "expense": 0}

    for t in txns:
        key = t["date"][:7]
        if key in month_buckets:
            month_buckets[key][t["type"]] += t["amount_cents"]

    trends = [
        TrendPoint(month=k, total_income_cents=v["income"], total_expense_cents=v["expense"])
        for k, v in month_buckets.items()
    ]

    current_month = monthly_summary(
        user_id=user_id,
        db=db,
        year=today.year,
        month=today.month,
    )

    return DashboardData(current_month=current_month, trends=trends)
