"use client";

import React, { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";

function TopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDesktop = window.innerWidth >= 640;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        padding: "20px 35px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
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
            <p
              style={{
                fontWeight: 600,
                color: "#1f2937",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0
              }}
            >
              Juwita
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                margin: 0
              }}
            >
              Welcome back to HRsync <span>👋</span>
            </p>
          </div>
        )}
      </div>

      {/* Right: Desktop buttons */}
      {isDesktop && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
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
          <button
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
          <button
            style={{
              padding: "8px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "white",
              color: "#374151",
              cursor: "pointer",
            }}
              // onClick={() => navigate("/schedule")}
          >
            Schedule
          </button>

          <button
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
              // onClick={() => navigate("/attendance")}
          >
            Create Request
          </button>
        </div>
      )}

      {/* Mobile menu toggle */}
      {!isDesktop && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              padding: "8px",
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && !isDesktop && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            width: "192px",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            borderRadius: "6px",
            display: "flex",
            flexDirection: "column",
            padding: "8px",
            gap: "8px",
            zIndex: 50,
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Search size={16} /> Search
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Bell size={16} />
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
            Notifications
          </button>
          <button
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
          <button
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
          </button>
        </div>
      )}
    </div>
  );
}

export default TopNavbar;
