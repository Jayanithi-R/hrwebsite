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

  // --- Render Components ---
  const renderProject = (project) => (
    <div key={project.id} className="project-item">
      {/* Project Header */}
      <div className="project-header">
        <div className="project-main-info">
          <button
            onClick={() => toggleExpand(project.id, 'project')}
            className="expand-btn"
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
              className="editable-input"
            />
          ) : (
            <div
              className="project-name"
              onDoubleClick={() => setEditing((prev) => ({ ...prev, [project.id]: true }))}
            >
              {project.name || "Untitled Project"}
            </div>
          )}

          <div className="project-meta">
            <div className="meta-item">
              <User size={14} />
              {project.assignee || "Unassigned"}
            </div>
            <div className="meta-item">
              <CalendarIcon size={14} />
              {project.due || "No Due Date"}
            </div>
            <div 
              className="priority-badge"
              style={{ background: priorityColors[project.priority] }}
            >
              {project.priority}
            </div>
          </div>
        </div>

        <div className="project-actions">
          <button
            onClick={() => openTaskModal(project.id)}
            className="add-task-btn"
          >
            <Plus size={14} /> Add Task
          </button>
          <button
            onClick={() => deleteProject(project.id)}
            className="delete-btn"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Project Description */}
      {project.description && (
        <div className="project-description">
          {project.description}
        </div>
      )}

      {/* Tasks List */}
      {project.expanded && (
        <div className="tasks-container">
          {project.tasks.length > 0 ? (
            project.tasks.map((task) => renderTask(task, project.id))
          ) : (
            <div className="empty-state">
              No tasks yet. Add one!
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTask = (task, projectId) => (
    <div key={task.id} className="task-item">
      {/* Task Header */}
      <div className="task-header">
        <div className="task-main-info">
          <button
            onClick={() => toggleExpand(task.id, 'task')}
            className="expand-btn"
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
              className="editable-input"
              style={{ fontSize: '14px' }}
            />
          ) : (
            <div
              className="task-name"
              onDoubleClick={() => setEditing((prev) => ({ ...prev, [task.id]: true }))}
            >
              {task.name || "Untitled Task"}
            </div>
          )}

          <div className="task-meta">
            <div className="meta-item">
              <User size={12} />
              {task.assignee || "Unassigned"}
            </div>
            <div className="meta-item">
              <CalendarIcon size={12} />
              {task.due || "No Due Date"}
            </div>
            <div 
              className="priority-badge"
              style={{ background: priorityColors[task.priority] }}
            >
              {task.priority}
            </div>
          </div>
        </div>

        <div className="task-actions">
          <button
            onClick={() => openSubtaskModal(task.id)}
            className="add-subtask-btn"
          >
            <Plus size={12} /> Add Subtask
          </button>
          <button
            onClick={() => deleteTask(task.id, 'task')}
            className="delete-btn"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <div className="task-description">
          {task.description}
        </div>
      )}

      {/* Subtasks List */}
      {task.expanded && (
        <div className="subtasks-container">
          {task.subtasks.length > 0 ? (
            task.subtasks.map((subtask) => renderSubtask(subtask, projectId))
          ) : (
            <div className="empty-state">
              No subtasks yet. Add one!
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSubtask = (subtask, projectId) => (
    <div key={subtask.id} className="subtask-item">
      <div className="subtask-header">
        <div className="subtask-main-info">
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
              className="editable-input"
              style={{ fontSize: '13px' }}
            />
          ) : (
            <div
              className="subtask-name"
              onDoubleClick={() => setEditing((prev) => ({ ...prev, [subtask.id]: true }))}
            >
              {subtask.name || "Untitled Subtask"}
            </div>
          )}

          <div className="subtask-meta">
            <div className="meta-item">
              <User size={11} />
              {subtask.assignee || "Unassigned"}
            </div>
            <div className="meta-item">
              <CalendarIcon size={11} />
              {subtask.due || "No Due Date"}
            </div>
            <div 
              className="priority-badge"
              style={{ background: priorityColors[subtask.priority] }}
            >
              {subtask.priority}
            </div>
          </div>
        </div>

        <div className="subtask-actions">
          <button
            onClick={() => deleteTask(subtask.id, 'subtask')}
            className="delete-btn"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Subtask Description */}
      {subtask.description && (
        <div className="subtask-description">
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
        <div className="modal-form">
          <div className="form-group">
            <label>Event Name</label>
            <input
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              placeholder="Enter event name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newTaskDue}
                onChange={e => setNewTaskDue(e.target.value)}
              />
            </div>
          </div>
          <div className="form-actions">
            <button onClick={addEvent} className="primary-btn">
              Create Event
            </button>
            <button onClick={closeModal} className="secondary-btn">
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="modal-form">
        <div className="form-group">
          <label>{isProject ? 'Project' : isTask ? 'Task' : 'Subtask'} Title</label>
          <input
            ref={isProject ? inputRef : null}
            value={isProject ? newProjectName : newTaskName}
            onChange={e => isProject ? setNewProjectName(e.target.value) : setNewTaskName(e.target.value)}
            placeholder={`Enter ${isProject ? 'project' : isTask ? 'task' : 'subtask'} title`}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={isProject ? newProjectDescription : newTaskDescription}
            onChange={e => isProject ? setNewProjectDescription(e.target.value) : setNewTaskDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Assignee</label>
            <input
              value={isProject ? newProjectAssignee : newTaskAssignee}
              onChange={e => isProject ? setNewProjectAssignee(e.target.value) : setNewTaskAssignee(e.target.value)}
              placeholder="Assignee name"
            />
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={isProject ? newProjectDue : newTaskDue}
              onChange={e => isProject ? setNewProjectDue(e.target.value) : setNewTaskDue(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={isProject ? newProjectPriority : newTaskPriority}
              onChange={e => isProject ? setNewProjectPriority(e.target.value) : setNewTaskPriority(e.target.value)}
            >
              {priorities.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            onClick={isProject ? addProject : addTask} 
            className="primary-btn"
          >
            Create {isProject ? 'Project' : isTask ? 'Task' : 'Subtask'}
          </button>
          <button onClick={closeModal} className="secondary-btn">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-title">Task & Event Management</div>
          <div className="header-controls">
            <button 
              onClick={() => setView(0)} 
              className={`view-btn ${view === 0 ? 'active' : ''}`}
            >
              <ListIcon size={16} /> List
            </button>
            <button 
              onClick={() => setView(1)} 
              className={`view-btn ${view === 1 ? 'active' : ''}`}
            >
              <CalendarIcon size={16} /> Calendar
            </button>
            <select 
              value={filterPriority} 
              onChange={e => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button 
              onClick={openProjectModal}
              className="add-btn"
            >
              <Plus size={16} /> Add Project/Event
            </button>
          </div>
        </div>

        {/* List View */}
        {view === 0 && (
          <div className="projects-list">
            {projects.length > 0 ? (
              projects.map(p => renderProject(p))
            ) : (
              <div className="empty-state-large">
                No projects yet. Click "Add Project/Event" to create your first project.
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === 1 && (
          <div className="calendar-view">
            <div className="calendar-header">
              <button onClick={() => changeMonth(-1)} className="month-nav">
                <ChevronLeft size={20} />
              </button>
              <div className="current-month">
                {monthNames[currentMonth]} {currentYear}
              </div>
              <button onClick={() => changeMonth(1)} className="month-nav">
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="calendar-grid">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="calendar-day-header">{day}</div>
              ))}
              {calendar.map((day, idx) => {
                const dateStr = day ? new Date(currentYear, currentMonth, day).toISOString().split("T")[0] : null;
                const dayTasks = dateStr ? tasksByDay[dateStr] || [] : [];
                const dayEvents = dateStr ? eventsByDay[dateStr] || [] : [];
                const isToday = day && dateStr === new Date().toISOString().split("T")[0];
                
                return (
                  <div 
                    key={idx} 
                    className={`calendar-day ${isToday ? 'today' : ''} ${dayTasks.length || dayEvents.length ? 'has-items' : ''}`}
                  >
                    {day && <div className="day-number">{day}</div>}
                    {dayTasks.map(item => (
                      <div 
                        key={item.id} 
                        className="calendar-item task"
                        style={{ background: priorityColors[item.priority] }}
                        title={item.name}
                      >
                        {item.name}
                      </div>
                    ))}
                    {dayEvents.map(e => (
                      <div 
                        key={e.id} 
                        className="calendar-item event"
                        style={{ background: eventColors[e.type] }}
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
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-tabs">
                {activeModal === 'project' && ['Task', 'Event'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setToggleMode(tab.toLowerCase())}
                    className={`modal-tab ${toggleMode === tab.toLowerCase() ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
                {(activeModal === 'task' || activeModal === 'subtask') && (
                  <div className="modal-title">
                    Add {activeModal === 'task' ? 'Task' : 'Subtask'}
                  </div>
                )}
              </div>
              {renderModalContent()}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          padding: 16px;
        }

        .main-content {
          margin: 0 auto;
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        /* Header Styles */
        .header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .header-title {
          font-weight: 600;
          font-size: 20px;
          color: #111827;
        }

        .header-controls {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          cursor: pointer;
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .view-btn.active {
          background: #4f46e5;
          color: #fff;
          border-color: #4f46e5;
        }

        .filter-select {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: #fff;
          font-size: 14px;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: background 0.2s;
        }

        .add-btn:hover {
          background: #4338ca;
        }

        /* Project/Task/Subtask Items */
        .project-item, .task-item, .subtask-item {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 12px;
          background: #fff;
          transition: all 0.2s;
        }

        .project-item:hover, .task-item:hover, .subtask-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .project-header, .task-header, .subtask-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          gap: 12px;
        }

        .project-main-info, .task-main-info, .subtask-main-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .expand-btn {
          background: transparent;
          border: none;
          border-radius: 4px;
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          color: #6b7280;
        }

        .expand-btn:hover {
          background: #f3f4f6;
        }

        .project-name, .task-name, .subtask-name {
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.2s;
          font-size: 16px;
        }

        .task-name { font-size: 14px; }
        .subtask-name { font-size: 13px; }

        .project-name:hover, .task-name:hover, .subtask-name:hover {
          background: #f9fafb;
        }

        .project-meta, .task-meta, .subtask-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #6b7280;
          font-size: 14px;
        }

        .task-meta { font-size: 12px; }
        .subtask-meta { font-size: 11px; }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .priority-badge {
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #fff;
        }

        .project-actions, .task-actions, .subtask-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .add-task-btn, .add-subtask-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: #4f46e5;
          color: #fff;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        }

        .add-subtask-btn {
          padding: 4px 8px;
          font-size: 11px;
        }

        .add-task-btn:hover, .add-subtask-btn:hover {
          background: #4338ca;
        }

        .delete-btn {
          background: #ef4444;
          border: none;
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
          color: #fff;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-btn:hover {
          background: #dc2626;
        }

        /* Descriptions */
        .project-description, .task-description, .subtask-description {
          padding: 0 16px 6px 16px;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        .task-description { font-size: 13px; padding-left: 52px; }
        .subtask-description { font-size: 12px; padding-left: 68px; }

        /* Containers */
        .tasks-container, .subtasks-container {
          padding: 0 16px 16px 16px;
        }

        .tasks-container { padding-left: 12px; }
        .subtasks-container { padding-left: 18px; }

        /* Empty States */
        .empty-state {
          color: #6b7280;
          font-size: 14px;
          font-style: italic;
          padding: 8px 0;
        }

        .empty-state-large {
          text-align: center;
          padding: 40px;
          color: #6b7280;
          font-size: 16px;
        }

        /* Editable Input */
        .editable-input {
          font-weight: 600;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 6px 10px;
          outline: none;
          width: 200px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        .editable-input:focus {
          border-color: #2563eb;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px rgba(0,0,0,0.15);
        }

        .modal-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 8px;
        }

        .modal-tab {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-bottom: 3px solid transparent;
          background: transparent;
          font-weight: 400;
          cursor: pointer;
          color: #6b7280;
          font-size: 16px;
          transition: all 0.2s;
        }

        .modal-tab.active {
          font-weight: 600;
          color: #4f46e5;
          border-bottom-color: #4f46e5;
        }

        .modal-title {
          font-weight: 600;
          font-size: 18px;
          color: #111827;
        }

        /* Form Styles */
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .form-row .form-group {
          flex: 1;
          min-width: 150px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        input, textarea, select {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        input:focus, textarea:focus, select:focus {
          border-color: #4f46e5;
        }

        textarea {
          min-height: 80px;
          resize: vertical;
        }

        select {
          appearance: none;
          background: #fff url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%234f46e5" d="M2 0L0 2h4L2 0zM2 5L0 3h4l-2 2z"/></svg>') no-repeat right 12px center;
          background-size: 10px;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .primary-btn {
          padding: 10px 20px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 16px;
          flex: 1;
          transition: background 0.2s;
        }

        .primary-btn:hover {
          background: #4338ca;
        }

        .secondary-btn {
          padding: 10px 20px;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 16px;
          flex: 1;
          transition: background 0.2s;
        }

        .secondary-btn:hover {
          background: #e5e7eb;
        }

        /* Calendar Styles */
        .calendar-view {
          overflow-x: auto;
        }

        .calendar-header {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          font-size: 18px;
        }

        .month-nav {
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .month-nav:hover {
          background: #f3f4f6;
        }

        .current-month {
          font-weight: 600;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(100px, 1fr));
          gap: 4px;
        }

        .calendar-day-header {
          font-weight: 700;
          text-align: center;
          padding: 12px 8px;
          background: #f8fafc;
          border-radius: 4px;
          font-size: 14px;
        }

        .calendar-day {
          min-height: 100px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 8px;
          background: #fff;
          position: relative;
        }

        .calendar-day.today {
          background: #fffbeb;
        }

        .calendar-day.has-items {
          background: #f0f9ff;
        }

        .day-number {
          font-weight: 600;
          margin-bottom: 4px;
          color: #111827;
        }

        .calendar-item {
          font-size: 11px;
          margin-top: 2px;
          padding: 2px 6px;
          border-radius: 4px;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: default;
        }
      `}</style>
    </div>
  );
}