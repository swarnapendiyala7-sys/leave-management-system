from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    department: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="EMPLOYEE",
    )
    created_at: Mapped[datetime] = mapped_column(
    DateTime,
    nullable=False,
    server_default="CURRENT_TIMESTAMP",
)
updated_at: Mapped[datetime] = mapped_column(
    DateTime,
    nullable=False,
    server_default="CURRENT_TIMESTAMP",
)