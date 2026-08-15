from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.employee import EmployeeCreate, EmployeeLogin, EmployeeResponse
from app.services.auth import create_access_token, verify_password
from app.services.employee import create_employee, get_employee_by_email


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
):
    existing_employee = get_employee_by_email(
        db,
        employee_data.email,
    )

    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    employee = create_employee(
        db,
        employee_data,
    )

    return employee


@router.post("/login")
def login(
    login_data: EmployeeLogin,
    db: Session = Depends(get_db),
):
    employee = get_employee_by_email(
        db,
        login_data.email,
    )

    if not employee or not verify_password(
        login_data.password,
        employee.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        {"sub": str(employee.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "employee": {
            "id": employee.id,
            "name": employee.name,
            "email": employee.email,
            "department": employee.department,
            "role": employee.role,
        },
    }