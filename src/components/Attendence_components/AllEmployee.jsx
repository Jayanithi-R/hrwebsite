export default function AllEmployee({ attendance, isMobile }) {
  const cellStyle = { border: "1px solid #e0e0e0", padding: "0.5rem" };
  const headerStyle = { ...cellStyle, background: "#f3f4f6", fontWeight: 600 };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["ID", "Email", "GitHub", "Projects Worked", "Company Projects"].map((h, i) => (
              <th key={i} style={headerStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attendance.map((emp, idx) => (
            <tr key={emp.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
              <td style={cellStyle}>{emp.employeeId}</td>
              <td style={cellStyle}>{emp.email}</td>
              <td style={cellStyle}>{emp.github}</td>
              <td style={cellStyle}>{emp.projects}</td>
              <td style={cellStyle}>{emp.companyProjects}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
