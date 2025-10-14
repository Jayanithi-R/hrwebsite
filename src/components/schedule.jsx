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
  High: "#dc2626",
  Medium: "#d97706",
  Low: "#059669"
};

const eventColors = {
  Meeting: "#6366f1",
  Event: "#0891b2"
};

export default function CourseDashboardEnhanced() {
  // State declarations
  const [projects, setProjects] = useState([]);
  const [creatingProject, setCreatingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(0); // 0: List, 1: Calendar, 2: Details
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
  const [newSubtaskFile, setNewSubtaskFile] = useState([]);
  const [newFile, setNewFile] = useState([]);
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
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const assigneeRef = useRef(null);
  const inputRef = useRef(null);
  const projectInputRef = useRef(null);
  const subtaskNameRef = useRef(null);
  const eventNameRef = useRef(null);
  // Add these with your existing useState imports
const [newDescription, setNewDescription] = useState("");
const [newTags, setNewTags] = useState([]);
const [newTagInput, setNewTagInput] = useState("");
const [selectedTemplate, setSelectedTemplate] = useState("");
const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (addingTop && inputRef.current) inputRef.current.focus();
    if (creatingProject && projectInputRef.current) projectInputRef.current.focus();
    if (addingSubtask && subtaskNameRef.current) subtaskNameRef.current.focus();
    if (addingEvent && eventNameRef.current) eventNameRef.current.focus();
  }, [addingTop, creatingProject, addingSubtask, addingEvent]);

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
      setNewName(name.trim()); // Retain task name for continuous filling
      setNewStart("");
      setNewDue("");
      setNewAssignee("");
      setNewStatus("Pending");
      setNewPriority("Low");
      setNewFile([...newFile]); // Retain existing files
      setAddingTop(true); // Keep dialog open
    } else if (parentId) {
      setTasks((s) =>
        s.map((x) =>
          x.id === parentId ? { ...x, subtasks: [t, ...x.subtasks] } : x
        )
      );
      setNewSubtaskName(name.trim()); // Retain subtask name
      setNewSubtaskStart("");
      setNewSubtaskDue("");
      setNewSubtaskAssignee("");
      setNewSubtaskStatus("Pending");
      setNewSubtaskPriority("Low");
      setNewSubtaskFile([...newSubtaskFile]); // Retain existing files
      setAddingSubtask(parentId); // Keep subtask dialog open
    } else if (projectId) {
      setTasks((s) => [t, ...s]);
      setNewSubtaskName(name.trim()); // Retain subtask name
      setNewSubtaskStart("");
      setNewSubtaskDue("");
      setNewSubtaskAssignee("");
      setNewSubtaskStatus("Pending");
      setNewSubtaskPriority("Low");
      setNewSubtaskFile([...newSubtaskFile]); // Retain existing files
      setAddingSubtask(projectId); // Keep subtask dialog open
    }
  };

  const addEvent = () => {
    if (!newEventName.trim() || !newEventDate || isNaN(Date.parse(newEventDate))) return;
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
    setNewEventName(""); // Clear event name after adding
    setNewEventDate("");
    setAddingEvent(true); // Keep dialog open
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
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        marginBottom: "0.5rem",
        background: "transparent",
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center" }}>
            {task.subtasks.length > 0 && (
              <button
                onClick={() => toggleExpand(task.id)}
                style={{ padding: "0.375rem", cursor: "pointer", background: "transparent", border: "none" }}
              >
                {task.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <div
              onClick={() => { setSelectedTaskDetails(task); setView(2); }}
              style={{ fontWeight: 600, color: "#1f2937", cursor: "pointer" }}
            >
              {task.name}
            </div>
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #e5e7eb" }}>
            <div ref={assigneeRef} style={{ position: "relative" }}>
              <input
                style={{ 
                  padding: "0.375rem", 
                  borderRadius: "0.5rem", 
                  border: "1px solid #d1d5db", 
                  width: "100%",
                  background: "#fff",
                  color: "#374151",
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
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  {filteredAssignees.map((assignee) => (
                    <div
                      key={assignee}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#374151",
                      }}
                      onClick={() => updateTask(task.id, { assignee }, parentId)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#fff"}
                    >
                      {assignee}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #e5e7eb" }}>
            <input
              type="date"
              style={{ padding: "0.375rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", width: "100%", background: "#fff", color: "#374151" }}
              value={task.start}
              onChange={(e) => updateTask(task.id, { start: e.target.value }, parentId)}
            />
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #e5e7eb" }}>
            <input
              type="date"
              style={{ padding: "0.375rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", width: "100%", background: "#fff", color: "#374151" }}
              value={task.due}
              onChange={(e) => updateTask(task.id, { due: e.target.value }, parentId)}
            />
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #e5e7eb" }}>
            <select
              style={{ padding: "0.375rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", width: "100%", background: "#fff", color: "#374151" }}
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value }, parentId)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #e5e7eb" }}>
            <select
              style={{ padding: "0.375rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", width: "100%", background: "#fff", color: "#374151" }}
              value={task.priority}
              onChange={(e) => updateTask(task.id, { priority: e.target.value }, parentId)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #e5e7eb" }}>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                updateTask(task.id, { file: [...(task.file || []), ...files] }, parentId);
              }}
            />
            {task.file && task.file.length > 0 && (
              <ul style={{ fontSize: "0.75rem", color: "#374151", marginTop: "0.25rem" }}>
                {task.file.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </td>
          <td style={{ padding: "0.625rem", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.25rem" }}>
              <button
                onClick={() => setEditing((s) => ({ ...s, [task.id]: !s[task.id] }))}
                style={{ padding: "0.375rem", border: "none", background: "#e5e7eb", borderRadius: "0.25rem", cursor: "pointer", color: "#374151" }}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => deleteTask(task.id, parentId)}
                style={{ padding: "0.375rem", border: "none", background: "#ef4444", color: "#fff", borderRadius: "0.25rem", cursor: "pointer" }}
              >
                <Trash2 size={14} />
              </button>
              {level === 0 && (
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
          background: "rgba(0, 0, 0, 0.5)",
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
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            color: "#374151",
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
              color: "#374151",
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
        background: "#f9fafb",
        color: "#1f2937",
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
              color: #1f2937;
            }
            .sidebar {
              position: fixed;
              top: 0;
              left: 0;
              width: 250px;
              height: 100%;
              background: #f3f4f6;
              padding: 0.75rem;
              transform: translateX(-100%);
              transition: transform 0.3s ease-in-out;
              z-index: 1000;
              box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
              color: #1f2937;
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
              background: rgba(0, 0, 0, 0.7);
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
              color: #1f2937;
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
              background: view === 0 ? "#4A90E2" : "transparent", // Updated color
              borderRadius: "0.25rem",
              color: "#1f2937",
            }}
          >
            <ListIcon size={16} /> List
          </div>
          <div
            onClick={() => { setView(1); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem 0.75rem",
              cursor: "pointer",
              background: view === 1 ? "#4A90E2" : "transparent", // Updated color
              borderRadius: "0.25rem",
              color: "#1f2937",
            }}
          >
            <CalendarIcon size={16} /> Calendar
          </div>
          <div
            onClick={() => { setView(2); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem 0.75rem",
              cursor: "pointer",
              background: view === 2 ? "#4A90E2" : "transparent", // Updated color
              borderRadius: "0.25rem",
              color: "#1f2937",
            }}
          >
            <ListIcon size={16} /> Details
          </div>
          <select
            value={selectedProject}
            onChange={(e) => { setSelectedProject(e.target.value); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem",
              borderRadius: "0.25rem",
              border: "1px solid #d1d5db",
              fontSize: "0.875rem",
              width: "100%",
              background: "#fff",
              color: "#374151",
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
              border: "1px solid #d1d5db",
              fontSize: "0.875rem",
              width: "100%",
              background: "#fff",
              color: "#374151",
            }}
          >
            <option>All</option>
            {["High", "Medium", "Low"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <button
            onClick={() => { setCreatingProject(true); setSidebarOpen(false); }}
            style={{
              padding: "0.375rem 0.75rem",
              cursor: "pointer",
              background: "#4A90E2", // Updated color
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
              background: "#4A90E2", // Updated color
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
          color: "#1f2937",
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
            Task & Event Management (screenshot)
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
                background: view === 0 ? "#4A90E2" : "transparent", // Updated color
                borderRadius: "0.25rem",
                color: "#1f2937",
              }}
            >
              <ListIcon size={16} /> List
            </div>
            <div
              onClick={() => setView(1)}
              style={{
                padding: "0.375rem 0.75rem",
                cursor: "pointer",
                background: view === 1 ? "#4A90E2" : "transparent", // Updated color
                borderRadius: "0.25rem",
                color: "#1f2937",
              }}
            >
              <CalendarIcon size={16} /> Calendar
            </div>
            <div
              onClick={() => setView(2)}
              style={{
                padding: "0.375rem 0.75rem",
                cursor: "pointer",
                background: view === 2 ? "#4A90E2" : "transparent", // Updated color
                borderRadius: "0.25rem",
                color: "#1f2937",
              }}
            >
              <ListIcon size={16} /> Details
            </div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                padding: "0.375rem",
                borderRadius: "0.25rem",
                border: "1px solid #d1d5db",
                fontSize: "0.875rem",
                background: "#fff",
                color: "#374151",
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
                border: "1px solid #d1d5db",
                fontSize: "0.875rem",
                background: "#fff",
                color: "#374151",
              }}
            >
              <option>All</option>
              {["High", "Medium", "Low"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={() => setCreatingProject(true)}
              style={{
                padding: "0.375rem 0.75rem",
                cursor: "pointer",
                background: "#4A90E2", // Updated color
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
                background: "#4A90E2", // Updated color
                color: "#fff",
                border: "none",
                borderRadius: "0.25rem",
              }}
            >
              <Plus size={14} /> Add Task/Remainder
            </button>
          </div>
        </div>

        {view === 0 && (
          <div style={{ overflowX: "auto" }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "#f3f4f6",
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    color: "#1f2937",
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
                        color: "#374151",
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
              <div style={{ fontWeight: 700, marginBottom: "0.375rem", color: "#1f2937" }}>
                Unassigned / No Project
              </div>
              {tasksFilteredByPriority(tasks)
                .filter((t) => !t.projectId)
                .map((t) => renderTaskTable(t))}
            </div>
          </div>
        )}

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
                color: "#1f2937",
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
                    color: "#1f2937",
                    background: "#e5e7eb",
                    borderRadius: "0.25rem",
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
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.25rem",
                      padding: "0.125rem",
                      background: isToday ? "#4A90E2" : dayTasks.length || dayEvents.length ? "#f3f4f6" : "#fff", // Updated color
                      color: "#1f2937",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.125rem",
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
                          padding: "0.125rem 0.25rem",
                          borderRadius: "0.25rem",
                          background: "transparent",
                          color: "#fff",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          cursor: "pointer",
                        }}
                        onClick={() => { setSelectedTaskDetails(t); setView(2); }}
                      >
                        {t.name}
                        <div style={{ fontSize: "0.625rem", color: "#374151" }}>
                          {t.assignee && `Assignee: ${t.assignee}`} {t.due && `Due: ${t.due}`}
                        </div>
                      </div>
                    ))}
                    {dayEvents.map((e) => (
                      <div
                        key={e.id + "-event"}
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.125rem 0.25rem",
                          borderRadius: "0.25rem",
                          background: "transparent",
                          color: "#fff",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
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

        {view === 2 && selectedTaskDetails && (
          <div style={{ padding: "1rem", background: "#fff", borderRadius: "0.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", color: "#1f2937" }}>
              Task Details
            </h2>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Name:</strong> {selectedTaskDetails.name}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Assignee:</strong> {selectedTaskDetails.assignee || "Not assigned"}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Start Date:</strong> {selectedTaskDetails.start || "Not set"}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Due Date:</strong> {selectedTaskDetails.due || "Not set"}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Status:</strong> {selectedTaskDetails.status}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Priority:</strong> {selectedTaskDetails.priority}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Files:</strong>
              {selectedTaskDetails.file && selectedTaskDetails.file.length > 0 ? (
                <ul style={{ fontSize: "0.75rem", color: "#374151", marginTop: "0.25rem" }}>
                  {selectedTaskDetails.file.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              ) : (
                " No files uploaded"
              )}
            </div>
            <button
              onClick={() => setView(0)}
              style={{
                padding: "0.375rem 0.75rem",
                background: "#4A90E2", // Updated color
                color: "#fff",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
              }}
            >
              Back to List
            </button>
          </div>
        )}

       <Dialog
  visible={addingTop}
  onClose={() => {
    setAddingTop(false);
    setNewName("");
    setNewFile([]);
    setNewAssignee("");
    setAssigneeSearch("");
    setShowAssigneeDropdown(false);
    setNewStart("");
    setNewDue("");
    setNewStatus("Pending");
    setNewPriority("Medium");
    setNewDescription("");
    setNewTags([]);
    setNewTagInput("");
    setSelectedTemplate("");
    setShowTemplates(false);
    setNewEventName("");
    setNewEventDate("");
    setNewEventType("Meeting");
    setSelectedProject("all");
  }}
  title="Add New Task"
  style={{ width: "500px", maxWidth: "90vw" }}
>
  {/* Task Name Section */}
  <div style={{ marginBottom: "1rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
      <label style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>Task Name</label>
      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{newName.length}/500</span>
    </div>
    <input
      ref={inputRef}
      style={{
        padding: "0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid #D1D5DB",
        width: "100%",
        background: "#FFF",
        color: "#111827",
        fontSize: "0.875rem",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
      }}
      placeholder="Task name or type '/' for commands"
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && newName.trim()) {
          e.preventDefault();
          addTask();
          setNewName("");
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }}
      maxLength={500}
    />
  </div>

  {/* Description Section */}
  <div style={{ marginBottom: "1rem" }}>
    <label style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#374151", display: "block" }}>
      Description
    </label>
    <div style={{ position: "relative" }}>
      <textarea
        style={{
          padding: "0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid #D1D5DB",
          width: "100%",
          minHeight: "80px",
          resize: "vertical",
          background: "#FFF",
          color: "#111827",
          fontSize: "0.875rem",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
        }}
        placeholder="Add description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", display: "flex", gap: "0.5rem" }}>
        <button
          style={{
            padding: "0.25rem 0.5rem",
            background: "transparent",
            border: "1px solid #D1D5DB",
            borderRadius: "0.375rem",
            fontSize: "0.75rem",
            color: "#374151",
            cursor: "pointer"
          }}
          onClick={() => {/* Write functionality */}}
        >
          Write
        </button>
        <button
          style={{
            padding: "0.25rem 0.5rem",
            background: "transparent",
            border: "1px solid #3B82F6",
            borderRadius: "0.375rem",
            fontSize: "0.75rem",
            color: "#3B82F6",
            cursor: "pointer"
          }}
          onClick={() => {/* Write with AI functionality */}}
        >
          Write with AI
        </button>
      </div>
    </div>
  </div>

  {/* TO DO Section */}
  <div style={{ marginBottom: "1rem", padding: "1rem", background: "#F9FAFB", borderRadius: "0.5rem" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
      <div style={{ width: "16px", height: "16px", border: "2px solid #D1D5DB", borderRadius: "0.25rem" }}></div>
      <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>TO DO</span>
    </div>
    
    {/* Assignee */}
    <div style={{ marginBottom: "0.75rem" }}>
      <label style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "0.25rem", display: "block" }}>Assignee</label>
      <div ref={assigneeRef} style={{ position: "relative" }}>
        <input
          style={{
            padding: "0.5rem",
            borderRadius: "0.375rem",
            border: "1px solid #D1D5DB",
            width: "100%",
            background: "#FFF",
            color: "#374151",
            fontSize: "0.875rem"
          }}
          placeholder="Unassigned"
          value={assigneeSearch}
          onChange={(e) => {
            setAssigneeSearch(e.target.value);
            setNewAssignee(e.target.value);
            setShowAssigneeDropdown(true);
          }}
          onFocus={() => setShowAssigneeDropdown(true)}
        />
        {showAssigneeDropdown && filteredAssignees.length > 0 && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#FFF",
            border: "1px solid #D1D5DB",
            borderRadius: "0.375rem",
            maxHeight: "120px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            {filteredAssignees.map((assignee) => (
              <div
                key={assignee}
                style={{
                  padding: "0.5rem",
                  cursor: "pointer",
                  borderBottom: "1px solid #F3F4F6",
                  fontSize: "0.875rem",
                  color: "#374151"
                }}
                onClick={() => handleAssigneeSelect(assignee)}
                onMouseEnter={(e) => e.target.style.background = "#F9FAFB"}
                onMouseLeave={(e) => e.target.style.background = "#FFF"}
              >
                {assignee}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Due Date */}
    <div style={{ marginBottom: "0.75rem" }}>
      <label style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "0.25rem", display: "block" }}>Due date</label>
      <input
        type="date"
        style={{
          padding: "0.5rem",
          borderRadius: "0.375rem",
          border: "1px solid #D1D5DB",
          width: "100%",
          background: "#FFF",
          color: "#374151",
          fontSize: "0.875rem"
        }}
        value={newDue}
        onChange={(e) => setNewDue(e.target.value)}
      />
    </div>

    {/* Priority */}
    <div style={{ marginBottom: "0.75rem" }}>
      <label style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "0.25rem", display: "block" }}>Priority</label>
      <select
        style={{
          padding: "0.5rem",
          borderRadius: "0.375rem",
          border: "1px solid #D1D5DB",
          width: "100%",
          background: "#FFF",
          color: "#374151",
          fontSize: "0.875rem"
        }}
        value={newPriority}
        onChange={(e) => setNewPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>

    {/* Tags */}
    <div>
      <label style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "0.25rem", display: "block" }}>Tags</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.25rem" }}>
        {newTags.map((tag, index) => (
          <div key={index} style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.25rem 0.5rem",
            background: "#E5E7EB",
            borderRadius: "0.375rem",
            fontSize: "0.75rem",
            color: "#374151"
          }}>
            {tag}
            <button
              onClick={() => setNewTags(newTags.filter((_, i) => i !== index))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280" }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        style={{
          padding: "0.5rem",
          borderRadius: "0.375rem",
          border: "1px solid #D1D5DB",
          width: "100%",
          background: "#FFF",
          color: "#374151",
          fontSize: "0.875rem"
        }}
        placeholder="Add tags..."
        value={newTagInput}
        onChange={(e) => setNewTagInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && newTagInput.trim()) {
            setNewTags([...newTags, newTagInput.trim()]);
            setNewTagInput("");
          }
        }}
      />
    </div>
  </div>

  {/* Custom Fields */}
  <div style={{ marginBottom: "1rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
      <label style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>Custom Fields</label>
      <button
        style={{
          padding: "0.375rem 0.75rem",
          background: "transparent",
          border: "1px solid #D1D5DB",
          borderRadius: "0.375rem",
          fontSize: "0.75rem",
          color: "#374151",
          cursor: "pointer"
        }}
        onClick={() => {/* Create new field functionality */}}
      >
        + Create new field
      </button>
    </div>
    <div style={{ padding: "0.75rem", background: "#F9FAFB", borderRadius: "0.375rem", border: "1px dashed #D1D5DB" }}>
      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>No custom fields added</span>
    </div>
  </div>

  {/* Templates */}
  <div style={{ marginBottom: "1rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
      <label style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>Templates</label>
      <button
        style={{
          padding: "0.375rem 0.75rem",
          background: "transparent",
          border: "1px solid #D1D5DB",
          borderRadius: "0.375rem",
          fontSize: "0.75rem",
          color: "#374151",
          cursor: "pointer"
        }}
        onClick={() => setShowTemplates(!showTemplates)}
      >
        {showTemplates ? "Hide" : "Show"} Templates
      </button>
    </div>
    {showTemplates && (
      <div style={{ padding: "0.75rem", background: "#F9FAFB", borderRadius: "0.375rem" }}>
        <select
          style={{
            padding: "0.5rem",
            borderRadius: "0.375rem",
            border: "1px solid #D1D5DB",
            width: "100%",
            background: "#FFF",
            color: "#374151",
            fontSize: "0.875rem"
          }}
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="">Select a template</option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="task">General Task</option>
        </select>
      </div>
    )}
  </div>

  {/* File Upload */}
  <div style={{ marginBottom: "1rem" }}>
    <label style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#374151", display: "block" }}>
      File Upload
    </label>
    <input
      type="file"
      multiple
      onChange={(e) => setNewFile((prevFiles) => [...prevFiles, ...Array.from(e.target.files)])}
      style={{
        padding: "0.5rem",
        width: "100%",
        background: "#FFF",
        border: "1px dashed #D1D5DB",
        borderRadius: "0.375rem",
        fontSize: "0.875rem"
      }}
    />
    {newFile.length > 0 && (
      <div style={{ marginTop: "0.5rem" }}>
        {newFile.map((file, index) => (
          <div key={index} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem",
            background: "#F9FAFB",
            borderRadius: "0.375rem",
            marginBottom: "0.25rem",
            fontSize: "0.75rem",
            color: "#374151"
          }}>
            <span>{file.name}</span>
            <button
              onClick={() => setNewFile(newFile.filter((_, i) => i !== index))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444" }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Project Assignment */}
  <div style={{ marginBottom: "1rem" }}>
    <label style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#374151", display: "block" }}>
      Assign to Project
    </label>
    <select
      value={selectedProject}
      onChange={(e) => setSelectedProject(e.target.value)}
      style={{
        padding: "0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid #D1D5DB",
        width: "100%",
        background: "#FFF",
        color: "#374151",
        fontSize: "0.875rem"
      }}
    >
      <option value="all">All Projects (unassigned)</option>
      <option value="unassigned">Unassigned</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  </div>

  {/* Add Task Button */}
  <button
    style={{
      padding: "0.75rem 1rem",
      background: "#3B82F6",
      color: "#FFF",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      width: "100%",
      fontSize: "0.875rem",
      fontWeight: "500",
      marginBottom: "1rem"
    }}
    onClick={addTask}
  >
    Create Task
  </button>

  <hr style={{ margin: "1rem 0", border: "none", borderTop: "1px solid #E5E7EB" }} />

  {/* Event Section */}
  <div style={{ marginBottom: "1rem" }}>
    <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.75rem" }}>Add Event</h3>
    
    <div style={{ marginBottom: "0.75rem" }}>
      <label style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#374151", display: "block" }}>
        Event Name
      </label>
      <textarea
        ref={eventNameRef}
        style={{
          padding: "0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid #D1D5DB",
          width: "100%",
          minHeight: "60px",
          resize: "vertical",
          background: "#FFF",
          color: "#111827",
          fontSize: "0.875rem",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
        }}
        placeholder="Event name"
        value={newEventName}
        onChange={(e) => setNewEventName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && newEventName.trim() && newEventDate) {
            e.preventDefault();
            addEvent();
            setNewEventName("");
            setTimeout(() => eventNameRef.current?.focus(), 0);
          }
        }}
      />
    </div>

    <div style={{ marginBottom: "0.75rem" }}>
      <label style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#374151", display: "block" }}>
        Event Date
      </label>
      <input
        type="date"
        style={{
          padding: "0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid #D1D5DB",
          width: "100%",
          background: "#FFF",
          color: "#374151",
          fontSize: "0.875rem"
        }}
        value={newEventDate}
        onChange={(e) => setNewEventDate(e.target.value)}
      />
    </div>

    <div style={{ marginBottom: "0.75rem" }}>
      <label style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#374151", display: "block" }}>
        Event Type
      </label>
      <select
        value={newEventType}
        onChange={(e) => setNewEventType(e.target.value)}
        style={{
          padding: "0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid #D1D5DB",
          width: "100%",
          background: "#FFF",
          color: "#374151",
          fontSize: "0.875rem"
        }}
      >
        <option>Meeting</option>
        <option>Event</option>
        <option>Reminder</option>
        <option>Deadline</option>
      </select>
    </div>

    <button
      style={{
        padding: "0.75rem 1rem",
        background: "#10B981",
        color: "#FFF",
        border: "none",
        borderRadius: "0.5rem",
        cursor: "pointer",
        width: "100%",
        fontSize: "0.875rem",
        fontWeight: "500"
      }}
      onClick={() => {
        if (newEventName.trim() && newEventDate) {
          addEvent();
          setNewEventName("");
          setTimeout(() => eventNameRef.current?.focus(), 0);
        }
      }}
    >
      Add Event
    </button>
  </div>
</Dialog>
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
            setNewSubtaskFile([]);
          }}
          title="Add New Subtask"
        >
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem", color: "#374151" }}>Subtask Name</label>
            <input
              ref={subtaskNameRef}
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                width: "100%",
                marginBottom: "0.375rem",
                background: "#fff",
                color: "#374151",
              }}
              placeholder="Subtask name"
              value={newSubtaskName}
              onChange={(e) => setNewSubtaskName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const isProject = projects.some((p) => p.id === addingSubtask);
                  addTask(isProject ? null : addingSubtask, isProject ? addingSubtask : null);
                }
                if (e.repeat && e.key !== "Enter") e.preventDefault();
              }}
              maxLength={50}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem", color: "#374151" }}>Assignee</label>
            <div ref={assigneeRef} style={{ position: "relative" }}>
              <input
                style={{
                  padding: "0.375rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  width: "100%",
                  marginBottom: "0.375rem",
                  background: "#fff",
                  color: "#374151",
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
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  {filteredAssignees.map((assignee) => (
                    <div
                      key={assignee}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#374151",
                      }}
                      onClick={() => handleSubtaskAssigneeSelect(assignee)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
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
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem", color: "#374151" }}>Start Date</label>
            <input
              type="date"
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                width: "100%",
                marginBottom: "0.375rem",
                background: "#fff",
                color: "#374151",
              }}
              value={newSubtaskStart}
              onChange={(e) => setNewSubtaskStart(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem", color: "#374151" }}>Due Date</label>
            <input
              type="date"
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                width: "100%",
                marginBottom: "0.375rem",
                background: "#fff",
                color: "#374151",
              }}
              value={newSubtaskDue}
              onChange={(e) => setNewSubtaskDue(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem", color: "#374151" }}>Status</label>
            <select
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                width: "100%",
                marginBottom: "0.375rem",
                background: "#fff",
                color: "#374151",
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
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem", color: "#374151" }}>Priority</label>
            <select
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                width: "100%",
                marginBottom: "0.375rem",
                background: "#fff",
                color: "#374151",
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
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem", color: "#374151" }}>File Upload</label>
            <input
              type="file"
              multiple
              onChange={(e) => setNewSubtaskFile((prevFiles) => [...prevFiles, ...Array.from(e.target.files)])}
              style={{
                padding: "0.375rem",
                width: "100%",
                marginBottom: "0.375rem",
                background: "#fff",
                color: "#374151",
              }}
            />
            {newSubtaskFile.length > 0 && (
              <ul style={{ fontSize: "0.75rem", color: "#374151", marginTop: "0.25rem" }}>
                {newSubtaskFile.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            style={{
              padding: "0.375rem 0.75rem",
              background: "#4A90E2", // Updated color
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
            <label style={{ fontSize: "0.75rem", marginBottom: "0.25rem", color: "#374151" }}>Project Name</label>
            <input
              ref={projectInputRef}
              style={{
                padding: "0.375rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                width: "100%",
                marginBottom: "0.75rem",
                background: "#fff",
                color: "#374151",
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
                background: "#4A90E2", // Updated color
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