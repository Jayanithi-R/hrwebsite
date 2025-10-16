"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./sidebar";
import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FEATURES = ["Schedule", "Attendance", "Create Request", "Employees", "Reports", "Settings"];

function TopNavbar() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setFilteredFeatures([]);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  // Handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      setFilteredFeatures([]);
    } else {
      const filtered = FEATURES.filter((f) =>
        f.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFeatures(filtered);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
    setSearchOpen(false);
    setFilteredFeatures([]);
  };

  const handleScheduleClick = () => navigate("/schedule");
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      {/* ✅ Desktop Sidebar only */}
      {!isMobile && <Sidebar />}

      {/* ✅ Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "240px",
            backgroundColor: "white",
            boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
            zIndex: 100,
            transition: "transform 0.3s ease",
          }}
        >
          <Sidebar />
          <button
            onClick={toggleSidebar}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              border: "none",
              background: "none",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Navbar */}
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="https://via.placeholder.com/40"
            alt="Avatar"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
          {isDesktop && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontWeight: 600, color: "#1F2937", margin: 0 }}>Juwita</p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6B7280",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Welcome back to HRsync <span>👋</span>
              </p>
            </div>
          )}
        </div>

        {/* Right section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Search */}
          <button
            onClick={() => setSearchOpen((prev) => !prev)}
            style={{
              padding: "8px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <Search size={18} />
          </button>

          {/* Notification */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              style={{
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              />
            </button>

            {notifOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "110%",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  borderRadius: "6px",
                  width: "250px",
                  zIndex: 50,
                }}
              >
                <div style={{ padding: "10px", borderBottom: "1px solid #E5E7EB" }}>
                  Notification 1
                </div>
                <div style={{ padding: "10px", borderBottom: "1px solid #E5E7EB" }}>
                  Notification 2
                </div>
                <div style={{ padding: "10px" }}>Notification 3</div>
              </div>
            )}
          </div>

          {/* ✅ Desktop: Schedule Button */}
          {isDesktop && (
            <button
              onClick={handleScheduleClick}
              style={{
                padding: "8px 16px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                backgroundColor: "white",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              Schedule
            </button>
          )}

          {/* ✅ Mobile: Hamburger Button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              style={{
                padding: "8px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                backgroundColor: "white",
                color: "#374151",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ☰
            </button>
          )}
        </div>
      </div>

      {/* ✅ Mobile search bar */}
      {!isDesktop && searchOpen && (
        <div
          ref={searchRef}
          style={{
            padding: "10px 24px",
            backgroundColor: "white",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px" }}>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: "#2563EB",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Go
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TopNavbar;
