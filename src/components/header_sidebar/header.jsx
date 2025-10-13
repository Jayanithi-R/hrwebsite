"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./sidebar";
import { Bell, Search } from "lucide-react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

// Example feature list
const FEATURES = ["Schedule", "Attendance", "Create Request", "Employees", "Reports", "Settings"];

function TopNavbar() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const inputRef = useRef(null);

  // Set initial desktop state and listen for resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
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

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  // Handlers
  const handleSearchClick = () => setSearchOpen(!searchOpen);
  const handleNotifClick = () => setNotifOpen(!notifOpen);

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

  return (
    <div style={{ width: "100%", backgroundColor: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", position: "relative" }}>
      <Sidebar />

      {/* Navbar */}
      <div
        style={{
          padding: "20px 35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: Avatar + Greeting */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="https://via.placeholder.com/40"
            alt="Avatar"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
          {isDesktop && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontWeight: 600, color: "#1f2937", margin: 0 }}>Juwita</p>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                Welcome back to HRsync <span>👋</span>
              </p>
            </div>
          )}
        </div>

        {/* Right: Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            aria-label="Search"
            style={{
              padding: "8px",
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Search size={18} />
          </button>

          {/* Desktop Search Bar */}
          {isDesktop && searchOpen && (
            <div ref={searchRef} style={{ position: "relative" }}>
              <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px" }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    outline: "none",
                    minWidth: "200px",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Go
                </button>
              </form>

              {/* Search Dropdown */}
              {filteredFeatures.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  borderRadius: "6px",
                  width: "100%",
                  zIndex: 50,
                }}>
                  {filteredFeatures.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        borderBottom: "1px solid #e5e7eb"
                      }}
                      onClick={() => alert(`Clicked on ${feature}`)}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notification Button */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button
              onClick={handleNotifClick}
              aria-label="Notifications"
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

            {/* Notification Dropdown */}
            {notifOpen && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "110%",
                backgroundColor: "white",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                borderRadius: "6px",
                width: "250px",
                zIndex: 50,
              }}>
                <div style={{ padding: "10px", borderBottom: "1px solid #e5e7eb" }}>Notification 1</div>
                <div style={{ padding: "10px", borderBottom: "1px solid #e5e7eb" }}>Notification 2</div>
                <div style={{ padding: "10px" }}>Notification 3</div>
              </div>
            )}
          </div>

          {/* Desktop Action Buttons */}
          {isDesktop && (
            <>
              <button
                onClick={() => alert("Schedule clicked!")}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                Schedule
              </button>
              {/* <button
                onClick={() => alert("Create Request clicked!")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Create Request
              </button> */}
            </>
          )}
        </div>
      </div>

      {/* Mobile Search Bar Below Navbar */}
      {!isDesktop && searchOpen && (
        <div style={{ padding: "10px 35px", backgroundColor: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }} ref={searchRef}>
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
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Go
            </button>
          </form>

          {filteredFeatures.length > 0 && (
            <div style={{
              marginTop: "4px",
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "6px",
              zIndex: 50,
            }}>
              {filteredFeatures.map((feature) => (
                <div
                  key={feature}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #e5e7eb"
                  }}
                  onClick={() => alert(`Clicked on ${feature}`)}
                >
                  {feature}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TopNavbar;
