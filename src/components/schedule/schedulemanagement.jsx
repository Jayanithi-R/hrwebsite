import React, { useState } from "react";
import { List, Calendar, Search, Eye, Settings } from "lucide-react";
import ListPage from "./ListView";
import Calendarpage from "./CalendarView";

export default function CourseDashboard() {
  const [activeTab, setActiveTab] = useState("List");
  const [searchOpen, setSearchOpen] = useState(false);

  const tabs = [
    { label: "List", icon: <List size={18} /> },
    { label: "Calendar", icon: <Calendar size={18} /> },
  ];

  return (
    <div
      style={{
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 30px",
          borderBottom: "1px solid #eaeaea",
          backgroundColor: "white",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: "#2c3e50" }}>Everything</div>
      </header>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        {/* Left tabs */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {tabs.map((tab) => (
            <div
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              style={{
                position: "relative",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 16,
                fontWeight: activeTab === tab.label ? 600 : 400,
                color: activeTab === tab.label ? "#3498db" : "#555",
              }}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.label && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: "100%",
                    height: 2,
                    backgroundColor: "#3498db",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Right group */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {/* {searchOpen ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f5f7fa",
                borderRadius: 8,
                padding: "4px 10px",
                width: 300,
              }}
            >
              <Search size={16} style={{ marginRight: 8, color: "#7f8c8d" }} />
              <input
                type="text"
                placeholder="Search"
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  width: "100%",
                  padding: 5,
                  fontSize: 14,
                }}
              />
              <span
                style={{ cursor: "pointer", marginLeft: 8, color: "#7f8c8d" }}
                onClick={() => setSearchOpen(false)}
              >
                ✖
              </span>
            </div>
          ) : (
            <div
              onClick={() => setSearchOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 14,
                color: "#555",
              }}
            >
              <Search size={16} style={{ marginRight: 4 }} /> Search
            </div>
          )} */}

          {/* <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Eye size={16} /> Hide
          </div>
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Settings size={16} /> Customize
          </div> */}
        </div>
      </div>

      {/* Content Area - changes based on active tab */}
      <div style={{ padding: "12px 15px", backgroundColor: "#f9fafb" }}>
        {activeTab === "List" && (
          <div>
            <ListPage/>
          </div>
        )}
        {activeTab === "Calendar" && (
          <div>
            <Calendarpage/>
          </div>
        )}
      </div>
    </div>
  );
}
