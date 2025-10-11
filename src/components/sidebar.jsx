import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const styles = {
    container: {
      width: "260px",
      height: "100vh",
      backgroundColor: "#fff",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      fontFamily: "Inter, sans-serif",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 100,
    },
    top: { padding: "24px 16px" },
    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "28px",
    },
    logoBox: {
      width: "42px",
      height: "42px",
      borderRadius: "12px",
      background: "#2C6BED",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "18px",
    },
    brand: { lineHeight: 1.3 },
    brandName: { fontWeight: 600, fontSize: "15px" },
    brandSub: { fontSize: "12px", color: "#7b8794" },
    sectionTitle: {
      fontSize: "11px",
      fontWeight: 600,
      color: "#9ca3af",
      margin: "20px 0 10px",
      letterSpacing: "0.03em",
    },
    navItem: (active = false) => ({
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 10px",
      borderRadius: "8px",
      fontSize: "14px",
      color: active ? "#fff" : "#1f2937",
      backgroundColor: active ? "#2C6BED" : "transparent",
      cursor: "pointer",
      transition: "0.2s",
      textDecoration: "none",
    }),
    shortcutItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 8px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13.5px",
      color: "#1f2937",
    },
    shortcutDot: (color) => ({
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: color,
    }),
    shortcutBadge: {
      marginLeft: "auto",
      backgroundColor: "#f4f5f7",
      borderRadius: "999px",
      padding: "3px 8px",
      fontSize: "12px",
    },
    bottom: {
      padding: "16px",
      borderTop: "1px solid #e5e7eb",
    },
    userRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#1f2937",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      fontSize: "15px",
    },
    userInfo: { lineHeight: 1.2 },
    userName: { fontSize: "14px", fontWeight: 600 },
    userEmail: { fontSize: "12px", color: "#9ca3af" },
  };

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/" },
    { name: "Schedule", icon: "📅", path: "/schedule" },
    { name: "Attendance", icon: "👤", path: "/attendance" },
    { name: "Departments", icon: "🎁", path: "/departments" },
    { name: "Integrations", icon: "🔗", path: "/integrations" },
    { name: "Reports", icon: "📊", path: "/reports" },
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

        {/* Main Navigation */}
        <div style={styles.sectionTitle}>MAIN</div>
        <div>
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => styles.navItem(isActive)}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Shortcuts */}
        <div style={styles.sectionTitle}>SHORTCUTS</div>
        <div>
          <div style={styles.shortcutItem}>
            <div style={styles.shortcutDot("#22c55e")}></div>
            New Hire Onboarding
            <div style={styles.shortcutBadge}>1</div>
          </div>
          <div style={styles.shortcutItem}>
            <div style={styles.shortcutDot("#ef4444")}></div>
            Leave Requests
            <div style={styles.shortcutBadge}>2</div>
          </div>
          <div style={styles.shortcutItem}>
            <div style={styles.shortcutDot("#f59e0b")}></div>
            Performance Reviews
            <div style={styles.shortcutBadge}>3</div>
          </div>
        </div>

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
          <div style={styles.userInfo}>
            <div style={styles.userName}>Juwita</div>
            <div style={styles.userEmail}>juvv@hr-mikom.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
