// src/components/Calendar.jsx
import React from "react";
import { ChevronLeft, ChevronRight as ArrowRight } from "lucide-react";

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function Calendar({ 
  projects = [], 
  events = [], 
  currentMonth, 
  currentYear, 
  changeMonth, 
  styles, 
  priorityColors,
  eventColors
}) {
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const calendar = [];
  for (let i = 0; i < firstDay; i++) calendar.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendar.push(d);

  const tasksByDay = {};
  projects.forEach(project => {
    project.tasks.forEach(task => {
      if (task.due) {
        tasksByDay[task.due] = tasksByDay[task.due] || [];
        tasksByDay[task.due].push({ ...task, type: 'task', projectName: project.name });
      }
      task.subtasks.forEach(subtask => {
        if (subtask.due) {
          tasksByDay[subtask.due] = tasksByDay[subtask.due] || [];
          tasksByDay[subtask.due].push({ ...subtask, type: 'subtask', projectName: project.name });
        }
      });
    });
  });

  const eventsByDay = {};
  events.forEach(e => {
    if (!e.date) return;
    eventsByDay[e.date] = eventsByDay[e.date] || [];
    eventsByDay[e.date].push(e);
  });

  return (
    <div style={styles.calendarView}>
      <div style={styles.calendarHeader}>
        <button onClick={() => changeMonth(-1)} style={styles.monthNav}>
          <ChevronLeft size={20} />
        </button>
        <div style={styles.currentMonth}>
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button onClick={() => changeMonth(1)} style={styles.monthNav}>
          <ArrowRight size={20} />
        </button>
      </div>
      <div style={styles.calendarGrid}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
          <div key={day} style={styles.calendarDayHeader}>{day}</div>
        ))}
        {calendar.map((day, idx) => {
          const dateStr = day ? new Date(currentYear, currentMonth, day).toISOString().split("T")[0] : null;
          const dayTasks = dateStr ? tasksByDay[dateStr] || [] : [];
          const dayEvents = dateStr ? eventsByDay[dateStr] || [] : [];
          const isToday = day && dateStr === new Date().toISOString().split("T")[0];

          return (
            <div 
              key={idx} 
              style={{
                ...styles.calendarDay,
                background: isToday ? '#fffbeb' : (dayTasks.length || dayEvents.length ? '#f0f9ff' : '#fff')
              }}
            >
              {day && <div style={styles.dayNumber}>{day}</div>}
              {dayTasks.map(item => (
                <div 
                  key={item.id} 
                  style={{ ...styles.calendarItem, background: priorityColors[item.priority] }}
                  title={item.name}
                >
                  {item.name}
                </div>
              ))}
              {dayEvents.map(e => (
                <div 
                  key={e.id} 
                  style={{ ...styles.calendarItem, background: eventColors[e.type] }}
                  title={e.name}
                >
                  {e.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
