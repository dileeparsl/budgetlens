"""Pydantic schemas for transactions."""

from datetime import date, datetime
from enum import Enum
from typing import List, Literal, Optional

from pydantic import BaseModel, Field

__all__ = [
    "TransactionType",
    "TransactionCreate",
    "TransactionUpdate",
    "TransactionOut",
    "TransactionListOut",
]


class TransactionType(str, Enum):
    income = "income"
    expense = "expense"


class TransactionCreate(BaseModel):
    amount_cents: int = Field(..., gt=0, description="Amount in cents (positive)")
    type: Literal["income", "expense"]
    category_id: str
    description: Optional[str] = Field(None, max_length=255)
    date: date


class TransactionUpdate(BaseModel):
    amount_cents: Optional[int] = Field(None, gt=0)
    type: Optional[Literal["income", "expense"]] = None
    category_id: Optional[str] = None
    description: Optional[str] = Field(None, max_length=255)
    date: Optional[date] = None


class TransactionOut(BaseModel):
    id: str
    user_id: str
    amount_cents: int
    type: str
    category_id: str
    category_name: Optional[str] = None
    description: Optional[str] = None
    date: date
    created_at: datetime
    updated_at: datetime


class TransactionListOut(BaseModel):
    data: List[TransactionOut]
    count: int
