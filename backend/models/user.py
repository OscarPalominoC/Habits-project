from beanie import Document
from pydantic import EmailStr, Field
from datetime import datetime, timezone
from typing import Optional


TITLE_MAP = {
    0: "Noob",
    1: "Novato disciplinado",
    10: "Aprendiz constante",
    20: "Forjador de hábitos",
    30: "Guerrero disciplinado",
    40: "Maestro del enfoque",
    50: "Estratega del progreso",
    60: "Titán de la constancia",
    70: "Arquitecto del destino",
    80: "Leyenda en ascenso",
    90: "Entidad imparable",
    100: "Monarca del sistema",
}


def get_title(level: int) -> str:
    milestone = max(k for k in TITLE_MAP if k <= level)
    return TITLE_MAP[milestone]


class User(Document):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password_hash: str
    avatar: str = "👤"
    level: int = 0
    xp: int = 0
    streak: int = 0
    last_activity_date: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def title(self) -> str:
        return get_title(self.level)

    @property
    def xp_for_next_level(self) -> int:
        """XP required to reach the next level threshold."""
        return min(100 * (2 ** max(0, self.level - 1)), 2000)

    class Settings:
        name = "users"
        indexes = [
            [("email", 1)],
            [("username", 1)],
        ]
