export default function Attendancepercent({ attendance, leaveRequests, isMobile }) {
  const parseTime = (t) => {
    if (!t) return 0;
    const [h, m, s] = t.split(":").map(Number);
    return h * 60 + m + s / 60;
  };
  const formatTime = (m) => {
    const h = Math.floor(m / 60);
    const mm = Math.floor(m % 60);
    return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
  };
  const getStats = (emp) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let monthDays = 0,
      monthPresent = 0,
      monthCheckInTotal = 0,
      monthCheckOutTotal = 0;
    emp.daily.forEach((d) => {
      const dateObj = new Date(d.date);
      if (d.checkIn && d.checkOut && dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
        monthDays++;
        monthPresent++;
        monthCheckInTotal += parseTime(d.checkIn);
        monthCheckOutTotal += parseTime(d.checkOut);
      }
    });
    return {
      avgCheckIn: monthCheckInTotal ? formatTime(monthCheckInTotal / monthPresent) : "-",
      avgCheckOut: monthCheckOutTotal ? formatTime(monthCheckOutTotal / monthPresent) : "-",
      monthlyPercent: monthDays ? ((monthPresent / monthDays) * 100).toFixed(0) + "%" : "-",
    };
  };

  const cellStyle = { border: "1px solid #e0e0e0", padding: "0.5rem" };
  const headerStyle = { ...cellStyle, background: "#f3f4f6", fontWeight: 600 };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Employee", "Avg In", "Avg Out", "Month %"].map((h, i) => (
              <th key={i} style={headerStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attendance.map((emp, idx) => {
            const s = getStats(emp);
            return (
              <tr key={emp.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                <td style={cellStyle}>{emp.employee}</td>
                <td style={cellStyle}>{s.avgCheckIn}</td>
                <td style={cellStyle}>{s.avgCheckOut}</td>
                <td style={cellStyle}>{s.monthlyPercent}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
