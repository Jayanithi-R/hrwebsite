import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [viewMode, setViewMode] = useState("desktop"); // mobile, tablet, desktop

  // Detect screen size and set appropriate defaults
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setViewMode("mobile");
        setIsOpen(false); // closed by default on mobile
      } else if (width >= 640 && width < 1024) {
        setViewMode("tablet");
        setIsOpen(true); // open by default on tablet
      } else {
        setViewMode("desktop");
        setIsOpen(true); // open by default on desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewMode === "mobile";
  const isTablet = viewMode === "tablet";
  const isDesktop = viewMode === "desktop";

  // Responsive styles
  const getSidebarWidth = () => {
    if (isMobile) return "280px";
    if (isTablet) return "260px";
    return "260px";
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1100,
      display: isMobile && isOpen ? "block" : "none",
      transition: "opacity 0.3s ease",
      backdropFilter: "blur(2px)",
    },
    container: {
      width: isOpen ? getSidebarWidth() : "0",
      height: "100vh",
      backgroundColor: "#fff",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      fontFamily: "Inter, -apple-system, sans-serif",
      position: "fixed",
      left: isOpen ? 0 : isMobile ? `-${getSidebarWidth()}` : "0",
      top: 0,
      zIndex: 1200,
      transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      overflowY: "auto",
      overflowX: "hidden",
      boxShadow:
        isOpen && (isMobile || isTablet)
          ? "2px 0 8px rgba(0,0,0,0.15)"
          : "none",
      WebkitOverflowScrolling: "touch",
    },
    top: {
      padding: isMobile ? "20px 14px" : "24px 16px",
      flex: 1,
      overflowY: "auto",
    },
    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: isMobile ? "24px" : "28px",
    },
    logoBox: {
      width: isMobile ? "38px" : "42px",
      height: isMobile ? "38px" : "42px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #2C6BED 0%, #1e4fc7 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "bold",
      fontSize: isMobile ? "16px" : "18px",
      boxShadow: "0 2px 8px rgba(44, 107, 237, 0.3)",
      flexShrink: 0,
    },
    brand: {
      lineHeight: 1.3,
      minWidth: 0,
      flex: 1,
    },
    brandName: {
      fontWeight: 600,
      fontSize: isMobile ? "14px" : "15px",
      color: "#111827",
    },
    brandSub: {
      fontSize: isMobile ? "11px" : "12px",
      color: "#7b8794",
      marginTop: "2px",
    },
    sectionTitle: {
      fontSize: isMobile ? "10px" : "11px",
      fontWeight: 600,
      color: "#9ca3af",
      margin: isMobile ? "16px 0 8px" : "20px 0 10px",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
    navItem: (active = false) => ({
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: isMobile ? "10px 8px" : "10px 10px",
      marginBottom: "4px",
      borderRadius: "8px",
      fontSize: isMobile ? "13px" : "14px",
      color: active ? "#fff" : "#1f2937",
      backgroundColor: active ? "#2C6BED" : "transparent",
      cursor: "pointer",
      transition: "all 0.2s ease",
      textDecoration: "none",
      fontWeight: active ? 600 : 500,
      boxShadow: active ? "0 2px 4px rgba(44, 107, 237, 0.2)" : "none",
    }),
    navIcon: {
      fontSize: isMobile ? "16px" : "18px",
      flexShrink: 0,
      width: "20px",
      textAlign: "center",
    },
    navText: {
      flex: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    shortcutItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: isMobile ? "8px 8px" : "8px 10px",
      marginBottom: "2px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: isMobile ? "12px" : "13px",
      color: "#1f2937",
      transition: "background 0.2s ease",
      fontWeight: 500,
    },
    shortcutDot: (color) => ({
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: color,
      flexShrink: 0,
    }),
    shortcutText: {
      flex: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    shortcutBadge: {
      marginLeft: "auto",
      backgroundColor: "#f3f4f6",
      borderRadius: "999px",
      padding: "2px 8px",
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: 600,
      color: "#6b7280",
      minWidth: "20px",
      textAlign: "center",
      flexShrink: 0,
    },
    bottom: {
      padding: isMobile ? "14px" : "16px",
      borderTop: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      flexShrink: 0,
    },
    userRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "8px",
      transition: "background 0.2s ease",
    },
    avatar: {
      width: isMobile ? "36px" : "40px",
      height: isMobile ? "36px" : "40px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      fontSize: isMobile ? "14px" : "15px",
      flexShrink: 0,
    },
    userInfo: {
      lineHeight: 1.3,
      minWidth: 0,
      flex: 1,
    },
    userName: {
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: 600,
      color: "#111827",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    userEmail: {
      fontSize: isMobile ? "11px" : "12px",
      color: "#9ca3af",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginTop: "2px",
    },
    toggleBtn: {
      position: "fixed",
      top: "12px",
      left: "12px",
      background: "#2C6BED",
      color: "#fff",
      border: "none",
      padding: "10px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      zIndex: 1300,
      transition: "transform 0.2s ease",
      boxShadow: "0 2px 8px rgba(44, 107, 237, 0.4)",
      fontSize: "16px",
      display: isMobile ? "flex" : "none", // ✅ only show on mobile
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
    },
  };

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/" },
    { name: "Schedule", icon: "📅", path: "/schedule" },
    { name: "Attendance", icon: "👤", path: "/attendance" },
    { name: "Departments", icon: "🎁", path: "/departments" },
    { name: "Integrations", icon: "🔗", path: "/integrations" },
    { name: "Reports", icon: "📊", path: "/reports" },
  ];

  const shortcuts = [
    { name: "New Hire Onboarding", color: "#22c55e", badge: "1" },
    { name: "Leave Requests", color: "#ef4444", badge: "2" },
    { name: "Performance Reviews", color: "#f59e0b", badge: "3" },
  ];

  const handleNavClick = () => {
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div style={styles.overlay} onClick={() => setIsOpen(false)} />

      {/* Toggle Button — only mobile */}
      <button
        style={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
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
                onClick={handleNavClick}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span style={styles.navText}>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Shortcuts */}
          <div style={styles.sectionTitle}>SHORTCUTS</div>
          <div>
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                style={styles.shortcutItem}
                onClick={handleNavClick}
              >
                <div style={styles.shortcutDot(shortcut.color)} />
                <span style={styles.shortcutText}>{shortcut.name}</span>
                <div style={styles.shortcutBadge}>{shortcut.badge}</div>
              </div>
            ))}
          </div>

          {/* Others */}
          <div style={styles.sectionTitle}>OTHERS</div>
          <div>
            <div style={styles.shortcutItem} onClick={handleNavClick}>
              <span style={styles.navIcon}>⚙️</span>
              <span style={styles.shortcutText}>Settings</span>
            </div>
            <div style={styles.shortcutItem} onClick={handleNavClick}>
              <span style={styles.navIcon}>❓</span>
              <span style={styles.shortcutText}>Help Center</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.bottom}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>J</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>Juwita</div>
              <div style={styles.userEmail}>juvv@hr-mikom.com</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
