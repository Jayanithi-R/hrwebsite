import React, { useState, useEffect, useMemo } from "react";
import { addDays, subDays, startOfWeek, format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Briefcase } from "lucide-react";


// Sample schedule data
const scheduleData = [
  {
    id: "m1",
    title: "Meeting Product",
    type: "Meeting",
    time: "9:00 - 9:45 AM",
    date: "2025-10-13",
    location: "Zoom",
    team: "Product Team",
  },
  {
    id: "e1",
    title: "Company Event",
    type: "Event",
    time: "4:00 - 5:00 PM",
    date: "2025-10-13",
    location: "Auditorium",
    team: "All Hands",
  },
  {
    id: "m2",
    title: "Daily Standup",
    type: "Meeting",
    time: "9:00 - 9:30 AM",
    date: "2025-10-14",
    location: "Teams",
    team: "Engineering",
  },
];
const PlaceHolderImages = [
  { id: "emp1", imageUrl: "https://i.pravatar.cc/40?img=1", description: "Nora" },
  { id: "emp2", imageUrl: "https://i.pravatar.cc/40?img=2", description: "Amit" },
  { id: "emp3", imageUrl: "https://i.pravatar.cc/40?img=3", description: "Priya" },
];
// WeekCalendar Component
const WeekCalendar = ({ selectedDate, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const week = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  return (
    <div style={{ borderRadius: 12, border: "1px solid #e5e7eb", padding: 10, background: "#fff", marginBottom: 15 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600 }}>{format(currentDate, "MMMM yyyy")}</h3>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
            onClick={() => setCurrentDate(subDays(currentDate, 7))}
          >
            <ChevronLeft />
          </button>
          <button
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {week.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 75,
                borderRadius: 8,
                cursor: "pointer",
                background: isSelected ? "#2563eb" : "transparent",
                color: isSelected ? "#fff" : "#111827",
              }}
            >
              <span style={{ fontSize: 12 }}>{format(day, "EEE")}</span>
              <span style={{ fontSize: 18, fontWeight: 700 }}>{format(day, "d")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// SchedulePanel Component
const SchedulePanel = () => {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-10-13"));
  const [activeTab, setActiveTab] = useState("meetings");

  const { meetings, events } = useMemo(() => ({
    meetings: scheduleData.filter(
      (item) => item.type === "Meeting" && isSameDay(new Date(item.date), selectedDate)
    ),
    events: scheduleData.filter(
      (item) => item.type === "Event" && isSameDay(new Date(item.date), selectedDate)
    ),
  }), [selectedDate]);

  const cardStyle = { background: "#fff", borderRadius: 12, padding: 15, marginBottom: 15, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" };
  const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 };
  const toggleBtnStyle = (active) => ({
    flex: 1,
    padding: 6,
    borderRadius: 6,
    cursor: "pointer",
    marginRight: 4,
    background: active ? "#2563eb" : "#f3f4f6",
    color: active ? "#fff" : "#111827",
    textAlign: "center",
    fontWeight: 600,
  });

  const itemStyle = { padding: 10, borderBottom: "1px solid #e5e7eb", cursor: "pointer" };

  const renderList = (items) => {
    if (!items.length) return <div style={{ padding: 10, fontSize: 14, color: "#666" }}>No items for this day.</div>;
    return items.map((item) => (
      <div key={item.id} style={itemStyle}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{item.title}</span>
          <span style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center" }}><Clock style={{ width: 12, height: 12, marginRight: 4 }} /> {item.time}</span>
        </div>
        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{item.location} - {item.team}</div>
      </div>
    ));
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ fontWeight: 600 }}>Schedule</h3>
        <button style={{ border: "none", background: "transparent", color: "#2563eb", cursor: "pointer" }}>See All</button>
      </div>
      <WeekCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <div style={{ display: "flex", marginBottom: 10 }}>
        <div style={toggleBtnStyle(activeTab === "meetings")} onClick={() => setActiveTab("meetings")}>Meetings</div>
        <div style={toggleBtnStyle(activeTab === "events")} onClick={() => setActiveTab("events")}>Events</div>
      </div>
      <div>
        {activeTab === "meetings" && renderList(meetings)}
        {activeTab === "events" && renderList(events)}
      </div>
    </div>
  );
};
const InternshipCard = () => {
  const avatars = [
    PlaceHolderImages.find((img) => img.id === "emp1"),
    PlaceHolderImages.find((img) => img.id === "emp2"),
    PlaceHolderImages.find((img) => img.id === "emp3"),
  ];

  const cardStyle = {
    background: "#fff",
    borderRadius: 12,
    padding: 15,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    height: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  };

  const titleStyle = { display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 16 };

  const buttonStyle = {
    border: "1px solid #2563eb",
    background: "transparent",
    borderRadius: 9999,
    padding: "4px 10px",
    color: "#2563eb",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 500,
  };

  const contentStyle = { display: "flex", flexDirection: "column", gap: 15 };
  const avatarContainerStyle = { display: "flex", alignItems: "center", gap: 8 };
  const avatarListStyle = { display: "flex", marginRight: 6, position: "relative" };
  const avatarStyle = (i) => ({
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "2px solid #fff",
    objectFit: "cover",
    marginLeft: i === 0 ? 0 : -8,
    zIndex: avatars.length - i,
  });
  const viewButtonStyle = {
    padding: "6px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>
          <Briefcase style={{ width: 16, height: 16, color: "#6b7280" }} />
          Internship
        </div>
        <button style={buttonStyle}>
          Details <ChevronRight style={{ width: 12, height: 12 }} />
        </button>
      </div>

      <div style={contentStyle}>
        <div>
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Total Intern</p>
          <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>8 Interns</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={avatarContainerStyle}>
            <div style={avatarListStyle}>
              {avatars.map((avatar, i) =>
                avatar ? (
                  <img key={i} src={avatar.imageUrl} alt={avatar.description} style={avatarStyle(i)} />
                ) : (
                  <div key={i} style={{ ...avatarStyle(i), background: "#ccc", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600 }}>
                    {avatar?.description?.[0]}
                  </div>
                )
              )}
            </div>
            <span style={{ fontSize: 12, color: "#6b7280" }}>8 Attended</span>
          </div>
          <button style={viewButtonStyle}>View Progress</button>
        </div>
      </div>
    </div>
  );
};



// 🧩 Main HR Dashboard
const HRDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dashboard Data
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
        <SchedulePanel />

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
      <InternshipCard />
    </div>
  );
};

export default HRDashboard;
