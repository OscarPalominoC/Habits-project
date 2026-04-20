from beanie import Document
from pydantic import Field
from datetime import datetime, timezone


class Achievement(Document):
    user_id: str
    key: str  # unique key per achievement type, e.g. "first_habit", "level_10"
    title: str
    description: str
    icon: str = "🏅"
    unlocked_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "achievements"
        indexes = [
            [("user_id", 1)],
            [("user_id", 1), ("key", 1)],
        ]
