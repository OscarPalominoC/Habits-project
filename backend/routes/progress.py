from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date, timezone

from models.habit import Habit
from models.activity import Activity
from models.progress import Progress, ActivityProgress
from models.user import User
from core.deps import get_current_user
from services.xp_service import calculate_xp, apply_xp
from services.achievement_service import check_and_unlock

router = APIRouter(prefix="/progress", tags=["progress"])


class ActivityProgressIn(BaseModel):
    activity_id: str
    completed: bool


class SubmitProgressRequest(BaseModel):
    habit_id: str
    date: str  # "YYYY-MM-DD"
    activities: List[ActivityProgressIn]


class ProgressOut(BaseModel):
    id: str
    habit_id: str
    date: str
    completion_percentage: float
    xp_earned: int
    status: str
    submitted_at: str


class SubmitProgressResponse(BaseModel):
    progress: ProgressOut
    xp_gained: int
    leveled_up: bool
    new_level: int
    new_title: Optional[str]
    new_achievements: List[dict]


@router.post("", response_model=SubmitProgressResponse, status_code=201)
async def submit_progress(
    body: SubmitProgressRequest, user: User = Depends(get_current_user)
):
    # Verify habit ownership
    habit = await Habit.get(body.habit_id)
    if not habit or habit.user_id != str(user.id):
        raise HTTPException(status_code=404, detail="Habit not found")

    # Get total activities for this habit
    all_activities = await Activity.find(
        Activity.habit_id == body.habit_id
    ).to_list()
    total = len(all_activities)
    if total == 0:
        raise HTTPException(
            status_code=400, detail="Habit has no activities to complete"
        )

    completed_count = sum(1 for a in body.activities if a.completed)
    completion_pct = (completed_count / total) * 100

    if completion_pct == 100:
        status_str = "complete"
    elif completion_pct > 0:
        status_str = "partial"
    else:
        status_str = "incomplete"

    xp_gained = calculate_xp(completion_pct, habit.xp_reward)

    # Upsert progress document for the date
    existing = await Progress.find_one(
        Progress.user_id == str(user.id),
        Progress.habit_id == body.habit_id,
        Progress.date == body.date,
    )

    now = datetime.now(timezone.utc)
    activity_docs = [
        ActivityProgress(
            activity_id=a.activity_id,
            completed=a.completed,
            completed_at=now if a.completed else None,
        )
        for a in body.activities
    ]

    if existing:
        existing.activities = activity_docs
        existing.completion_percentage = completion_pct
        existing.xp_earned = xp_gained
        existing.status = status_str
        existing.submitted_at = now
        await existing.save()
        progress = existing
    else:
        progress = Progress(
            user_id=str(user.id),
            habit_id=body.habit_id,
            date=body.date,
            activities=activity_docs,
            completion_percentage=completion_pct,
            xp_earned=xp_gained,
            status=status_str,
        )
        await progress.insert()

    # Update Streak if progress is completed
    if status_str == "complete" or status_str == "partial":
        if user.last_activity_date != body.date:
            if user.last_activity_date:
                try:
                    last_date = datetime.strptime(user.last_activity_date, "%Y-%m-%d").date()
                    curr_date = datetime.strptime(body.date, "%Y-%m-%d").date()
                    diff = (curr_date - last_date).days
                    if diff == 1:
                        user.streak += 1
                    elif diff > 1:
                        user.streak = 1
                except:
                    user.streak = 1
            else:
                user.streak = 1
            user.last_activity_date = body.date
            await user.save()

    # Apply XP and check level-ups
    xp_result = await apply_xp(user, xp_gained)

    # Count total completions for achievements
    total_completions = await Progress.find(
        Progress.user_id == str(user.id),
        Progress.status == "complete",
    ).count()

    new_achievements = await check_and_unlock(user, total_completions)

    return SubmitProgressResponse(
        progress=ProgressOut(
            id=str(progress.id),
            habit_id=progress.habit_id,
            date=progress.date,
            completion_percentage=progress.completion_percentage,
            xp_earned=progress.xp_earned,
            status=progress.status,
            submitted_at=progress.submitted_at.isoformat(),
        ),
        xp_gained=xp_gained,
        leveled_up=xp_result["leveled_up"],
        new_level=xp_result["new_level"],
        new_title=xp_result.get("new_title"),
        new_achievements=new_achievements,
    )


@router.get("", response_model=List[ProgressOut])
async def get_progress(
    habit_id: Optional[str] = None,
    limit: int = 30,
    user: User = Depends(get_current_user),
):
    query = Progress.find(Progress.user_id == str(user.id))
    if habit_id:
        query = Progress.find(
            Progress.user_id == str(user.id), Progress.habit_id == habit_id
        )
    records = await query.sort(-Progress.submitted_at).limit(limit).to_list()
    return [
        ProgressOut(
            id=str(p.id),
            habit_id=p.habit_id,
            date=p.date,
            completion_percentage=p.completion_percentage,
            xp_earned=p.xp_earned,
            status=p.status,
            submitted_at=p.submitted_at.isoformat(),
        )
        for p in records
    ]
