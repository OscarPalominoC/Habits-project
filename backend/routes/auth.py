from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from models.user import User
from models.habit import Habit
from models.activity import Activity
from core.security import hash_password, verify_password, create_access_token
from core.defaults import DEFAULT_HABITS

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: RegisterRequest):
    existing = await User.find_one(User.email == body.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_username = await User.find_one(User.username == body.username)
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=body.username,
        email=body.email,
        password_hash=hash_password(body.password),
    )
    await user.insert()

    for habit_data in DEFAULT_HABITS:
        habit = Habit(
            user_id=str(user.id),
            name=habit_data["name"],
            description=habit_data["description"],
            type=habit_data["type"],
            xp_reward=habit_data["xp_reward"],
            color="#6366f1"
        )
        await habit.insert()
        
        for act_data in habit_data["activities"]:
            activity = Activity(
                habit_id=str(habit.id),
                name=act_data["name"],
                xp_value=act_data["xp_value"],
                is_required=act_data["is_required"],
                order=act_data["order"]
            )
            await activity.insert()

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    user = await User.find_one(User.email == body.email)
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)
