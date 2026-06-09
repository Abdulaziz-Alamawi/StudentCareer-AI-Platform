"""Authentication & profile routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from prisma.models import User

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.auth import AuthResult, Token, UserLogin, UserOut, UserRegister
from app.schemas.user import ProfileOut, ProfileUpdate
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResult, status_code=201)
async def register(payload: UserRegister, db=Depends(get_db)) -> AuthResult:
    return await auth_service.register(db, payload)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)
) -> Token:
    """OAuth2-compatible login (username field = email). Returns a JWT."""
    result = await auth_service.authenticate(db, form_data.username, form_data.password)
    return result.token


@router.post("/login/json", response_model=AuthResult)
async def login_json(payload: UserLogin, db=Depends(get_db)) -> AuthResult:
    """JSON login used by the frontend; returns token + user."""
    return await auth_service.authenticate(db, payload.email, payload.password)


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return auth_service.to_user_out(current_user)


@router.post("/logout")
async def logout(_: User = Depends(get_current_user)) -> dict:
    # Stateless JWT: the client discards the token. Endpoint provided for symmetry.
    return {"success": True, "message": "Logged out."}


@router.get("/profile", response_model=ProfileOut)
async def get_profile(
    current_user: User = Depends(get_current_user), db=Depends(get_db)
) -> ProfileOut:
    return await auth_service.get_profile(db, current_user.id)


@router.put("/profile", response_model=ProfileOut)
async def update_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> ProfileOut:
    return await auth_service.update_profile(db, current_user.id, payload)
