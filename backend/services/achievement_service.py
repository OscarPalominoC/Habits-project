"""
Achievement unlock logic — called after XP is applied.
"""

from models.user import User
from models.achievement import Achievement


ACHIEVEMENT_DEFINITIONS = [
    {
        "key": "first_habit_complete",
        "title": "Primera Misión",
        "description": "Completaste tu primer hábito.",
        "icon": "⚔️",
    },
    {
        "key": "streak_3",
        "title": "En Racha",
        "description": "Mantuviste una racha de 3 días.",
        "icon": "🔥",
    },
    {
        "key": "streak_7",
        "title": "Semana Perfecta",
        "description": "7 días consecutivos completando hábitos.",
        "icon": "🌟",
    },
    {
        "key": "streak_30",
        "title": "Imparable",
        "description": "30 días seguidos sin fallar.",
        "icon": "💎",
    },
    {
        "key": "level_10",
        "title": "Aprendiz",
        "description": "Alcanzaste el nivel 10.",
        "icon": "🏅",
    },
    {
        "key": "level_25",
        "title": "Guerrero",
        "description": "Alcanzaste el nivel 25.",
        "icon": "🥈",
    },
    {
        "key": "level_50",
        "title": "Maestro",
        "description": "Alcanzaste el nivel 50.",
        "icon": "🥇",
    },
    {
        "key": "level_100",
        "title": "Monarca del Sistema",
        "description": "Llegaste al nivel máximo. Eres imparable.",
        "icon": "👑",
    },
]


async def check_and_unlock(user: User, total_completions: int = 0) -> list[dict]:
    """
    Checks which achievements the user qualifies for and unlocks new ones.
    Returns list of newly unlocked achievement dicts.
    """
    existing_keys = {
        a.key
        for a in await Achievement.find(Achievement.user_id == str(user.id)).to_list()
    }

    newly_unlocked = []

    for defn in ACHIEVEMENT_DEFINITIONS:
        key = defn["key"]
        if key in existing_keys:
            continue

        unlocked = False

        if key == "first_habit_complete" and total_completions >= 1:
            unlocked = True
        elif key == "streak_3" and user.streak >= 3:
            unlocked = True
        elif key == "streak_7" and user.streak >= 7:
            unlocked = True
        elif key == "streak_30" and user.streak >= 30:
            unlocked = True
        elif key == "level_10" and user.level >= 10:
            unlocked = True
        elif key == "level_25" and user.level >= 25:
            unlocked = True
        elif key == "level_50" and user.level >= 50:
            unlocked = True
        elif key == "level_100" and user.level >= 100:
            unlocked = True

        if unlocked:
            achievement = Achievement(
                user_id=str(user.id),
                key=key,
                title=defn["title"],
                description=defn["description"],
                icon=defn["icon"],
            )
            await achievement.insert()
            newly_unlocked.append(defn)

    return newly_unlocked
