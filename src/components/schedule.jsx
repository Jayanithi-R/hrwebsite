import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  User,
  Tag,
  List as ListIcon,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight as ArrowRight
} from "lucide-react";

export default function CourseDashboardEnhanced() {
  // --- Sample & General State ---
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState(0); // 0: List, 1: Calendar
  const [addingTop, setAddingTop] = useState(false); // Add Project/Event modal
  const [toggleMode, setToggleMode] = useState("task"); // Task/Event toggle in modal
  const [addingTaskFor, setAddingTaskFor] = useState(null); // Track which project is adding a task
  const [editing, setEditing] = useState({}); // Editable tasks/events
  const [filterPriority, setFilterPriority] = useState("All");

  // --- New Project Form ---
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDue, setNewProjectDue] = useState("");
  const [newProjectPriority, setNewProjectPriority] = useState("Low");
  const [newProjectAssignee, setNewProjectAssignee] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  // --- Projects & Tasks ---
  const [projects, setProjects] = useState([]);
  const [newTaskNames, setNewTaskNames] = useState({});
  const [newTaskDates, setNewTaskDates] = useState({});
  const [newTaskPriority, setNewTaskPriority] = useState({});

  // --- Subtasks ---
  const [newSubtaskNames, setNewSubtaskNames] = useState({});
  const [newSubtaskDates, setNewSubtaskDates] = useState({});

  // --- New Event Form ---
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventType, setNewEventType] = useState("Meeting");

  // --- Calendar State ---
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);

  // --- Constants ---
  const priorities = ["High", "Medium", "Low"];
  const priorityColors = { High: "#f87171", Medium: "#facc15", Low: "#4ade80" };
  const eventColors = { Meeting: "#fbbf24", Event: "#34d399" };
  const uid = () => Math.floor(Math.random() * 1000000);

  // --- Refs ---
  const inputRef = useRef(null);

  useEffect(() => { 
    if (addingTop && inputRef.current) inputRef.current.focus(); 
  }, [addingTop]);

  const toggleExpand = (id) => setTasks(s => s.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));
  
  // Filter tasks for calendar view
  const filteredTasks = tasks.filter(t => filterPriority === "All" || t.priority === filterPriority);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const calendar = [];
  for (let i = 0; i < firstDay; i++) calendar.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendar.push(d);

  const addProject = () => {
    if (!newProjectName.trim()) return;
    const p = {
      id: uid(),
      name: newProjectName.trim(),
      description: newProjectDescription,
      assignee: newProjectAssignee,
      due: newProjectDue,
      priority: newProjectPriority,
      expanded: false,
      tasks: []
    };
    setProjects(s => [p, ...s]);
    setNewProjectName(""); 
    setNewProjectDescription("");
    setNewProjectAssignee("");
    setNewProjectDue(""); 
    setNewProjectPriority("Low"); 
    setAddingTop(false);
  };

  const addTask = (projectID) => {
    const name = newTaskNames[projectID]?.trim();
    if (!name) return;
    const t = {
      id: uid(),
      name,
      start: newTaskDates[projectID]?.start || "",
      due: newTaskDates[projectID]?.due || "",
      priority: newTaskPriority[projectID] || "Low",
      expanded: false,
      subtasks: []
    };

    setProjects(s =>
      s.map(p =>
        p.id === projectID ? { ...p, tasks: [t, ...p.tasks] } : p
      )
    );

    setNewTaskNames(s => ({ ...s, [projectID]: "" }));
    setNewTaskDates(s => ({ ...s, [projectID]: { start: "", due: "" } }));
    setNewTaskPriority(s => ({ ...s, [projectID]: "Low" }));
    setAddingTaskFor(null);
  };

  const addSubtask = (projectID, taskID) => {
    const name = newSubtaskNames[taskID]?.trim();
    if (!name) return;
    const st = {
      id: uid(),
      name,
      start: newSubtaskDates[taskID]?.start || "",
      due: newSubtaskDates[taskID]?.due || "",
      priority: "Low"
    };
    setProjects(s => s.map(p => p.id === projectID ? {
      ...p,
      tasks: p.tasks.map(t => t.id === taskID ? { ...t, subtasks: [st, ...t.subtasks] } : t)
    } : p));
    setNewSubtaskNames(s => ({ ...s, [taskID]: "" }));
    setNewSubtaskDates(s => ({ ...s, [taskID]: { start: "", due: "" } }));
  };

  const updateTask = (projectId, taskId, patch, parentId = null) => {
    setProjects(projects => projects.map(p => {
      if (p.id !== projectId) return p;

      return {
        ...p,
        tasks: p.tasks.map(t => {
          if (parentId === null && t.id === taskId) return { ...t, ...patch };
          if (parentId && t.id === parentId) {
            return { ...t, subtasks: t.subtasks.map(st => st.id === taskId ? { ...st, ...patch } : st) };
          }
          return t;
        })
      };
    }));
  };

  const deleteProject = (projectId) => {
    setProjects(s => s.filter(p => p.id !== projectId));
  };

  const deleteTask = (projectId, taskId, parentId = null) => {
    setProjects(projects => projects.map(p => {
      if (p.id !== projectId) return p;

      return {
        ...p,
        tasks: p.tasks.map(t => {
          if (parentId === null && t.id === taskId) return null;
          if (parentId && t.id === parentId) {
            return { ...t, subtasks: t.subtasks.filter(st => st.id !== taskId) };
          }
          return t;
        }).filter(Boolean)
      };
    }));
  };

  const addEvent = () => {
    if (!newEventName.trim() || !newEventDate) return;
    setEvents(s => [...s, { 
      id: uid(), 
      name: newEventName.trim(), 
      date: newEventDate, 
      type: newEventType 
    }]);
    setNewEventName(""); 
    setNewEventDate(""); 
    setAddingTop(false);
  };

  // Fix: Properly handle task dates for calendar
  const tasksByDay = {};
  projects.forEach(project => {
    project.tasks.forEach(task => {
      if (task.due) {
        const dueDateStr = task.due;
        tasksByDay[dueDateStr] = tasksByDay[dueDateStr] || [];
        tasksByDay[dueDateStr].push({ ...task, projectId: project.id, isTask: true });
      }
      // Also include subtasks
      task.subtasks.forEach(subtask => {
        if (subtask.due) {
          const dueDateStr = subtask.due;
          tasksByDay[dueDateStr] = tasksByDay[dueDateStr] || [];
          tasksByDay[dueDateStr].push({ ...subtask, projectId: project.id, taskId: task.id, isSubtask: true });
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

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 11) { newMonth = 0; newYear += 1; }
    if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderProject = (project) => (
    <div
      key={project.id}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        background: "#ffffff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          rowGap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          {/* Expand/Collapse Button */}
          <button
            onClick={() =>
              setProjects((s) =>
                s.map((p) =>
                  p.id === project.id ? { ...p, expanded: !p.expanded } : p
                )
              )
            }
            style={{
              background: "transparent",
              border: "none",
              borderRadius: 6,
              padding: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span
              style={{
                display: "inline-block",
                transform: project.expanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
                fontSize: 16,
              }}
            >
              ▶
            </span>
          </button>

          {/* Editable Project Name */}
          {editing[project.id] ? (
            <input
              type="text"
              value={project.name}
              autoFocus
              onChange={(e) =>
                setProjects((prev) =>
                  prev.map((p) =>
                    p.id === project.id ? { ...p, name: e.target.value } : p
                  )
                )
              }
              onBlur={() =>
                setEditing((prev) => ({ ...prev, [project.id]: false }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") e.target.blur();
              }}
              style={{
                fontWeight: 600,
                fontSize: 16,
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "6px 10px",
                outline: "none",
                width: 180,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
            />
          ) : (
            <div
              style={{
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                padding: "6px 10px",
                borderRadius: 6,
                transition: "background 0.2s ease",
              }}
              onDoubleClick={() =>
                setEditing((prev) => ({ ...prev, [project.id]: true }))
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f9fafb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {project.name || "Untitled Project"}
            </div>
          )}

          {/* Meta Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14, color: "#4b5563", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <User size={14} />
              {project.assignee || "Unassigned"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CalendarIcon size={14} />
              {project.due || "No Due Date"}
            </div>
            <div
              style={{
                padding: "3px 8px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                color: "#fff",
                background: priorityColors[project.priority] || "#9ca3af",
              }}
            >
              {project.priority}
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            onClick={() => setAddingTaskFor(project.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: "#4f46e5",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4338ca")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#4f46e5")}
          >
            <Plus size={14} /> Add Task
          </button>
          <button
            onClick={() => deleteProject(project.id)}
            style={{
              background: "#ef4444",
              border: "none",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
              color: "#fff",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <div style={{ marginBottom: 12, paddingLeft: 28, color: "#6b7280", fontSize: 14 }}>
          {project.description}
        </div>
      )}

      {/* Add Task Form */}
      {addingTaskFor === project.id && (
        <div style={{ padding: "12px 28px", background: "#f8fafc", borderRadius: 8, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input
              value={newTaskNames[project.id] || ""}
              onChange={(e) => setNewTaskNames(s => ({ ...s, [project.id]: e.target.value }))}
              placeholder="Task name"
              style={{ flex: 1, minWidth: 200, padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
            />
            <input
              type="date"
              value={newTaskDates[project.id]?.due || ""}
              onChange={(e) => setNewTaskDates(s => ({ 
                ...s, 
                [project.id]: { 
                  ...s[project.id], 
                  due: e.target.value 
                } 
              }))}
              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
            />
            <select
              value={newTaskPriority[project.id] || "Low"}
              onChange={(e) => setNewTaskPriority(s => ({ ...s, [project.id]: e.target.value }))}
              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
            >
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button
              onClick={() => addTask(project.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "#10b981",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Add
            </button>
            <button
              onClick={() => setAddingTaskFor(null)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "#6b7280",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tasks Section */}
      {project.expanded && (
        <div
          style={{
            marginTop: 12,
            paddingLeft: 28,
            borderTop: "1px solid #f3f4f6",
            paddingTop: 12,
          }}
        >
          {project.tasks.length > 0 ? (
            project.tasks.map((t) => renderTask(t, project.id))
          ) : (
            <div
              style={{
                color: "#6b7280",
                fontSize: 14,
                fontStyle: "italic",
                padding: "4px 0",
              }}
            >
              No tasks yet. Add one!
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTask = (task, projectId) => (
    <div
      key={task.id}
      style={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr 150px",
        alignItems: "center",
        padding: "8px 12px",
        borderBottom: "1px solid #e5e7eb",
        borderRadius: 6,
        background: "#f9fafb",
        marginBottom: 4,
      }}
    >
      {/* Task Name */}
      <div style={{ fontWeight: 500 }}>{task.name}</div>

      {/* Priority */}
      <div
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: 6,
          background: priorityColors[task.priority] || "#9ca3af",
          color: "#fff",
          textAlign: "center",
          fontSize: 12,
        }}
      >
        {task.priority}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6 }}>
        {task.subtasks.length > 0 && (
          <button
            onClick={() => updateTask(projectId, task.id, { expanded: !task.expanded })}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "none",
              background: "#4f46e5",
              color: "#fff",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {task.expanded ? "Collapse" : "Expand"}
          </button>
        )}
        <button
          onClick={() => deleteTask(projectId, task.id)}
          style={{
            padding: "4px 8px",
            borderRadius: 4,
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Delete
        </button>
      </div>

      {/* Nested Subtasks */}
      {task.expanded && (
        <div
          style={{
            gridColumn: "1 / -1",
            marginTop: 8,
            paddingLeft: 20,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {task.subtasks.length > 0 ? (
            task.subtasks.map((st) => (
              <div
                key={st.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "3fr 1fr 150px",
                  alignItems: "center",
                  padding: "6px 8px",
                  borderRadius: 4,
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div>{st.name}</div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: priorityColors[st.priority] || "#9ca3af",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: 12,
                  }}
                >
                  {st.priority}
                </div>
                <div>
                  <button
                    onClick={() => deleteTask(projectId, st.id, task.id)}
                    style={{
                      padding: "2px 6px",
                      borderRadius: 4,
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#6b7280", fontSize: 12, fontStyle: "italic" }}>
              No subtasks
            </div>
          )}

          {/* Add New Subtask */}
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            <input
              value={newSubtaskNames[task.id] || ""}
              onChange={(e) =>
                setNewSubtaskNames((s) => ({ ...s, [task.id]: e.target.value }))
              }
              placeholder="New subtask"
              style={{ flex: 1, padding: "4px 8px", borderRadius: 4, border: "1px solid #d1d5db" }}
            />
            <input
              type="date"
              value={newSubtaskDates[task.id]?.due || ""}
              onChange={(e) => setNewSubtaskDates(s => ({ 
                ...s, 
                [task.id]: { 
                  ...s[task.id], 
                  due: e.target.value 
                } 
              }))}
              style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #d1d5db" }}
            />
            <button
              onClick={() => addSubtask(projectId, task.id)}
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                border: "none",
                background: "#4f46e5",
                color: "#fff",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, Roboto, Arial, sans-serif", background: "#f8fafc", padding: 16 }}>
      <div style={{ margin: "0 auto", background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 20 }}>Task & Event Management</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button 
              onClick={() => setView(0)} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 6, 
                padding: "8px 16px", 
                cursor: "pointer", 
                background: view === 0 ? "#4f46e5" : "transparent", 
                color: view === 0 ? "#fff" : "#374151",
                border: view === 0 ? "none" : "1px solid #d1d5db",
                borderRadius: 6 
              }}
            >
              <ListIcon size={16} /> List
            </button>
            <button 
              onClick={() => setView(1)} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 6, 
                padding: "8px 16px", 
                cursor: "pointer", 
                background: view === 1 ? "#4f46e5" : "transparent", 
                color: view === 1 ? "#fff" : "#374151",
                border: view === 1 ? "none" : "1px solid #d1d5db",
                borderRadius: 6 
              }}
            >
              <CalendarIcon size={16} /> Calendar
            </button>
            <select 
              value={filterPriority} 
              onChange={e => setFilterPriority(e.target.value)} 
              style={{ 
                padding: "8px 12px", 
                borderRadius: 6, 
                border: "1px solid #d1d5db",
                background: "#fff"
              }}
            >
              <option value="All">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button 
              onClick={() => setAddingTop(true)} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 6,
                padding: "8px 16px", 
                cursor: "pointer", 
                background: "#4f46e5", 
                color: "#fff", 
                border: "none", 
                borderRadius: 6,
                fontWeight: 500
              }}
            >
              <Plus size={16} /> Add Project/Event
            </button>
          </div>
        </div>

        {/* List View */}
        {view === 0 && (
          <div>
            {projects.length > 0 ? (
              projects.map(p => renderProject(p))
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
                No projects yet. Click "Add Project/Event" to create your first project.
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === 1 && (
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontWeight: 600, marginBottom: 16, fontSize: 18, gap: 16 }}>
              <button 
                onClick={() => changeMonth(-1)} 
                style={{ 
                  border: "none", 
                  background: "transparent", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 8,
                  borderRadius: 6
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <ChevronLeft size={20} />
              </button>
              {monthNames[currentMonth]} {currentYear}
              <button 
                onClick={() => changeMonth(1)} 
                style={{ 
                  border: "none", 
                  background: "transparent", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 8,
                  borderRadius: 6
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <ArrowRight size={20} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(100px, 1fr))", gap: 4 }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} style={{ fontWeight: 700, textAlign: "center", padding: 8, background: "#f8fafc", borderRadius: 4 }}>{day}</div>
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
                      minHeight: 100, 
                      border: "1px solid #e5e7eb", 
                      borderRadius: 6, 
                      padding: 8, 
                      background: isToday ? "#fffbeb" : (dayTasks.length || dayEvents.length ? "#f0f9ff" : "#fff"),
                      position: "relative"
                    }}
                  >
                    {day && (
                      <div style={{ 
                        fontWeight: 600, 
                        marginBottom: 4,
                        color: isToday ? "#d97706" : "#111827"
                      }}>
                        {day}
                      </div>
                    )}
                    {dayTasks.map(item => (
                      <div 
                        key={item.id} 
                        style={{ 
                          fontSize: 11, 
                          marginTop: 2, 
                          padding: "2px 6px", 
                          borderRadius: 4, 
                          background: priorityColors[item.priority], 
                          color: "#fff", 
                          whiteSpace: "nowrap", 
                          overflow: "hidden", 
                          textOverflow: "ellipsis",
                          cursor: "default"
                        }}
                        title={item.name}
                      >
                        {item.name}
                      </div>
                    ))}
                    {dayEvents.map(e => (
                      <div 
                        key={e.id} 
                        style={{ 
                          fontSize: 11, 
                          marginTop: 2, 
                          padding: "2px 6px", 
                          borderRadius: 4, 
                          background: eventColors[e.type], 
                          color: "#fff", 
                          whiteSpace: "nowrap", 
                          overflow: "hidden", 
                          textOverflow: "ellipsis",
                          cursor: "default"
                        }}
                        title={e.name}
                      >
                        {e.name} ({e.type})
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Project/Event Modal */}
        {addingTop && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#00000066",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
          }}>
            <div style={{ 
              background: "#fff", 
              borderRadius: 12, 
              padding: 24, 
              width: "90%", 
              maxWidth: 600, 
              maxHeight: "90vh", 
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
            }}>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>
                {["Task", "Event"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setToggleMode(tab.toLowerCase())}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      border: "none",
                      borderBottom: toggleMode === tab.toLowerCase() ? "3px solid #4f46e5" : "3px solid transparent",
                      background: "transparent",
                      fontWeight: toggleMode === tab.toLowerCase() ? "600" : "400",
                      cursor: "pointer",
                      color: toggleMode === tab.toLowerCase() ? "#4f46e5" : "#6b7280",
                      fontSize: 16
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Task Form */}
              {toggleMode === "task" && (
                <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#374151" }}>
                      Project Title
                    </label>
                    <input
                      ref={inputRef}
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
                      placeholder="Enter project title"
                      style={{ 
                        padding: "10px 12px", 
                        borderRadius: 8, 
                        border: "1px solid #d1d5db", 
                        width: "100%", 
                        fontSize: 16,
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = "#4f46e5"}
                      onBlur={e => e.target.style.borderColor = "#d1d5db"}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#374151" }}>
                      Description
                    </label>
                    <textarea
                      value={newProjectDescription}
                      onChange={e => setNewProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      style={{ 
                        padding: "10px 12px", 
                        borderRadius: 8, 
                        border: "1px solid #d1d5db", 
                        width: "100%", 
                        minHeight: 80, 
                        fontSize: 16,
                        outline: "none",
                        transition: "border-color 0.2s",
                        resize: "vertical"
                      }}
                      onFocus={e => e.target.style.borderColor = "#4f46e5"}
                      onBlur={e => e.target.style.borderColor = "#d1d5db"}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 200px" }}>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#374151" }}>
                        Assignee
                      </label>
                      <input
                        value={newProjectAssignee}
                        onChange={e => setNewProjectAssignee(e.target.value)}
                        placeholder="Assignee name"
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          width: "100%",
                          fontSize: 16,
                          outline: "none",
                          transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#4f46e5"}
                        onBlur={e => e.target.style.borderColor = "#d1d5db"}
                      />
                    </div>

                    <div style={{ flex: "1 1 200px" }}>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#374151" }}>
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newProjectDue}
                        onChange={e => setNewProjectDue(e.target.value)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          width: "100%",
                          fontSize: 16,
                          outline: "none",
                          transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#4f46e5"}
                        onBlur={e => e.target.style.borderColor = "#d1d5db"}
                      />
                    </div>

                    <div style={{ flex: "1 1 150px" }}>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#374151" }}>
                        Priority
                      </label>
                      <select
                        value={newProjectPriority}
                        onChange={e => setNewProjectPriority(e.target.value)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          width: "100%",
                          appearance: "none",
                          background: `#fff url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%234f46e5" d="M2 0L0 2h4L2 0zM2 5L0 3h4l-2 2z"/></svg>') no-repeat right 12px center`,
                          backgroundSize: "10px",
                          cursor: "pointer",
                          fontSize: 16,
                          outline: "none",
                          transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#4f46e5"}
                        onBlur={e => e.target.style.borderColor = "#d1d5db"}
                      >
                        {priorities.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button
                      onClick={addProject}
                      style={{ 
                        padding: "10px 20px", 
                        background: "#4f46e5", 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: 8, 
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: 16,
                        flex: 1
                      }}
                    >
                      Create Project
                    </button>
                    <button 
                      onClick={() => setAddingTop(false)} 
                      style={{ 
                        padding: "10px 20px", 
                        background: "#f3f4f6", 
                        color: "#374151",
                        border: "none", 
                        borderRadius: 8, 
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: 16,
                        flex: 1
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Event Form */}
              {toggleMode === "event" && (
                <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#374151" }}>
                      Event Name
                    </label>
                    <input
                      value={newEventName}
                      onChange={e => setNewEventName(e.target.value)}
                      placeholder="Enter event name"
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #d1d5db",
                        width: "100%",
                        fontSize: 16,
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = "#4f46e5"}
                      onBlur={e => e.target.style.borderColor = "#d1d5db"}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 250px" }}>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#374151" }}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={newEventDate}
                        onChange={e => setNewEventDate(e.target.value)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          width: "100%",
                          fontSize: 16,
                          outline: "none",
                          transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#4f46e5"}
                        onBlur={e => e.target.style.borderColor = "#d1d5db"}
                      />
                    </div>

                    <div style={{ flex: "1 1 200px" }}>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#374151" }}>
                        Event Type
                      </label>
                      <select
                        value={newEventType}
                        onChange={e => setNewEventType(e.target.value)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          width: "100%",
                          appearance: "none",
                          background: `#fff url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%234f46e5" d="M2 0L0 2h4L2 0zM2 5L0 3h4l-2 2z"/></svg>') no-repeat right 12px center`,
                          backgroundSize: "10px",
                          cursor: "pointer",
                          fontSize: 16,
                          outline: "none",
                          transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#4f46e5"}
                        onBlur={e => e.target.style.borderColor = "#d1d5db"}
                      >
                        <option value="Meeting">Meeting</option>
                        <option value="Event">Event</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button
                      onClick={addEvent}
                      style={{ 
                        padding: "10px 20px", 
                        background: "#4f46e5", 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: 8, 
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: 16,
                        flex: 1
                      }}
                    >
                      Create Event
                    </button>
                    <button 
                      onClick={() => setAddingTop(false)} 
                      style={{ 
                        padding: "10px 20px", 
                        background: "#f3f4f6", 
                        color: "#374151",
                        border: "none", 
                        borderRadius: 8, 
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: 16,
                        flex: 1
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}