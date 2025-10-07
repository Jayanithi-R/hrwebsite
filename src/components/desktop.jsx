import React, { useState, useEffect } from "react";

// Placeholder data
const dashboardData = {
  attendance: [
    { name: "Gordon Paucek", role: "Finance", status: "Absent" },
    { name: "Nora Kreiger", role: "Product Manager", status: "Sick" },
    { name: "Amber Wolf", role: "UI/UX Designer", status: "WFH" },
    { name: "Alonzo Sauer", role: "SQA", status: "Present" },
  ],
  tasks: [
    { title: "Update Payroll Records", priority: "Pending", due: "Today" },
    { title: "Interview with Sarah Lee", priority: "Recruitment", due: "Today" },
    { title: "Review Leave Applications", priority: "Important", due: "Yesterday" },
  ],
  leaveRequests: [
    { name: "Bobby Gibson", type: "Annual Leave", range: "Aug 21 - Sep 04", status: "Pending" },
    { name: "Yvonne Hartmann", type: "Sick Leave", range: "Aug 02 - Aug 18", status: "Pending" },
    { name: "Russell Bartell", type: "Annual Leave", range: "June 24 - July 03", status: "Approved" },
    { name: "Pearl Franecki", type: "Annual Leave", range: "June 04 - June 28", status: "Approved" },
  ],
  interns: { total: 8, attendance: 6 },
};

// Color codes
const badgeColors = {
  Pending: "#FFE8C6",
  Recruitment: "#D6E4FF",
  Important: "#FFD6D6",
  Approved: "#C6F6C6",
  Sick: "#FFE2C6",
  Absent: "#F5C6C6",
  WFH: "#C6D8F5",
  Present: "#C6F5C9",
};

const HRDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const layoutStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: "20px",
    padding: "20px",
    background: "#f8fafc",
    fontFamily: "Inter, sans-serif",
  };

  const card = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    padding: "20px",
  };

  const badge = (label) => ({
    backgroundColor: badgeColors[label] || "#eee",
    color: "#333",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "500",
  });

  const header = { fontSize: "16px", fontWeight: "600", marginBottom: "12px" };

  return (
    <div style={layoutStyle}>
      {/* Attendance */}
      <div style={card}>
        <h3 style={header}>Attendance Report</h3>
        <div>
          {dashboardData.attendance.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div>
                <strong>{a.name}</strong>
                <div style={{ fontSize: "13px", color: "#666" }}>{a.role}</div>
              </div>
              <span style={badge(a.status)}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div style={card}>
        <h3 style={header}>Tasks</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {dashboardData.tasks.map((t, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>{t.title}</strong>
                <div style={{ fontSize: "13px", color: "#666" }}>{t.due}</div>
              </div>
              <span style={badge(t.priority)}>{t.priority}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Schedule */}
      <div style={card}>
        <h3 style={header}>Schedule</h3>
        <p style={{ color: "#666", fontSize: "14px" }}>Upcoming meetings & events</p>
      </div>

      {/* Leave Requests */}
      <div style={{ ...card, gridColumn: isMobile ? "1" : "span 2" }}>
        <h3 style={header}>Leave Requests</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#666" }}>
              <th style={{ padding: "8px 0" }}>Employee</th>
              <th>Leave Type</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.leaveRequests.map((lr, i) => (
              <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "8px 0" }}>{lr.name}</td>
                <td>{lr.type}</td>
                <td>{lr.range}</td>
                <td>
                  <span style={badge(lr.status)}>{lr.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internship */}
      <div style={card}>
        <h3 style={header}>Internship</h3>
        <p style={{ fontSize: "14px" }}>
          Total Interns: <strong>{dashboardData.interns.total}</strong>
        </p>
        <p style={{ fontSize: "14px" }}>
          Attendance: <strong>{dashboardData.interns.attendance}</strong>
        </p>
        <button
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: "8px",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          View Progress
        </button>
      </div>
    </div>
  );
};

export default HRDashboard;
