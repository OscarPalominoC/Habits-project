from beanie import Document
from pydantic import Field
from typing import Optional


class Activity(Document):
    habit_id: str
    name: str = Field(..., min_length=1, max_length=200)
    xp_value: int = 10
    is_required: bool = True
    order: int = 0

    class Settings:
        name = "activities"
        indexes = [
            [("habit_id", 1), ("order", 1)],
        ]
