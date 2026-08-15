from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class LeaveType(Base):
    __tablename__ = "leave_types"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        unique=True,
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )