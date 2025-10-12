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
const WeekCalendar = ({ selectedDate, onSelectDate, isMobile, isTablet }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const week = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  return (
    <div style={{ 
      borderRadius: 12, 
      border: "1px solid #e5e7eb", 
      padding: isMobile ? 8 : 10, 
      background: "#fff", 
      marginBottom: 15,
      overflow: "hidden"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 8,
        gap: 8
      }}>
        <h3 style={{ 
          fontSize: isMobile ? 13 : 14, 
          fontWeight: 600,
          margin: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1
        }}>
          {format(currentDate, isMobile ? "MMM yyyy" : "MMMM yyyy")}
        </h3>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            style={{ 
              border: "none", 
              background: "transparent", 
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setCurrentDate(subDays(currentDate, 7))}
          >
            <ChevronLeft size={isMobile ? 16 : 20} />
          </button>
          <button
            style={{ 
              border: "none", 
              background: "transparent", 
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
          >
            <ChevronRight size={isMobile ? 16 : 20} />
          </button>
        </div>
      </div>
      <div style={{ 
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: isMobile ? 2 : isTablet ? 4 : 8
      }}>
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
                minWidth: 0,
                height: isMobile ? 55 : isTablet ? 65 : 75,
                borderRadius: 8,
                cursor: "pointer",
                background: isSelected ? "#2563eb" : "transparent",
                color: isSelected ? "#fff" : "#111827",
                padding: isMobile ? "4px 1px" : "4px 2px"
              }}
            >
              <span style={{ fontSize: isMobile ? 9 : isTablet ? 10 : 12 }}>
                {isMobile ? format(day, "EEE").charAt(0) : format(day, "EEE").substring(0, 3)}
              </span>
              <span style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18, fontWeight: 700 }}>
                {format(day, "d")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// SchedulePanel Component
const SchedulePanel = ({ isMobile, isTablet }) => {
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

  const cardStyle = { 
    background: "#fff", 
    borderRadius: 12, 
    padding: isMobile ? 12 : 15, 
    marginBottom: 0, 
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  };

  const headerStyle = { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 10 
  };

  const toggleBtnStyle = (active) => ({
    flex: 1,
    padding: isMobile ? 8 : 6,
    borderRadius: 6,
    cursor: "pointer",
    marginRight: 4,
    background: active ? "#2563eb" : "#f3f4f6",
    color: active ? "#fff" : "#111827",
    textAlign: "center",
    fontWeight: 600,
    fontSize: isMobile ? 12 : 14,
    border: "none"
  });

  const itemStyle = { 
    padding: isMobile ? 8 : 10, 
    borderBottom: "1px solid #e5e7eb", 
    cursor: "pointer" 
  };

  const renderList = (items) => {
    if (!items.length) return (
      <div style={{ padding: 10, fontSize: isMobile ? 12 : 14, color: "#666" }}>
        No items for this day.
      </div>
    );
    return items.map((item) => (
      <div key={item.id} style={itemStyle}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          gap: 4
        }}>
          <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 500 }}>
            {item.title}
          </span>
          <span style={{ 
            fontSize: isMobile ? 11 : 12, 
            color: "#666", 
            display: "flex", 
            alignItems: "center",
            whiteSpace: "nowrap"
          }}>
            <Clock style={{ width: 12, height: 12, marginRight: 4 }} /> 
            {item.time}
          </span>
        </div>
        <div style={{ fontSize: isMobile ? 11 : 12, color: "#666", marginTop: 4 }}>
          {item.location} - {item.team}
        </div>
      </div>
    ));
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ fontWeight: 600, fontSize: isMobile ? 14 : 16, margin: 0 }}>
          Schedule
        </h3>
        <button style={{ 
          border: "none", 
          background: "transparent", 
          color: "#2563eb", 
          cursor: "pointer",
          fontSize: isMobile ? 12 : 14,
          padding: 4
        }}>
          See All
        </button>
      </div>
      <WeekCalendar 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <div style={{ display: "flex", marginBottom: 10, gap: 4 }}>
        <button style={toggleBtnStyle(activeTab === "meetings")} onClick={() => setActiveTab("meetings")}>
          Meetings
        </button>
        <button style={toggleBtnStyle(activeTab === "events")} onClick={() => setActiveTab("events")}>
          Events
        </button>
      </div>
      <div style={{ 
        maxHeight: isMobile ? 180 : 220, 
        overflowY: "auto",
        flex: 1
      }}>
        {activeTab === "meetings" && renderList(meetings)}
        {activeTab === "events" && renderList(events)}
      </div>
    </div>
  );
};

