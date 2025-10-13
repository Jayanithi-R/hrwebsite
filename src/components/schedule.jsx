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
  MoreVertical
} from "lucide-react";

export default function CourseDashboardEnhanced() {
  // --- General State ---
  const [view, setView] = useState(0);
  const [addingTop, setAddingTop] = useState(false);
  const [toggleMode, setToggleMode] = useState("task");
  const [editing, setEditing] = useState({});
  const [filterPriority, setFilterPriority] = useState("All");
  const [activeModal, setActiveModal] = useState(null); // 'project', 'task', 'subtask'

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
  const [taskParentId, setTaskParentId] = useState(null); // project ID for task, task ID for subtask

  // --- Projects & Data ---
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);

  // --- Calendar State ---
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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

  // --- Modal Management ---
  const openProjectModal = () => {
    setActiveModal('project');
    setAddingTop(true);
  };

  const openTaskModal = (parentId) => {
    setActiveModal('task');
    setTaskParentId(parentId);
    setAddingTop(true);
  };

  const openSubtaskModal = (parentId) => {
    setActiveModal('subtask');
    setTaskParentId(parentId);
    setAddingTop(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setAddingTop(false);
    resetTaskForm();
    resetProjectForm();
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
    setTaskParentId(null);
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
    if (!newTaskName.trim() || !taskParentId) return;
    
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

    if (activeModal === 'task') {
      // Add task to project
      setProjects(s =>
        s.map(p =>
          p.id === taskParentId ? { ...p, tasks: [task, ...p.tasks] } : p
        )
      );
    } else if (activeModal === 'subtask') {
      // Add subtask to task
      setProjects(s =>
        s.map(p => ({
          ...p,
          tasks: p.tasks.map(t =>
            t.id === taskParentId ? { ...t, subtasks: [task, ...t.subtasks] } : t
          )
        }))
      );
    }

    resetTaskForm();
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

  // --- Calendar Functions ---
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const calendar = [];
  for (let i = 0; i < firstDay; i++) calendar.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendar.push(d);

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 11) { newMonth = 0; newYear += 1; }
    if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // --- Calendar Data ---
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

  // --- Inline Style Objects ---
  const styles = {
    appContainer: {
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#f8fafc',
      padding: 16
    },
    mainContent: {
      margin: '0 auto',
      background: '#fff',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
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
    viewBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      cursor: 'pointer',
      background: 'transparent',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: 6,
      fontSize: 14,
      transition: 'all 0.2s'
    },
    viewBtnActive: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      cursor: 'pointer',
      background: '#4f46e5',
      color: '#fff',
      border: '1px solid #4f46e5',
      borderRadius: 6,
      fontSize: 14,
      transition: 'all 0.2s'
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
    itemHover: {
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      marginBottom: 12,
      background: '#fff',
      transition: 'all 0.2s',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
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
    modalTitle: {
      fontWeight: 600,
      fontSize: 18,
      color: '#111827'
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
      minWidth: 150
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
    calendarView: {
      overflowX: 'auto'
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      fontWeight: 600,
      marginBottom: 16,
      fontSize: 18
    },
    monthNav: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: 8,
      borderRadius: 6,
      transition: 'background 0.2s'
    },
    currentMonth: {
      fontWeight: 600
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, minmax(100px, 1fr))',
      gap: 4
    },
    calendarDayHeader: {
      fontWeight: 700,
      textAlign: 'center',
      padding: '12px 8px',
      background: '#f8fafc',
      borderRadius: 4,
      fontSize: 14
    },
    calendarDay: {
      minHeight: 100,
      border: '1px solid #e5e7eb',
      borderRadius: 6,
      padding: 8,
      background: '#fff',
      position: 'relative'
    },
    dayNumber: {
      fontWeight: 600,
      marginBottom: 4,
      color: '#111827'
    },
    calendarItem: {
      fontSize: 11,
      marginTop: 2,
      padding: '2px 6px',
      borderRadius: 4,
      color: '#fff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'default'
    }
  };

  // --- Render Components ---
  const renderProject = (project) => (
    <div key={project.id} style={styles.itemBase}>
      {/* Project Header */}
      <div style={styles.itemHeader}>
        <div style={styles.mainInfo}>
          <button
            onClick={() => toggleExpand(project.id, 'project')}
            style={styles.expandBtn}
          >
            {project.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

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
              onBlur={() => setEditing((prev) => ({ ...prev, [project.id]: false }))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") e.target.blur();
              }}
              style={styles.editableInput}
            />
          ) : (
            <div
              style={{...styles.nameBase, fontSize: 16}}
              onDoubleClick={() => setEditing((prev) => ({ ...prev, [project.id]: true }))}
            >
              {project.name || "Untitled Project"}
            </div>
          )}

          <div style={{...styles.metaBase, fontSize: 14}}>
            <div style={styles.metaItem}>
              <User size={14} />
              {project.assignee || "Unassigned"}
            </div>
            <div style={styles.metaItem}>
              <CalendarIcon size={14} />
              {project.due || "No Due Date"}
            </div>
            <div 
              style={{...styles.priorityBadge, background: priorityColors[project.priority]}}
            >
              {project.priority}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => openTaskModal(project.id)}
            style={styles.addTaskBtn}
          >
            <Plus size={14} /> Add Task
          </button>
          <button
            onClick={() => deleteProject(project.id)}
            style={styles.deleteBtn}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Project Description */}
      {project.description && (
        <div style={styles.description}>
          {project.description}
        </div>
      )}

      {/* Tasks List */}
      {project.expanded && (
        <div style={{...styles.container, paddingLeft: 12}}>
          {project.tasks.length > 0 ? (
            project.tasks.map((task) => renderTask(task, project.id))
          ) : (
            <div style={styles.emptyState}>
              No tasks yet. Add one!
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTask = (task, projectId) => (
    <div key={task.id} style={styles.itemBase}>
      {/* Task Header */}
      <div style={styles.itemHeader}>
        <div style={styles.mainInfo}>
          <button
            onClick={() => toggleExpand(task.id, 'task')}
            style={styles.expandBtn}
          >
            {task.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {editing[task.id] ? (
            <input
              type="text"
              value={task.name}
              autoFocus
              onChange={(e) =>
                setProjects(prev =>
                  prev.map(p => ({
                    ...p,
                    tasks: p.tasks.map(t =>
                      t.id === task.id ? { ...t, name: e.target.value } : t
                    )
                  }))
                )
              }
              onBlur={() => setEditing((prev) => ({ ...prev, [task.id]: false }))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") e.target.blur();
              }}
              style={{...styles.editableInput, fontSize: '14px'}}
            />
          ) : (
            <div
              style={{...styles.nameBase, fontSize: '14px'}}
              onDoubleClick={() => setEditing((prev) => ({ ...prev, [task.id]: true }))}
            >
              {task.name || "Untitled Task"}
            </div>
          )}

          <div style={{...styles.metaBase, fontSize: 12}}>
            <div style={styles.metaItem}>
              <User size={12} />
              {task.assignee || "Unassigned"}
            </div>
            <div style={styles.metaItem}>
              <CalendarIcon size={12} />
              {task.due || "No Due Date"}
            </div>
            <div 
              style={{...styles.priorityBadge, background: priorityColors[task.priority]}}
            >
              {task.priority}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => openSubtaskModal(task.id)}
            style={{...styles.addTaskBtn, padding: '4px 8px', fontSize: 11}}
          >
            <Plus size={12} /> Add Subtask
          </button>
          <button
            onClick={() => deleteTask(task.id, 'task')}
            style={styles.deleteBtn}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <div style={{...styles.description, fontSize: 13, paddingLeft: 52}}>
          {task.description}
        </div>
      )}

      {/* Subtasks List */}
      {task.expanded && (
        <div style={{...styles.container, paddingLeft: 18}}>
          {task.subtasks.length > 0 ? (
            task.subtasks.map((subtask) => renderSubtask(subtask, projectId))
          ) : (
            <div style={styles.emptyState}>
              No subtasks yet. Add one!
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSubtask = (subtask, projectId) => (
    <div key={subtask.id} style={styles.itemBase}>
      <div style={styles.itemHeader}>
        <div style={styles.mainInfo}>
          {editing[subtask.id] ? (
            <input
              type="text"
              value={subtask.name}
              autoFocus
              onChange={(e) =>
                setProjects(prev =>
                  prev.map(p => ({
                    ...p,
                    tasks: p.tasks.map(t => ({
                      ...t,
                      subtasks: t.subtasks.map(st =>
                        st.id === subtask.id ? { ...st, name: e.target.value } : st
                      )
                    }))
                  }))
                )
              }
              onBlur={() => setEditing((prev) => ({ ...prev, [subtask.id]: false }))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") e.target.blur();
              }}
              style={{...styles.editableInput, fontSize: '13px'}}
            />
          ) : (
            <div
              style={{...styles.nameBase, fontSize: '13px'}}
              onDoubleClick={() => setEditing((prev) => ({ ...prev, [subtask.id]: true }))}
            >
              {subtask.name || "Untitled Subtask"}
            </div>
          )}

          <div style={{...styles.metaBase, fontSize: 11}}>
            <div style={styles.metaItem}>
              <User size={11} />
              {subtask.assignee || "Unassigned"}
            </div>
            <div style={styles.metaItem}>
              <CalendarIcon size={11} />
              {subtask.due || "No Due Date"}
            </div>
            <div 
              style={{...styles.priorityBadge, background: priorityColors[subtask.priority]}}
            >
              {subtask.priority}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => deleteTask(subtask.id, 'subtask')}
            style={styles.deleteBtn}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Subtask Description */}
      {subtask.description && (
        <div style={{...styles.description, fontSize: 12, paddingLeft: 68}}>
          {subtask.description}
        </div>
      )}
    </div>
  );

  // --- Modal Content ---
  const renderModalContent = () => {
    const isProject = activeModal === 'project';
    const isTask = activeModal === 'task';
    const isSubtask = activeModal === 'subtask';
    const isEvent = toggleMode === 'event';

    if (isEvent) {
      return (
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
    }

    return (
      <div style={styles.modalForm}>
        <div style={styles.formGroup}>
          <label style={styles.label}>{isProject ? 'Project' : isTask ? 'Task' : 'Subtask'} Title</label>
          <input
            ref={isProject ? inputRef : null}
            value={isProject ? newProjectName : newTaskName}
            onChange={e => isProject ? setNewProjectName(e.target.value) : setNewTaskName(e.target.value)}
            placeholder={`Enter ${isProject ? 'project' : isTask ? 'task' : 'subtask'} title`}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            value={isProject ? newProjectDescription : newTaskDescription}
            onChange={e => isProject ? setNewProjectDescription(e.target.value) : setNewTaskDescription(e.target.value)}
            placeholder="Enter description"
            style={styles.textarea}
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formRowGroup}>
            <label style={styles.label}>Assignee</label>
            <input
              value={isProject ? newProjectAssignee : newTaskAssignee}
              onChange={e => isProject ? setNewProjectAssignee(e.target.value) : setNewTaskAssignee(e.target.value)}
              placeholder="Assignee name"
              style={styles.input}
            />
          </div>

          <div style={styles.formRowGroup}>
            <label style={styles.label}>Due Date</label>
            <input
              type="date"
              value={isProject ? newProjectDue : newTaskDue}
              onChange={e => isProject ? setNewProjectDue(e.target.value) : setNewTaskDue(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formRowGroup}>
            <label style={styles.label}>Priority</label>
            <select
              value={isProject ? newProjectPriority : newTaskPriority}
              onChange={e => isProject ? setNewProjectPriority(e.target.value) : setNewTaskPriority(e.target.value)}
              style={styles.select}
            >
              {priorities.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.formActions}>
          <button 
            onClick={isProject ? addProject : addTask} 
            style={styles.primaryBtn}
          >
            Create {isProject ? 'Project' : isTask ? 'Task' : 'Subtask'}
          </button>
          <button onClick={closeModal} style={styles.secondaryBtn}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>Task & Event Management</div>
          <div style={styles.headerControls}>
            <button 
              onClick={() => setView(0)} 
              style={view === 0 ? styles.viewBtnActive : styles.viewBtn}
            >
              <ListIcon size={16} /> List
            </button>
            <button 
              onClick={() => setView(1)} 
              style={view === 1 ? styles.viewBtnActive : styles.viewBtn}
            >
              <CalendarIcon size={16} /> Calendar
            </button>
            <select 
              value={filterPriority} 
              onChange={e => setFilterPriority(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="All">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button 
              onClick={openProjectModal}
              style={styles.addBtn}
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
              <div style={styles.emptyStateLarge}>
                No projects yet. Click "Add Project/Event" to create your first project.
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === 1 && (
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
                        style={{
                          ...styles.calendarItem,
                          background: priorityColors[item.priority]
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
                          ...styles.calendarItem,
                          background: eventColors[e.type]
                        }}
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
        )}

        {/* Modal */}
        {addingTop && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalTabs}>
                {activeModal === 'project' && ['Task', 'Event'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setToggleMode(tab.toLowerCase())}
                    style={toggleMode === tab.toLowerCase() ? styles.modalTabActive : styles.modalTab}
                  >
                    {tab}
                  </button>
                ))}
                {(activeModal === 'task' || activeModal === 'subtask') && (
                  <div style={styles.modalTitle}>
                    Add {activeModal === 'task' ? 'Task' : 'Subtask'}
                  </div>
                )}
              </div>
              {renderModalContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}