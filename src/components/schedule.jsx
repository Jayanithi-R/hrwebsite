// CourseDashboardEnhanced.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  User,
  List as ListIcon,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight as ArrowRight
} from "lucide-react";

export default function CourseDashboardEnhanced() {
  const sample = [];

  const [tasks, setTasks] = useState(sample);
  const [view, setView] = useState(0);
  const [addingTop, setAddingTop] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newDue, setNewDue] = useState("");
  const [editing, setEditing] = useState({});
  const [filterPriority, setFilterPriority] = useState("All");
  const [newSubtaskNames, setNewSubtaskNames] = useState({});
  const [newSubtaskDates, setNewSubtaskDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const priorities = ["High", "Medium", "Low"];
  const priorityColors = { High: "#f87171", Medium: "#facc15", Low: "#4ade80" };
  const uid = () => Math.floor(Math.random() * 1000000);
  const inputRef = useRef(null);

  // --- NEW: Meetings/Events ---
  const [events, setEvents] = useState([]);
  const [addingEvent, setAddingEvent] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const eventColors = { Meeting: "#fbbf24", Event: "#34d399" };
  const [newEventType, setNewEventType] = useState("Meeting");

  useEffect(() => { if (addingTop && inputRef.current) inputRef.current.focus(); }, [addingTop]);

  const addTask = (parentId = null) => {
    const name = parentId ? newSubtaskNames[parentId] : newName;
    if (!name.trim()) return;
    const t = { 
      id: uid(), 
      name: name.trim(), 
      assignee: "", 
      start: parentId ? newSubtaskDates[parentId]?.start || "" : newStart,
      due: parentId ? newSubtaskDates[parentId]?.due || "" : newDue,
      priority: "Low", 
      expanded: false, 
      subtasks: [] 
    };
    if (parentId === null) {
      setTasks(s => [t, ...s]);
      setNewName(""); setNewStart(""); setNewDue(""); setAddingTop(false);
    } else {
      setTasks(s => s.map(x => x.id === parentId ? { ...x, subtasks: [t, ...x.subtasks] } : x));
      setNewSubtaskNames(s => ({ ...s, [parentId]: "" }));
      setNewSubtaskDates(s => ({ ...s, [parentId]: { start: "", due: "" } }));
    }
  };

  const addEvent = () => {
    if (!newEventName.trim() || !newEventDate) return;
    setEvents(s => [...s, { id: uid(), name: newEventName.trim(), date: newEventDate, type: newEventType }]);
    setNewEventName(""); setNewEventDate(""); setAddingEvent(false);
  };

  const updateTask = (taskId, patch, parentId = null) => {
    setTasks(s => s.map(t => {
      if (parentId === null && t.id === taskId) return { ...t, ...patch };
      if (parentId && t.id === parentId) return { ...t, subtasks: t.subtasks.map(st => st.id === taskId ? { ...st, ...patch } : st) };
      return t;
    }));
  };

  const deleteTask = (taskId, parentId = null) => {
    if (!parentId) setTasks(s => s.filter(t => t.id !== taskId));
    else setTasks(s => s.map(t => t.id === parentId ? { ...t, subtasks: t.subtasks.filter(st => st.id !== taskId) } : t));
  };

  const toggleExpand = (id) => setTasks(s => s.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));

  const filteredTasks = tasks.filter(t => filterPriority === "All" || t.priority === filterPriority);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const calendar = [];
  for (let i = 0; i < firstDay; i++) calendar.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendar.push(d);

  // --- Tasks only on due date ---
  const tasksByDay = {};
  filteredTasks.forEach(t => {
    const allTasks = [t, ...t.subtasks];
    allTasks.forEach(task => {
      if (!task.due) return;
      const dueDateStr = task.due;
      tasksByDay[dueDateStr] = tasksByDay[dueDateStr] || [];
      tasksByDay[dueDateStr].push({ ...task, parentId: t.id });
    });
  });

  // --- Events by date ---
  const eventsByDay = {};
  events.forEach(e => {
    if (!e.date) return;
    eventsByDay[e.date] = eventsByDay[e.date] || [];
    eventsByDay[e.date].push(e);
  });

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 11) { newMonth = 0; newYear += 1; }
    if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderTask = (task, parentId = null, level = 0) => (
    <div key={task.id} style={{ border: "1px solid #f0f0f2", borderRadius: 6, padding: 10, marginBottom: 4, background: priorityColors[task.priority] + "20", marginLeft: level * 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {task.subtasks.length > 0 && (
          <button onClick={() => toggleExpand(task.id)} style={{ padding: 6, cursor: "pointer", background: "transparent", border: "none" }}>
            {task.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        {editing[task.id] ? (
          <input style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef", width: "100%" }}
            value={task.name} onChange={e => updateTask(task.id, { name: e.target.value }, parentId)}
            onBlur={() => setEditing(s => ({ ...s, [task.id]: false }))} />
        ) : (
          <div onDoubleClick={() => setEditing(s => ({ ...s, [task.id]: true }))} style={{ fontWeight: 600 }}>{task.name}</div>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 6 }}>
        <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "#e2e8f0", borderRadius: "50%" }}>{task.assignee ? task.assignee[0] : <User size={14} />}</div>
        <input type="date" style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef" }} value={task.start} onChange={e => updateTask(task.id, { start: e.target.value }, parentId)} />
        <input type="date" style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef" }} value={task.due} onChange={e => updateTask(task.id, { due: e.target.value }, parentId)} />
        <select style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef" }} value={task.priority} onChange={e => updateTask(task.id, { priority: e.target.value }, parentId)}>
          {priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button onClick={() => setEditing(s => ({ ...s, [task.id]: !s[task.id] }))} style={{ padding: 6, border: "none", background: "#e5e7eb", borderRadius: 4, cursor: "pointer" }}><Edit2 size={14} /></button>
          <button onClick={() => deleteTask(task.id, parentId)} style={{ padding: 6, border: "none", background: "#ef4444", color: "#fff", borderRadius: 4, cursor: "pointer" }}><Trash2 size={14} /></button>
        </div>
      </div>

      {task.expanded && task.subtasks.map(st => renderTask(st, task.id, level + 1))}

      {task.expanded && (
        <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
          <input style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef", flex: 1 }} placeholder="Subtask name"
            value={newSubtaskNames[task.id] || ""} onChange={e => setNewSubtaskNames(s => ({ ...s, [task.id]: e.target.value }))} />
          <input type="date" style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef" }}
            value={newSubtaskDates[task.id]?.start || ""} onChange={e => setNewSubtaskDates(s => ({ ...s, [task.id]: { ...s[task.id], start: e.target.value } }))} />
          <input type="date" style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef" }}
            value={newSubtaskDates[task.id]?.due || ""} onChange={e => setNewSubtaskDates(s => ({ ...s, [task.id]: { ...s[task.id], due: e.target.value } }))} />
          <button style={{ padding: "6px 12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }} onClick={() => addTask(task.id)}>Add</button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, Roboto, Arial, sans-serif", }}>
      <div style={{ margin: "0 auto", background: "#fff", borderRadius: 8, padding: 12 }}>
        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Task & Event Management</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <div onClick={() => setView(0)} style={{ padding: "6px 12px", cursor: "pointer", background: view === 0 ? "#e0e7ff" : "transparent", borderRadius: 4 }}><ListIcon size={16} /> List</div>
            <div onClick={() => setView(1)} style={{ padding: "6px 12px", cursor: "pointer", background: view === 1 ? "#e0e7ff" : "transparent", borderRadius: 4 }}><CalendarIcon size={16} /> Calendar</div>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ padding: 6, borderRadius: 4, border: "1px solid #e6e9ef" }}>
              <option>All</option>
              {priorities.map(p => <option key={p}>{p}</option>)}
            </select>
            <button onClick={() => setAddingTop(a => !a)} style={{ padding: "6px 12px", cursor: "pointer", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 4 }}><Plus size={14} /> Add Task</button>
            <button onClick={() => setAddingEvent(a => !a)} style={{ padding: "6px 12px", cursor: "pointer", background: "#22c55e", color: "#fff", border: "none", borderRadius: 4 }}><Plus size={14} /> Add Event</button>
          </div>
        </div>

        {/* Add Top Task */}
        {addingTop && (
          <div style={{ marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input ref={inputRef} style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef", flex: 1 }} placeholder="Task name" value={newName} onChange={e => setNewName(e.target.value)} />
            <input type="date" style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef" }} value={newStart} onChange={e => setNewStart(e.target.value)} />
            <input type="date" style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef" }} value={newDue} onChange={e => setNewDue(e.target.value)} />
            <button style={{ padding: "6px 12px", cursor: "pointer", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 4 }} onClick={() => addTask()}>Add</button>
            <button style={{ padding: "6px 12px", cursor: "pointer", background: "#e5e7eb", color: "#000", border: "none", borderRadius: 4 }} onClick={() => { setAddingTop(false); setNewName(""); setNewStart(""); setNewDue(""); }}>Cancel</button>
          </div>
        )}

        {/* Add Event */}
        {addingEvent && (
          <div style={{ marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef", flex: 1 }} placeholder="Event name" value={newEventName} onChange={e => setNewEventName(e.target.value)} />
            <input type="date" style={{ padding: 6, borderRadius: 6, border: "1px solid #e6e9ef" }} value={newEventDate} onChange={e => setNewEventDate(e.target.value)} />
            <select value={newEventType} onChange={e => setNewEventType(e.target.value)} style={{ padding: 6, borderRadius: 4, border: "1px solid #e6e9ef" }}>
              <option>Meeting</option>
              <option>Event</option>
            </select>
            <button style={{ padding: "6px 12px", cursor: "pointer", background: "#22c55e", color: "#fff", border: "none", borderRadius: 4 }} onClick={addEvent}>Add</button>
            <button style={{ padding: "6px 12px", cursor: "pointer", background: "#e5e7eb", color: "#000", border: "none", borderRadius: 4 }} onClick={() => setAddingEvent(false)}>Cancel</button>
          </div>
        )}

        {/* List View */}
        {view === 0 && filteredTasks.map(task => renderTask(task))}

        {/* Calendar View */}
        {view === 1 && (
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontWeight: 600, marginBottom: 6, fontSize: 16, gap: 12 }}>
              <button onClick={() => changeMonth(-1)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><ChevronLeft /></button>
              {monthNames[currentMonth]} {currentYear}
              <button onClick={() => changeMonth(1)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><ArrowRight /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(80px, 1fr))", gap: 4 }}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
                <div key={day} style={{ fontWeight: 700, textAlign: "center", padding: 4 }}>{day}</div>
              ))}
              {calendar.map((day, idx) => {
                const dateStr = day ? new Date(currentYear, currentMonth, day).toISOString().split("T")[0] : null;
                const dayTasks = dateStr ? tasksByDay[dateStr] || [] : [];
                const dayEvents = dateStr ? eventsByDay[dateStr] || [] : [];
                const isToday = day && dateStr === new Date().toISOString().split("T")[0];
                return (
                  <div key={idx} style={{ minHeight: 60, border: "1px solid #e9e9ec", borderRadius: 4, padding: 2, background: isToday ? "#fffbeb" : dayTasks.length || dayEvents.length ? "#f0f4ff" : "#fff" }}>
                    {day && <div style={{ fontWeight: 600 }}>{day}</div>}
                    {/* Render tasks */}
                    {dayTasks.map(t => (
                      <div key={t.id + "-task"} style={{ fontSize: 12, marginTop: 2, padding: "2px 4px", borderRadius: 4, background: priorityColors[t.priority], color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }}
                        onDoubleClick={() => setEditing(s => ({ ...s, [t.id]: true }))}>
                        {editing[t.id] ? (
                          <input value={t.name} onChange={e => updateTask(t.id, { name: e.target.value }, t.parentId)} onBlur={() => setEditing(s => ({ ...s, [t.id]: false }))} style={{ width: "100%", fontSize: 12, border: "none", borderRadius: 2 }} />
                        ) : t.name}
                      </div>
                    ))}
                    {/* Render events */}
                    {dayEvents.map(e => (
                      <div key={e.id + "-event"} style={{ fontSize: 12, marginTop: 2, padding: "2px 4px", borderRadius: 4, background: eventColors[e.type], color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "default" }}>
                        {e.name} ({e.type})
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
