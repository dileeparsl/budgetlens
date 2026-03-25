"""CRUD routes for user categories."""

from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.auth import get_current_user_id
from app.database import get_supabase
from app.models.category import CategoryCreate, CategoryOut, CategoryUpdate

router = APIRouter(prefix="/api/categories", tags=["categories"])

TABLE = "categories"

DEFAULT_CATEGORIES = [
    {"name": "Food & Dining", "icon": "🍔", "color": "#FF6B6B"},
    {"name": "Transport", "icon": "🚗", "color": "#4ECDC4"},
    {"name": "Bills & Utilities", "icon": "💡", "color": "#45B7D1"},
    {"name": "Entertainment", "icon": "🎬", "color": "#96CEB4"},
    {"name": "Shopping", "icon": "🛒", "color": "#FFEAA7"},
    {"name": "Health", "icon": "🏥", "color": "#DDA0DD"},
    {"name": "Salary", "icon": "💰", "color": "#55EFC4"},
    {"name": "Freelance", "icon": "💻", "color": "#74B9FF"},
    {"name": "Other Income", "icon": "📥", "color": "#A29BFE"},
    {"name": "Other", "icon": "📦", "color": "#636E72"},
]


def _seed_defaults(user_id: str, db: Client) -> List[dict]:
    rows = [
        {"user_id": user_id, "is_default": True, **cat}
        for cat in DEFAULT_CATEGORIES
    ]
    res = db.table(TABLE).insert(rows).execute()
    return res.data or []


@router.get("", response_model=List[CategoryOut])
def list_categories(
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    res = db.table(TABLE).select("*").eq("user_id", user_id).order("created_at").execute()
    if not res.data:
        return _seed_defaults(user_id, db)
    return res.data


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(
    body: CategoryCreate,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    row = {"user_id": user_id, **body.model_dump(exclude_none=True)}
    res = db.table(TABLE).insert(row).execute()
    if not res.data:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Insert failed")
    return res.data[0]


@router.get("/{category_id}", response_model=CategoryOut)
def get_category(
    category_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    res = db.table(TABLE).select("*").eq("id", category_id).eq("user_id", user_id).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
    return res.data[0]


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: str,
    body: CategoryUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No fields to update")
    res = (
        db.table(TABLE)
        .update(updates)
        .eq("id", category_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
    return res.data[0]


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    res = (
        db.table(TABLE)
        .delete()
        .eq("id", category_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
    return None
