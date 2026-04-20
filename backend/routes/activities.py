from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from models.activity import Activity
from models.habit import Habit
from core.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/activities", tags=["activities"])


class ActivityCreate(BaseModel):
    habit_id: str
    name: str
    xp_value: int = 10
    is_required: bool = True
    order: int = 0


class ActivityUpdate(BaseModel):
    name: str | None = None
    xp_value: int | None = None
    is_required: bool | None = None
    order: int | None = None


class ActivityOut(BaseModel):
    id: str
    habit_id: str
    name: str
    xp_value: int
    is_required: bool
    order: int


def activity_to_out(a: Activity) -> ActivityOut:
    return ActivityOut(
        id=str(a.id),
        habit_id=a.habit_id,
        name=a.name,
        xp_value=a.xp_value,
        is_required=a.is_required,
        order=a.order,
    )


async def _verify_habit_ownership(habit_id: str, user_id: str):
    habit = await Habit.get(habit_id)
    if not habit or habit.user_id != user_id:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.post("", response_model=ActivityOut, status_code=201)
async def create_activity(body: ActivityCreate, user: User = Depends(get_current_user)):
    await _verify_habit_ownership(body.habit_id, str(user.id))
    activity = Activity(**body.model_dump())
    await activity.insert()
    return activity_to_out(activity)


@router.get("/habit/{habit_id}", response_model=List[ActivityOut])
async def list_activities(habit_id: str, user: User = Depends(get_current_user)):
    await _verify_habit_ownership(habit_id, str(user.id))
    activities = (
        await Activity.find(Activity.habit_id == habit_id)
        .sort(Activity.order)
        .to_list()
    )
    return [activity_to_out(a) for a in activities]


@router.put("/{activity_id}", response_model=ActivityOut)
async def update_activity(
    activity_id: str, body: ActivityUpdate, user: User = Depends(get_current_user)
):
    activity = await Activity.get(activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    await _verify_habit_ownership(activity.habit_id, str(user.id))

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(activity, field, value)
    await activity.save()
    return activity_to_out(activity)


@router.delete("/{activity_id}", status_code=204)
async def delete_activity(activity_id: str, user: User = Depends(get_current_user)):
    activity = await Activity.get(activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    await _verify_habit_ownership(activity.habit_id, str(user.id))
    await activity.delete()
