import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import DailyAttendace from "./DailyAttendace";
import Attendancepercent from "./Attendancepercent";
import LeaveRequest from "./leaverequest";
import AllEmployee from "./AllEmployee";

function AttendanceDashboard() {
  const [activeTab, setActiveTab] = useState("daily");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const commonProps = { attendance, setAttendance, leaveRequests, setLeaveRequests, isMobile };

  const tabContainerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "0.5rem" : "0",
    marginBottom: "clamp(1rem, 3vw, 2rem)",
  };

  const tabStyle = (isActive) => ({
    display: "inline-block",
    padding: isMobile ? "0.75rem 0.5rem" : "clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)",
    borderRadius: "0.5rem",
    cursor: "pointer",
    background: isActive ? "#4f46e5" : "#e5e7eb",
    color: isActive ? "#fff" : "#000",
    transition: "0.2s",
    textAlign: "center",
    flex: isMobile ? "1" : "none",
    marginRight: isMobile ? "0" : "0.5rem",
  });

  const containerStyle = {
    padding: isMobile ? "1rem 0.5rem" : "clamp(1rem, 3vw, 2rem)",
    background: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div style={containerStyle}>
      {/* Tabs */}
      <div style={tabContainerStyle}>
        {["daily", "attendance", "leave", "all"].map((tab) => (
          <span key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
            {tab === "daily"
              ? "Daily Attendance"
              : tab === "attendance"
              ? "Attendance %"
              : tab === "leave"
              ? "Leave Requests"
              : "All Employees"}
          </span>
        ))}
      </div>

      {/* Tab Components */}
      {activeTab === "daily" && <DailyAttendace {...commonProps} />}
      {activeTab === "attendance" && <Attendancepercent {...commonProps} />}
      {activeTab === "leave" && <LeaveRequest {...commonProps} />}
      {activeTab === "all" && <AllEmployee {...commonProps} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AttendanceDashboard />);
export default AttendanceDashboard;
