\# Employee Leave Management System



A full-stack Employee Leave Management System developed as a practical Full Stack Developer Intern assessment.



The system digitizes the employee leave process by allowing employees to apply for and track leave requests while managers can review, approve, reject, and manage employee leave requests.



\## Project Overview



The Employee Leave Management System provides a centralized platform for managing employee leave requests.



\### Main Objectives



\* Secure employee and manager authentication

\* Role-based access control

\* Employee leave application and tracking

\* Manager leave approval and rejection workflow

\* Leave history management

\* RESTful backend APIs

\* Database-backed application

\* Responsive frontend interface

\* Input validation and error handling

\* Audit logging

\* Maintainable project architecture



\## Features



\### Authentication



\* Login using email and password

\* Password hashing using bcrypt

\* JWT-based authentication

\* Employee and Manager roles

\* Protected application areas

\* Invalid credential validation

\* Logout functionality on the frontend



\### Employee Module



Employees can:



\* Login securely

\* View their dashboard

\* Apply for leave

\* View leave history

\* View leave status

\* Cancel pending leave requests

\* Search and filter leave records



\### Manager Module



Managers can:



\* Login securely

\* View manager dashboard

\* View pending leave requests

\* Review leave details

\* Approve leave requests

\* Reject leave requests with comments

\* View employee leave information



\### Dashboard



Employee dashboard provides:



\* Total leave requests

\* Approved requests

\* Pending requests

\* Rejected requests

\* Recent leave activities



Manager dashboard provides:



\* Total employees

\* Pending approvals

\* Approved requests

\* Rejected requests

\* Recent activities



\### Additional Features



\* Leave type management

\* Leave status tracking

\* Manager comments

\* Audit logging

\* Form validation

\* Error handling

\* Responsive UI

\* Background images and modern dashboard design



\## Technology Stack



\### Frontend



\* React

\* Vite

\* JavaScript

\* CSS

\* HTML



\### Backend



\* Python

\* FastAPI

\* SQLAlchemy

\* Pydantic

\* JWT

\* Passlib / bcrypt



\### Database



\* Relational database

\* SQLAlchemy ORM

\* Foreign key relationships

\* Normalized database structure



\### Development Tools



\* Git

\* GitHub

\* Visual Studio Code

\* PowerShell



\## Project Structure



```text

leave-management-system/

│

├── backend/

│   ├── app/

│   │   ├── api/

│   │   │   ├── auth.py

│   │   │   ├── leave\_types.py

│   │   │   └── leaves.py

│   │   │

│   │   ├── core/

│   │   │   └── config.py

│   │   │

│   │   ├── db/

│   │   │   └── database.py

│   │   │

│   │   ├── models/

│   │   │   ├── audit\_log.py

│   │   │   ├── employee.py

│   │   │   ├── leave.py

│   │   │   └── leave\_type.py

│   │   │

│   │   ├── schemas/

│   │   │   ├── audit\_log.py

│   │   │   ├── employee.py

│   │   │   ├── leave.py

│   │   │   └── leave\_type.py

│   │   │

│   │   ├── services/

│   │   │   ├── audit\_log.py

│   │   │   ├── auth.py

│   │   │   ├── employee.py

│   │   │   ├── leave.py

│   │   │   └── leave\_type.py

│   │   │

│   │   └── main.py

│   │

│   └── requirements.txt

│

├── database/

│   └── database-schema.sql

│

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── assets/

│   │   ├── App.jsx

│   │   ├── App.css

│   │   ├── index.css

│   │   └── main.jsx

│   │

│   ├── package.json

│   └── vite.config.js

│

├── .env.example

├── .gitignore

└── README.md

```



\## Database Design



The system uses the following main entities:



\### Employee



Stores employee authentication and profile information.



Fields include:



\* ID

\* Name

\* Email

\* Password Hash

\* Department

\* Role

\* Created At

\* Updated At



\### Leave



Stores employee leave requests.



Fields include:



\* ID

\* Employee ID

\* Leave Type ID

\* Start Date

\* End Date

\* Reason

\* Status

\* Manager Comments

\* Reviewed By

\* Created At

\* Updated At



\### Leave Type



Stores available leave categories.



Fields include:



\* ID

\* Name

\* Description



\### Audit Log



Stores important system activities for tracking and accountability.



\## API Endpoints



\### Authentication



| Method | Endpoint         | Description                 |

| ------ | ---------------- | --------------------------- |

| POST   | `/auth/register` | Register an employee        |

| POST   | `/auth/login`    | Login and receive JWT token |



\### Leave Management



| Method | Endpoint                         | Description                |

| ------ | -------------------------------- | -------------------------- |

| POST   | `/leaves`                        | Apply for leave            |

| GET    | `/leaves/employee/{employee\_id}` | Get employee leave history |

| GET    | `/leaves/pending`                | Get pending leave requests |

| GET    | `/leaves/{leave\_id}`             | Get leave details          |

| PUT    | `/leaves/{leave\_id}/review`      | Approve or reject leave    |

| PUT    | `/leaves/{leave\_id}/cancel`      | Cancel pending leave       |



\### System



| Method | Endpoint  | Description     |

| ------ | --------- | --------------- |

| GET    | `/`       | API information |

| GET    | `/health` | Health check    |



\## Authentication



The backend uses JWT-based authentication.



After successful login, the API returns an access token.



Example response:



