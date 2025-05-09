from fastapi import FastAPI
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import JWTAuthentication
from fastapi_users.db import SQLAlchemyUserDatabase

from app.core.config import settings
from app.db.session import get_async_db, engine
from app.db.base_class import Base
from app.models.user import User
from app.schemas.user import UserRead, UserCreate, UserUpdate

# DB テーブル作成 (開発用)
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# ユーザーデータベース
async def get_user_db():
    async for db in get_async_db():
        yield SQLAlchemyUserDatabase(User, db)

# JWT 認証
jwt_auth = JWTAuthentication(secret=settings.SECRET_KEY, lifetime_seconds=settings.JWT_LIFETIME_SECONDS, tokenUrl="auth/jwt/login")

# FastAPIUsers インスタンス
fastapi_users = FastAPIUsers[User, int](
    get_user_db,
    [jwt_auth],
    UserRead,
    UserCreate,
    UserUpdate,
)

app = FastAPI(title="Wolficial")

# 認証ルーターを追加
app.include_router(
    fastapi_users.get_auth_router(jwt_auth),
    prefix="/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(),
    prefix="/users",
    tags=["users"],
)