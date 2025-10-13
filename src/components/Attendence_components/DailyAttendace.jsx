export default function DailyAttendace({ attendance, isMobile }) {
  const today = new Date().toISOString().split("T")[0];
  const cellStyle = { border: "1px solid #e0e0e0", padding: "0.5rem" };
  const headerStyle = { ...cellStyle, background: "#f3f4f6", fontWeight: 600 };

  const rows = attendance.map((emp, idx) => {
    const todayRecord = emp.daily.find((d) => d.date === today) || {};
    return (
      <tr key={emp.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
        <td style={cellStyle}>{emp.employee}</td>
        <td style={cellStyle}>{todayRecord.checkIn || "-"}</td>
        <td style={cellStyle}>{todayRecord.breakStart || "-"}</td>
        <td style={cellStyle}>{todayRecord.breakEnd || "-"}</td>
        <td style={cellStyle}>{todayRecord.checkOut || "-"}</td>
      </tr>
    );
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Employee", "Check In", "Lunch Break", "Back", "Check Out"].map((h, i) => (
              <th key={i} style={headerStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