```json

{

&#x20; "access\_token": "JWT\_TOKEN",

&#x20; "token\_type": "bearer",

&#x20; "employee": {

&#x20;   "id": 1,

&#x20;   "name": "Employee Name",

&#x20;   "email": "employee@example.com",

&#x20;   "department": "IT",

&#x20;   "role": "EMPLOYEE"

&#x20; }

}

```



The frontend uses the authenticated user information to provide the appropriate employee or manager experience.



\## Environment Variables



Create a `.env` file inside the `backend` directory.



Example:



```env

DATABASE\_URL=your\_database\_connection\_string



JWT\_SECRET\_KEY=your\_secure\_secret\_key

JWT\_ALGORITHM=HS256

JWT\_ACCESS\_TOKEN\_EXPIRE\_MINUTES=60



CORS\_ORIGINS=http://localhost:5173

```



Never commit the real `.env` file to GitHub.



The repository includes `.env.example` as a configuration template.



\## Installation



\### Prerequisites



Install the following:



\* Python 3.11+

\* Node.js

\* npm

\* Git

\* A supported relational database



\## Backend Setup



Open PowerShell and navigate to the backend:



```powershell

cd backend

```



Create a virtual environment:



```powershell

python -m venv .venv

```



Activate it:



```powershell

.venv\\Scripts\\activate

```



Install dependencies:



```powershell

pip install -r requirements.txt

```



Configure the environment variables in `.env`.



Start the FastAPI server:



```powershell

uvicorn app.main:app --reload

```



The backend will normally run at:



```text

http://127.0.0.1:8000

```



FastAPI automatically provides interactive API documentation at:



```text

http://127.0.0.1:8000/docs

```



\## Frontend Setup



Open another terminal.



Navigate to the frontend:



```powershell

cd frontend

```



Install dependencies:



```powershell

npm install

```



Start the development server:



```powershell

npm run dev

```



The frontend will normally run at:



```text

http://localhost:5173

```



\## Running the Application



Start the backend:



```powershell

cd backend

.venv\\Scripts\\activate

uvicorn app.main:app --reload

```



Then start the frontend in another terminal:



```powershell

cd frontend

npm run dev

```



Open the frontend URL displayed by Vite in your browser.



\## API Documentation



FastAPI provides automatic OpenAPI documentation.



Swagger UI:



```text

http://127.0.0.1:8000/docs

```



ReDoc:



```text

http://127.0.0.1:8000/redoc

```



These interfaces can be used to test and explore the REST APIs.



\## Validation and Error Handling



The application implements validation for:



\* Email format

\* Password length

\* Required fields

\* Leave dates

\* Leave reasons

\* Duplicate employee email

\* Invalid login credentials

\* Missing leave requests

\* Invalid leave status transitions



The API uses appropriate HTTP status codes such as:



\* `200 OK`

\* `201 Created`

\* `400 Bad Request`

\* `401 Unauthorized`

\* `404 Not Found`

\* `409 Conflict`



\## Git Workflow



Git is used for version control.



The project contains meaningful commits representing development stages.



Example commit types:



```text

Initial Leave Management System

Configure database connection

Implement authentication

Develop leave management APIs

Build responsive dashboard

Add frontend validation

Implement approval workflow

Update documentation

```



\## Security Practices



The project follows basic security practices including:



\* Password hashing

\* JWT authentication

\* Environment-based configuration

\* `.env` excluded from Git

\* Input validation

\* CORS configuration

\* Protected authentication flow

\* Database foreign key constraints



\## Sample Credentials



For security reasons, real production credentials are not stored in this repository.



For local testing, create test accounts using the registration functionality or database seed data if configured.



Example roles:



```text

EMPLOYEE

MANAGER

```



\## Assumptions



\* Employees submit leave requests through the application.

\* Managers are responsible for reviewing pending requests.

\* A leave request starts with `PENDING` status.

\* Managers can approve or reject pending requests.

\* Cancelled requests cannot be reviewed.

\* Dates are validated so the end date cannot be before the start date.



\## Known Limitations



The current MVP may not include:



\* Email notifications

\* Advanced leave balance calculation

\* Refresh token rotation

\* Production-grade rate limiting

\* Automated deployment pipeline

\* Comprehensive automated test coverage



These can be implemented as future enhancements.



\## Future Enhancements



Potential future improvements include:



\* JWT refresh tokens

\* Advanced RBAC

\* Leave balance calculation

\* Email notifications

\* Pagination

\* Advanced search and filtering

\* Docker support

\* Unit and integration testing

\* GitHub Actions CI/CD

\* Audit log dashboard

\* Mobile application

\* Advanced reporting

\* Production monitoring



\## Deployment



The application can be deployed using separate hosting services for the frontend and backend.



Before production deployment:



1\. Configure production environment variables.

2\. Configure the production database.

3\. Update CORS settings.

4\. Build the React frontend.

5\. Deploy the FastAPI backend.

6\. Deploy the frontend.

7\. Verify authentication and API connectivity.

8\. Test employee and manager workflows.



\## Project Status



\*\*Status: MVP Completed and Ready for Deployment Preparation\*\*



The project demonstrates:



\* Frontend development

\* Backend development

\* Database design

\* REST API development

\* Authentication

\* Role-based application flow

\* Validation

\* Error handling

\* Git/GitHub workflow

\* Professional project structure



\## Author



\*\*Swarna Pendiyala\*\*



Full Stack Developer Intern Assessment



\## License



This project was developed for educational and assessment purposes.



