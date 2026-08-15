from pydantic import BaseModel, ConfigDict, EmailStr, Field


class EmployeeCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    department: str = Field(min_length=2, max_length=100)
    role: str = Field(default="EMPLOYEE")


class EmployeeLogin(BaseModel):
    email: EmailStr
    password: str


class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    department: str
    role: str

    model_config = ConfigDict(from_attributes=True)