from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Leave(Base):
    __tablename__ = "leaves"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    employee_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
    )

    leave_type_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("leave_types.id", ondelete="RESTRICT"),
        nullable=False,
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="PENDING",
    )

    manager_comments: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    reviewed_by: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("employees.id", ondelete="SET NULL"),
        nullable=True,
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