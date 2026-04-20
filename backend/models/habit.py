from beanie import Document
from pydantic import Field
from datetime import datetime, timezone
from typing import Literal
from bson import ObjectId


class Habit(Document):
    user_id: str
    name: str = Field(..., min_length=1, max_length=100)
    description: str = ""
    type: Literal["daily", "weekly", "custom"] = "daily"
    xp_reward: int = 100
    color: str = "#6366f1"  # for UI theming per habit
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "habits"
        indexes = [
            [("user_id", 1)],
        ]
