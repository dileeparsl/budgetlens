"""Pydantic schemas for finance settings (budget/income/savings targets)."""

from datetime import datetime

from pydantic import BaseModel, Field

__all__ = [
    "FinanceSettingsUpsert",
    "FinanceSettingsOut",
]


class FinanceSettingsUpsert(BaseModel):
    monthly_income_cents: int = Field(0, ge=0)
    monthly_budget_cents: int = Field(0, ge=0)
    savings_target_cents: int = Field(0, ge=0)


class FinanceSettingsOut(BaseModel):
    id: str
    user_id: str
    monthly_income_cents: int = 0
    monthly_budget_cents: int = 0
    savings_target_cents: int = 0
    created_at: datetime
    updated_at: datetime
