import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("TestPassword123");
  const [message, setMessage] = useState("");
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);

  const [leaveType, setLeaveType] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // LOGIN
  const login = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Login failed");
        return;
      }

      setEmployee(data.employee);
      localStorage.setItem("token", data.access_token);

      if (data.employee.role === "MANAGER") {
        setPage("manager");
        loadPendingLeaves();
      } else {
        setPage("dashboard");
      }
    } catch {
      setMessage("Cannot connect to backend. Is FastAPI running?");
    }
  };

  // LOAD EMPLOYEE LEAVES
  const loadLeaves = async () => {
    if (!employee) return;

    try {
      const response = await fetch(
        `${API_URL}/leaves/employee/${employee.id}`
      );

      const data = await response.json();

      if (response.ok) {
        setLeaves(data);
      } else {
        setMessage(data.detail || "Could not load leaves");
      }
    } catch {
      setMessage("Could not load leaves.");
    }
  };

  // LOAD PENDING LEAVES FOR MANAGER
  const loadPendingLeaves = async () => {
    try {
      const response = await fetch(`${API_URL}/leaves/pending`);

      const data = await response.json();

      if (response.ok) {
        setLeaves(data);
      } else {
        setMessage(data.detail || "Could not load pending leaves");
      }
    } catch {
      setMessage("Cannot connect to backend.");
    }
  };

  // APPLY FOR LEAVE
  const applyLeave = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/leaves?employee_id=${employee.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leave_type_id: Number(leaveType),
            start_date: startDate,
            end_date: endDate,
            reason: reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Could not apply for leave");
        return;
      }

      setMessage("Leave applied successfully! 🎉");

      setStartDate("");
      setEndDate("");
      setReason("");

      loadLeaves();
    } catch {
      setMessage("Cannot connect to backend.");
    }
  };

  // APPROVE / REJECT LEAVE
  const reviewLeave = async (leaveId, status) => {
    try {
      const response = await fetch(
        `${API_URL}/leaves/${leaveId}/review?reviewer_id=${employee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
            manager_comments:
              status === "APPROVED"
                ? "Leave approved"
                : "Leave rejected",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Could not review leave");
        return;
      }

      setMessage(`Leave ${status.toLowerCase()} successfully!`);

      loadPendingLeaves();
    } catch {
      setMessage("Cannot connect to backend.");
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setEmployee(null);
    setLeaves([]);
    setPage("login");
    setMessage("");
  };

  // LOGIN PAGE
  if (page === "login") {
    return (
      <div className="app">
        <div className="login-card">
          <h1>Leave Management System</h1>
          <p className="subtitle">Employee / Manager Portal</p>

          <form onSubmit={login}>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />

            <button type="submit">Login</button>
          </form>

          {message && <p className="message">{message}</p>}

          <p className="demo">
            Employee: test@example.com
          </p>

          <p className="demo">
            Manager: manager@example.com
          </p>
        </div>
      </div>
    );
  }

  // MANAGER PAGE
  if (page === "manager") {
    return (
      <div className="app">
        <header className="navbar">
          <div>
            <h2>Leave Management System</h2>
            <span>Manager Portal</span>
          </div>

          <button className="logout" onClick={logout}>
            Logout
          </button>
        </header>

        <main className="dashboard">
          <div className="welcome">
            <h1>Welcome, {employee?.name} 👋</h1>
            <p>
              {employee?.department} • {employee?.role}
            </p>
          </div>

          <div className="cards">
            <div className="card">
              <h3>Manager ID</h3>
              <strong>{employee?.id}</strong>
            </div>

            <div className="card">
              <h3>Department</h3>
              <strong>{employee?.department}</strong>
            </div>

            <div className="card">
              <h3>Pending Leaves</h3>
              <strong>{leaves.length}</strong>
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <h2>Pending Leave Requests</h2>

              <button onClick={loadPendingLeaves}>
                Refresh
              </button>
            </div>

            {leaves.length === 0 ? (
              <p className="empty">
                No pending leave requests.
              </p>
            ) : (
              <div className="leave-list">
                {leaves.map((leave) => (
                  <div className="leave-item" key={leave.id}>
                    <div>
                      <h3>Leave #{leave.id}</h3>

                      <p>
                        Employee ID: {leave.employee_id}
                      </p>

                      <p>
                        {leave.start_date} → {leave.end_date}
                      </p>

                      <p>
                        <strong>Reason:</strong> {leave.reason}
                      </p>

                      <p>
                        <strong>Status:</strong> {leave.status}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() =>
                          reviewLeave(leave.id, "APPROVED")
                        }
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          reviewLeave(leave.id, "REJECTED")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {message && (
              <p className="message">{message}</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // EMPLOYEE DASHBOARD
  return (
    <div className="app">
      <header className="navbar">
        <div>
          <h2>Leave Management System</h2>
          <span>Employee Portal</span>
        </div>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard">
        <div className="welcome">
          <h1>Welcome, {employee?.name} 👋</h1>

          <p>
            {employee?.department} • {employee?.role}
          </p>
        </div>

        <div className="cards">
          <div className="card">
            <h3>Employee ID</h3>
            <strong>{employee?.id}</strong>
          </div>

          <div className="card">
            <h3>Department</h3>
            <strong>{employee?.department}</strong>
          </div>

          <div className="card">
            <h3>Leave Requests</h3>
            <strong>{leaves.length}</strong>
          </div>
        </div>

        <div className="section">
          <h2>Apply for Leave</h2>

          <form
            onSubmit={applyLeave}
            className="leave-form"
          >
            <label>Leave Type</label>

            <select
              value={leaveType}
              onChange={(e) =>
                setLeaveType(e.target.value)
              }
            >
              <option value="1">Casual Leave</option>
              <option value="2">Sick Leave</option>
              <option value="3">Earned Leave</option>
            </select>

            <label>Start Date</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              required
            />

            <label>End Date</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              required
            />

            <label>Reason</label>

            <textarea
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              placeholder="Enter reason for leave"
              required
            />

            <button type="submit">
              Apply for Leave
            </button>
          </form>

          {message && (
            <p className="message">{message}</p>
          )}
        </div>

        <div className="section">
          <div className="section-header">
            <h2>My Leave Requests</h2>

            <button onClick={loadLeaves}>
              Refresh
            </button>
          </div>

          {leaves.length === 0 ? (
            <p className="empty">
              Click Refresh to load your leave requests.
            </p>
          ) : (
            <div className="leave-list">
              {leaves.map((leave) => (
                <div
                  className="leave-item"
                  key={leave.id}
                >
                  <div>
                    <h3>Leave #{leave.id}</h3>

                    <p>
                      {leave.start_date} → {leave.end_date}
                    </p>

                    <p>{leave.reason}</p>
                  </div>

                  <span
                    className={`status ${leave.status.toLowerCase()}`}
                  >
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

