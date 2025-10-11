import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  // Favorites list
  const [favorites, setFavorites] = useState([
    { label: "New Hire Onboarding", path: "/onboarding", color: "#22c55e", badge: 1 },
    { label: "Leave Requests", path: "/leaves", color: "#ef4444", badge: 2 },
    { label: "Performance Reviews", path: "/reviews", color: "#f59e0b", badge: 3 },
  ]);

  // Add new favorite
  const addFavorite = () => {
    const label = prompt("Enter favorite name:");
    const path = prompt("Enter path (e.g., /schedule):");
    if (!label || !path) return;

    const colors = ["#3b82f6", "#8b5cf6", "#f97316", "#22c55e", "#ef4444", "#f59e0b"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    setFavorites([...favorites, { label, path, color, badge: Math.floor(Math.random() * 5) + 1 }]);
  };

  // Quick Add options
  const quickAdd = (type) => {
    if (type === "task") {
      const title = prompt("Enter Task Title:");
      if (!title) return alert("Task title required!");
      // Navigate to schedule with task details (simulate passing)
      navigate(`/schedule?addTask=${encodeURIComponent(title)}`);
    } else if (type === "event") {
      const eventTitle = prompt("Enter Event Title:");
      if (!eventTitle) return alert("Event title required!");
      navigate(`/schedule?addEvent=${encodeURIComponent(eventTitle)}`);
    }
  };

  const styles = {
    container: {
      width: 260,
      height: "100vh",
      background: "#fff",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 100,
      fontFamily: "Inter, sans-serif",
    },
    top: { padding: "24px 16px", overflowY: "auto" },
    logoRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
    logoBox: {
      width: 42,
      height: 42,
      borderRadius: 12,
      background: "#2C6BED",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
    },
    brand: { lineHeight: 1.3 },
    brandName: { fontWeight: 600, fontSize: 15 },
    brandSub: { fontSize: 12, color: "#7b8794" },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 600,
      color: "#9ca3af",
      margin: "20px 0 10px",
      letterSpacing: "0.03em",
    },
    navItem: (active = false) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 10px",
      borderRadius: 8,
      fontSize: 14,
      color: active ? "#fff" : "#1f2937",
      backgroundColor: active ? "#2C6BED" : "transparent",
      textDecoration: "none",
      transition: "0.2s",
    }),
    shortcutItem: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 8px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 13.5,
      color: "#1f2937",
      textDecoration: "none",
    },
    shortcutDot: (color) => ({
      width: 6,
      height: 6,
      borderRadius: "50%",
      backgroundColor: color,
    }),
    shortcutBadge: {
      marginLeft: "auto",
      backgroundColor: "#f4f5f7",
      borderRadius: "999px",
      padding: "3px 8px",
      fontSize: 12,
    },
    addButton: {
      width: "100%",
      marginTop: 8,
      padding: "6px 0",
      backgroundColor: "#2C6BED",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 13,
    },
    quickActions: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginTop: 8,
    },
    quickButton: {
      background: "#f3f4f6",
      border: "none",
      borderRadius: 6,
      padding: "6px 8px",
      cursor: "pointer",
      fontSize: 13,
      textAlign: "left",
      transition: "0.2s",
    },
    quickButtonHover: {
      background: "#e5e7eb",
    },
    bottom: {
      padding: 16,
      borderTop: "1px solid #e5e7eb",
    },
    userRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "#1f2937",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      fontSize: 15,
    },
    userName: { fontSize: 14, fontWeight: 600 },
    userEmail: { fontSize: 12, color: "#9ca3af" },
  };

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/" },
    { name: "Schedule", icon: "📅", path: "/schedule" },
    { name: "Attendance", icon: "👤", path: "/attendance" },
    // { name: "Departments", icon: "🎁", path: "/Departments" },
    // { name: "Attendance", icon: "🔗", path: "/Integrations" },
    // { name: "Reports", icon: "📊", path: "/reports" }, 
  ];

  return (
    <div style={styles.container}>
      <div style={styles.top}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoBox}>H</div>
          <div style={styles.brand}>
            <div style={styles.brandName}>HRsync</div>
            <div style={styles.brandSub}>HR Management</div>
          </div>
        </div>

        {/* Main */}
        <div style={styles.sectionTitle}>MAIN</div>
        {menu.map((item) => (
          <NavLink key={item.name} to={item.path} style={({ isActive }) => styles.navItem(isActive)}>
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Favorites */}
        <div style={styles.sectionTitle}>FAVORITES</div>
        {favorites.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.shortcutItem,
              backgroundColor: isActive ? "#e0f2fe" : "transparent",
              marginBottom: 8,
            })}
          >
            <div style={styles.shortcutDot(item.color)} />
            {item.label}
            {item.badge && <div style={styles.shortcutBadge}>{item.badge}</div>}
          </NavLink>
        ))}
        <button style={styles.addButton} onClick={addFavorite}>
          + Add Favorite
        </button>

        {/* Others */}
        <div style={styles.sectionTitle}>OTHERS</div>
        <div>
          <div style={styles.shortcutItem}>⚙️ Settings</div>
          <div style={styles.shortcutItem}>❓ Help Center</div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.bottom}>
        <div style={styles.userRow}>
          <div style={styles.avatar}>N</div>
          <div>
            <div style={styles.userName}>Juwita</div>
            <div style={styles.userEmail}>juvv@hr-mikom.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