const InternshipCard = ({ isMobile, isTablet }) => {
  const avatars = [
    PlaceHolderImages.find((img) => img.id === "emp1"),
    PlaceHolderImages.find((img) => img.id === "emp2"),
    PlaceHolderImages.find((img) => img.id === "emp3"),
  ];

  const cardStyle = {
    background: "#fff",
    borderRadius: 12,
    padding: isMobile ? 12 : 15,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    height: isMobile ? "auto" : 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
    flexWrap: isMobile ? "wrap" : "nowrap"
  };

  const titleStyle = { 
    display: "flex", 
    alignItems: "center", 
    gap: 6, 
    fontWeight: 600, 
    fontSize: isMobile ? 14 : 16 
  };

  const buttonStyle = {
    border: "1px solid #2563eb",
    background: "transparent",
    borderRadius: 9999,
    padding: isMobile ? "4px 8px" : "4px 10px",
    color: "#2563eb",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: isMobile ? 11 : 12,
    fontWeight: 500,
    whiteSpace: "nowrap"
  };

  const contentStyle = { display: "flex", flexDirection: "column", gap: isMobile ? 10 : 15 };
  const avatarContainerStyle = { 
    display: "flex", 
    alignItems: "center", 
    gap: 8,
    flexWrap: "wrap"
  };
  const avatarListStyle = { display: "flex", marginRight: 6, position: "relative" };
  const avatarStyle = (i) => ({
    width: isMobile ? 26 : 32,
    height: isMobile ? 26 : 32,
    borderRadius: "50%",
    border: "2px solid #fff",
    objectFit: "cover",
    marginLeft: i === 0 ? 0 : isMobile ? -6 : -8,
    zIndex: avatars.length - i,
  });
  const viewButtonStyle = {
    padding: isMobile ? "6px 10px" : "6px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: isMobile ? 11 : 12,
    fontWeight: 500,
    whiteSpace: "nowrap"
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
          <p style={{ fontSize: isMobile ? 11 : 12, color: "#6b7280", margin: 0 }}>
            Total Intern
          </p>
          <p style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, margin: 0 }}>
            8 Interns
          </p>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: 8
        }}>
          <div style={avatarContainerStyle}>
            <div style={avatarListStyle}>
              {avatars.map((avatar, i) =>
                avatar ? (
                  <img key={i} src={avatar.imageUrl} alt={avatar.description} style={avatarStyle(i)} />
                ) : (
                  <div key={i} style={{ 
                    ...avatarStyle(i), 
                    background: "#ccc", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: "#fff", 
                    fontWeight: 600 
                  }}>
                    {avatar?.description?.[0]}
                  </div>
                )
              )}
            </div>
            <span style={{ fontSize: isMobile ? 11 : 12, color: "#6b7280" }}>
              8 Attended
            </span>
          </div>
          <button style={viewButtonStyle}>View Progress</button>
        </div>
      </div>
    </div>
  );
};

// Main HR Dashboard
const HRDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    handleResize();
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

  const getGridColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "repeat(2, 1fr)";
    return "repeat(3, 1fr)";
  };

  const layoutStyle = {
    display: "grid",
    gridTemplateColumns: getGridColumns(),
    gap: isMobile ? "12px" : "20px",
    padding: isMobile ? "12px" : "20px",
    background: "#f8fafc",
    fontFamily: "Inter, sans-serif",
    maxWidth: "100%",
    overflowX: "hidden",
    minHeight: "100vh"
  };

  const card = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    padding: isMobile ? "12px" : "20px",
  };

  const badge = (label) => ({
    backgroundColor: badgeColors[label] || "#eee",
    color: "#333",
    borderRadius: "6px",
    padding: isMobile ? "2px 6px" : "2px 8px",
    fontSize: isMobile ? "10px" : "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    display: "inline-block"
  });

  const header = { 
    fontSize: isMobile ? "14px" : "16px", 
    fontWeight: "600", 
    marginBottom: "12px",
    margin: 0
  };

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
              gap: 8
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <strong style={{ fontSize: isMobile ? 12 : 14 }}>{a.name}</strong>
              <div style={{ fontSize: isMobile ? 11 : 13, color: "#666" }}>{a.role}</div>
            </div>
            <span style={badge(a.status)}>{a.status}</span>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div style={card}>
        <h3 style={header}>Tasks</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {dashboardData.tasks.map((t, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                gap: 8
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong style={{ fontSize: isMobile ? 12 : 14 }}>{t.title}</strong>
                <div style={{ fontSize: isMobile ? 11 : 13, color: "#666" }}>{t.due}</div>
              </div>
              <span style={badge(t.priority)}>{t.priority}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Schedule */}
      <SchedulePanel isMobile={isMobile} isTablet={isTablet} />

      {/* Leave Requests */}
      <div style={{ 
        ...card, 
        gridColumn: isMobile ? "1" : isTablet ? "span 2" : "span 2",
        overflowX: "auto"
      }}>
        <h3 style={header}>Leave Requests</h3>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            fontSize: isMobile ? 12 : 14,
            minWidth: isMobile ? "500px" : "auto"
          }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#666" }}>
                <th style={{ 
                  padding: isMobile ? "6px 4px" : "8px 0", 
                  fontSize: isMobile ? 11 : 14,
                  fontWeight: 600
                }}>
                  Employee
                </th>
                <th style={{ 
                  padding: isMobile ? "6px 4px" : "8px 0", 
                  fontSize: isMobile ? 11 : 14,
                  fontWeight: 600
                }}>
                  Leave Type
                </th>
                <th style={{ 
                  padding: isMobile ? "6px 4px" : "8px 0", 
                  fontSize: isMobile ? 11 : 14,
                  fontWeight: 600
                }}>
                  Date
                </th>
                <th style={{ 
                  padding: isMobile ? "6px 4px" : "8px 0", 
                  fontSize: isMobile ? 11 : 14,
                  fontWeight: 600
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.leaveRequests.map((lr, i) => (
                <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: isMobile ? "6px 4px" : "8px 0" }}>{lr.name}</td>
                  <td style={{ padding: isMobile ? "6px 4px" : "8px 0" }}>{lr.type}</td>
                  <td style={{ padding: isMobile ? "6px 4px" : "8px 0" }}>{lr.range}</td>
                  <td style={{ padding: isMobile ? "6px 4px" : "8px 0" }}>
                    <span style={badge(lr.status)}>{lr.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internship */}
      <InternshipCard isMobile={isMobile} isTablet={isTablet} />
    </div>
  );
};

export default HRDashboard;