-- Leave Management System
-- Database Schema
-- PostgreSQL 18+

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT employees_role_check
        CHECK (role IN ('EMPLOYEE', 'MANAGER'))
);


CREATE TABLE leave_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);


CREATE TABLE leaves (
    id SERIAL PRIMARY KEY,

    employee_id INTEGER NOT NULL,
    leave_type_id INTEGER NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    manager_comments TEXT,

    reviewed_by INTEGER,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT leaves_employee_fk
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE,

    CONSTRAINT leaves_leave_type_fk
        FOREIGN KEY (leave_type_id)
        REFERENCES leave_types(id)
        ON DELETE RESTRICT,

    CONSTRAINT leaves_reviewer_fk
        FOREIGN KEY (reviewed_by)
        REFERENCES employees(id)
        ON DELETE SET NULL,

    CONSTRAINT leaves_status_check
        CHECK (
            status IN (
                'PENDING',
                'APPROVED',
                'REJECTED',
                'CANCELLED'
            )
        ),

    CONSTRAINT leaves_date_check
        CHECK (end_date >= start_date)
);


CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    leave_id INTEGER,

    action VARCHAR(100) NOT NULL,
    details TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT audit_logs_user_fk
        FOREIGN KEY (user_id)
        REFERENCES employees(id)
        ON DELETE CASCADE,

    CONSTRAINT audit_logs_leave_fk
        FOREIGN KEY (leave_id)
        REFERENCES leaves(id)
        ON DELETE SET NULL
);


-- Performance indexes

CREATE INDEX idx_employees_email
    ON employees(email);

CREATE INDEX idx_employees_role
    ON employees(role);

CREATE INDEX idx_leaves_employee_id
    ON leaves(employee_id);

CREATE INDEX idx_leaves_status
    ON leaves(status);

CREATE INDEX idx_leaves_type_id
    ON leaves(leave_type_id);

CREATE INDEX idx_leaves_dates
    ON leaves(start_date, end_date);

CREATE INDEX idx_audit_logs_user_id
    ON audit_logs(user_id);

CREATE INDEX idx_audit_logs_leave_id
    ON audit_logs(leave_id);


-- Initial leave types

INSERT INTO leave_types (name, description)
VALUES
    ('Casual Leave', 'Leave for personal or casual purposes'),
    ('Sick Leave', 'Leave due to illness or medical reasons'),
    ('Annual Leave', 'Planned annual vacation leave'),
    ('Emergency Leave', 'Leave for urgent or unexpected situations')
ON CONFLICT (name) DO NOTHING;