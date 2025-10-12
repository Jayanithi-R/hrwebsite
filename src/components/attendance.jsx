import { useState, useEffect } from "react";

function AttendanceDashboard() {
  const [activeTab, setActiveTab] = useState("daily");
  const [viewMode, setViewMode] = useState("desktop"); // mobile, tablet, desktop

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setViewMode("mobile");
      } else if (width >= 640 && width < 1024) {
        setViewMode("tablet");
      } else {
        setViewMode("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [attendance, setAttendance] = useState([
    { id: 1, employee: "John Doe", employeeId: 1, email: "john@example.com", github: "johndoe", projects: 3, companyProjects: 2, daily: [] },
    { id: 2, employee: "Jane Smith", employeeId: 2, email: "jane@example.com", github: "janesmith", projects: 2, companyProjects: 1, daily: [] },
    { id: 3, employee: "Michael Brown", employeeId: 3, email: "michaelbrown@example.com", github: "michaelbrown", projects: 4, companyProjects: 3, daily: [] },
    { id: 4, employee: "Sarah Davis", employeeId: 4, email: "sarahdavis@example.com", github: "sarahdavis", projects: 1, companyProjects: 1, daily: [] },
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employeeId: 1, leaveType: "Sickness", from: "2025-10-10", to: "2025-10-12", status: "Pending" },
    { id: 2, employeeId: 2, leaveType: "Personal", from: "2025-10-23", to: "2025-10-25", status: "Approved" },
  ]);

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

    return {
      avgCheckIn: monthCheckInTotal ? formatTime(monthCheckInTotal / monthPresent) : "-",
      avgCheckOut: monthCheckOutTotal ? formatTime(monthCheckOutTotal / monthPresent) : "-",
      monthlyPercent: monthDays ? ((monthPresent / monthDays) * 100).toFixed(0) + "%" : "-",
      yearlyPercent: yearDays ? ((yearPresent / yearDays) * 100).toFixed(0) + "%" : "-",
    };
  };

  // Styling based on view mode
  const getStyles = () => {
    const isMobile = viewMode === "mobile";
    const isTablet = viewMode === "tablet";
    const isDesktop = viewMode === "desktop";

    return {
      container: {
        padding: isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem",
        background: "#f9fafb",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        maxWidth: "100%",
        overflowX: "hidden"
      },
      tabContainer: {
        marginBottom: isMobile ? "1rem" : "2rem",
        display: "flex",
        flexWrap: "wrap",
        gap: isMobile ? "0.4rem" : "0.5rem",
        justifyContent: isMobile ? "center" : "flex-start"
      },
      tab: (isActive) => ({
        display: "inline-block",
        padding: isMobile ? "0.5rem 0.7rem" : isTablet ? "0.5rem 0.9rem" : "0.5rem 1rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        background: isActive ? "#4f46e5" : "#e5e7eb",
        color: isActive ? "#fff" : "#000",
        transition: "all 0.2s",
        fontSize: isMobile ? "0.75rem" : isTablet ? "0.85rem" : "0.9rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        border: "none",
        boxShadow: isActive ? "0 2px 4px rgba(79, 70, 229, 0.3)" : "none"
      }),
      card: {
        background: "#fff",
        borderRadius: isMobile ? "0.75rem" : "0.875rem",
        padding: isMobile ? "1rem" : isTablet ? "1.25rem" : "1.5rem",
        marginBottom: isMobile ? "0.75rem" : "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #e5e7eb"
      },
      cardHeader: {
        margin: "0 0 1rem 0",
        fontSize: isMobile ? "0.95rem" : isTablet ? "1rem" : "1.1rem",
        color: "#111827",
        fontWeight: 600,
        paddingBottom: "0.5rem",
        borderBottom: "2px solid #4f46e5"
      },
      cardRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile ? "0.6rem 0" : "0.75rem 0",
        borderBottom: "1px solid #f3f4f6",
        fontSize: isMobile ? "0.8rem" : isTablet ? "0.85rem" : "0.9rem"
      },
      label: {
        fontWeight: 500,
        color: "#6b7280",
        minWidth: isMobile ? "100px" : "120px"
      },
      value: {
        fontWeight: 600,
        color: "#111827",
        textAlign: "right"
      },
      tableWrapper: {
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        marginBottom: "2rem",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #e5e7eb"
      },
      table: {
        width: "100%",
        minWidth: isTablet ? "650px" : "auto",
        borderCollapse: "collapse",
        background: "#fff"
      },
      th: {
        border: "1px solid #e0e0e0",
        padding: isMobile ? "0.6rem 0.5rem" : isTablet ? "0.7rem 0.8rem" : "0.75rem 1rem",
        textAlign: "left",
        verticalAlign: "middle",
        background: "#f3f4f6",
        fontWeight: 600,
        fontSize: isMobile ? "0.75rem" : isTablet ? "0.85rem" : "0.95rem",
        color: "#374151",
        whiteSpace: "nowrap"
      },
      td: {
        border: "1px solid #e0e0e0",
        padding: isMobile ? "0.6rem 0.5rem" : isTablet ? "0.7rem 0.8rem" : "0.75rem 1rem",
        textAlign: "left",
        verticalAlign: "middle",
        fontSize: isMobile ? "0.75rem" : isTablet ? "0.8rem" : "0.9rem",
        color: "#1f2937"
      },
      select: {
        padding: isMobile ? "0.3rem 0.4rem" : "0.35rem 0.5rem",
        borderRadius: "0.25rem",
        border: "1px solid #d1d5db",
        cursor: "pointer",
        fontSize: isMobile ? "0.75rem" : isTablet ? "0.8rem" : "0.85rem",
        background: "#fff",
        color: "#374151",
        fontWeight: 500
      }
    };
  };

  const styles = getStyles();
  const isMobile = viewMode === "mobile";
  const isTablet = viewMode === "tablet";

  // Mobile Card View Component
  const MobileCard = ({ children }) => (
    <div style={styles.card}>{children}</div>
  );

  const CardRow = ({ label, value, isLast }) => (
    <div style={{
      ...styles.cardRow,
      borderBottom: isLast ? "none" : styles.cardRow.borderBottom
    }}>
      <span style={styles.label}>{label}:</span>
      <span style={styles.value}>{value}</span>
    </div>
  );

  const renderMobileView = (tabType) => {
    if (tabType === "daily") {
      return attendance.map((emp, index) => {
        const today = new Date().toISOString().split("T")[0];
        const todayRecord = emp.daily.find(d => d.date === today) || {};
        return (
          <MobileCard key={emp.id}>
            <h3 style={styles.cardHeader}>{emp.employee}</h3>
            <CardRow label="Check In" value={todayRecord.checkIn || "-"} />
            <CardRow label="Lunch Break" value={todayRecord.breakStart || "-"} />
            <CardRow label="Back to Work" value={todayRecord.breakEnd || "-"} />
            <CardRow label="Check Out" value={todayRecord.checkOut || "-"} isLast />
          </MobileCard>
        );
      });
    } else if (tabType === "attendance") {
      return attendance.map((emp) => {
        const stats = getEmployeeStats(emp);
        return (
          <MobileCard key={emp.id}>
            <h3 style={styles.cardHeader}>{emp.employee}</h3>
            <CardRow label="Avg Check-In" value={stats.avgCheckIn} />
            <CardRow label="Avg Check-Out" value={stats.avgCheckOut} />
            <CardRow label="Monthly %" value={stats.monthlyPercent} />
            <CardRow label="Yearly %" value={stats.yearlyPercent} isLast />
          </MobileCard>
        );
      });
    } else if (tabType === "leave") {
      return leaveRequests.map((req) => {
        const emp = attendance.find(e => e.id === req.employeeId);
        return (
          <MobileCard key={req.id}>
            <h3 style={styles.cardHeader}>{emp?.employee || "Unknown"}</h3>
            <CardRow label="Leave Type" value={req.leaveType} />
            <CardRow label="From" value={req.from} />
            <CardRow label="To" value={req.to} />
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.6rem 0",
              fontSize: "0.8rem"
            }}>
              <span style={styles.label}>Status:</span>
              <select
                value={req.status}
                onChange={(e) => {
                  setLeaveRequests(prev =>
                    prev.map(r => r.id === req.id ? { ...r, status: e.target.value } : r)
                  );
                }}
                style={styles.select}
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </MobileCard>
        );
      });
    } else if (tabType === "all") {
      return attendance.map((emp) => (
        <MobileCard key={emp.id}>
          <h3 style={styles.cardHeader}>{emp.employee}</h3>
          <CardRow label="ID" value={emp.employeeId} />
          <CardRow label="Email" value={emp.email} />
          <CardRow label="GitHub" value={emp.github} />
          <CardRow label="Projects" value={emp.projects} />
          <CardRow label="Company Projects" value={emp.companyProjects} isLast />
        </MobileCard>
      ));
    }
  };

  const renderTableView = (tabType) => {
    let headers = [], rows = [];

    if (tabType === "daily") {
      headers = ["Employee", "Check In", "Lunch Break", "Back to Work", "Check Out"];
      rows = attendance.map((emp, idx) => {
        const today = new Date().toISOString().split("T")[0];
        const todayRecord = emp.daily.find(d => d.date === today) || {};
        return (
          <tr key={emp.id} style={{ background: idx % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
            <td style={styles.td}>{emp.employee}</td>
            <td style={styles.td}>{todayRecord.checkIn || "-"}</td>
            <td style={styles.td}>{todayRecord.breakStart || "-"}</td>
            <td style={styles.td}>{todayRecord.breakEnd || "-"}</td>
            <td style={styles.td}>{todayRecord.checkOut || "-"}</td>
          </tr>
        );
      });
    } else if (tabType === "attendance") {
      headers = ["Employee", "Avg Check-In", "Avg Check-Out", "Monthly %", "Yearly %"];
      rows = attendance.map((emp, idx) => {
        const stats = getEmployeeStats(emp);
        return (
          <tr key={emp.id} style={{ background: idx % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
            <td style={styles.td}>{emp.employee}</td>
            <td style={styles.td}>{stats.avgCheckIn}</td>
            <td style={styles.td}>{stats.avgCheckOut}</td>
            <td style={styles.td}>{stats.monthlyPercent}</td>
            <td style={styles.td}>{stats.yearlyPercent}</td>
          </tr>
        );
      });
    } else if (tabType === "leave") {
      headers = ["Employee", "Leave Type", "From", "To", "Status"];
      rows = leaveRequests.map((req, idx) => {
        const emp = attendance.find(e => e.id === req.employeeId);
        return (
          <tr key={req.id} style={{ background: idx % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
            <td style={styles.td}>{emp?.employee || "Unknown"}</td>
            <td style={styles.td}>{req.leaveType}</td>
            <td style={styles.td}>{req.from}</td>
            <td style={styles.td}>{req.to}</td>
            <td style={styles.td}>
              <select
                value={req.status}
                onChange={(e) => {
                  setLeaveRequests(prev =>
                    prev.map(r => r.id === req.id ? { ...r, status: e.target.value } : r)
                  );
                }}
                style={styles.select}
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </td>
          </tr>
        );
      });
    } else if (tabType === "all") {
      headers = ["ID", "Email", "GitHub", "Projects", "Company Projects"];
      rows = attendance.map((emp, idx) => (
        <tr key={emp.id} style={{ background: idx % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
          <td style={styles.td}>{emp.employeeId}</td>
          <td style={styles.td}>{emp.email}</td>
          <td style={styles.td}>{emp.github}</td>
          <td style={styles.td}>{emp.projects}</td>
          <td style={styles.td}>{emp.companyProjects}</td>
        </tr>
      ));
    }

    return (
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {headers.map((h, i) => <th key={i} style={styles.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  };

  const getTabLabel = (tab) => {
    if (isMobile) {
      return { daily: "Daily", attendance: "Attend %", leave: "Leave", all: "All" }[tab];
    }
    return {
      daily: "Daily Attendance",
      attendance: "Attendance %",
      leave: "Leave Requests",
      all: "All Employees"
    }[tab];
  };

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabContainer}>
        {["daily", "attendance", "leave", "all"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={styles.tab(activeTab === tab)}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      {/* Content */}
      {isMobile ? (
        <div>{renderMobileView(activeTab)}</div>
      ) : (
        renderTableView(activeTab)
      )}
    </div>
  );
}

export default AttendanceDashboard;