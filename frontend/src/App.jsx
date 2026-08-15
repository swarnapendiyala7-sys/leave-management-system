import { useState } from "react";
import "./App.css";
import leaveBackground from "./assets/leave-background.jpg";
import dashboardBackground from "./assets/dashboard-background.jpg";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [page, setPage] = useState("login");
  const [activePage, setActivePage] = useState("dashboard");

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("TestPassword123");

  const [message, setMessage] = useState("");
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);

  const [leaveType, setLeaveType] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // =========================
  // LOGIN
  // =========================
  const login = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Login failed");
        return;
      }

      setEmployee(data.employee);
      localStorage.setItem("token", data.access_token);

      setActivePage("dashboard");

      if (data.employee.role === "MANAGER") {
        setPage("manager");
      } else {
        setPage("employee");
      }
    } catch {
      setMessage("Cannot connect to backend. Is FastAPI running?");
    }
  };

  // =========================
  // LOAD EMPLOYEE LEAVES
  // =========================
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
      setMessage("Could not connect to backend.");
    }
  };

  // =========================
  // LOAD PENDING LEAVES
  // =========================
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

  // =========================
  // APPLY LEAVE
  // =========================
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

  // =========================
  // APPROVE / REJECT
  // =========================
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

      setMessage(
        status === "APPROVED"
          ? "Leave approved successfully! ✅"
          : "Leave rejected successfully! ❌"
      );

      loadPendingLeaves();
    } catch {
      setMessage("Cannot connect to backend.");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");

    setEmployee(null);
    setLeaves([]);
    setPage("login");
    setActivePage("dashboard");
    setMessage("");
  };

  // =========================
  // LOGIN PAGE
  // =========================
  if (page === "login") {
  return (
    <div
  className="login-page"
  style={{
    backgroundImage: `url(${leaveBackground})`,
  }}
>

      <div className="login-card">

        <div className="login-logo">
          🏖️
        </div>

        <h1>LeaveFlow</h1>

        <p className="subtitle">
          Leave Management System
        </p>

        <form onSubmit={login}>

          <label>Email Address</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button type="submit">
            Login to LeaveFlow →
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <div className="demo-box">

          <strong>Demo Accounts</strong>

          <p>
            Employee: test@example.com
          </p>

          <p>
            Manager: manager@example.com
          </p>

        </div>

      </div>

    </div>
  );
}
  // =====================================================
  // MAIN APPLICATION WITH LEFT SIDEBAR
  // =====================================================
  return (
    <div
  className="app"
  style={{
    backgroundImage: `url(${dashboardBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  }}
>

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">
            LM
          </div>

          <div>
            <h2>LeaveFlow</h2>
            <span>Management System</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {employee?.name?.charAt(0)}
          </div>

          <div>
            <strong>{employee?.name}</strong>
            <small>{employee?.role}</small>
          </div>
        </div>

        <nav className="sidebar-nav">

          {/* DASHBOARD */}
          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setActivePage("dashboard");

              if (employee?.role === "MANAGER") {
                loadPendingLeaves();
              } else {
                loadLeaves();
              }
            }}
          >
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </button>

          {/* EMPLOYEE OPTIONS */}
          {employee?.role !== "MANAGER" && (
            <>
              <button
                className={
                  activePage === "apply"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => {
                  setActivePage("apply");
                  setMessage("");
                }}
              >
                <span className="nav-icon">📝</span>
                <span>Apply Leave</span>
              </button>

              <button
                className={
                  activePage === "my-leaves"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => {
                  setActivePage("my-leaves");
                  setMessage("");
                  loadLeaves();
                }}
              >
                <span className="nav-icon">📋</span>
                <span>My Leaves</span>
              </button>
            </>
          )}

          {/* MANAGER OPTIONS */}
          {employee?.role === "MANAGER" && (
            <>
              <button
                className={
                  activePage === "pending"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => {
                  setActivePage("pending");
                  setMessage("");
                  loadPendingLeaves();
                }}
              >
                <span className="nav-icon">⏳</span>
                <span>Pending Leaves</span>
              </button>

              <button
                className={
                  activePage === "requests"
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => {
                  setActivePage("requests");
                  setMessage("");
                  loadPendingLeaves();
                }}
              >
                <span className="nav-icon">📋</span>
                <span>Leave Requests</span>
              </button>
            </>
          )}

        </nav>

        <div className="sidebar-bottom">

          <button
            className="nav-item logout-side"
            onClick={logout}
          >
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <h2>
              {employee?.role === "MANAGER"
                ? "Manager Portal"
                : "Employee Portal"}
            </h2>

            <p>
              Leave Management System
            </p>
          </div>

          <div className="topbar-user">
            <div className="top-avatar">
              {employee?.name?.charAt(0)}
            </div>

            <div>
              <strong>{employee?.name}</strong>
              <span>{employee?.department}</span>
            </div>
          </div>

        </header>

        <div className="content-area">

          {/* =========================
              DASHBOARD
          ========================= */}
          {activePage === "dashboard" && (
            <>
              <div className="welcome">
                <h1>
                  Welcome, {employee?.name} 👋
                </h1>

                <p>
                  {employee?.department} •{" "}
                  {employee?.role}
                </p>
              </div>

              <div className="cards">

                <div className="card">
                  <h3>
                    {employee?.role === "MANAGER"
                      ? "Manager ID"
                      : "Employee ID"}
                  </h3>

                  <strong>
                    {employee?.id}
                  </strong>
                </div>

                <div className="card">
                  <h3>
                    Department
                  </h3>

                  <strong>
                    {employee?.department}
                  </strong>
                </div>

                <div className="card">
                  <h3>
                    {employee?.role === "MANAGER"
                      ? "Pending Leaves"
                      : "Leave Requests"}
                  </h3>

                  <strong>
                    {leaves.length}
                  </strong>
                </div>

              </div>

              <div className="section">

                <h2>
                  Quick Overview
                </h2>

                <p className="empty">
                  Use the menu on the left to manage your leave requests.
                </p>

              </div>
            </>
          )}

          {/* =========================
              APPLY LEAVE
          ========================= */}
          {activePage === "apply" &&
            employee?.role !== "MANAGER" && (
              <div className="section">

                <h2>
                  Apply for Leave
                </h2>

                <form
                  onSubmit={applyLeave}
                  className="leave-form"
                >

                  <label>
                    Leave Type
                  </label>

                  <select
                    value={leaveType}
                    onChange={(e) =>
                      setLeaveType(e.target.value)
                    }
                  >
                    <option value="1">
                      Casual Leave
                    </option>

                    <option value="2">
                      Sick Leave
                    </option>

                    <option value="3">
                      Earned Leave
                    </option>
                  </select>

                  <label>
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                    required
                  />

                  <label>
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    required
                  />

                  <label>
                    Reason
                  </label>

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
                  <p className="message">
                    {message}
                  </p>
                )}

              </div>
            )}

          {/* =========================
              MY LEAVES
          ========================= */}
          {activePage === "my-leaves" &&
            employee?.role !== "MANAGER" && (
              <div className="section">

                <div className="section-header">

                  <h2>
                    My Leave Requests
                  </h2>

                  <button onClick={loadLeaves}>
                    Refresh
                  </button>

                </div>

                {leaves.length === 0 ? (
                  <p className="empty">
                    No leave requests found.
                  </p>
                ) : (
                  <div className="leave-list">

                    {leaves.map((leave) => (
                      <div
                        className="leave-item"
                        key={leave.id}
                      >

                        <div>

                          <h3>
                            Leave #{leave.id}
                          </h3>

                          <p>
                            {leave.start_date} →{" "}
                            {leave.end_date}
                          </p>

                          <p>
                            {leave.reason}
                          </p>

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
            )}

          {/* =========================
              MANAGER PENDING LEAVES
          ========================= */}
          {activePage === "pending" &&
            employee?.role === "MANAGER" && (
              <div className="section">

                <div className="section-header">

                  <h2>
                    Pending Leave Requests
                  </h2>

                  <button
                    onClick={loadPendingLeaves}
                  >
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
                      <div
                        className="leave-item"
                        key={leave.id}
                      >

                        <div>

                          <h3>
                            Leave #{leave.id}
                          </h3>

                          <p>
                            Employee ID:{" "}
                            {leave.employee_id}
                          </p>

                          <p>
                            {leave.start_date} →{" "}
                            {leave.end_date}
                          </p>

                          <p>
                            <strong>
                              Reason:
                            </strong>{" "}
                            {leave.reason}
                          </p>

                          <p>
                            <strong>
                              Status:
                            </strong>{" "}
                            {leave.status}
                          </p>

                        </div>

                        <div>

                          <button
                            onClick={() =>
                              reviewLeave(
                                leave.id,
                                "APPROVED"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              reviewLeave(
                                leave.id,
                                "REJECTED"
                              )
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
                  <p className="message">
                    {message}
                  </p>
                )}

              </div>
            )}

          {/* =========================
              MANAGER REQUESTS
          ========================= */}
          {activePage === "requests" &&
            employee?.role === "MANAGER" && (
              <div className="section">

                <div className="section-header">

                  <h2>
                    Leave Requests
                  </h2>

                  <button
                    onClick={loadPendingLeaves}
                  >
                    Refresh
                  </button>

                </div>

                {leaves.length === 0 ? (
                  <p className="empty">
                    No leave requests found.
                  </p>
                ) : (
                  <div className="leave-list">

                    {leaves.map((leave) => (
                      <div
                        className="leave-item"
                        key={leave.id}
                      >

                        <div>

                          <h3>
                            Leave #{leave.id}
                          </h3>

                          <p>
                            Employee ID:{" "}
                            {leave.employee_id}
                          </p>

                          <p>
                            {leave.start_date} →{" "}
                            {leave.end_date}
                          </p>

                          <p>
                            <strong>
                              Reason:
                            </strong>{" "}
                            {leave.reason}
                          </p>

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
            )}

        </div>

      </main>

    </div>
  );
}
export default App;
