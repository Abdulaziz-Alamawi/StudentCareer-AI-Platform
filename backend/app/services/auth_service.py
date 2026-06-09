"""Authentication service — registration, login, profile management."""
from __future__ import annotations

from prisma import Prisma
from prisma.models import User

from app.core.exceptions import ConflictError, UnauthorizedError
from app.core.security import create_access_token, hash_password, verify_password
from app.schemas.auth import AuthResult, Token, UserOut, UserRegister
from app.schemas.user import ProfileOut, ProfileUpdate


def to_user_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.fullName,
        role=user.role,
        is_active=user.isActive,
        created_at=user.createdAt,
    )


async def register(db: Prisma, payload: UserRegister) -> AuthResult:
    existing = await db.user.find_unique(where={"email": payload.email})
    if existing:
        raise ConflictError("An account with this email already exists.")

    user = await db.user.create(
        data={
            "email": payload.email,
            "passwordHash": hash_password(payload.password),
            "fullName": payload.full_name,
        }
    )
    # Create related profile + analytics rows up front.
    await db.profile.create(data={"userId": user.id})
    await db.analytics.create(data={"userId": user.id})

    token = create_access_token(subject=user.id)
    return AuthResult(token=Token(access_token=token), user=to_user_out(user))


async def authenticate(db: Prisma, email: str, password: str) -> AuthResult:
    user = await db.user.find_unique(where={"email": email})
    if not user or not verify_password(password, user.passwordHash):
        raise UnauthorizedError("Invalid email or password.")
    if not user.isActive:
        raise UnauthorizedError("This account is disabled.")

    token = create_access_token(subject=user.id)
    return AuthResult(token=Token(access_token=token), user=to_user_out(user))


async def get_profile(db: Prisma, user_id: str) -> ProfileOut:
    profile = await db.profile.find_unique(where={"userId": user_id})
    if not profile:
        profile = await db.profile.create(data={"userId": user_id})
    return ProfileOut(
        id=profile.id,
        user_id=profile.userId,
        headline=profile.headline,
        bio=profile.bio,
        major=profile.major,
        university=profile.university,
        graduation_year=profile.graduationYear,
        career_track=profile.careerTrack,
        location=profile.location,
        linkedin_url=profile.linkedinUrl,
        github_url=profile.githubUrl,
        website_url=profile.websiteUrl,
        interests=profile.interests or [],
    )


async def update_profile(db: Prisma, user_id: str, payload: ProfileUpdate) -> ProfileOut:
    data: dict = {}
    mapping = {
        "headline": "headline",
        "bio": "bio",
        "major": "major",
        "university": "university",
        "graduation_year": "graduationYear",
        "career_track": "careerTrack",
        "location": "location",
        "phone": "phone",
        "linkedin_url": "linkedinUrl",
        "github_url": "githubUrl",
        "website_url": "websiteUrl",
        "interests": "interests",
    }
    dumped = payload.model_dump(exclude_unset=True)
    for key, value in dumped.items():
        if value is not None:
            data[mapping[key]] = value.value if hasattr(value, "value") else value

    await db.profile.update(where={"userId": user_id}, data=data)
    return await get_profile(db, user_id)
