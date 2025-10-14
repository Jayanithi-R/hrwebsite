import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Calendar as CalendarIcon,
  Search,
  Filter,

  CheckCircle,
  Users
} from "lucide-react";



const LightToolbar = () => {
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("All");

    const optionsList = ["Settings", "Preferences", "Help", "About"];
    const priorities = ["Low", "Medium", "High"];

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8f8f8",
          padding: "8px 12px",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* Left Section */}
        <div style={{ display: "flex", gap: "8px", position: "relative" }}>
          {/* Options Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            >
              Group{" "}
              <span style={{ fontSize: "10px" }}>
                {showOptionsDropdown ? "▲" : "▼"}
              </span>
            </button>

            {showOptionsDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  minWidth: "120px",
                  marginTop: "4px",
                }}
              >
                {optionsList.map((opt) => (
                  <div
                    key={opt}
                    style={{
                      padding: "6px 10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => {
                      alert(`Selected: ${opt}`);
                      setShowOptionsDropdown(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Normal Buttons */}
          {["Subtasks", "Columns"].map((btn) => (
            <button
              key={btn}
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Filter Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "14px",
                padding: "6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                height: "32px"
              }}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter size={20} />
              Filter{" "}
              <span style={{ fontSize: "10px" }}>
                {showFilterDropdown ? "▲" : "▼"}
              </span>
            </button>

            {showFilterDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  minWidth: "140px",
                  marginTop: "4px",
                  padding: "8px",
                }}
              >
                {priorities.map((p) => (
                  <div
                    key={p}
                    style={{
                      padding: "6px 10px",
                      cursor: "pointer",
                      background: filterPriority === p ? "#f0f0f0" : "transparent",
                    }}
                    onClick={() => {
                      setFilterPriority(p);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "14px",
                padding: "6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                height: "32px"
              }}
            >
            <CheckCircle size={20} />
            <p style={{ fontSize: "14px", paddingLeft: "5px" }}>Closed</p>
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <button
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "14px",
                padding: "6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                height: "32px"
              }}
            >
            <Users size={20}  />
            <p style={{ fontSize: "14px", paddingLeft: "5px" }}>Assignee</p>
            </button>
          </div>

          {/* Profile */}
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#007bff",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            B
          </div>

          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "#fff",
              padding: "4px 8px",
            }}
          >
            <Search size={16} style={{ marginRight: "4px", color: "#888" }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "14px",
                width: "120px",
                background: "transparent",
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  export default LightToolbar;
