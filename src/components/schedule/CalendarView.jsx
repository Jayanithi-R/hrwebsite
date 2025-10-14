
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Filter, CheckCircle, Users, Search, Settings } from "lucide-react";

export default function GoogleCalendarReplica() {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setViewMode("mobile");
      else if (width >= 640 && width < 1024) setViewMode("tablet");
      else setViewMode("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewMode === "mobile";
  const isTablet = viewMode === "tablet";

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToToday = () => setCurrentDate(new Date());

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + direction);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const getDateTitle = () => {
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const day = currentDate.getDate();
    const dayName = dayNames[currentDate.getDay()];

    if (view === "day") {
      if (isMobile) return `${dayName.substring(0, 3)}, ${month.substring(0, 3)} ${day}`;
      return `${dayName}, ${month} ${day}`;
    } else if (view === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      if (isMobile) return `${month.substring(0, 3)} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}`;
      return `${month} ${startOfWeek.getDate()} - ${month} ${endOfWeek.getDate()}`;
    } else {
      return `${month} ${year}`;
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const period = i < 12 ? "am" : "pm";
      const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
      hours.push(`${hour}${period}`);
    }
    return hours;
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };


  const styles = {
    container: {
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      maxWidth: "100vw",
      overflow: "hidden"
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "8px 8px" : isTablet ? "10px 16px" : "12px 20px",
      borderBottom: "1px solid #dadce0",
      gap: isMobile ? "4px" : isTablet ? "8px" : "16px",
      flexWrap: isMobile ? "wrap" : "nowrap",
      position: "sticky",
      top: 0,
      background: "#fff",
      zIndex: 100
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "4px" : isTablet ? "8px" : "12px",
      flex: 1,
      minWidth: 0,
      flexWrap: isMobile ? "wrap" : "nowrap"
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "4px" : isTablet ? "8px" : "16px",
      flexShrink: 0
    },
    todayBtn: {
      border: "1px solid #dadce0",
      background: "#fff",
      borderRadius: "4px",
      padding: isMobile ? "6px 8px" : isTablet ? "7px 12px" : "8px 16px",
      fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
      fontWeight: 500,
      color: "#3c4043",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background-color 0.2s"
    },
    viewDropdown: {
      border: "1px solid #dadce0",
      background: "#fff",
      borderRadius: "4px",
      padding: isMobile ? "6px 6px" : isTablet ? "7px 10px" : "8px 12px",
      fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
      fontWeight: 500,
      color: "#3c4043",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      minWidth: isMobile ? "60px" : isTablet ? "80px" : "100px",
      transition: "background-color 0.2s"
    },
    navBtn: {
      border: "none",
      background: "transparent",
      padding: "6px",
      cursor: "pointer",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#5f6368",
      transition: "background-color 0.2s"
    },
    dateTitle: {
      fontSize: isMobile ? "16px" : isTablet ? "20px" : "22px",
      fontWeight: 400,
      color: "#3c4043",
      marginLeft: isMobile ? "0px" : isTablet ? "8px" : "16px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: isMobile ? "100%" : "auto",
      flexBasis: isMobile ? "100%" : "auto"
    },
    iconBtn: {
      border: "none",
      background: "transparent",
      padding: isMobile ? "6px" : "8px",
      cursor: "pointer",
      borderRadius: "50%",
      display: isMobile && (view === "month") ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#5f6368",
      transition: "background-color 0.2s"
    },
    searchBtn: {
      border: "none",
      background: "transparent",
      padding: "8px",
      cursor: "pointer",
      borderRadius: "4px",


      display: (isMobile || isTablet) ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#5f6368",
      transition: "background-color 0.2s"
    },
    profileIcon: {
      width: isMobile ? "26px" : isTablet ? "30px" : "32px",
      height: isMobile ? "26px" : isTablet ? "30px" : "32px",
      borderRadius: "50%",
      background: "#1a73e8",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
      fontWeight: 500,
      cursor: "pointer",
      flexShrink: 0
    },
    calendarContent: {
      flex: 1,
      overflow: "auto",
      position: "relative"
    },
    dayView: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    },
    timeSlot: {
      display: "flex",
      borderBottom: "1px solid #dadce0",
      minHeight: isMobile ? "40px" : isTablet ? "44px" : "48px"
    },
    timeLabel: {
      width: isMobile ? "45px" : isTablet ? "55px" : "60px",
      padding: isMobile ? "6px 4px" : "8px",
      fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
      color: "#70757a",
      textAlign: "right",
      borderRight: "1px solid #dadce0",
      flexShrink: 0
    },
    timeContent: {
      flex: 1,
      position: "relative"
    },
    weekView: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    },
    weekHeader: {
      display: "grid",
      gridTemplateColumns: `${isMobile ? "45px" : isTablet ? "55px" : "60px"} repeat(7, 1fr)`,
      borderBottom: "1px solid #dadce0",
      position: "sticky",
      top: 0,
      background: "#fff",
      zIndex: 10
    },
    weekDay: {
      padding: isMobile ? "6px 2px" : isTablet ? "10px 4px" : "12px 8px",
      textAlign: "center",
      borderLeft: "1px solid #dadce0",
      overflow: "hidden"
    },
    weekDayName: {
      fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
      color: "#70757a",
      fontWeight: 500
    },
    weekDayNumber: {
      fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
      color: "#3c4043",
      marginTop: "4px"
    },
    weekTimeGrid: {
      display: "grid",
      gridTemplateColumns: `${isMobile ? "45px" : isTablet ? "55px" : "60px"} repeat(7, 1fr)`,
      flex: 1
    },
    monthView: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
    monthHeader: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      borderBottom: "1px solid #dadce0",
      background: "#fff"
    },
    monthDayName: {
      padding: isMobile ? "6px 2px" : isTablet ? "10px 6px" : "12px 8px",
      textAlign: "center",
      fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
      color: "#70757a",
      fontWeight: 500
    },
    monthGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gridAutoRows: "1fr",
      flex: 1,
      border: "1px solid #dadce0",
      borderTop: "none",
      minHeight: 0
    },
    monthDay: {
      border: "1px solid #dadce0",
      borderTop: "none",
      borderLeft: "none",
      padding: isMobile ? "4px" : isTablet ? "6px" : "8px",
      minHeight: isMobile ? "50px" : isTablet ? "80px" : "100px",
      position: "relative",
      background: "#fff",
      overflow: "hidden"
    },
    monthDayNumber: {
      fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
      color: "#3c4043",
      fontWeight: 400
    },
    todayIndicator: {
      width: isMobile ? "20px" : isTablet ? "24px" : "26px",
      height: isMobile ? "20px" : isTablet ? "24px" : "26px",
      background: "#1a73e8",
      borderRadius: "50%",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
      fontWeight: 500
    },
    allDayLabel: {
      padding: isMobile ? "6px 8px" : isTablet ? "10px 12px" : "12px 16px",
      fontSize: isMobile ? "11px" : isTablet ? "12px" : "14px",
      color: "#70757a",
      borderBottom: "1px solid #dadce0",
      background: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 5
    },
    saveViewBtn: {
      border: "1px solid #dadce0",
      background: "#fef7e0",
      borderRadius: "4px",
      padding: isMobile ? "6px 8px" : isTablet ? "7px 12px" : "8px 16px",
      fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
      fontWeight: 500,
      color: "#b06000",
      cursor: "pointer",
      display: isMobile || isTablet ? "none" : "flex",
      alignItems: "center",
      gap: "6px",
      transition: "background-color 0.2s"
    }
  };

  const renderDayView = () => {
    const hours = getHours();
    return (
      <div style={styles.dayView}>
        <div style={styles.allDayLabel}>All day</div>
        {hours.map((hour, idx) => (
          <div key={idx} style={styles.timeSlot}>
            <div style={styles.timeLabel}>{hour}</div>
            <div style={styles.timeContent}></div>
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const hours = getHours();

    return (
      <div style={styles.weekView}>
        <div style={styles.weekHeader}>
          <div></div>
          {weekDays.map((day, idx) => (
            <div key={idx} style={styles.weekDay}>
              <div style={styles.weekDayName}>
                {isMobile ? shortDayNames[day.getDay()].charAt(0) : shortDayNames[day.getDay()]}
              </div>
              <div style={styles.weekDayNumber}>
                {isToday(day.getDate()) && day.getMonth() === new Date().getMonth() ? (
                  <div style={styles.todayIndicator}>{day.getDate()}</div>
                ) : (
                  <div>{day.getDate()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={styles.allDayLabel}>All day</div>
        {hours.map((hour, idx) => (
          <div key={idx} style={styles.timeSlot}>
            <div style={styles.timeLabel}>{hour}</div>
            {weekDays.map((day, dayIdx) => (
              <div key={dayIdx} style={{ ...styles.timeContent, borderLeft: "1px solid #dadce0" }}></div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <div style={styles.monthView}>
        <div style={styles.monthHeader}>
          {shortDayNames.map((day, idx) => (
            <div key={idx} style={styles.monthDayName}>
              {isMobile ? day.charAt(0) : day}
            </div>
          ))}
        </div>
        <div style={styles.monthGrid}>
          {days.map((day, idx) => (
            <div key={idx} style={styles.monthDay}>
              {day && (
                <div style={styles.monthDayNumber}>
                  {isToday(day) ? (
                    <div style={styles.todayIndicator}>{day}</div>
                  ) : (
                    <div>{day}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <div style={styles.leftSection}>
          <button style={styles.todayBtn} onClick={goToToday}>Today</button>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <select
              style={styles.viewDropdown}
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button style={styles.navBtn} onClick={() => navigateDate(-1)}>
              <ChevronLeft size={isMobile ? 18 : 20} />
            </button>
            <button style={styles.navBtn} onClick={() => navigateDate(1)}>
              <ChevronRight size={isMobile ? 18 : 20} />
            </button>
          </div>
          <div style={styles.dateTitle}>{getDateTitle()}</div>
        </div>

        <div style={styles.rightSection}>
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
              <Filter size={isMobile ? 16 : isTablet ? 18 : 20} />
              <p style={{ fontSize: "15px", paddingLeft: "5px" }}>Filter</p>
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
              <Users size={20} />
              <p style={{ fontSize: "14px", paddingLeft: "5px" }}>Assignee</p>
            </button>
          </div>
          <div style={styles.profileIcon}>J</div>
          <button style={styles.searchBtn}>
            <Search size={20} />
          </button>
          <button style={styles.iconBtn}>
            <Settings size={isMobile ? 16 : isTablet ? 18 : 20} />
          </button>
        </div>
      </div>

      <div style={styles.calendarContent}>
        {view === "day" && renderDayView()}
        {view === "week" && renderWeekView()}
        {view === "month" && renderMonthView()}
      </div>
    </div>
  );
}