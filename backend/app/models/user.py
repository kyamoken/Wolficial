from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Column, String

from app.db.base_class import Base

class User(SQLAlchemyBaseUserTable, Base):
    username = Column(String, unique=True, index=True, nullable=False)