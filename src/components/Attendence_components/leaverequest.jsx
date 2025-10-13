export default function LeaveRequest({ leaveRequests, setLeaveRequests, attendance, isMobile }) {
  const cellStyle = { border: "1px solid #e0e0e0", padding: "0.5rem" };
  const headerStyle = { ...cellStyle, background: "#f3f4f6", fontWeight: 600 };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Employee", "Leave Type", "From", "To", "Status"].map((h, i) => (
              <th key={i} style={headerStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((req, idx) => {
            const emp = attendance.find((e) => e.id === req.employeeId);
            return (
              <tr key={req.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                <td style={cellStyle}>{emp?.employee || "Unknown"}</td>
                <td style={cellStyle}>{req.leaveType}</td>
                <td style={cellStyle}>{req.from}</td>
                <td style={cellStyle}>{req.to}</td>
                <td style={cellStyle}>
                  <select
                    value={req.status}
                    onChange={(e) =>
                      setLeaveRequests((prev) =>
                        prev.map((r) => (r.id === req.id ? { ...r, status: e.target.value } : r))
                      )
                    }
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      border: "1px solid #ccc",
                      fontSize: "0.85rem",
                    }}
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
