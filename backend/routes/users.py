from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from models.user import User, get_title
from core.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


class UserProfile(BaseModel):
    id: str
    username: str
    email: str
    avatar: str
    level: int
    xp: int
    xp_for_next_level: int
    title: str
    streak: int
    created_at: str


class UpdateUserRequest(BaseModel):
    username: Optional[str] = None
    avatar: Optional[str] = None


def user_to_profile(user: User) -> UserProfile:
    return UserProfile(
        id=str(user.id),
        username=user.username,
        email=user.email,
        avatar=user.avatar or "👤",
        level=user.level,
        xp=user.xp,
        xp_for_next_level=user.xp_for_next_level,
        title=get_title(user.level),
        streak=user.streak,
        created_at=user.created_at.isoformat(),
    )


@router.get("/me", response_model=UserProfile)
async def get_me(current_user: User = Depends(get_current_user)):
    return user_to_profile(current_user)


@router.put("/me", response_model=UserProfile)
async def update_me(
    body: UpdateUserRequest, current_user: User = Depends(get_current_user)
):
    if body.username is not None:
        current_user.username = body.username
    if body.avatar is not None:
        current_user.avatar = body.avatar
    await current_user.save()
    return user_to_profile(current_user)
