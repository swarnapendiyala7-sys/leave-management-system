from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    user_id: int,
    action: str,
    leave_id: int | None = None,
    details: str | None = None,
) -> AuditLog:
    audit_log = AuditLog(
        user_id=user_id,
        leave_id=leave_id,
        action=action,
        details=details,
    )

    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)

    return audit_log


def get_user_audit_logs(
    db: Session,
    user_id: int,
) -> list[AuditLog]:
    statement = (
        select(AuditLog)
        .where(AuditLog.user_id == user_id)
        .order_by(AuditLog.created_at.desc())
    )

    return list(db.scalars(statement).all())