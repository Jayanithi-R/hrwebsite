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
  Bookmark,
  Eye,
  Edit3,
  X
} from "lucide-react";

export default function CourseDashboardEnhanced() {
  // --- Consolidated State ---
  const [editing, setEditing] = useState({});
  const [filterPriority, setFilterPriority] = useState("All");
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskParentId, setTaskParentId] = useState(null);
  const [subtaskParentId, setSubtaskParentId] = useState(null);
  const [toggleMode, setToggleMode] = useState("task");
  const [detailView, setDetailView] = useState({ isOpen: false, type: null, data: null });

  // --- Consolidated Form State ---
  const [formData, setFormData] = useState({
    project: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low"
    },
    task: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low"
    },
    subtask: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low"
    }
  });

  // --- Projects & Data with localStorage persistence ---
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('courseDashboardProjects');
    const savedEvents = localStorage.getItem('courseDashboardEvents');

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save data to localStorage whenever projects or events change
  useEffect(() => {
    localStorage.setItem('courseDashboardProjects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('courseDashboardEvents', JSON.stringify(events));
  }, [events]);

  // --- Constants ---
  const priorities = ["High", "Medium", "Low"];
  const priorityColors = { High: "#f87171", Medium: "#facc15", Low: "#4ade80" };
  const uid = () => Math.floor(Math.random() * 1000000);

  // --- Detail View Functions ---
  const openDetailView = (type, data) => {
    setDetailView({ isOpen: true, type, data });
  };

  const closeDetailView = () => {
    setDetailView({ isOpen: false, type: null, data: null });
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

  // --- Form Management ---
  const updateFormData = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const resetFormData = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        name: "",
        description: "",
        assignee: "",
        due: "",
        priority: "Low"
      }
    }));
  };

  // --- Modal Management ---
  const openModal = (modalType, parentId = null) => {
    setActiveModal(modalType);
    if (modalType === 'task') setTaskParentId(parentId);
    if (modalType === 'subtask') setSubtaskParentId(parentId);

    // Reset relevant form
    if (modalType === 'project') resetFormData('project');
    if (modalType === 'task') resetFormData('task');
    if (modalType === 'subtask') resetFormData('subtask');
  };

  const closeModal = () => {
    setActiveModal(null);
    setTaskParentId(null);
    setSubtaskParentId(null);
  };

  // --- Item Creation ---
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
          date: data.due,
          type: "Event",
          createdAt: new Date().toISOString()
        };
      default:
        return baseItem;
    }
  };

  // --- Data Management ---
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

    switch (activeModal) {
      case 'project':
        setProjects(s => [item, ...s]);
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
        break;
      case 'event':
        setEvents(s => [...s, item]);
        break;
      default:
        return;
    }

    resetFormData(activeModal);
    closeModal();
  };

  // --- Expand/Collapse ---
  const toggleExpand = (id, type = 'project') => {
    setProjects(s => s.map(item => {
      if (type === 'project' && item.id === id) {
        return { ...item, expanded: !item.expanded };
      }
      if (type === 'task') {
        return {
          ...item,
          tasks: item.tasks.map(task =>
            task.id === id ? { ...task, expanded: !task.expanded } : task
          )
        };
      }
      return item;
    }));
  };

  // --- Delete Functions ---
  const deleteItem = (id, type = 'project') => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
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
  };

  // --- Clear All Data ---
  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      setProjects([]);
      setEvents([]);
      localStorage.removeItem('courseDashboardProjects');
      localStorage.removeItem('courseDashboardEvents');
    }
  };

  // --- Reusable Components ---
  const FormField = ({ label, type = "text", value, onChange, placeholder, options }) => (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      {type === "select" ? (
        <select value={value} onChange={onChange} style={styles.select}>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.textarea}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.input}
        />
      )}
    </div>
  );

  const FormRow = ({ children }) => (
    <div style={styles.formRow}>{children}</div>
  );

  // --- Detail View Modal ---
  const renderDetailView = () => {
    const { type, data } = detailView;
    if (!data) return null;

    return (
      <div style={styles.detailOverlay}>
        <div style={styles.detailModal}>
          <div style={styles.detailHeader}>
            <div style={styles.detailTitle}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Details
            </div>
            <button onClick={closeDetailView} style={styles.detailCloseBtn}>
              <X size={20} />
            </button>
          </div>

          <div style={styles.detailContent}>
            <div style={styles.detailSection}>
              <h3 style={styles.detailName}>{data.name || `Untitled ${type}`}</h3>
              {data.projectName && (
                <div style={styles.detailMeta}>
                  <strong>Project:</strong> {data.projectName}
                </div>
              )}
              {data.taskName && (
                <div style={styles.detailMeta}>
                  <strong>Task:</strong> {data.taskName}
                </div>
              )}
            </div>

            <div style={styles.detailSection}>
              <h4 style={styles.detailSubtitle}>Description</h4>
              <div style={styles.detailDescription}>
                {data.description || "No description provided."}
              </div>
            </div>

            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <User size={16} style={styles.detailIcon} />
                <div>
                  <div style={styles.detailLabel}>Assignee</div>
                  <div style={styles.detailValue}>{data.assignee || "Unassigned"}</div>
                </div>
              </div>

              <div style={styles.detailItem}>
                <CalendarIcon size={16} style={styles.detailIcon} />
                <div>
                  <div style={styles.detailLabel}>Due Date</div>
                  <div style={styles.detailValue}>{data.due || "No due date"}</div>
                </div>
              </div>

              <div style={styles.detailItem}>
                <div style={styles.detailIcon}>
                  <div
                    style={{
                      ...styles.priorityDot,
                      background: priorityColors[data.priority]
                    }}
                  />
                </div>
                <div>
                  <div style={styles.detailLabel}>Priority</div>
                  <div style={styles.detailValue}>{data.priority}</div>
                </div>
              </div>

              {data.createdAt && (
                <div style={styles.detailItem}>
                  <div style={styles.detailIcon}>📅</div>
                  <div>
                    <div style={styles.detailLabel}>Created</div>
                    <div style={styles.detailValue}>
                      {new Date(data.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {type === 'project' && data.tasks && data.tasks.length > 0 && (
              <div style={styles.detailSection}>
                <h4 style={styles.detailSubtitle}>Tasks ({data.tasks.length})</h4>
                <div style={styles.detailList}>
                  {data.tasks.map(task => (
                    <div key={task.id} style={styles.detailListItem}>
                      <span>{task.name}</span>
                      <span style={styles.detailBadge}>{task.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type === 'task' && data.subtasks && data.subtasks.length > 0 && (
              <div style={styles.detailSection}>
                <h4 style={styles.detailSubtitle}>Subtasks ({data.subtasks.length})</h4>
                <div style={styles.detailList}>
                  {data.subtasks.map(subtask => (
                    <div key={subtask.id} style={styles.detailListItem}>
                      <span>{subtask.name}</span>
                      <span style={styles.detailBadge}>{subtask.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Render Functions ---
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
              style={{ ...styles.nameBase, fontSize: 16 }}
              onDoubleClick={() => setEditing((prev) => ({ ...prev, [project.id]: true }))}
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
            <div
              style={{ ...styles.priorityBadge, background: priorityColors[project.priority] }}
            >
              {project.priority}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => openDetailView('project', project)}
            style={styles.viewBtn}
            title="View Details"
          >
            <Eye size={14} />
          </button>
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

      {/* Project Description */}
      {project.description && (
        <div style={styles.description}>
          {project.description}
        </div>
      )}

      {/* Tasks List */}
      {project.expanded && (
        <div style={{ ...styles.container, paddingLeft: 12 }}>
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
              style={{ ...styles.editableInput, fontSize: '14px' }}
            />
          ) : (
            <div
              style={{ ...styles.nameBase, fontSize: '14px' }}
              onDoubleClick={() => setEditing((prev) => ({ ...prev, [task.id]: true }))}
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
            <div
              style={{ ...styles.priorityBadge, background: priorityColors[task.priority] }}
            >
              {task.priority}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => openDetailView('task', task)}
            style={styles.viewBtn}
            title="View Details"
          >
            <Eye size={12} />
          </button>
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

      {/* Task Description */}
      {task.description && (
        <div style={{ ...styles.description, fontSize: 13, paddingLeft: 52 }}>
          {task.description}
        </div>
      )}

      {/* Subtasks List */}
      {task.expanded && (
        <div style={{ ...styles.container, paddingLeft: 18 }}>
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
              style={{ ...styles.editableInput, fontSize: '13px' }}
            />
          ) : (
            <div
              style={{ ...styles.nameBase, fontSize: '13px' }}
              onDoubleClick={() => setEditing((prev) => ({ ...prev, [subtask.id]: true }))}
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
            <div
              style={{ ...styles.priorityBadge, background: priorityColors[subtask.priority] }}
            >
              {subtask.priority}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => openDetailView('subtask', subtask)}
            style={styles.viewBtn}
            title="View Details"
          >
            <Eye size={11} />
          </button>
          <button
            onClick={() => deleteItem(subtask.id, 'subtask')}
            style={styles.deleteBtn}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Subtask Description */}
      {subtask.description && (
        <div style={{ ...styles.description, fontSize: 12, paddingLeft: 68 }}>
          {subtask.description}
        </div>
      )}
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
          <FormField
            label="Project Title"
            value={formData.project.name}
            onChange={e => updateFormData('project', 'name', e.target.value)}
            placeholder="Enter project title"
          />

          <FormField
            label="Description"
            type="textarea"
            value={formData.project.description}
            onChange={e => updateFormData('project', 'description', e.target.value)}
            placeholder="Enter description"
          />

          <FormRow>
            <div style={styles.formRowGroup}>
              <FormField
                label="Assignee"
                value={formData.project.assignee}
                onChange={e => updateFormData('project', 'assignee', e.target.value)}
                placeholder="Assignee name"
              />
            </div>
            <div style={styles.formRowGroup}>
              <FormField
                label="Due Date"
                type="date"
                value={formData.project.due}
                onChange={e => updateFormData('project', 'due', e.target.value)}
              />
            </div>
            <div style={styles.formRowGroup}>
              <FormField
                label="Priority"
                type="select"
                value={formData.project.priority}
                onChange={e => updateFormData('project', 'priority', e.target.value)}
                options={priorities}
              />
            </div>
          </FormRow>

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
          <FormField
            label="Event Name"
            value={formData.task.name}
            onChange={e => updateFormData('task', 'name', e.target.value)}
            placeholder="Enter event name"
          />
          <FormRow>
            <div style={styles.formRowGroup}>
              <FormField
                label="Date"
                type="date"
                value={formData.task.due}
                onChange={e => updateFormData('task', 'due', e.target.value)}
              />
            </div>
          </FormRow>
          <div style={styles.formActions}>
            <button onClick={() => {
              setActiveModal('event');
              addItem();
            }} style={styles.primaryBtn}>
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
      <FormField
        label="Task Title"
        value={formData.task.name}
        onChange={e => updateFormData('task', 'name', e.target.value)}
        placeholder="Enter task title"
      />

      <FormField
        label="Description"
        type="textarea"
        value={formData.task.description}
        onChange={e => updateFormData('task', 'description', e.target.value)}
        placeholder="Enter description"
      />

      <FormRow>
        <div style={styles.formRowGroup}>
          <FormField
            label="Assignee"
            value={formData.task.assignee}
            onChange={e => updateFormData('task', 'assignee', e.target.value)}
            placeholder="Assignee name"
          />
        </div>
        <div style={styles.formRowGroup}>
          <FormField
            label="Due Date"
            type="date"
            value={formData.task.due}
            onChange={e => updateFormData('task', 'due', e.target.value)}
          />
        </div>
        <div style={styles.formRowGroup}>
          <FormField
            label="Priority"
            type="select"
            value={formData.task.priority}
            onChange={e => updateFormData('task', 'priority', e.target.value)}
            options={priorities}
          />
        </div>
      </FormRow>

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
      <FormField
        label="Subtask Title"
        value={formData.subtask.name}
        onChange={e => updateFormData('subtask', 'name', e.target.value)}
        placeholder="Enter subtask title"
      />

      <FormField
        label="Description"
        type="textarea"
        value={formData.subtask.description}
        onChange={e => updateFormData('subtask', 'description', e.target.value)}
        placeholder="Enter description"
      />

      <FormRow>
        <div style={styles.formRowGroup}>
          <FormField
            label="Assignee"
            value={formData.subtask.assignee}
            onChange={e => updateFormData('subtask', 'assignee', e.target.value)}
            placeholder="Assignee name"
          />
        </div>
        <div style={styles.formRowGroup}>
          <FormField
            label="Due Date"
            type="date"
            value={formData.subtask.due}
            onChange={e => updateFormData('subtask', 'due', e.target.value)}
          />
        </div>
        <div style={styles.formRowGroup}>
          <FormField
            label="Priority"
            type="select"
            value={formData.subtask.priority}
            onChange={e => updateFormData('subtask', 'priority', e.target.value)}
            options={priorities}
          />
        </div>
      </FormRow>

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
      <FormField
        label="Event Name"
        value={formData.task.name}
        onChange={e => updateFormData('task', 'name', e.target.value)}
        placeholder="Enter event name"
      />
      <FormRow>
        <div style={styles.formRowGroup}>
          <FormField
            label="Date"
            type="date"
            value={formData.task.due}
            onChange={e => updateFormData('task', 'due', e.target.value)}
          />
        </div>
      </FormRow>
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

  // --- Light Toolbar Styles ---
  const LightToolbar = () => {
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("All");

    const optionsList = ["Settings", "Preferences", "Help", "About"];
    const priorities = ["Low", "Medium", "High"];

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8f8f8",
          padding: "8px 12px",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* Left Section */}
        <div style={{ display: "flex", gap: "8px", position: "relative" }}>
          {/* Options Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              onMouseOver={(e) => (e.currentTarget.style.background = "#eaeaea")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
            >
              Options{" "}
              <span style={{ fontSize: "10px" }}>
                {showOptionsDropdown ? "▲" : "▼"}
              </span>
            </button>

            {showOptionsDropdown && (
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
                  minWidth: "120px",
                  marginTop: "4px",
                }}
              >
                {optionsList.map((opt) => (
                  <div
                    key={opt}
                    style={{
                      padding: "6px 10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => {
                      alert(`Selected: ${opt}`);
                      setShowOptionsDropdown(false);
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f2f2f2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Normal Buttons */}
          {["Status", "Subtasks", "Columns"].map((btn) => (
            <button
              key={btn}
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onMouseOver={(e) => (e.target.style.background = "#eaeaea")}
              onMouseOut={(e) => (e.target.style.background = "#fff")}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Filter Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              onMouseOver={(e) => (e.currentTarget.style.background = "#eaeaea")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <Filter size={16} />
              Filter{" "}
              <span style={{ fontSize: "10px" }}>
                {showFilterDropdown ? "▲" : "▼"}
              </span>
            </button>

            {showFilterDropdown && (
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
                  minWidth: "140px",
                  marginTop: "4px",
                  padding: "8px",
                }}
              >
                {priorities.map((p) => (
                  <div
                    key={p}
                    style={{
                      padding: "6px 10px",
                      cursor: "pointer",
                      background: filterPriority === p ? "#f0f0f0" : "transparent",
                    }}
                    onClick={() => {
                      setFilterPriority(p);
                      setShowFilterDropdown(false);
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f2f2f2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        filterPriority === p ? "#f0f0f0" : "#fff")
                    }
                  >
                    {p}
                </div>
                ))}
              </div>
            )}
          </div>

          {/* Groups */}
          <button
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "6px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            onMouseOver={(e) => (e.target.style.background = "#eaeaea")}
            onMouseOut={(e) => (e.target.style.background = "#fff")}
          >
            Groups
          </button>

          {/* Bookmarks */}
          <button
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
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

          {/* Profile */}
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
              cursor: "pointer",
            }}
          >
            A
          </div>

          {/* Search */}
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
    clearBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      background: '#ef4444',
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
    viewBtn: {
      background: '#3b82f6',
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
    // Detail View Styles
    detailOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100
    },
    detailModal: {
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      width: '90%',
      maxWidth: 600,
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
    },
    detailHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingBottom: 16,
      borderBottom: '2px solid #e5e7eb'
    },
    detailTitle: {
      fontWeight: 600,
      fontSize: 24,
      color: '#111827'
    },
    detailCloseBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 8,
      borderRadius: 6,
      color: '#6b7280',
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    detailContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    },
    detailSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    },
    detailName: {
      fontWeight: 700,
      fontSize: 20,
      color: '#111827',
      margin: 0
    },
    detailMeta: {
      fontSize: 14,
      color: '#6b7280'
    },
    detailSubtitle: {
      fontWeight: 600,
      fontSize: 16,
      color: '#374151',
      margin: 0
    },
    detailDescription: {
      fontSize: 15,
      lineHeight: 1.6,
      color: '#4b5563',
      padding: 12,
      background: '#f9fafb',
      borderRadius: 8,
      borderLeft: '4px solid #4f46e5'
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      background: '#f8fafc',
      borderRadius: 8,
      border: '1px solid #e5e7eb'
    },
    detailIcon: {
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24
    },
    detailLabel: {
      fontSize: 12,
      fontWeight: 500,
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    detailValue: {
      fontSize: 14,
      fontWeight: 600,
      color: '#111827'
    },
    priorityDot: {
      width: 12,
      height: 12,
      borderRadius: '50%'
    },
    detailList: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    },
    detailListItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      background: '#f8fafc',
      borderRadius: 6,
      border: '1px solid #e5e7eb'
    },
    detailBadge: {
      padding: '2px 8px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 500,
      background: '#e5e7eb',
      color: '#374151'
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* Light Toolbar */}
      <LightToolbar />

      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}> 
          <div style={styles.headerControls}>
            <button
              onClick={() => openModal('project')}
              style={styles.addBtn}
            >
              <Plus size={16} /> Add Project/Event
            </button>
            <button
              onClick={clearAllData}
              style={styles.clearBtn}
            >
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        </div>

        {/* List View */}
        <div>
          {projects.length > 0 ? (
            projects.map(p => renderProject(p))
          ) : (
            <div style={styles.emptyStateLarge}>
              No projects yet. Click "Add Project/Event" to create your first project.
            </div>
          )}
        </div>

        {/* Create Modal */}
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

        {/* Detail View Modal */}
        {detailView.isOpen && renderDetailView()}
      </div>
    </div>
  );
}