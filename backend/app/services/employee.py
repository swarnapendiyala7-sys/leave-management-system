from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate
from app.services.auth import hash_password


def get_employee_by_email(
    db: Session,
    email: str,
) -> Employee | None:
    statement = select(Employee).where(Employee.email == email)
    return db.scalar(statement)


def get_employee_by_id(
    db: Session,
    employee_id: int,
) -> Employee | None:
    return db.get(Employee, employee_id)


def create_employee(
    db: Session,
    employee_data: EmployeeCreate,
) -> Employee:
    employee = Employee(
        name=employee_data.name,
        email=employee_data.email,
        password_hash=hash_password(employee_data.password),
        department=employee_data.department,
        role=employee_data.role,
    )

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return employee