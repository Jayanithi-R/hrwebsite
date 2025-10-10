import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Header from "./header";
// Placeholder data
const dashboardData = {
  attendance: [
    { name: "Gordon Paucek", role: "Finance", status: "Absent", avatar: "https://i.pravatar.cc/40?img=1" },
    { name: "Nora Kreiger", role: "Product Manager", status: "Sick", avatar: "https://i.pravatar.cc/40?img=2" },
    { name: "Amber Wolf", role: "UI/UX Designer", status: "WFH", avatar: "https://i.pravatar.cc/40?img=3" },
    { name: "Alonzo Sauer", role: "SQA", status: "Present", avatar: "https://i.pravatar.cc/40?img=4" },
  ],
  tasks: [
    { title: "Update Payroll Records", priority: "Pending", due: "Today" },
    { title: "Interview with Sarah Lee", priority: "Recruitment", due: "Today" },
    { title: "Review Leave Applications", priority: "Important", due: "Yesterday" },
  ],
  leaveRequests: [
    { name: "Bobby Gibson", type: "Annual Leave", range: "Aug 21 - Sep 04", status: "Pending", avatar: "https://i.pravatar.cc/40?img=5" },
    { name: "Yvonne Hartmann", type: "Sick Leave", range: "Aug 02 - Aug 18", status: "Pending", avatar: "https://i.pravatar.cc/40?img=6" },
    { name: "Russell Bartell", type: "Annual Leave", range: "June 24 - July 03", status: "Approved", avatar: "https://i.pravatar.cc/40?img=7" },
    { name: "Pearl Franecki", type: "Annual Leave", range: "June 04 - June 28", status: "Approved", avatar: "https://i.pravatar.cc/40?img=8" },
  ],
  interns: { total: 8, attendance: 6 },
  schedule: [
    { title: "Meeting Mitra 2025", time: "09:00 - 9:45 AM", team: "Product Team", link: "Zoom" },
    { title: "Meeting Ops", time: "10:00 - 11:00 AM", team: "Operations Team", link: "Slack" },
  ],
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

  const headerContainer = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  };

  const header = { fontSize: "16px", fontWeight: "600" };

  const seeAllButton = {
    fontSize: "13px",
    color: "#2563eb",
    cursor: "pointer",
    border: "1px solid #2563eb",
    background: "none",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "500",
  };

  const addButton = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    color: "#fff",
    background: "#2563eb",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    fontWeight: "500",
    cursor: "pointer",
  };

  return (
    <>
    <Header />
    <div style={layoutStyle}>
      {/* Attendance */}
      <div style={card}>
        <div style={headerContainer}>
          <h3 style={header}>Attendance Report</h3>
          <button style={seeAllButton}>See All</button>
        </div>
        {dashboardData.attendance.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={a.avatar} alt={a.name} style={{ width: 35, height: 35, borderRadius: "50%" }} />
              <div>
                <strong>{a.name}</strong>
                <div style={{ fontSize: "13px", color: "#666" }}>{a.role}</div>
              </div>
            </div>
            <span style={badge(a.status)}>{a.status}</span>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div style={card}>
        <div style={headerContainer}>
          <h3 style={header}>Tasks</h3>
          <button style={addButton}>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>+</span> Add Task
          </button>
        </div>
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
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "15px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h3 style={{ fontSize: "16px", color: "#333", margin: 0 }}>Schedule</h3>
          <button
            style={{
              background: "none",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "5px 10px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            See All
          </button>
        </div>
        <p style={{ color: "#666", fontSize: "14px", margin: "0 0 10px 0" }}>
          Upcoming meetings & events
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {dashboardData.schedule.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px",
                color: "#666",
              }}
            >
              <div>
                <strong>{s.title}</strong>
                <div style={{ fontSize: "12px" }}>{s.time}</div>
              </div>
              <span style={{ fontSize: "12px", marginLeft: "10px" }}>{s.link}</span>
              <span style={{ fontSize: "12px", marginLeft: "10px" }}>{s.team}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Requests */}
      <div style={{ ...card, gridColumn: isMobile ? "1" : "span 2" }}>
        <div style={headerContainer}>
          <h3 style={header}>Leave Requests</h3>
          <button style={seeAllButton}>See All</button>
        </div>
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
                <td
                  style={{
                    padding: "8px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <img src={lr.avatar} alt={lr.name} style={{ width: 30, height: 30, borderRadius: "50%" }} />
                  {lr.name}
                </td>
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
      <div style={{ ...card, gridColumn: isMobile ? "1" : "3 / 4", gridRow: isMobile ? "5" : "span 2" }}>
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
            width: "100%",
          }}
        >
          View Progress
        </button>
      </div>
    </div>
    </>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<HRDashboard />);

export default HRDashboard;
