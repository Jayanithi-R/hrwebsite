"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  User,
  Calendar as CalendarIcon,
  List as ListIcon,
  Search,
  Filter,
  Eye
} from "lucide-react";
import { useFavorites } from "../header_sidebar/favorites"; // FIXED: Changed from './components/header_sidebar/favorites'
import Calendar from './CalendarView'; // FIXED: Changed from './calender' to './CalendarView'

export default function CourseDashboardEnhanced({ events, setEvents }) {
  // --- General State ---
  const [view, setView] = useState(0); // 0: List, 1: Calendar, 2: Table
  const [toggleMode, setToggleMode] = useState("task");
  const [editing, setEditing] = useState({});
  const [filterPriority, setFilterPriority] = useState("All");
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskParentId, setTaskParentId] = useState(null);
  const [subtaskParentId, setSubtaskParentId] = useState(null);
  const [originalNames, setOriginalNames] = useState({});

  // --- Favorites Context ---
  const { recentUpdates, setRecentUpdates } = useFavorites();

  // ... rest of your component code remains exactly the same ...

  // --- Form State ---
  const [formData, setFormData] = useState({
    project: { name: "", description: "", assignee: "", due: "", priority: "Low" },
    task: { name: "", description: "", assignee: "", due: "", priority: "Low" },
    subtask: { name: "", description: "", assignee: "", due: "", priority: "Low" },
    event: { name: "", date: "" }
  });

  // --- Projects & Data ---
  const [projects, setProjects] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // --- Load from localStorage ---
  useEffect(() => {
    const savedProjects = localStorage.getItem('courseDashboardProjects');
    const savedEvents = localStorage.getItem('courseDashboardEvents');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    if (savedEvents) {
      setEvents(Array.isArray(JSON.parse(savedEvents)) ? JSON.parse(savedEvents) : []);
    }
  }, [setEvents]);

  // FIXED: Removed the problematic line and fixed the useEffect
  useEffect(() => {
    // Data will be saved automatically
    localStorage.setItem('courseDashboardProjects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('courseDashboardEvents', JSON.stringify(events));
  }, [events]);

  // --- Toggle Expand Function (Missing in original code) ---
  const toggleExpand = (id, type) => {
    switch (type) {
      case 'project':
        setProjects(prev => prev.map(p =>
          p.id === id ? { ...p, expanded: !p.expanded } : p
        ));
        break;
      case 'task':
        setProjects(prev => prev.map(p => ({
          ...p,
          tasks: p.tasks.map(t =>
            t.id === id ? { ...t, expanded: !t.expanded } : t
          )
        })));
        break;
      default:
        break;
    }
  };

  // --- Constants ---
  const priorities = ["High", "Medium", "Low"];
  const priorityColors = { High: "#f87171", Medium: "#facc15", Low: "#4ade80" };
  const eventColors = { Meeting: "#fbbf24", Event: "#34d399" };
  const uid = () => Math.floor(Math.random() * 1000000);

  // --- Modal Management ---
  const openModal = (modalType, parentId = null) => {
    setActiveModal(modalType);
    if (modalType === 'task') setTaskParentId(parentId);
    if (modalType === 'subtask') setSubtaskParentId(parentId);
    setFormData(prev => ({
      ...prev,
      [modalType]: modalType === 'event' 
        ? { name: "", date: "" }
        : { name: "", description: "", assignee: "", due: "", priority: "Low" }
    }));
  };

  const closeModal = () => {
    setActiveModal(null);
    setTaskParentId(null);
    setSubtaskParentId(null);
  };

  // --- Data Management ---
  const createItem = (type, data, parentId = null) => {
    const baseItem = {
      id: uid(),
      name: data.name.trim(),
      description: data.description,
      assignee: data.assignee,
      due: data.due,
      priority: data.priority,
      expanded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    switch (type) {
      case 'project':
        return { ...baseItem, tasks: [] };
      case 'task':
        return { ...baseItem, subtasks: [] };
      case 'subtask':
        return baseItem;
      case 'event':
        return {
          id: uid(),
          name: data.name.trim(),
          date: data.date,
          type: "Event",
          createdAt: new Date().toISOString()
        };
      default:
        return baseItem;
    }
  };

  const addItem = () => {
    const currentForm = formData[activeModal];
    if (!currentForm?.name?.trim()) {
      alert(`Please enter a name for the ${activeModal}`);
      return;
    }

    const item = createItem(activeModal, currentForm,
      activeModal === 'task' ? taskParentId :
      activeModal === 'subtask' ? subtaskParentId : null
    );

    const assigneeStr = item.assignee ? ` (Assignee: ${item.assignee})` : '';
    const creationEventData = {
      name: `Created ${activeModal} "${item.name}"${assigneeStr}`,
      due: item.createdAt.split('T')[0]
    };
    const creationEvent = createItem('event', creationEventData);

    switch (activeModal) {
      case 'project':
        setProjects(s => [item, ...s]);
        setEvents(prev => Array.isArray(prev) ? [...prev, creationEvent] : [creationEvent]);
        if (currentForm.due) {
          const dueEventData = {
            name: `Due ${activeModal} "${item.name}"${assigneeStr}`,
            due: currentForm.due
          };
          const dueEvent = createItem('event', dueEventData);
          setEvents(prev => Array.isArray(prev) ? [...prev, dueEvent] : [dueEvent]);
        }
        break;
      case 'task':
        if (!taskParentId) return;
        setProjects(s => s.map(p =>
          p.id === taskParentId ? {
            ...p,
            tasks: [item, ...p.tasks],
            updatedAt: new Date().toISOString()
          } : p
        ));
        setEvents(prev => Array.isArray(prev) ? [...prev, creationEvent] : [creationEvent]);
        if (currentForm.due) {
          const dueEventData = {
            name: `Due ${activeModal} "${item.name}"${assigneeStr}`,
            due: currentForm.due
          };
          const dueEvent = createItem('event', dueEventData);
          setEvents(prev => Array.isArray(prev) ? [...prev, dueEvent] : [dueEvent]);
        }
        break;
      case 'subtask':
        if (!subtaskParentId) return;
        setProjects(s => s.map(p => ({
          ...p,
          tasks: p.tasks.map(t =>
            t.id === subtaskParentId ? {
              ...t,
              subtasks: [item, ...t.subtasks],
              updatedAt: new Date().toISOString()
            } : t
          )
        })));
        setEvents(prev => Array.isArray(prev) ? [...prev, creationEvent] : [creationEvent]);
        if (currentForm.due) {
          const dueEventData = {
            name: `Due ${activeModal} "${item.name}"${assigneeStr}`,
            due: currentForm.due
          };
          const dueEvent = createItem('event', dueEventData);
          setEvents(prev => Array.isArray(prev) ? [...prev, dueEvent] : [dueEvent]);
        }
        break;
      case 'event':
        setEvents(prev => Array.isArray(prev) ? [...prev, item] : [item]);
        break;
      default:
        return;
    }

    setRecentUpdates(prev => [
      `Created ${activeModal} "${item.name}" at ${new Date().toLocaleString()}`,
      ...prev
    ].slice(0, 10));

    closeModal();
  };

  const updateEventNames = (itemId, oldName, newName, type) => {
    setEvents(prev => prev.map(event => {
      if (event.name.includes(`"${oldName}"`)) {
        return {
          ...event,
          name: event.name.replace(`"${oldName}"`, `"${newName}"`)
        };
      }
      return event;
    }));
  };

  const deleteItem = (id, type = 'project') => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    const item = findItemDetails(type, id);
    if (item) {
      setEvents(prev => prev.filter(event => !event.name.includes(`"${item.name}"`)));
    }

    switch (type) {
      case 'project':
        setProjects(s => s.filter(p => p.id !== id));
        break;
      case 'task':
        setProjects(s => s.map(p => ({
          ...p,
          tasks: p.tasks.filter(t => t.id !== id)
        })));
        break;
      case 'subtask':
        setProjects(s => s.map(p => ({
          ...p,
          tasks: p.tasks.map(t => ({
            ...t,
            subtasks: t.subtasks.filter(st => st.id !== id)
          }))
        })));
        break;
    }

    setRecentUpdates(prev => [
      `Deleted ${type} "${item.name}" at ${new Date().toLocaleString()}`,
      ...prev
    ].slice(0, 10));
  };

  const findItemDetails = (type, id) => {
    switch (type) {
      case 'project':
        return projects.find(p => p.id === id);
      case 'task':
        for (const project of projects) {
          const task = project.tasks.find(t => t.id === id);
          if (task) return { ...task, projectName: project.name };
        }
        return null;
      case 'subtask':
        for (const project of projects) {
          for (const task of project.tasks) {
            const subtask = task.subtasks.find(st => st.id === id);
            if (subtask) return { ...subtask, taskName: task.name, projectName: project.name };
          }
        }
        return null;
      default:
        return null;
    }
  };

  // --- Calendar Navigation ---
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

  // --- Render Functions ---
  const renderProject = (project) => (
    <div key={project.id} style={styles.itemBase}>
      <div style={styles.itemHeader}>
        <div style={styles.mainInfo}>
          <button onClick={() => toggleExpand(project.id, 'project')} style={styles.expandBtn}>
            {project.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {editing[project.id] ? (
            <input
              type="text"
              value={project.name}
              autoFocus
              onChange={(e) =>
                setProjects(prev => prev.map(p =>
                  p.id === project.id ? { ...p, name: e.target.value } : p
                ))
              }
              onBlur={() => {
                setEditing(prev => ({ ...prev, [project.id]: false }));
                if (project.name !== originalNames[project.id]) {
                  updateEventNames(project.id, originalNames[project.id], project.name, 'project');
                  setRecentUpdates(prev => [
                    `Updated project from "${originalNames[project.id]}" to "${project.name}" at ${new Date().toLocaleString()}`,
                    ...prev
                  ].slice(0, 10));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") e.target.blur();
              }}
              style={styles.editableInput}
            />
          ) : (
            <div
              style={{ ...styles.nameBase, fontSize: 16 }}
              onDoubleClick={() => {
                setEditing(prev => ({ ...prev, [project.id]: true }));
                setOriginalNames(prev => ({ ...prev, [project.id]: project.name }));
              }}
            >
              {project.name || "Untitled Project"}
            </div>
          )}
          <div style={{ ...styles.metaBase, fontSize: 14 }}>
            <div style={styles.metaItem}>
              <User size={14} />
              {project.assignee || "Unassigned"}
            </div>
            <div style={styles.metaItem}>
              <CalendarIcon size={14} />
              {project.due || "No Due Date"}
            </div>
            <div style={{ ...styles.priorityBadge, background: priorityColors[project.priority] }}>
              {project.priority}
            </div>
          </div>
        </div>
        <div style={styles.actions}>
          <button
            onClick={() => openModal('task', project.id)}
            style={styles.addTaskBtn}
          >
            <Plus size={14} /> Add Task
          </button>
          <button
            onClick={() => deleteItem(project.id, 'project')}
            style={styles.deleteBtn}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {project.description && (
        <div style={styles.description}>
          {project.description}
        </div>
      )}
      {project.expanded && (
        <div style={{ ...styles.container, paddingLeft: 12 }}>
          {project.tasks.length > 0 ? (
            project.tasks.map(task => renderTask(task, project.id))
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
      <div style={styles.itemHeader}>
        <div style={styles.mainInfo}>
          <button onClick={() => toggleExpand(task.id, 'task')} style={styles.expandBtn}>
            {task.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {editing[task.id] ? (
            <input
              type="text"
              value={task.name}
              autoFocus
              onChange={(e) => {
                // FIXED: Added proper function body with return statement
                setProjects(prev => prev.map(p => ({
                  ...p,
                  tasks: p.tasks.map(t =>
                    t.id === task.id ? { ...t, name: e.target.value } : t
                  )
                })));
              }}
              onBlur={() => {
                setEditing(prev => ({ ...prev, [task.id]: false }));
                if (task.name !== originalNames[task.id]) {
                  updateEventNames(task.id, originalNames[task.id], task.name, 'task');
                  setRecentUpdates(prev => [
                    `Updated task from "${originalNames[task.id]}" to "${task.name}" at ${new Date().toLocaleString()}`,
                    ...prev
                  ].slice(0, 10));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") e.target.blur();
              }}
              style={{ ...styles.editableInput, fontSize: '14px' }}
            />
          ) : (
            <div
              style={{ ...styles.nameBase, fontSize: '14px' }}
              onDoubleClick={() => {
                setEditing(prev => ({ ...prev, [task.id]: true }));
                setOriginalNames(prev => ({ ...prev, [task.id]: task.name }));
              }}
            >
              {task.name || "Untitled Task"}
            </div>
          )}
          <div style={{ ...styles.metaBase, fontSize: 12 }}>
            <div style={styles.metaItem}>
              <User size={12} />
              {task.assignee || "Unassigned"}
            </div>
            <div style={styles.metaItem}>
              <CalendarIcon size={12} />
              {task.due || "No Due Date"}
            </div>
            <div style={{ ...styles.priorityBadge, background: priorityColors[task.priority] }}>
              {task.priority}
            </div>
          </div>
        </div>
        <div style={styles.actions}>
          <button
            onClick={() => openModal('subtask', task.id)}
            style={{ ...styles.addTaskBtn, padding: '4px 8px', fontSize: 11 }}
          >
            <Plus size={12} /> Add Subtask
          </button>
          <button
            onClick={() => deleteItem(task.id, 'task')}
            style={styles.deleteBtn}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      {task.description && (
        <div style={{ ...styles.description, fontSize: 13, paddingLeft: 52 }}>
          {task.description}
        </div>
      )}
      {task.expanded && (
        <div style={{ ...styles.container, paddingLeft: 18 }}>
          {task.subtasks.length > 0 ? (
            task.subtasks.map(subtask => renderSubtask(subtask, projectId))
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
              onChange={(e) => {
                // FIXED: Added proper function body with return statement
                setProjects(prev => prev.map(p => ({
                  ...p,
                  tasks: p.tasks.map(t => ({
                    ...t,
                    subtasks: t.subtasks.map(st =>
                      st.id === subtask.id ? { ...st, name: e.target.value } : st
                    )
                  }))
                })));
              }}
              onBlur={() => {
                setEditing(prev => ({ ...prev, [subtask.id]: false }));
                if (subtask.name !== originalNames[subtask.id]) {
                  updateEventNames(subtask.id, originalNames[subtask.id], subtask.name, 'subtask');
                  setRecentUpdates(prev => [
                    `Updated subtask from "${originalNames[subtask.id]}" to "${subtask.name}" at ${new Date().toLocaleString()}`,
                    ...prev
                  ].slice(0, 10));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") e.target.blur();
              }}
              style={{ ...styles.editableInput, fontSize: '13px' }}
            />
          ) : (
            <div
              style={{ ...styles.nameBase, fontSize: '13px' }}
              onDoubleClick={() => {
                setEditing(prev => ({ ...prev, [subtask.id]: true }));
                setOriginalNames(prev => ({ ...prev, [subtask.id]: subtask.name }));
              }}
            >
              {subtask.name || "Untitled Subtask"}
            </div>
          )}
          <div style={{ ...styles.metaBase, fontSize: 11 }}>
            <div style={styles.metaItem}>
              <User size={11} />
              {subtask.assignee || "Unassigned"}
            </div>
            <div style={styles.metaItem}>
              <CalendarIcon size={11} />
              {subtask.due || "No Due Date"}
            </div>
            <div style={{ ...styles.priorityBadge, background: priorityColors[subtask.priority] }}>
              {subtask.priority}
            </div>
          </div>
        </div>
        <div style={styles.actions}>
          <button
            onClick={() => deleteItem(subtask.id, 'subtask')}
            style={styles.deleteBtn}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
      {subtask.description && (
        <div style={{ ...styles.description, fontSize: 12, paddingLeft: 68 }}>
          {subtask.description}
        </div>
      )}
    </div>
  );

  // --- Table View ---
  const renderTableView = () => {
    const filteredItems = [];
    projects.forEach(project => {
      filteredItems.push({ type: 'project', ...project });
      project.tasks.forEach(task => {
        filteredItems.push({ type: 'task', projectName: project.name, ...task });
        task.subtasks.forEach(subtask => {
          filteredItems.push({ type: 'subtask', projectName: project.name, taskName: task.name, ...subtask });
        });
      });
    });

    const filteredByPriority = filterPriority === "All"
      ? filteredItems
      : filteredItems.filter(item => item.priority === filterPriority);

    const filtered = filteredByPriority.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>Type</th>
              <th style={styles.tableCell}>Name</th>
              <th style={styles.tableCell}>Project</th>
              <th style={styles.tableCell}>Task</th>
              <th style={styles.tableCell}>Assignee</th>
              <th style={styles.tableCell}>Due Date</th>
              <th style={styles.tableCell}>Priority</th>
              <th style={styles.tableCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(item => (
                <tr key={item.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
                  <td style={styles.tableCell}>
                    {editing[item.id] ? (
                      <input
                        type="text"
                        value={item.name}
                        autoFocus
                        onChange={(e) => {
                          if (item.type === 'project') {
                            setProjects(prev => prev.map(p =>
                              p.id === item.id ? { ...p, name: e.target.value } : p
                            ));
                          } else if (item.type === 'task') {
                            setProjects(prev => prev.map(p => ({
                              ...p,
                              tasks: p.tasks.map(t =>
                                t.id === item.id ? { ...t, name: e.target.value } : t
                              )
                            })));
                          } else if (item.type === 'subtask') {
                            setProjects(prev => prev.map(p => ({
                              ...p,
                              tasks: p.tasks.map(t => ({
                                ...t,
                                subtasks: t.subtasks.map(st =>
                                  st.id === item.id ? { ...st, name: e.target.value } : st
                                )
                              }))
                            })));
                          }
                        }}
                        onBlur={() => {
                          setEditing(prev => ({ ...prev, [item.id]: false }));
                          if (item.name !== originalNames[item.id]) {
                            updateEventNames(item.id, originalNames[item.id], item.name, item.type);
                            setRecentUpdates(prev => [
                              `Updated ${item.type} from "${originalNames[item.id]}" to "${item.name}" at ${new Date().toLocaleString()}`,
                              ...prev
                            ].slice(0, 10));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Escape") e.target.blur();
                        }}
                        style={styles.editableInput}
                      />
                    ) : (
                      <span
                        onDoubleClick={() => {
                          setEditing(prev => ({ ...prev, [item.id]: true }));
                          setOriginalNames(prev => ({ ...prev, [item.id]: item.name }));
                        }}
                      >
                        {item.name || `Untitled ${item.type}`}
                      </span>
                    )}
                  </td>
                  <td style={styles.tableCell}>{item.projectName || '-'}</td>
                  <td style={styles.tableCell}>{item.taskName || '-'}</td>
                  <td style={styles.tableCell}>{item.assignee || 'Unassigned'}</td>
                  <td style={styles.tableCell}>{item.due || 'No Due Date'}</td>
                  <td style={styles.tableCell}>
                    <span style={{ ...styles.priorityBadge, background: priorityColors[item.priority] }}>
                      {item.priority}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.actions}>
                      <button
                        onClick={() => deleteItem(item.id, item.type)}
                        style={styles.deleteBtn}
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={styles.emptyState}>
                  No items match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

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
              value={formData.project.name}
              onChange={e => setFormData(prev => ({ ...prev, project: { ...prev.project, name: e.target.value } }))}
              placeholder="Enter project title"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.project.description}
              onChange={e => setFormData(prev => ({ ...prev, project: { ...prev.project, description: e.target.value } }))}
              placeholder="Enter description"
              style={styles.textarea}
            />
          </div>
          <div style={styles.formRow}>
            <div style={styles.formRowGroup}>
              <label style={styles.label}>Assignee</label>
              <input
                value={formData.project.assignee}
                onChange={e => setFormData(prev => ({ ...prev, project: { ...prev.project, assignee: e.target.value } }))}
                placeholder="Assignee name"
                style={styles.input}
              />
            </div>
            <div style={styles.formRowGroup}>
              <label style={styles.label}>Due Date</label>
              <input
                type="date"
                value={formData.project.due}
                onChange={e => setFormData(prev => ({ ...prev, project: { ...prev.project, due: e.target.value } }))}
                style={styles.input}
              />
            </div>
            <div style={styles.formRowGroup}>
              <label style={styles.label}>Priority</label>
              <select
                value={formData.project.priority}
                onChange={e => setFormData(prev => ({ ...prev, project: { ...prev.project, priority: e.target.value } }))}
                style={styles.select}
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.formActions}>
            <button onClick={addItem} style={styles.primaryBtn}>
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
              value={formData.event.name}
              onChange={e => setFormData(prev => ({ ...prev, event: { ...prev.event, name: e.target.value } }))}
              placeholder="Enter event name"
              style={styles.input}
            />
          </div>
          <div style={styles.formRow}>
            <div style={styles.formRowGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={formData.event.date}
                onChange={e => setFormData(prev => ({ ...prev, event: { ...prev.event, date: e.target.value } }))}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.formActions}>
            <button onClick={addItem} style={styles.primaryBtn}>
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
          value={formData.task.name}
          onChange={e => setFormData(prev => ({ ...prev, task: { ...prev.task, name: e.target.value } }))}
          placeholder="Enter task title"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Description</label>
        <textarea
          value={formData.task.description}
          onChange={e => setFormData(prev => ({ ...prev, task: { ...prev.task, description: e.target.value } }))}
          placeholder="Enter description"
          style={styles.textarea}
        />
      </div>
      <div style={styles.formRow}>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Assignee</label>
          <input
            value={formData.task.assignee}
            onChange={e => setFormData(prev => ({ ...prev, task: { ...prev.task, assignee: e.target.value } }))}
            placeholder="Assignee name"
            style={styles.input}
          />
        </div>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Due Date</label>
          <input
            type="date"
            value={formData.task.due}
            onChange={e => setFormData(prev => ({ ...prev, task: { ...prev.task, due: e.target.value } }))}
            style={styles.input}
          />
        </div>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Priority</label>
          <select
            value={formData.task.priority}
            onChange={e => setFormData(prev => ({ ...prev, task: { ...prev.task, priority: e.target.value } }))}
            style={styles.select}
          >
            {priorities.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={styles.formActions}>
        <button onClick={addItem} style={styles.primaryBtn}>
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
          value={formData.subtask.name}
          onChange={e => setFormData(prev => ({ ...prev, subtask: { ...prev.subtask, name: e.target.value } }))}
          placeholder="Enter subtask title"
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Description</label>
        <textarea
          value={formData.subtask.description}
          onChange={e => setFormData(prev => ({ ...prev, subtask: { ...prev.subtask, description: e.target.value } }))}
          placeholder="Enter description"
          style={styles.textarea}
        />
      </div>
      <div style={styles.formRow}>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Assignee</label>
          <input
            value={formData.subtask.assignee}
            onChange={e => setFormData(prev => ({ ...prev, subtask: { ...prev.subtask, assignee: e.target.value } }))}
            placeholder="Assignee name"
            style={styles.input}
          />
        </div>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Due Date</label>
          <input
            type="date"
            value={formData.subtask.due}
            onChange={e => setFormData(prev => ({ ...prev, subtask: { ...prev.subtask, due: e.target.value } }))}
            style={styles.input}
          />
        </div>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Priority</label>
          <select
            value={formData.subtask.priority}
            onChange={e => setFormData(prev => ({ ...prev, subtask: { ...prev.subtask, priority: e.target.value } }))}
            style={styles.select}
          >
            {priorities.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={styles.formActions}>
        <button onClick={addItem} style={styles.primaryBtn}>
          Create Subtask
        </button>
        <button onClick={closeModal} style={styles.secondaryBtn}>
          Cancel
        </button>
      </div>
    </div>
  );

  const renderEventModal = () => (
    <div style={styles.modalForm}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Event Name</label>
        <input
          value={formData.event.name}
          onChange={e => setFormData(prev => ({ ...prev, event: { ...prev.event, name: e.target.value } }))}
          placeholder="Enter event name"
          style={styles.input}
        />
      </div>
      <div style={styles.formRow}>
        <div style={styles.formRowGroup}>
          <label style={styles.label}>Date</label>
          <input
            type="date"
            value={formData.event.date}
            onChange={e => setFormData(prev => ({ ...prev, event: { ...prev.event, date: e.target.value } }))}
            style={styles.input}
          />
        </div>
      </div>
      <div style={styles.formActions}>
        <button onClick={addItem} style={styles.primaryBtn}>
          Create Event
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

  // --- Styles ---
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
    tableContainer: {
      overflowX: 'auto',
      marginBottom: 20
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: '#fff',
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    tableHeader: {
      background: '#f8fafc',
      color: '#374151',
      fontWeight: 600,
      fontSize: 14
    },
    tableRow: {
      borderBottom: '1px solid #e5e7eb'
    },
    tableCell: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: 14,
      color: '#374151'
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.mainContent}>
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
            <button
              onClick={() => setView(2)}
              style={view === 2 ? styles.viewBtnActive : styles.viewBtn}
            >
              <ListIcon size={16} /> Table
            </button>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="All">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              style={{ ...styles.input, width: 200 }}
            />
            <button
              onClick={() => openModal('project')}
              style={styles.addBtn}
            >
              <Plus size={16} /> Add Project/Event
            </button>
          </div>
        </div>

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

        {view === 1 && (
          <Calendar
            projects={projects}
            events={events}
            currentMonth={currentMonth}
            currentYear={currentYear}
            changeMonth={changeMonth}
            styles={styles}
            priorityColors={priorityColors}
            eventColors={eventColors}
          />
        )}

        {view === 2 && renderTableView()}

        {activeModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <div style={styles.modalTitle}>{getModalTitle()}</div>
                <button onClick={closeModal} style={styles.closeBtn}>×</button>
              </div>
              {renderModalContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}