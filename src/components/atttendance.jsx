import { useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./header";

function Attendance() {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: "John Doe", employeeId: 1, leaveType: "Sickness", from: "10-10-2025", to: "12-10-2025", status: "Pending" },
    { id: 2, employee: "Jane Smith", employeeId: 2, leaveType: "Personal", from: "23-10-2025", to: "25-10-2025", status: "Pending" },
  ]);
      const [showForm, setShowForm] = useState(false);
      const [newRequest, setNewRequest] = useState({
        employee: "",
        employeeId: "",
        leaveType: "Sickness",
        from: "",
        to: "",
        status: "Pending",
      });
      const [attendance, setAttendance] = useState([
        { id: 1, employee: "John Doe", employeeId: 1, checkIn: "", checkOut: "", interval: "" },
        { id: 2, employee: "Jane Smith", employeeId: 2, checkIn: "", checkOut: "", interval: "" },
      ]);
      const [userRole, setUserRole] = useState("Employee"); // Default role, can be "HR" or "Employee"

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRequest((prev) => ({ ...prev, [name]: value }));
      };

      const handleAddRequest = (e) => {
        e.preventDefault();
        if (!newRequest.employee || !newRequest.employeeId || !newRequest.from || !newRequest.to) {
          alert("Please fill all required fields");
          return;
        }
        setLeaveRequests([...leaveRequests, { ...newRequest, id: leaveRequests.length + 1 }]);
        setShowForm(false);
        setNewRequest({ employee: "", employeeId: "", leaveType: "Sickness", from: "", to: "", status: "Pending" });
      };

      const handleStatusChange = (id, status) => {
        if (userRole === "HR") {
          setLeaveRequests((prev) =>
            prev.map((request) => (request.id === id ? { ...request, status } : request))
          );
        }
      };

      const handleCheckInOut = (id, type) => {
        const now = new Date().toLocaleTimeString();
        setAttendance((prev) =>
          prev.map((record) =>
            record.id === id
              ? type === "checkIn"
                ? { ...record, checkIn: now }
                : { ...record, checkOut: now, interval: calculateInterval(record.checkIn, now) }
              : record
          )
        );
      };

      const calculateInterval = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return "";
        const inTime = new Date(`1970-01-01 ${checkIn}`);
        const outTime = new Date(`1970-01-01 ${checkOut}`);
        const diffMs = outTime - inTime;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
      };

      return (
        <>
          <Header />
        
        <div style={{ padding: "2rem", background: "#f9fafb", minHeight: "100vh" }}>
          <style>
            {`
              .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
              .title { font-size: 1.5rem; font-weight: 600; }
              .create-btn { background: #4f46e5; color: #fff; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }
              .tab { display: inline-block; padding: 0.5rem 1rem; background: #e5e7eb; border-radius: 0.5rem; cursor: pointer; margin-right: 0.5rem; }
              .tab.active { background: #4f46e5; color: #fff; }
              .table { width: 100%; border-collapse: collapse; }
              .table th, .table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
              .table th { background: #f3f4f6; font-weight: 600; }
              .edit-btn { background: #e5e7eb; color: #4f46e5; padding: 0.25rem 0.75rem; border-radius: 0.25rem; cursor: pointer; }
              .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
              .modal-content { background: #fff; padding: 2rem; border-radius: 0.5rem; width: 400px; }
              .attendance-section { margin-top: 2rem; }
              .category { font-weight: 600; margin-bottom: 0.5rem; }
            `}
          </style>

          <div className="header">
            <div>
              <h2 className="title">Attendance</h2>
              <div style={{ marginTop: "0.5rem" }}>
                <span className={`tab ${userRole === "Employee" ? "active" : ""}`} onClick={() => setUserRole("Employee")}>All Employees</span>
                <span className={`tab ${userRole === "HR" ? "active" : ""}`} onClick={() => setUserRole("HR")}>Leave Requests</span>
              </div>
            </div>
            {userRole === "Employee" && <button className="create-btn" onClick={() => setShowForm(true)}>Create Request</button>}
          </div>

          {userRole === "HR" && (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.employee}</td>
                    <td>{request.leaveType}</td>
                    <td>{request.from}</td>
                    <td>{request.to}</td>
                    <td>
                      <select value={request.status} onChange={(e) => handleStatusChange(request.id, e.target.value)} disabled={userRole !== "HR"}>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="WFH">WFH</option>
                      </select>
                    </td>
                    <td><button className="edit-btn">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {userRole === "Employee" && (
            <div className="attendance-section">
              <div className="category">Check In/Out</div>
              {attendance.map((record) => (
                <div key={record.id} style={{ display: "flex", alignItems: "center", marginBottom: "1rem", padding: "1rem", background: "#fff", borderRadius: "0.5rem" }}>
                  <img src={`https://i.pravatar.cc/40?img=${record.employeeId}`} alt={record.employee} style={{ marginRight: "1rem", borderRadius: "50%" }} />
                  <div>
                    <p>{record.employee} (ID: {record.employeeId})</p>
                    <div>
                      <button onClick={() => handleCheckInOut(record.id, "checkIn")} style={{ marginRight: "0.5rem", padding: "0.25rem 0.75rem", background: "#4f46e5", color: "#fff", borderRadius: "0.25rem" }}>Check In</button>
                      <button onClick={() => handleCheckInOut(record.id, "checkOut")} style={{ padding: "0.25rem 0.75rem", background: "#4f46e5", color: "#fff", borderRadius: "0.25rem" }}>Check Out</button>
                    </div>
                    <p>Check In: {record.checkIn}</p>
                    <p>Check Out: {record.checkOut}</p>
                    <p>Interval: {record.interval}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showForm && (
            <div className="modal">
              <div className="modal-content">
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Create Leave Request</h2>
                <form onSubmit={handleAddRequest} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <input type="text" name="employee" value={newRequest.employee} onChange={handleInputChange} placeholder="Employee Name" required />
                  <input type="number" name="employeeId" value={newRequest.employeeId} onChange={handleInputChange} placeholder="Employee ID" required />
                  <select name="leaveType" value={newRequest.leaveType} onChange={handleInputChange} required>
                    <option value="Sickness">Sickness</option>
                    <option value="Personal">Personal</option>
                    <option value="Vacation">Vacation</option>
                  </select>
                  <input type="date" name="from" value={newRequest.from} onChange={handleInputChange} required />
                  <input type="date" name="to" value={newRequest.to} onChange={handleInputChange} required />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button type="submit" style={{ background: "#4f46e5", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>Submit</button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        </>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<Attendance />);
    export default Attendance;