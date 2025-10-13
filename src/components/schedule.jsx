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
  ChevronRight as ArrowRight,
  Menu,
} from "lucide-react";

// ✅ MISSING VARIABLES - Itha ADD PANNUNGA
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const priorityColors = {
  High: "#ef4444",
  Medium: "#f59e0b", 
  Low: "#10b981"
};

const priorities = ["High", "Medium", "Low"];

const eventColors = {
  Meeting: "#8b5cf6",
  Event: "#06b6d4"
};

export default function CourseDashboardEnhanced() {
  // State declarations
  const [projects, setProjects] = useState([]);
  // ... rest of your existing code (ONGA ORIGINAL CODE)
  const [creatingProject, setCreatingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(0);
  const [addingTop, setAddingTop] = useState(false);
  const [addingEvent, setAddingEvent] = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(null);
  const [newName, setNewName] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newDue, setNewDue] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newStatus, setNewStatus] = useState("Pending");
  const [newPriority, setNewPriority] = useState("Low");
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventType, setNewEventType] = useState("Meeting");
  const [editing, setEditing] = useState({});
  const [filterPriority, setFilterPriority] = useState("All");
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [newSubtaskStart, setNewSubtaskStart] = useState("");
  const [newSubtaskDue, setNewSubtaskDue] = useState("");
  const [newSubtaskAssignee, setNewSubtaskAssignee] = useState("");
  const [newSubtaskStatus, setNewSubtaskStatus] = useState("Pending");
  const [newSubtaskPriority, setNewSubtaskPriority] = useState("Low");
  const [newSubtaskFile, setNewSubtaskFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedProject, setSelectedProject] = useState("all");
  const [assignees, setAssignees] = useState([
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Wilson",
    "Charlie Brown",
    "Diana Prince",
    "Eve Davis",
    "Frank Miller",
    "Grace Lee",
    "Henry Green"
  ]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const assigneeRef = useRef(null);
  const inputRef = useRef(null);
  const projectInputRef = useRef(null);
  const subtaskNameRef = useRef(null);

  useEffect(() => {
    if (addingTop && inputRef.current) inputRef.current.focus();
    if (creatingProject && projectInputRef.current) projectInputRef.current.focus();
    if (addingSubtask && subtaskNameRef.current) subtaskNameRef.current.focus();
  }, [addingTop, creatingProject, addingSubtask]);

  // Handle assignee dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (assigneeRef.current && !assigneeRef.current.contains(event.target)) {
        setShowAssigneeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter assignees based on search
  const filteredAssignees = assignees.filter((assignee) =>
    assignee.toLowerCase().includes(assigneeSearch.toLowerCase())
  );

  const handleAssigneeSelect = (selectedAssignee) => {
    setNewAssignee(selectedAssignee);
    setAssigneeSearch("");
    setShowAssigneeDropdown(false);
  };

  const handleSubtaskAssigneeSelect = (selectedAssignee) => {
    setNewSubtaskAssignee(selectedAssignee);
    setAssigneeSearch("");
    setShowAssigneeDropdown(false);
  };

  // Project CRUD
  const createProject = (name) => {
    if (!name || !name.trim()) return;
    const p = { id: uid(), name: name.trim(), expanded: true };
    setProjects((s) => [...s, p]);
    setNewProjectName("");
    setSelectedProject(p.id);
    setCreatingProject(true);
    setTimeout(() => projectInputRef.current?.focus(), 0);
  };

  const updateProject = (projectId, patch) =>
    setProjects((s) => s.map((p) => (p.id === projectId ? { ...p, ...patch } : p)));

  const deleteProject = (projectId) => {
    setTasks((s) =>
      s.map((t) => (t.projectId === projectId ? { ...t, projectId: null } : t))
    );
    setEvents((s) =>
      s.map((e) => (e.projectId === projectId ? { ...e, projectId: null } : e))
    );
    setProjects((s) => s.filter((p) => p.id !== projectId));
    if (selectedProject === projectId) setSelectedProject("all");
  };

  // Task CRUD
  const addTask = (parentId = null, projectId = null) => {
    const name = parentId || projectId ? newSubtaskName : newName;
    if (!name.trim()) return;
    const t = {
      id: uid(),
      name: name.trim(),
      assignee: parentId || projectId ? newSubtaskAssignee || "" : newAssignee || "",
      start: parentId || projectId ? newSubtaskStart || "" : newStart,
      due: parentId || projectId ? newSubtaskDue || "" : newDue,
      status: parentId || projectId ? newSubtaskStatus : newStatus,
      priority: parentId || projectId ? newSubtaskPriority : newPriority,
      expanded: false,
      subtasks: [],
      projectId:
        projectId ||
        (selectedProject === "all"
          ? null
          : selectedProject === "unassigned"
          ? null
          : selectedProject),
      file: parentId || projectId ? newSubtaskFile : newFile,
    };
    if (parentId === null && projectId === null) {
      setTasks((s) => [t, ...s]);
      setNewName("");
      setNewStart("");
      setNewDue("");
      setNewAssignee("");
      setNewStatus("Pending");
      setNewPriority("Low");
      setNewFile(null);
      setAddingTop(false);
    } else if (parentId) {
      setTasks((s) =>
        s.map((x) =>
          x.id === parentId ? { ...x, subtasks: [t, ...x.subtasks] } : x
        )
      );
      setNewSubtaskName("");
      setNewSubtaskStart("");
      setNewSubtaskDue("");
      setNewSubtaskAssignee("");
      setNewSubtaskStatus("Pending");
      setNewSubtaskPriority("Low");
      setNewSubtaskFile(null);
      setAddingSubtask(null);
    } else if (projectId) {
      setTasks((s) => [t, ...s]);
      setNewSubtaskName("");
      setNewSubtaskStart("");
      setNewSubtaskDue("");
      setNewSubtaskAssignee("");
      setNewSubtaskStatus("Pending");
      setNewSubtaskPriority("Low");
      setNewSubtaskFile(null);
      setAddingSubtask(null);
    }
  };

  const addEvent = () => {
    if (!newEventName.trim() || !newEventDate) return;
    setEvents((s) => [
      ...s,
      {
        id: uid(),
        name: newEventName.trim(),
        date: newEventDate,
        type: newEventType,
        projectId:
          selectedProject === "all"
            ? null
            : selectedProject === "unassigned"
            ? null
            : selectedProject,
      },
    ]);
    setNewEventName("");
    setNewEventDate("");
    setAddingEvent(false);
  };

  const updateTask = (taskId, patch, parentId = null) => {
    setTasks((s) =>
      s.map((t) => {
        if (parentId === null && t.id === taskId) return { ...t, ...patch };
        if (parentId && t.id === parentId)
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === taskId ? { ...st, ...patch } : st
            ),
          };
        return t;
      })
    );
  };

  const deleteTask = (taskId, parentId = null) => {
    if (!parentId) setTasks((s) => s.filter((t) => t.id !== taskId));
    else
      setTasks((s) =>
        s.map((t) =>
          t.id === parentId
            ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== taskId) }
            : t
        )
      );
  };

  const toggleExpand = (id) =>
    setTasks((s) =>
      s.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t))
    );

  const tasksFilteredByPriority = (inputTasks) =>
    inputTasks.filter((t) => filterPriority === "All" || t.priority === filterPriority);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const calendar = [];
  for (let i = 0; i < firstDay; i++) calendar.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendar.push(d);

  const tasksByDay = {};
  tasksFilteredByPriority(tasks).forEach((t) => {
    const allTasks = [t, ...t.subtasks];
    allTasks.forEach((task) => {
      if (selectedProject !== "all") {
        const wantUnassigned = selectedProject === "unassigned";
        const matches =
          (wantUnassigned && !task.projectId) ||
          (!wantUnassigned && task.projectId === selectedProject);
        if (!matches) return;
      }
      if (!task.due) return;
      const dueDateStr = task.due;
      tasksByDay[dueDateStr] = tasksByDay[dueDateStr] || [];
      tasksByDay[dueDateStr].push({ ...task, parentId: t.id });
    });
  });

  const eventsByDay = {};
  events.forEach((e) => {
    if (selectedProject !== "all") {
      const wantUnassigned = selectedProject === "unassigned";
      const matches =
        (wantUnassigned && !e.projectId) ||
        (!wantUnassigned && e.projectId === selectedProject);
      if (!matches) return;
    }
    if (!e.date) return;
    eventsByDay[e.date] = eventsByDay[e.date] || [];
    eventsByDay[e.date].push(e);
  });

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getProjectName = (pid) => projects.find((p) => p.id === pid)?.name || "No Project";

  const renderTaskTable = (task, parentId = null, level = 0) => (
    <table
      key={task.id}
      style={{
        width: "100%",
        border: "1px solid #f0f0f2",
        borderRadius: "0.5rem",
        marginBottom: "0.5rem",
        background: priorityColors[task.priority] + "20",
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #f0f0f2" }}>
            {task.subtasks.length > 0 && (
              <button
                onClick={() => toggleExpand(task.id)}
                style={{ padding: "0.375rem", cursor: "pointer", background: "transparent", border: "none" }}
              >
                {task.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            {editing[task.id] ? (
              <input
                style={{
                  padding: "0.375rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e6e9ef",
                  width: "100%",
                }}
                value={task.name}
                onChange={(e) => updateTask(task.id, { name: e.target.value }, parentId)}
                onBlur={() => setEditing((s) => ({ ...s, [task.id]: false }))}
                autoFocus
              />
            ) : (
              <div
                onDoubleClick={() => setEditing((s) => ({ ...s, [task.id]: true }))}
                style={{ fontWeight: 600 }}
              >
                {task.name}
              </div>
            )}
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #f0f0f2" }}>
            <div ref={assigneeRef} style={{ position: "relative" }}>
              <input
                style={{ 
                  padding: "0.375rem", 
                  borderRadius: "0.5rem", 
                  border: "1px solid #e6e9ef", 
                  width: "100%" 
                }}
                value={task.assignee}
                onChange={(e) => {
                  updateTask(task.id, { assignee: e.target.value }, parentId);
                  setAssigneeSearch(e.target.value);
                  setShowAssigneeDropdown(true);
                }}
                placeholder="Assignee"
                onFocus={() => setShowAssigneeDropdown(true)}
              />
              {showAssigneeDropdown && filteredAssignees.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #e6e9ef",
                    borderRadius: "0.5rem",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredAssignees.map((assignee) => (
                    <div
                      key={assignee}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f2",
                      }}
                      onClick={() => updateTask(task.id, { assignee }, parentId)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f4ff"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#fff"}
                    >
                      {assignee}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #f0f0f2" }}>
            <input
              type="date"
              style={{ padding: "0.375rem", borderRadius: "0.5rem", border: "1px solid #e6e9ef", width: "100%" }}
              value={task.start}
              onChange={(e) => updateTask(task.id, { start: e.target.value }, parentId)}
            />
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #f0f0f2" }}>
            <input
              type="date"
              style={{ padding: "0.375rem", borderRadius: "0.5rem", border: "1px solid #e6e9ef", width: "100%" }}
              value={task.due}
              onChange={(e) => updateTask(task.id, { due: e.target.value }, parentId)}
            />
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #f0f0f2" }}>
            <select
              style={{ padding: "0.375rem", borderRadius: "0.5rem", border: "1px solid #e6e9ef", width: "100%" }}
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value }, parentId)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #f0f0f2" }}>
            <select
              style={{ padding: "0.375rem", borderRadius: "0.5rem", border: "1px solid #e6e9ef", width: "100%" }}
              value={task.priority}
              onChange={(e) => updateTask(task.id, { priority: e.target.value }, parentId)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #f0f0f2" }}>
            <input
              type="file"
              onChange={(e) => updateTask(task.id, { file: e.target.files[0] }, parentId)}
            />
            {task.file && <span style={{ fontSize: "0.75rem" }}>{task.file.name}</span>}
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #f0f0f2" }}>
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.25rem" }}>
              <button
                onClick={() => setEditing((s) => ({ ...s, [task.id]: !s[task.id] }))}
                style={{ padding: "0.375rem", border: "none", background: "#e5e7eb", borderRadius: "0.25rem", cursor: "pointer" }}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => deleteTask(task.id, parentId)}
                style={{ padding: "0.375rem", border: "none", background: "#ef4444", color: "#fff", borderRadius: "0.25rem", cursor: "pointer" }}
              >
                <Trash2 size={14} />
              </button>
              {level === 0 && ( // Only allow subtasks for top-level tasks
                <button
                  onClick={() => setAddingSubtask(task.id)}
                  style={{ padding: "0.375rem", border: "none", background: "#22c55e", color: "#fff", borderRadius: "0.25rem", cursor: "pointer" }}
                >
                  <Plus size={14} /> Add Subtask
                </button>
              )}
            </div>
          </td>
        </tr>
        {task.expanded && task.subtasks.map((st) => renderTaskTable(st, task.id, level + 1))}
      </tbody>
    </table>
  );

  const Dialog = ({ visible, onClose, title, children }) => {
    if (!visible) return null;
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#00000066",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            maxWidth: "400px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: "1rem",
              fontSize: "1.125rem",
              textAlign: "center",
            }}
          >
            {title}
          </div>
          {children}
          <button
            onClick={onClose}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#e5e7eb",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Inter, Roboto, Arial, sans-serif",
        padding: "0.75rem",
        position: "relative",
      }}
    >
      <style>
        {`
          @media (max-width: 768px) {
            .header-controls { display: none; }
            .hamburger-btn {
              display: block;
              padding: 0.375rem;
              background: transparent;
              border: none;
              cursor: "pointer";
              z-index: 1001;
            }
            .sidebar {
              position: fixed;
              top: 0;
              left: 0;
              width: 250px;
              height: 100%;
              background: #fff;
              padding: 0.75rem;
              transform: translateX(-100%);
              transition: transform 0.3s ease-in-out;
              z-index: 1000;
              box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
            }
            .sidebar.open { transform: translateX(0); }
            .sidebar-overlay { display: none; }
            .sidebar.open + .sidebar-overlay {
              display: block;
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              z-index: 999;
            }
            .content { margin-left: 0; }
          }
          @media (min-width: 769px) {
            .hamburger-btn { display: none; }
            .sidebar { display: none; }
            .sidebar-overlay { display: none; }
            .header-controls {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              align-items: center;
              gap: "0.75rem";
              margin-bottom: "0.75rem";
            }
            .content { margin-left: 0; }
          }
        `}
      </style>
      <div
        className="hamburger-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ display: sidebarOpen ? "none" : "block", cursor: "pointer", zIndex: 1001 }}
      >
        <Menu size={24} />
      </div>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`} style={{ display: sidebarOpen ? "block" : "none" }}>
        <div
          className="header-controls"
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <div
            onClick={() => { setView(0); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem 0.75rem",
              cursor: "pointer",
              background: view === 0 ? "#e0e7ff" : "transparent",
              borderRadius: "0.25rem",
            }}
          >
            <ListIcon size={16} /> List
          </div>
          <div
            onClick={() => { setView(1); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem 0.75rem",
              cursor: "pointer",
              background: view === 1 ? "#e0e7ff" : "transparent",
              borderRadius: "0.25rem",
            }}
          >
            <CalendarIcon size={16} /> Calendar
          </div>
          <select
            value={selectedProject}
            onChange={(e) => { setSelectedProject(e.target.value); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem",
              borderRadius: "0.25rem",
              border: "1px solid #e6e9ef",
              fontSize: "0.875rem",
              width: "100%",
            }}
          >
            <option value="all">All Projects</option>
            <option value="unassigned">Unassigned</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => { setFilterPriority(e.target.value); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem",
              borderRadius: "0.25rem",
              border: "1px solid #e6e9ef",
              fontSize: "0.875rem",
              width: "100%",
            }}
          >
            <option>All</option>
            {priorities.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <button
            onClick={() => { setCreatingProject(true); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem 0.75rem",
              cursor: "pointer",
              background: "#06b6d4",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              width: "100%",
            }}
          >
            <Plus size={14} /> Create Project
          </button>
          <button
            onClick={() => { setAddingTop(true); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem 0.75rem",
              cursor: "pointer",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              width: "100%",
            }}
          >
            <Plus size={14} /> Add Task/Remainder
          </button>
        </div>
      </div>
      <div
        className="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
        style={{ display: sidebarOpen ? "block" : "none" }}
      ></div>
      <div
        style={{
          margin: "0 auto",
          background: "#fff",
          borderRadius: "0.5rem",
          padding: "0.75rem",
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <div
          className="header-controls"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: "1.125rem" }}>
            Task & Event Management
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div
              onClick={() => setView(0)}
              style={{
                padding: "0.375rem 0.75rem",
                cursor: "pointer",
                background: view === 0 ? "#e0e7ff" : "transparent",
                borderRadius: "0.25rem",
              }}
            >
              <ListIcon size={16} /> List
            </div>
            <div
              onClick={() => setView(1)}
              style={{
                padding: "0.375rem 0.75rem",
                cursor: "pointer",
                background: view === 1 ? "#e0e7ff" : "transparent",
                borderRadius: "0.25rem",
              }}
            >
              <CalendarIcon size={16} /> Calendar
            </div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                padding: "0.375rem",
                borderRadius: "0.25rem",
                border: "1px solid #e6e9ef",
                fontSize: "0.875rem",
              }}
            >
              <option value="all">All Projects</option>
              <option value="unassigned">Unassigned</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                padding: "0.375rem",
                borderRadius: "0.25rem",
                border: "1px solid #e6e9ef",
                fontSize: "0.875rem",
              }}
            >
              <option>All</option>
              {priorities.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={() => setCreatingProject(true)}
              style={{
                padding: "0.375rem 0.75rem",
                cursor: "pointer",
                background: "#06b6d4",
                color: "#fff",
                border: "none",
                borderRadius: "0.25rem",
              }}
            >
              <Plus size={14} /> Create Project
            </button>
            <button
              onClick={() => setAddingTop(true)}
              style={{
                padding: "0.375rem 0.75rem",
                cursor: "pointer",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "0.25rem",
              }}
            >
              <Plus size={14} /> Add Task/Remainder
            </button>
          </div>
        </div>

        {/* List View */}
        {view === 0 && (
          <div style={{ overflowX: "auto" }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "#f8fafc",
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                  }}
                >
                  <button
                    onClick={() => updateProject(proj.id, { expanded: !proj.expanded })}
                    style={{ border: "none", background: "transparent", cursor: "pointer" }}
                  >
                    {proj.expanded ? <ChevronDown /> : <ChevronRight />}
                  </button>
                  <div style={{ fontWeight: 700 }}>{proj.name}</div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "0.25rem" }}>
                    <button
                      onClick={() => setAddingSubtask(proj.id)}
                      style={{
                        padding: "0.375rem",
                        border: "none",
                        background: "#22c55e",
                        color: "#fff",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                      }}
                    >
                      <Plus size={14} /> Add Subtask
                    </button>
                    <button
                      onClick={() => {
                        setEditingProjectId(proj.id);
                        setNewProjectName(proj.name);
                        setCreatingProject(true);
                      }}
                      style={{
                        padding: "0.375rem",
                        border: "none",
                        background: "#e5e7eb",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      style={{
                        padding: "0.375rem",
                        border: "none",
                        background: "#ef4444",
                        color: "#fff",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {proj.expanded &&
                  tasksFilteredByPriority(tasks)
                    .filter((t) => t.projectId === proj.id)
                    .map((t) => renderTaskTable(t))}
              </div>
            ))}
            <div style={{ marginTop: "0.75rem" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.375rem" }}>
                Unassigned / No Project
              </div>
              {tasksFilteredByPriority(tasks)
                .filter((t) => !t.projectId)
                .map((t) => renderTaskTable(t))}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {view === 1 && (
          <div style={{ overflowX: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 600,
                marginBottom: "0.375rem",
                fontSize: "1rem",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={() => changeMonth(-1)}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                <ChevronLeft />
              </button>
              {monthNames[currentMonth]} {currentYear}
              <button
                onClick={() => changeMonth(1)}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                <ArrowRight />
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(4rem, 1fr))",
                gap: "0.25rem",
              }}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  style={{
                    fontWeight: 700,
                    textAlign: "center",
                    padding: "0.25rem",
                    fontSize: "0.875rem",
                  }}
                >
                  {day}
                </div>
              ))}
              {calendar.map((day, idx) => {
                const dateStr =
                  day && new Date(currentYear, currentMonth, day).toISOString().split("T")[0];
                const dayTasks = dateStr ? tasksByDay[dateStr] || [] : [];
                const dayEvents = dateStr ? eventsByDay[dateStr] || [] : [];
                const isToday = day && dateStr === new Date().toISOString().split("T")[0];
                return (
                  <div
                    key={idx}
                    style={{
                      minHeight: "3.75rem",
                      border: "1px solid #e9e9ec",
                      borderRadius: "0.25rem",
                      padding: "0.125rem",
                      background: isToday ? "#fffbeb" : dayTasks.length || dayEvents.length ? "#f0f4ff" : "#fff",
                    }}
                  >
                    {day && (
                      <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{day}</div>
                    )}
                    {dayTasks.map((t) => (
                      <div
                        key={t.id + "-task"}
                        style={{
                          fontSize: "0.75rem",
                          marginTop: "0.125rem",
                          padding: "0.125rem 0.25rem",
                          borderRadius: "0.25rem",
                          background: priorityColors[t.priority],
                          color: "#fff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                        }}
                        onDoubleClick={() => setEditing((s) => ({ ...s, [t.id]: true }))}
                      >
                        {editing[t.id] ? (
                          <input
                            value={t.name}
                            onChange={(e) => updateTask(t.id, { name: e.target.value }, t.parentId)}
                            onBlur={() => setEditing((s) => ({ ...s, [t.id]: false }))}
                            style={{
                              width: "100%",
                              fontSize: "0.75rem",
                              border: "none",
                              borderRadius: "0.125rem",
                            }}
                          />
                        ) : (
                          t.name
                        )}
                      </div>
                    ))}
                    {dayEvents.map((e) => (
                      <div
                        key={e.id + "-event"}
                        style={{
                          fontSize: "0.75rem",
                          marginTop: "0.125rem",
                          padding: "0.125rem 0.25rem",
                          borderRadius: "0.25rem",
                          background: eventColors[e.type],
                          color: "#fff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "default",
                        }}
                      >
                        {e.name} ({e.type})
                        {e.projectId ? ` - ${getProjectName(e.projectId)}` : ""}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Task Dialog */}
        <Dialog
          visible={addingTop}
          onClose={() => {
            setAddingTop(false);
            setNewFile(null);
            setNewAssignee("");
            setAssigneeSearch("");
            setShowAssigneeDropdown(false);
          }}
          title="Add New Task"
        >
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Task Name</label>
            <input
              ref={inputRef}
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              placeholder="Task name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") addTask();
                if (e.repeat) e.preventDefault();
              }}
              maxLength={50}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Assignee</label>
            <div ref={assigneeRef} style={{ position: "relative" }}>
              <input
                style={{
                  padding: "0.375rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e6e9ef",
                  width: "100%",
                  marginBottom: "0.375rem",
                }}
                placeholder="Assignee"
                value={assigneeSearch}
                onChange={(e) => {
                  setAssigneeSearch(e.target.value);
                  setNewAssignee(e.target.value);
                  setShowAssigneeDropdown(true);
                }}
                onFocus={() => setShowAssigneeDropdown(true)}
              />
              {showAssigneeDropdown && filteredAssignees.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #e6e9ef",
                    borderRadius: "0.5rem",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredAssignees.map((assignee) => (
                    <div
                      key={assignee}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f2",
                      }}
                      onClick={() => handleAssigneeSelect(assignee)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f4ff"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#fff"}
                    >
                      {assignee}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Start Date</label>
            <input
              type="date"
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Due Date</label>
            <input
              type="date"
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Status</label>
            <select
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Priority</label>
            <select
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>File Upload</label>
            <input
              type="file"
              onChange={(e) => setNewFile(e.target.files[0])}
              style={{
                padding: "0.375rem",
                width: "100%",
                marginBottom: "0.375rem",
              }}
            />
            {newFile && <span style={{ fontSize: "0.75rem" }}>{newFile.name}</span>}
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Assign to Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
              }}
            >
              <option value="all">All Projects (unassigned)</option>
              <option value="unassigned">Unassigned</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button
            style={{
              padding: "0.375rem 0.75rem",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              width: "100%",
            }}
            onClick={() => addTask()}
          >
            Add Task
          </button>
          <hr style={{ margin: "0.75rem 0" }} />
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Event Name</label>
            <textarea
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
                minHeight: "4rem",
                resize: "vertical",
              }}
              placeholder="Event name"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addEvent()}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Event Date</label>
            <input
              type="date"
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Event Type</label>
            <select
              value={newEventType}
              onChange={(e) => setNewEventType(e.target.value)}
              style={{
                padding: "0.375rem",
                borderRadius: "0.25rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
            >
              <option>Meeting</option>
              <option>Event</option>
            </select>
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Assign to Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
              }}
            >
              <option value="all">All Projects (unassigned)</option>
              <option value="unassigned">Unassigned</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button
            style={{
              padding: "0.375rem 0.75rem",
              background: "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              width: "100%",
            }}
            onClick={addEvent}
          >
            Add Event
          </button>
        </Dialog>

        {/* Subtask Dialog */}
        <Dialog
          visible={!!addingSubtask}
          onClose={() => {
            setAddingSubtask(null);
            setNewSubtaskName("");
            setNewSubtaskStart("");
            setNewSubtaskDue("");
            setNewSubtaskAssignee("");
            setAssigneeSearch("");
            setShowAssigneeDropdown(false);
            setNewSubtaskStatus("Pending");
            setNewSubtaskPriority("Low");
            setNewSubtaskFile(null);
          }}
          title="Add New Subtask"
        >
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Subtask Name</label>
            <input
              ref={subtaskNameRef}
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              placeholder="Subtask name"
              value={newSubtaskName}
              onChange={(e) => setNewSubtaskName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const isProject = projects.some((p) => p.id === addingSubtask);
                  addTask(isProject ? null : addingSubtask, isProject ? addingSubtask : null);
                }
                if (e.repeat) e.preventDefault();
              }}
              maxLength={50}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Assignee</label>
            <div ref={assigneeRef} style={{ position: "relative" }}>
              <input
                style={{
                  padding: "0.375rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e6e9ef",
                  width: "100%",
                  marginBottom: "0.375rem",
                }}
                placeholder="Assignee"
                value={assigneeSearch}
                onChange={(e) => {
                  setAssigneeSearch(e.target.value);
                  setNewSubtaskAssignee(e.target.value);
                  setShowAssigneeDropdown(true);
                }}
                onFocus={() => setShowAssigneeDropdown(true)}
              />
              {showAssigneeDropdown && filteredAssignees.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #e6e9ef",
                    borderRadius: "0.5rem",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredAssignees.map((assignee) => (
                    <div
                      key={assignee}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f2",
                      }}
                      onClick={() => handleSubtaskAssigneeSelect(assignee)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f4ff"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#fff"}
                    >
                      {assignee}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Start Date</label>
            <input
              type="date"
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              value={newSubtaskStart}
              onChange={(e) => setNewSubtaskStart(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Due Date</label>
            <input
              type="date"
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              value={newSubtaskDue}
              onChange={(e) => setNewSubtaskDue(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Status</label>
            <select
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              value={newSubtaskStatus}
              onChange={(e) => setNewSubtaskStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Priority</label>
            <select
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.375rem",
              }}
              value={newSubtaskPriority}
              onChange={(e) => setNewSubtaskPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>File Upload</label>
            <input
              type="file"
              onChange={(e) => setNewSubtaskFile(e.target.files[0])}
              style={{
                padding: "0.375rem",
                width: "100%",
                marginBottom: "0.375rem",
              }}
            />
            {newSubtaskFile && <span style={{ fontSize: "0.75rem" }}>{newSubtaskFile.name}</span>}
          </div>
          <button
            style={{
              padding: "0.375rem 0.75rem",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              width: "100%",
            }}
            onClick={() => {
              const isProject = projects.some((p) => p.id === addingSubtask);
              addTask(isProject ? null : addingSubtask, isProject ? addingSubtask : null);
            }}
          >
            Add Subtask
          </button>
        </Dialog>

        {/* Project Dialog */}
        <Dialog
          visible={creatingProject}
          onClose={() => {
            setCreatingProject(false);
            setEditingProjectId(null);
            setNewProjectName("");
          }}
          title={editingProjectId ? "Edit Project" : "Create Project"}
        >
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Project Name</label>
            <input
              ref={projectInputRef}
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #e6e9ef",
                width: "100%",
                marginBottom: "0.75rem",
              }}
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newProjectName.trim()) {
                  e.preventDefault();
                  if (editingProjectId) {
                    updateProject(editingProjectId, { name: newProjectName });
                    setEditingProjectId(null);
                    setCreatingProject(false);
                  } else {
                    createProject(newProjectName);
                  }
                }
              }}
              autoFocus
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              style={{
                padding: "0.5rem 1rem",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
                flex: 1,
              }}
              onClick={() => {
                if (editingProjectId) {
                  updateProject(editingProjectId, { name: newProjectName });
                  setEditingProjectId(null);
                  setCreatingProject(false);
                } else {
                  createProject(newProjectName);
                }
              }}
              disabled={!newProjectName.trim()}
            >
              {editingProjectId ? "Save" : "Create"}
            </button>
            {editingProjectId && (
              <button
                onClick={() => {
                  deleteProject(editingProjectId);
                  setEditingProjectId(null);
                  setCreatingProject(false);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Delete
              </button>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}