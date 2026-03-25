"""GET / PUT for per-user finance settings (income, budget, savings targets)."""

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.auth import get_current_user_id
from app.database import get_supabase
from app.models.finance_settings import FinanceSettingsOut, FinanceSettingsUpsert

router = APIRouter(prefix="/api/finance-settings", tags=["finance-settings"])

TABLE = "finance_settings"


@router.get("", response_model=FinanceSettingsOut)
def get_finance_settings(
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    res = db.table(TABLE).select("*").eq("user_id", user_id).execute()
    if not res.data:
        row = {"user_id": user_id}
        insert_res = db.table(TABLE).insert(row).execute()
        if not insert_res.data:
            raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Could not create settings")
        return insert_res.data[0]
    return res.data[0]


@router.put("", response_model=FinanceSettingsOut)
def upsert_finance_settings(
    body: FinanceSettingsUpsert,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase),
):
    existing = db.table(TABLE).select("id").eq("user_id", user_id).execute()
    payload = body.model_dump()

    if existing.data:
        res = (
            db.table(TABLE)
            .update(payload)
            .eq("user_id", user_id)
            .execute()
        )
    else:
        payload["user_id"] = user_id
        res = db.table(TABLE).insert(payload).execute()

    if not res.data:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Upsert failed")
    return res.data[0]
