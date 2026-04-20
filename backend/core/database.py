from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from core.config import settings

client: AsyncIOMotorClient = None


async def connect_db():
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    from models.user import User
    from models.habit import Habit
    from models.activity import Activity
    from models.progress import Progress
    from models.achievement import Achievement

    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[User, Habit, Activity, Progress, Achievement],
    )


async def close_db():
    global client
    if client:
        client.close()
