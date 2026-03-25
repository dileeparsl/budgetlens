"""CRUD routes for transactions with filtering and pagination."""

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client

from app.deps import get_current_user_id, get_supabase
from app.models.transaction import (
    TransactionCreate,
    TransactionListOut,
    TransactionOut,
    TransactionUpdate,
)

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

TABLE = "transactions"


def _select_with_category(db: Client):
    return db.table(TABLE).select("*, categories(name)")


def _flatten(row: dict) -> dict:
    """Pull category name out of the joined object."""
    cat = row.pop("categories", None)
    row["category_name"] = cat["name"] if cat else None
    return row


@router.get("", response_model=TransactionListOut)
def list_transactions(
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
    type: Optional[str] = Query(None, pattern="^(income|expense)$"),
    category_id: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    q = _select_with_category(db).eq("user_id", user_id)
    if type:
        q = q.eq("type", type)
    if category_id:
        q = q.eq("category_id", category_id)
    if date_from:
        q = q.gte("date", date_from.isoformat())
    if date_to:
        q = q.lte("date", date_to.isoformat())

    q = q.order("date", desc=True).range(offset, offset + limit - 1)
    res = q.execute()

    count_q = db.table(TABLE).select("id", count="exact").eq("user_id", user_id)
    if type:
        count_q = count_q.eq("type", type)
    if category_id:
        count_q = count_q.eq("category_id", category_id)
    if date_from:
        count_q = count_q.gte("date", date_from.isoformat())
    if date_to:
        count_q = count_q.lte("date", date_to.isoformat())
    count_res = count_q.execute()

    return TransactionListOut(
        data=[_flatten(r) for r in res.data],
        count=count_res.count or len(res.data),
    )


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def create_transaction(
    body: TransactionCreate,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    row = {"user_id": user_id, **body.model_dump()}
    row["date"] = row["date"].isoformat()
    res = db.table(TABLE).insert(row).execute()
    if not res.data:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Insert failed")
    joined = (
        _select_with_category(db)
        .eq("id", res.data[0]["id"])
        .execute()
    )
    return _flatten(joined.data[0])


@router.get("/{txn_id}", response_model=TransactionOut)
def get_transaction(
    txn_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    res = (
        _select_with_category(db)
        .eq("id", txn_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Transaction not found")
    return _flatten(res.data[0])


@router.put("/{txn_id}", response_model=TransactionOut)
def update_transaction(
    txn_id: str,
    body: TransactionUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No fields to update")
    if "date" in updates:
        updates["date"] = updates["date"].isoformat()
    res = (
        db.table(TABLE)
        .update(updates)
        .eq("id", txn_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Transaction not found")
    joined = _select_with_category(db).eq("id", txn_id).execute()
    return _flatten(joined.data[0])


@router.delete("/{txn_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    txn_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    res = (
        db.table(TABLE)
        .delete()
        .eq("id", txn_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Transaction not found")
    return None
