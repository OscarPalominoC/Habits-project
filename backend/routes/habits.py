from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Literal, List
from models.habit import Habit
from models.activity import Activity
from models.progress import Progress
from core.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/habits", tags=["habits"])


class HabitCreate(BaseModel):
    name: str
    description: str = ""
    type: Literal["daily", "weekly", "custom"] = "daily"
    xp_reward: int = 100
    color: str = "#6366f1"


class HabitUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    type: Literal["daily", "weekly", "custom"] | None = None
    xp_reward: int | None = None
    color: str | None = None


class HabitOut(BaseModel):
    id: str
    name: str
    description: str
    type: str
    xp_reward: int
    color: str
    created_at: str


def habit_to_out(h: Habit) -> HabitOut:
    return HabitOut(
        id=str(h.id),
        name=h.name,
        description=h.description,
        type=h.type,
        xp_reward=h.xp_reward,
        color=h.color,
        created_at=h.created_at.isoformat(),
    )


@router.post("", response_model=HabitOut, status_code=201)
async def create_habit(body: HabitCreate, user: User = Depends(get_current_user)):
    habit = Habit(user_id=str(user.id), **body.model_dump())
    await habit.insert()
    return habit_to_out(habit)


@router.get("", response_model=List[HabitOut])
async def list_habits(user: User = Depends(get_current_user)):
    habits = await Habit.find(Habit.user_id == str(user.id)).to_list()
    return [habit_to_out(h) for h in habits]


@router.get("/{habit_id}", response_model=HabitOut)
async def get_habit(habit_id: str, user: User = Depends(get_current_user)):
    habit = await Habit.get(habit_id)
    if not habit or habit.user_id != str(user.id):
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit_to_out(habit)


@router.put("/{habit_id}", response_model=HabitOut)
async def update_habit(
    habit_id: str, body: HabitUpdate, user: User = Depends(get_current_user)
):
    habit = await Habit.get(habit_id)
    if not habit or habit.user_id != str(user.id):
        raise HTTPException(status_code=404, detail="Habit not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(habit, field, value)
    await habit.save()
    return habit_to_out(habit)


@router.delete("/{habit_id}", status_code=204)
async def delete_habit(habit_id: str, user: User = Depends(get_current_user)):
    habit = await Habit.get(habit_id)
    if not habit or habit.user_id != str(user.id):
        raise HTTPException(status_code=404, detail="Habit not found")
    # Cascade delete activities and progress
    await Activity.find(Activity.habit_id == habit_id).delete()
    await Progress.find(Progress.habit_id == habit_id).delete()
    await habit.delete()
