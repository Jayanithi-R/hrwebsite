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
  ChevronRight as ArrowRight,
  MoreVertical,
  Search,
  Filter,
  Bookmark,
  Settings
} from "lucide-react";

export default function CourseDashboardEnhanced() {
  // --- General State ---
  const [toggleMode, setToggleMode] = useState("task");
  const [editing, setEditing] = useState({});
  const [filterPriority, setFilterPriority] = useState("All");
  const [activeModal, setActiveModal] = useState(null); // 'project', 'task', 'subtask', 'event'
  const [searchQuery, setSearchQuery] = useState("");

  // --- Calendar State ---
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // --- Project Form ---
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDue, setNewProjectDue] = useState("");
  const [newProjectPriority, setNewProjectPriority] = useState("Low");
  const [newProjectAssignee, setNewProjectAssignee] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  // --- Task Form ---
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Low");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [taskParentId, setTaskParentId] = useState(null);

  // --- Subtask Form ---
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [newSubtaskDue, setNewSubtaskDue] = useState("");
  const [newSubtaskPriority, setNewSubtaskPriority] = useState("Low");
  const [newSubtaskAssignee, setNewSubtaskAssignee] = useState("");
  const [newSubtaskDescription, setNewSubtaskDescription] = useState("");
  const [subtaskParentId, setSubtaskParentId] = useState(null);

  // --- Projects & Data ---
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);

  // --- Constants ---
  const priorities = ["High", "Medium", "Low"];
  const priorityColors = { High: "#f87171", Medium: "#facc15", Low: "#4ade80" };
  const eventColors = { Meeting: "#fbbf24", Event: "#34d399" };
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const uid = () => Math.floor(Math.random() * 1000000);

  // --- Calendar Functions ---
  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const calendar = [];
  for (let i = 0; i < firstDay; i++) calendar.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendar.push(d);

  // Group tasks and events by date for calendar
  const tasksByDay = {};
  projects.forEach(project => {
    project.tasks?.forEach(task => {
      if (task.due) {
        tasksByDay[task.due] = tasksByDay[task.due] || [];
        tasksByDay[task.due].push({ ...task, type: 'task', projectName: project.name });
      }
    });
  });

  const eventsByDay = {};
  events.forEach(e => {
    if (!e.date) return;
    eventsByDay[e.date] = eventsByDay[e.date] || [];
    eventsByDay[e.date].push(e);
  });

  // --- Light Toolbar Styles ---
  const lightToolbarStyles = {
    toolbar: {
      background: '#ffffff',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e5e7eb',
      color: '#374151',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    toolbarButton: {
      background: 'transparent',
      border: 'none',
      color: '#6b7280',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease'
    },
    toolbarButtonHover: {
      background: '#f3f4f6',
      color: '#374151'
    },
    searchContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    searchInput: {
      background: '#f9fafb',
      border: '1px solid #d1d5db',
      borderRadius: '20px',
      padding: '8px 16px 8px 40px',
      color: '#374151',
      fontSize: '14px',
      width: '200px',
      outline: 'none',
      transition: 'all 0.2s ease'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      color: '#9ca3af'
    },
    iconButton: {
      background: 'transparent',
      border: 'none',
      color: '#6b7280',
      padding: '8px',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease'
    },
    profileIcon: {
      background: '#10b981',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  };

  // --- Modal Management ---
  const openProjectModal = () => {
    setActiveModal('project');
    setToggleMode('task'); // Default to project tab
  };

  const openTaskModal = (parentId) => {
    console.log("Opening task modal for project:", parentId);
    setActiveModal('task');
    setTaskParentId(parentId);
    resetTaskForm();
  };

  const openSubtaskModal = (parentId) => {
    console.log("Opening subtask modal for task:", parentId);
    setActiveModal('subtask');
    setSubtaskParentId(parentId);
    resetSubtaskForm();
  };

  const openEventModal = () => {
    setActiveModal('event');
    resetTaskForm();
  };

  const closeModal = () => {
    setActiveModal(null);
    resetProjectForm();
    resetTaskForm();
    resetSubtaskForm();
    setTaskParentId(null);
    setSubtaskParentId(null);
  };

  // --- Form Reset ---
  const resetProjectForm = () => {
    setNewProjectName("");
    setNewProjectDescription("");
    setNewProjectAssignee("");
    setNewProjectDue("");
    setNewProjectPriority("Low");
  };

  const resetTaskForm = () => {
    setNewTaskName("");
    setNewTaskDescription("");
    setNewTaskAssignee("");
    setNewTaskDue("");
    setNewTaskPriority("Low");
  };

  const resetSubtaskForm = () => {
    setNewSubtaskName("");
    setNewSubtaskDescription("");
    setNewSubtaskAssignee("");
    setNewSubtaskDue("");
    setNewSubtaskPriority("Low");
  };

  // --- Data Management ---
  const addProject = () => {
    if (!newProjectName.trim()) return;
    const project = {
      id: uid(),
      name: newProjectName.trim(),
      description: newProjectDescription,
      assignee: newProjectAssignee,
      due: newProjectDue,
      priority: newProjectPriority,
      expanded: true,
      tasks: []
    };
    setProjects(s => [project, ...s]);
    resetProjectForm();
    closeModal();
  };

  const addTask = () => {
    if (!newTaskName.trim() || !taskParentId) {
      console.log("Cannot add task - missing name or parent ID:", newTaskName, taskParentId);
      return;
    }

    const task = {
      id: uid(),
      name: newTaskName.trim(),
      description: newTaskDescription,
      assignee: newTaskAssignee,
      due: newTaskDue,
      priority: newTaskPriority,
      expanded: true,
      subtasks: []
    };

    console.log("Adding task to project:", taskParentId, task);

    setProjects(s =>
      s.map(p =>
        p.id === taskParentId ? { ...p, tasks: [task, ...p.tasks] } : p
      )
    );

    resetTaskForm();
    closeModal();
  };

  const addSubtask = () => {
    if (!newSubtaskName.trim() || !subtaskParentId) {
      console.log("Cannot add subtask - missing name or parent ID:", newSubtaskName, subtaskParentId);
      return;
    }

    const subtask = {
      id: uid(),
      name: newSubtaskName.trim(),
      description: newSubtaskDescription,
      assignee: newSubtaskAssignee,
      due: newSubtaskDue,
      priority: newSubtaskPriority
    };

    console.log("Adding subtask to task:", subtaskParentId, subtask);

    setProjects(s =>
      s.map(p => ({
        ...p,
        tasks: p.tasks.map(t =>
          t.id === subtaskParentId ? { ...t, subtasks: [subtask, ...t.subtasks] } : t
        )
      }))
    );

    resetSubtaskForm();
    closeModal();
  };

  const addEvent = () => {
    if (!newTaskName.trim() || !newTaskDue) return;
    setEvents(s => [...s, {
      id: uid(),
      name: newTaskName.trim(),
      date: newTaskDue,
      type: "Event"
    }]);
    resetTaskForm();
    closeModal();
  };

  // --- Expand/Collapse ---
  const toggleExpand = (id, type = 'project') => {
    if (type === 'project') {
      setProjects(s => s.map(p => p.id === id ? { ...p, expanded: !p.expanded } : p));
    } else if (type === 'task') {
      setProjects(s => s.map(p => ({
        ...p,
        tasks: p.tasks.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t)
      })));
    }
  };

  // --- Delete Functions ---
  const deleteProject = (projectId) => {
    setProjects(s => s.filter(p => p.id !== projectId));
  };

  const deleteTask = (taskId, type = 'task') => {
    if (type === 'task') {
      setProjects(s => s.map(p => ({
        ...p,
        tasks: p.tasks.filter(t => t.id !== taskId)
      })));
    } else if (type === 'subtask') {
      setProjects(s => s.map(p => ({
        ...p,
        tasks: p.tasks.map(t => ({
          ...t,
          subtasks: t.subtasks.filter(st => st.id !== taskId)
        }))
      })));
    }
  };

  // --- Inline Style Objects ---
  const styles = {
    appContainer: {
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#f8fafc'
    },
    mainContent: {
      margin: '0 auto',
      background: '#fff',
      padding: 20
    },
    header: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20
    },
    headerTitle: {
      fontWeight: 600,
      fontSize: 20,
      color: '#111827'
    },
    headerControls: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    filterSelect: {
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #d1d5db',
      background: '#fff',
      fontSize: 14
    },
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      background: '#4f46e5',
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: 14,
      transition: 'background 0.2s'
    },
    itemBase: {
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      marginBottom: 12,
      background: '#fff',
      transition: 'all 0.2s'
    },
    itemHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      gap: 12
    },
    mainInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flex: 1
    },
    expandBtn: {
      background: 'transparent',
      border: 'none',
      borderRadius: 4,
      padding: 4,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
      color: '#6b7280'
    },
    nameBase: {
      fontWeight: 600,
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: 4,
      transition: 'background 0.2s'
    },
    metaBase: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      color: '#6b7280'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    },
    priorityBadge: {
      padding: '2px 8px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 500,
      color: '#fff'
    },
    actions: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    },
    addTaskBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 12px',
      border: 'none',
      borderRadius: 6,
      background: '#4f46e5',
      color: '#fff',
      cursor: 'pointer',
      fontSize: 12,
      transition: 'background 0.2s'
    },
    deleteBtn: {
      background: '#ef4444',
      border: 'none',
      borderRadius: 6,
      padding: 6,
      cursor: 'pointer',
      color: '#fff',
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    description: {
      padding: '0 16px 6px 16px',
      color: '#6b7280',
      fontSize: 14,
      lineHeight: 1.5
    },
    container: {
      padding: '0 16px 16px 16px'
    },
    emptyState: {
      color: '#6b7280',
      fontSize: 14,
      fontStyle: 'italic',
      padding: '8px 0'
    },
    emptyStateLarge: {
      textAlign: 'center',
      padding: 40,
      color: '#6b7280',
      fontSize: 16
    },
    editableInput: {
      fontWeight: 600,
      border: '1px solid #d1d5db',
      borderRadius: 6,
      padding: '6px 10px',
      outline: 'none',
      width: 200,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      width: '90%',
      maxWidth: 600,
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 25px rgba(0,0,0,0.15)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 16,
      borderBottom: '1px solid #e5e7eb'
    },
    modalTitle: {
      fontWeight: 600,
      fontSize: 20,
      color: '#111827'
    },
    closeBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 8,
      borderRadius: 6,
      color: '#6b7280',
      transition: 'background 0.2s',
      fontSize: 24,
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalTabs: {
      display: 'flex',
      gap: 8,
      marginBottom: 20,
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: 8
    },
    modalTab: {
      flex: 1,
      padding: '10px 16px',
      border: 'none',
      borderBottom: '3px solid transparent',
      background: 'transparent',
      fontWeight: 400,
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: 16,
      transition: 'all 0.2s'
    },
    modalTabActive: {
      flex: 1,
      padding: '10px 16px',
      border: 'none',
      borderBottom: '3px solid #4f46e5',
      background: 'transparent',
      fontWeight: 600,
      cursor: 'pointer',
      color: '#4f46e5',
      fontSize: 16,
      transition: 'all 0.2s'
    },
    modalForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    },
    formRow: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    },
    formRowGroup: {
      flex: 1,
      minWidth: 150,
      display: "flex",
      flexDirection: "column"
    },
    label: {
      fontSize: 14,
      fontWeight: 500,
      color: '#374151'
    },
    input: {
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid #d1d5db',
      fontSize: 16,
      outline: 'none',
      transition: 'border-color 0.2s',
      fontFamily: 'inherit'
    },
    textarea: {
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid #d1d5db',
      fontSize: 16,
      outline: 'none',
      transition: 'border-color 0.2s',
      fontFamily: 'inherit',
      minHeight: 80,
      resize: 'vertical'
    },
    select: {
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid #d1d5db',
      fontSize: 16,
      outline: 'none',
      transition: 'border-color 0.2s',
      fontFamily: 'inherit',
      appearance: 'none',
      background: '#fff'
    },
    formActions: {
      display: 'flex',
      gap: 12,
      marginTop: 8
    },
    primaryBtn: {
      padding: '10px 20px',
      background: '#4f46e5',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: 16,
      flex: 1,
      transition: 'background 0.2s'
    },
    secondaryBtn: {
      padding: '10px 20px',
      background: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: 16,
      flex: 1,
      transition: 'background 0.2s'
    },
    // Calendar Styles
    calendarView: {
      width: '100%'
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    monthNav: {
      background: 'transparent',
      border: '1px solid #d1d5db',
      borderRadius: 6,
      padding: '8px 12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      color: '#374151'
    },
    currentMonth: {
      fontWeight: 600,
      fontSize: 18,
      color: '#111827'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 1,
      background: '#e5e7eb',
      border: '1px solid #e5e7eb'
    },
    calendarDayHeader: {
      background: '#f8fafc',
      padding: '12px 8px',
      textAlign: 'center',
      fontWeight: 600,
      fontSize: 14,
      color: '#374151',
      borderBottom: '1px solid #e5e7eb'
    },
    calendarDay: {
      background: '#fff',
      minHeight: 120,
      padding: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    },
    dayNumber: {
      fontWeight: 500,
      fontSize: 14,
      color: '#111827',
      marginBottom: 4
    },
    calendarItem: {
      fontSize: 11,
      padding: '2px 6px',
      borderRadius: 4,
      color: '#fff',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      marginBottom: 2
    }
  };

  // --- Light Toolbar Component ---
  const LightToolbar = () => {
    // Internal state so props aren't required
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthOptions = ["Day", "Week", "Month", "Year"];

    // Local function to change month
    const changeMonth = (direction) => {
      let newMonth = currentMonth + direction;
      let newYear = currentYear;

      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }

      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    };

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          borderBottom: "1px solid #ddd",
          background: "#f8f8f8",
        }}
      >
        {/* Left Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            Today
          </button>

          {/* Dropdown Button */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* 🔘 Toggle Button */}
              <button
                style={{
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: "100px",
                }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Month
                <span style={{ marginLeft: "6px", fontSize: "10px" }}>
                  {showDropdown ? "▲" : "▼"}
                </span>
              </button>

              {/* ⬇️ Dropdown */}
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    zIndex: 10,
                    minWidth: "100px",
                    marginTop: "4px",
                  }}
                >
                  {monthOptions.map((monthOptions) => (
                    <div
                      key={monthOptions}
                      style={{
                        padding: "6px 10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => {
                        alert(`Selected: ${monthOptions}`);
                        setShowDropdown(false);
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f2f2f2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#fff")
                      }
                    >
                      {monthOptions}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showDropdown && (
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
                  minWidth: "100px",
                }}
              >
                {monthOptions.map((opt) => (
                  <div
                    key={opt}
                    style={{
                      padding: "6px 10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => {
                      alert(`Selected: ${opt}`);
                      setShowDropdown(false);
                    }}
                    onMouseEnter={(e) => (e.target.style.background = "#f2f2f2")}
                    onMouseLeave={(e) => (e.target.style.background = "#fff")}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Month Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => changeMonth(-1)}
              style={{
                padding: "6px",
                border: "none",
                borderRadius: "4px",
                background: "#fff",
                cursor: "pointer",
                color: "black"
              }}
            >
              <ChevronLeft size={15} />
            </button>
            <div
              style={{
                minWidth: "80px",
                textAlign: "center",
                // fontWeight: "bold",
              }}
            >
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button
              onClick={() => changeMonth(1)}
              style={{
                padding: "6px",
                border: "None",
                borderRadius: "4px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            }}
          >
            <Filter size={16} />
            Filter
          </button>
          <button
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "14px",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            Groups
          </button>
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
            }}
          >
            <Bookmark size={16} />
            Bookmarks
          </button>

          {/* Profile Icon */}
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
            }}
          >
            A
          </div>

          {/* Search Bar */}
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

  // --- Calendar View Component ---
  const CalendarView = () => (
    <div style={styles.calendarView}>
      <div style={styles.calendarGrid}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
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
                  style={{ ...styles.calendarItem, background: item.priority === 'High' ? '#f87171' : item.priority === 'Medium' ? '#facc15' : '#4ade80' }}
                  title={item.name}
                >
                  {item.name}
                </div>
              ))}
              {dayEvents.map(e => (
                <div
                  key={e.id}
                  style={{ ...styles.calendarItem, background: e.type === 'Meeting' ? '#fbbf24' : '#34d399' }}
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

  // --- Modal Content ---
  const renderProjectModal = () => (
    <div>
      <div style={styles.modalTabs}>
        <button
          onClick={() => setToggleMode("task")}
          style={toggleMode === "task" ? styles.modalTabActive : styles.modalTab}
        >
          Project
        </button>
        <button
          onClick={() => setToggleMode("event")}
          style={toggleMode === "event" ? styles.modalTabActive : styles.modalTab}
        >
          Event
        </button>
      </div>

      {toggleMode === "task" ? (
        <div style={styles.modalForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Project Title</label>
            <input
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="Enter project title"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={newProjectDescription}
              onChange={e => setNewProjectDescription(e.target.value)}
              placeholder="Enter description"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formRowGroup}>
              <label style={styles.label}>Assignee</label>
              <input
                value={newProjectAssignee}
                onChange={e => setNewProjectAssignee(e.target.value)}
                placeholder="Assignee name"
                style={styles.input}
              />
            </div>

            <div style={styles.formRowGroup}>
              <label style={styles.label}>Due Date</label>
              <input
                type="date"
                value={newProjectDue}
                onChange={e => setNewProjectDue(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formRowGroup}>
              <label style={styles.label}>Priority</label>
              <select
                value={newProjectPriority}
                onChange={e => setNewProjectPriority(e.target.value)}
                style={styles.select}
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formActions}>
            <button onClick={addProject} style={styles.primaryBtn}>
              Create Project
            </button>
            <button onClick={closeModal} style={styles.secondaryBtn}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.modalForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Event Name</label>
            <input
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              placeholder="Enter event name"
              style={styles.input}
            />
          </div>
          <div style={styles.formRow}>
            <div style={styles.formRowGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={newTaskDue}
                onChange={e => setNewTaskDue(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.formActions}>
            <button onClick={addEvent} style={styles.primaryBtn}>
              Create Event
            </button>
            <button onClick={closeModal} style={styles.secondaryBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderTaskModal = () => (
    <div style={styles.modalForm}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Task Title</label>
        <input
          value={newTaskName}
          onChange={e => setNewTaskName(e.target.value)}
          placeholder="Enter task title"
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Description</label>
        <textarea
          value={newTaskDescription}
          onChange={e => setNewTaskDescription(e.target.value)}
          placeholder="Enter description"
          style={styles.textarea}
        />
      </div>

      <div style={styles.formRow}>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Assignee</label>
          <input
            value={newTaskAssignee}
            onChange={e => setNewTaskAssignee(e.target.value)}
            placeholder="Assignee name"
            style={styles.input}
          />
        </div>

        <div style={styles.formRowGroup}>
          <label style={styles.label}>Due Date</label>
          <input
            type="date"
            value={newTaskDue}
            onChange={e => setNewTaskDue(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formRowGroup}>
          <label style={styles.label}>Priority</label>
          <select
            value={newTaskPriority}
            onChange={e => setNewTaskPriority(e.target.value)}
            style={styles.select}
          >
            {priorities.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.formActions}>
        <button onClick={addTask} style={styles.primaryBtn}>
          Create Task
        </button>
        <button onClick={closeModal} style={styles.secondaryBtn}>
          Cancel
        </button>
      </div>
    </div>
  );

  const renderSubtaskModal = () => (
    <div style={styles.modalForm}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Subtask Title</label>
        <input
          value={newSubtaskName}
          onChange={e => setNewSubtaskName(e.target.value)}
          placeholder="Enter subtask title"
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Description</label>
        <textarea
          value={newSubtaskDescription}
          onChange={e => setNewSubtaskDescription(e.target.value)}
          placeholder="Enter description"
          style={styles.textarea}
        />
      </div>

      <div style={styles.formRow}>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Assignee</label>
          <input
            value={newSubtaskAssignee}
            onChange={e => setNewSubtaskAssignee(e.target.value)}
            placeholder="Assignee name"
            style={styles.input}
          />
        </div>

        <div style={styles.formRowGroup}>
          <label style={styles.label}>Due Date</label>
          <input
            type="date"
            value={newSubtaskDue}
            onChange={e => setNewSubtaskDue(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formRowGroup}>
          <label style={styles.label}>Priority</label>
          <select
            value={newSubtaskPriority}
            onChange={e => setNewSubtaskPriority(e.target.value)}
            style={styles.select}
          >
            {priorities.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.formActions}>
        <button onClick={addSubtask} style={styles.primaryBtn}>
          Create Subtask
        </button>
        <button onClick={closeModal} style={styles.secondaryBtn}>
          Cancel
        </button>
      </div>
    </div>
  );

  const getModalTitle = () => {
    switch (activeModal) {
      case 'project': return 'Create New Project or Event';
      case 'task': return 'Create New Task';
      case 'subtask': return 'Create New Subtask';
      case 'event': return 'Create New Event';
      default: return '';
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'project': return renderProjectModal();
      case 'task': return renderTaskModal();
      case 'subtask': return renderSubtaskModal();
      case 'event': return renderEventModal();
      default: return null;
    }
  };

  const renderEventModal = () => (
    <div style={styles.modalForm}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Event Name</label>
        <input
          value={newTaskName}
          onChange={e => setNewTaskName(e.target.value)}
          placeholder="Enter event name"
          style={styles.input}
        />
      </div>
      <div style={styles.formRow}>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Date</label>
          <input
            type="date"
            value={newTaskDue}
            onChange={e => setNewTaskDue(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>
      <div style={styles.formActions}>
        <button onClick={addEvent} style={styles.primaryBtn}>
          Create Event
        </button>
        <button onClick={closeModal} style={styles.secondaryBtn}>
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.appContainer}>
      {/* Light Toolbar */}
      <LightToolbar />

      <div style={styles.mainContent}>
        {/* Header */}
        {/* <div style={styles.header}>
          <div style={styles.headerControls}>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="All">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            
          </div>
        </div> */}

        {/* Permanent Calendar View */}
        <div>
          <CalendarView />
          {(projects.length === 0 && events.length === 0) && (
            <div style={styles.emptyStateLarge}>
              No tasks or events scheduled. Add some to see them on the calendar.
            </div>
          )}
        </div>

        {/* Modal */}
        {activeModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <div style={styles.modalTitle}>{getModalTitle()}</div>
                <button onClick={closeModal} style={styles.closeBtn}>
                  ×
                </button>
              </div>
              {renderModalContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}