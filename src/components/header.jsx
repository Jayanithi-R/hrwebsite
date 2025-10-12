"use client";

import React, { useState, useEffect } from "react";
import { Bell, Search, Menu, X } from "lucide-react";

function TopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        padding: isDesktop ? "20px 35px" : "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Left: Avatar + Greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
        <img
          src="https://via.placeholder.com/40"
          alt="Avatar"
          style={{ 
            width: isDesktop ? "40px" : "36px", 
            height: isDesktop ? "40px" : "36px", 
            borderRadius: "50%",
            flexShrink: 0
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: isDesktop ? "1rem" : "0.9rem",
              color: "#1f2937",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              margin: 0
            }}
          >
            Juwita
          </p>
          {isDesktop && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                margin: 0,
                whiteSpace: "nowrap"
              }}
            >
              Welcome back to HRsync <span>👋</span>
            </p>
          )}
        </div>
      </div>

      {/* Right: Desktop buttons */}
      {isDesktop && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <button
            aria-label="Search"
            style={{
              padding: "8px",
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
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
              whiteSpace: "nowrap"
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
              whiteSpace: "nowrap"
            }}
          >
            Create Request
          </button>
        </div>
      )}

      {/* Mobile menu toggle */}
      {!isDesktop && (
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              padding: "8px",
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
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
            right: "20px",
            marginTop: "8px",
            width: "200px",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            borderRadius: "6px",
            display: "flex",
            flexDirection: "column",
            padding: "8px",
            gap: "4px",
            zIndex: 50,
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              width: "100%"
            }}
          >
            <Search size={16} /> Search
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              position: "relative",
              textAlign: "left",
              width: "100%"
            }}
          >
            <div style={{ position: "relative", display: "flex" }}>
              <Bell size={16} />
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  width: "6px",
                  height: "6px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              />
            </div>
            Notifications
          </button>
          <button
            style={{
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "white",
              color: "#374151",
              cursor: "pointer",
              textAlign: "center",
              width: "100%"
            }}
          >
            Schedule
          </button>
          <button
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
              textAlign: "center",
              width: "100%"
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