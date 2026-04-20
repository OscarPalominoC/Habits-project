from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from models.achievement import Achievement
from models.user import User
from core.deps import get_current_user

router = APIRouter(prefix="/achievements", tags=["achievements"])


class AchievementOut(BaseModel):
    id: str
    key: str
    title: str
    description: str
    icon: str
    unlocked_at: str


@router.get("", response_model=List[AchievementOut])
async def list_achievements(user: User = Depends(get_current_user)):
    achievements = await Achievement.find(
        Achievement.user_id == str(user.id)
    ).to_list()
    return [
        AchievementOut(
            id=str(a.id),
            key=a.key,
            title=a.title,
            description=a.description,
            icon=a.icon,
            unlocked_at=a.unlocked_at.isoformat(),
        )
        for a in achievements
    ]
