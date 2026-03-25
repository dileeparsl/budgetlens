from pydantic import BaseModel


class CategoryBreakdownItem(BaseModel):
    category_id: str | None
    category_name: str
    total_cents: int
    percentage: float


class LandingSummaryResponse(BaseModel):
    total_income_cents: int
    total_expense_cents: int
    balance_cents: int
    monthly_budget_cents: int | None
    budget_used_percent: float | None
    category_breakdown: list[CategoryBreakdownItem]


class MonthlyTrendItem(BaseModel):
    month: str
    income_cents: int
    expense_cents: int


class DashboardResponse(BaseModel):
    monthly_trends: list[MonthlyTrendItem]
    category_breakdown: list[CategoryBreakdownItem]
