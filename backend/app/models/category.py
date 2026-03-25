"""Pydantic schemas for categories."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

__all__ = [
    "CategoryCreate",
    "CategoryUpdate",
    "CategoryOut",
]


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    icon: Optional[str] = Field(None, max_length=30)
    color: Optional[str] = Field(None, pattern=r"^#[0-9a-fA-F]{6}$")


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    icon: Optional[str] = Field(None, max_length=30)
    color: Optional[str] = Field(None, pattern=r"^#[0-9a-fA-F]{6}$")


class CategoryOut(BaseModel):
    id: str
    user_id: str
    name: str
    icon: Optional[str] = None
    color: Optional[str] = None
    is_default: bool = False
    created_at: datetime
