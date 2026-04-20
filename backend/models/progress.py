from beanie import Document
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import List, Literal, Optional


class ActivityProgress(BaseModel):
    activity_id: str
    completed: bool = False
    completed_at: Optional[datetime] = None


class Progress(Document):
    user_id: str
    habit_id: str
    date: str  # ISO date string "YYYY-MM-DD"
    activities: List[ActivityProgress] = []
    completion_percentage: float = 0.0
    xp_earned: int = 0
    status: Literal["complete", "partial", "incomplete"] = "incomplete"
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "progress"
        indexes = [
            [("user_id", 1), ("date", -1)],
            [("user_id", 1), ("habit_id", 1), ("date", -1)],
        ]
