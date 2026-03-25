"""JWT authentication dependency — verifies Supabase tokens via the Auth API."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import Client

from app.database import get_supabase

_bearer = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: Client = Depends(get_supabase),
) -> str:
    """Call Supabase ``auth.get_user(token)`` and return the user's UUID."""
    token = credentials.credentials
    try:
        user_response = db.auth.get_user(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if not user_response or not user_response.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    return user_response.user.id
