"""
XP and leveling logic for the Habits RPG system.
"""

from models.user import User, get_title


def xp_threshold(level: int) -> int:
    """XP needed to advance FROM this level to the next."""
    return min(100 * (2 ** (level - 1)), 2000)


def calculate_xp(completion_percentage: float, xp_reward: int) -> int:
    """Return XP earned based on habit completion percentage."""
    return round(xp_reward * (completion_percentage / 100))


async def apply_xp(user: User, xp_gained: int) -> dict:
    """
    Add XP to user, handle level-ups, save, and return event info.
    Returns: { leveled_up: bool, old_level: int, new_level: int, new_xp: int }
    """
    old_level = user.level
    user.xp += xp_gained

    # Handle level-ups (can be multiple consecutive)
    while user.level < 100:
        needed = xp_threshold(user.level)
        if user.xp >= needed:
            user.xp -= needed
            user.level += 1
        else:
            break

    await user.save()
    return {
        "leveled_up": user.level > old_level,
        "old_level": old_level,
        "new_level": user.level,
        "new_xp": user.xp,
        "new_title": get_title(user.level) if user.level > old_level else None,
    }
