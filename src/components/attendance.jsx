import { useState } from "react";
import ReactDOM from "react-dom/client";

function AttendanceDashboard() {
  const [activeTab, setActiveTab] = useState("daily");

  const [attendance, setAttendance] = useState([
    { id: 1, employee: "John Doe", employeeId: 1, email: "john@example.com", github: "johndoe", projects: 3, companyProjects: 2, daily: [] },
    { id: 2, employee: "Jane Smith", employeeId: 2, email: "jane@example.com", github: "janesmith", projects: 2, companyProjects: 1, daily: [] },
    { id: 3, employee: "Michael Brown", employeeId: 3, email: "michaelbrown", github: "michaelbrown", projects: 4, companyProjects: 3, daily: [] },
    { id: 4, employee: "Sarah Davis", employeeId: 4, email: "sarahdavis", github: "sarahdavis", projects: 1, companyProjects: 1, daily: [] },
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employeeId: 1, leaveType: "Sickness", from: "2025-10-10", to: "2025-10-12", status: "Pending" },
    { id: 2, employeeId: 2, leaveType: "Personal", from: "2025-10-23", to: "2025-10-25", status: "Approved" },
  ]);

  const handleCheckInOut = (id) => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toLocaleTimeString();
    setAttendance(prev =>
      prev.map(emp => {
        if (emp.id !== id) return emp;
        const todayRecord = emp.daily.find(d => d.date === today);
        if (!todayRecord) {
          return { ...emp, daily: [...emp.daily, { date: today, checkIn: now, breakStart: "", breakEnd: "", checkOut: "" }] };
        }
        if (!todayRecord.checkOut) todayRecord.checkOut = now;
        else todayRecord.checkIn = now;
        return { ...emp };
      })
    );
  };

  const handleBreak = (id) => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toLocaleTimeString();
    setAttendance(prev =>
      prev.map(emp => {
        if (emp.id !== id) return emp;
        const todayRecord = emp.daily.find(d => d.date === today);
        if (!todayRecord) return emp;
        if (!todayRecord.breakStart) todayRecord.breakStart = now;
        else todayRecord.breakEnd = now;
        return { ...emp };
      })
    );
  };

  const parseTime = (time) => {
    if (!time) return 0;
    const [h, m, s] = time.split(":").map(Number);
    return h * 60 + m + s / 60;
  };

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const getEmployeeStats = (emp) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let monthDays = 0, monthPresent = 0, monthCheckInTotal = 0, monthCheckOutTotal = 0;
    let yearDays = 0, yearPresent = 0, yearCheckInTotal = 0, yearCheckOutTotal = 0;

    emp.daily.forEach(d => {
      const dateObj = new Date(d.date);
      if (d.checkIn && d.checkOut) {
        yearDays++; yearPresent++; yearCheckInTotal += parseTime(d.checkIn); yearCheckOutTotal += parseTime(d.checkOut);
        if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
          monthDays++; monthPresent++; monthCheckInTotal += parseTime(d.checkIn); monthCheckOutTotal += parseTime(d.checkOut);
        }
      } else if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
        monthDays++;
      }
      yearDays++;
    });

    const empLeaves = leaveRequests.filter(l => l.employeeId === emp.id).map(l => `${l.leaveType}(${l.status})`).join(", ") || "-";
    return {
      avgCheckIn: monthCheckInTotal ? formatTime(monthCheckInTotal / monthPresent) : "-",
      avgCheckOut: monthCheckOutTotal ? formatTime(monthCheckOutTotal / monthPresent) : "-",
      monthlyPercent: monthDays ? ((monthPresent / monthDays) * 100).toFixed(0) + "%" : "-",
      yearlyPercent: yearDays ? ((yearPresent / yearDays) * 100).toFixed(0) + "%" : "-",
      leaves: empLeaves
    };
  };

  const cellStyle = {
    border: "1px solid #e0e0e0",
    padding: "0.75rem 1rem",
    textAlign: "left",
    verticalAlign: "middle"
  };

  const headerStyle = {
    ...cellStyle,
    background: "#f3f4f6",
    fontWeight: 600,
    fontSize: "0.95rem"
  };

  const rowStyle = (idx) => ({
    background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
    transition: "background 0.2s",
    cursor: "default"
  });

  const buttonStyle = {
    padding: "0.3rem 0.6rem",
    fontSize: "0.8rem",
    borderRadius: "0.25rem",
    border: "1px solid #4f46e5",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer"
  };

  return (
    <div style={{ padding: "2rem", background: "#f9fafb", minHeight: "100vh", fontFamily: "Arial, sans-serif", fontSize: "0.9rem" }}>
      {/* Tabs */}
      <div style={{ marginBottom: "2rem" }}>
        {["daily", "attendance", "leave", "all"].map(tab => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              background: activeTab === tab ? "#4f46e5" : "#e5e7eb",
              color: activeTab === tab ? "#fff" : "#000",
              transition: "0.2s"
            }}
          >
            {tab === "daily" ? "Daily Attendance" : tab === "attendance" ? "Attendance %" : tab === "leave" ? "Leave Requests" : "All Employees"}
          </span>
        ))}
      </div>

      {/* Table render function to reduce repetition */}
      {["daily", "attendance", "leave", "all"].map(tabType => {
        if (activeTab !== tabType) return null;

        let headers = [], rows = [];
        if (tabType === "daily") {
          headers = ["Employee", "Check In", "Lunch Break", "Back to Work", "Check Out"];
          rows = attendance.map((emp, idx) => {
            const today = new Date().toISOString().split("T")[0];
            const todayRecord = emp.daily.find(d => d.date === today) || {};
            return (
              <tr key={emp.id} style={rowStyle(idx)}>
                <td style={cellStyle}>{emp.employee}</td>
                <td style={cellStyle}>{todayRecord.checkIn || "-"}</td>
                <td style={cellStyle}>{todayRecord.breakStart || "-"}</td>
                <td style={cellStyle}>{todayRecord.breakEnd || "-"}</td>
                <td style={cellStyle}>{todayRecord.checkOut || "-"}</td>
              </tr>

            )
          });
        } else if (tabType === "attendance") {
          headers = ["Employee", "Avg Check-In", "Avg Check-Out", "Monthly %", "Yearly %",];
          rows = attendance.map((emp, idx) => {
            const stats = getEmployeeStats(emp);
            return (
              <tr key={emp.id} style={rowStyle(idx)}>
                <td style={cellStyle}>{emp.employee}</td>
                <td style={cellStyle}>{stats.avgCheckIn}</td>
                <td style={cellStyle}>{stats.avgCheckOut}</td>
                <td style={cellStyle}>{stats.monthlyPercent}</td>
                <td style={cellStyle}>{stats.yearlyPercent}</td>

              </tr>
            )
          });
        } else if (tabType === "leave") {
          headers = ["Employee", "Leave Type", "From", "To", "Status"];
          rows = leaveRequests.map((req, idx) => {
            const emp = attendance.find(e => e.id === req.employeeId);
            return (
              <tr key={req.id} style={rowStyle(idx)}>
                <td style={cellStyle}>{emp?.employee || "Unknown"}</td>
                <td style={cellStyle}>{req.leaveType}</td>
                <td style={cellStyle}>{req.from}</td>
                <td style={cellStyle}>{req.to}</td>
                <td style={cellStyle}>
                  <select
                    value={req.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setLeaveRequests(prev =>
                        prev.map(r => r.id === req.id ? { ...r, status: newStatus } : r)
                      );
                    }}
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                      fontSize: "0.85rem"
                    }}
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </td>

              </tr>
            )
          });
        } else if (tabType === "all") {
          headers = ["ID", "Email", "GitHub", "Projects Worked", "Company Projects"];
          rows = attendance.map((emp, idx) => (
            <tr key={emp.id} style={rowStyle(idx)}>
              <td style={cellStyle}>{emp.employeeId}</td>
              <td style={cellStyle}>{emp.email}</td>
              <td style={cellStyle}>{emp.github}</td>
              <td style={cellStyle}>{emp.projects}</td>
              <td style={cellStyle}>{emp.companyProjects}</td>
            </tr>
          ));
        }

        return (
          <table
            key={tabType}
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "2rem",
              borderRadius: "0.5rem",
              overflow: "hidden",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}
          >
            <thead>
              <tr>
                {headers.map((h, i) => <th key={i} style={headerStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        )
      })}

    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AttendanceDashboard />);
export default AttendanceDashboard;
