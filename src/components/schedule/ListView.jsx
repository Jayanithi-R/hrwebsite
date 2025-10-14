import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  User,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Bookmark,
  Eye,
  Settings,
  Leaf,
  Flag,
  X,
  Save,
  Edit3,
  FileText,
  Bell,
  FolderOpen,
  Clock,
  Target,
  CheckCircle,
  Users
} from "lucide-react";

export default function CourseDashboardEnhanced() {
  // --- Consolidated State ---
  const [editing, setEditing] = useState({});
  const [filterPriority, setFilterPriority] = useState("All");
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskParentId, setTaskParentId] = useState(null);
  const [subtaskParentId, setSubtaskParentId] = useState(null);
  const [itemType, setItemType] = useState("project"); // "project" | "task" | "subtask"
  const [isEvent, setIsEvent] = useState(false);
  const [detailView, setDetailView] = useState({ isOpen: false, type: null, data: null });
  const [projectEditMode, setProjectEditMode] = useState({});
  const [editingValues, setEditingValues] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
const [taskEditMode, setTaskEditMode] = useState({});

  // --- Consolidated Form State ---
  const [formData, setFormData] = useState({
    project: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low",
      reminder: false,
      files: []
    },
    task: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low",
      reminder: false,
      files: []
    },
    subtask: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low",
      reminder: false,
      files: []
    },
    event: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low",
      reminder: false,
      files: []
    }
  });

  // --- Dummy Data ---
  const dummyAssignees = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
    "Emily Davis",
    "Chris Lee",
    "Amanda Garcia"
  ];

  const dummyProjects = [
    {
      id: 1,
      name: "Web Development Course",
      description: "Complete full-stack web development bootcamp",
      assignee: "John Doe",
      due: "2024-12-31",
      priority: "High",
      reminder: true,
      files: [],
      type: "project",
      expanded: true,
      todoExpanded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [
        {
          id: 101,
          name: "Learn React Fundamentals",
          description: "Complete React basics and component creation",
          assignee: "Jane Smith",
          due: "2024-11-15",
          priority: "High",
          reminder: false,
          files: [],
          type: "task",
          expanded: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subtasks: [
            {
              id: 1001,
              name: "Setup development environment",
              description: "Install Node.js, VS Code, and necessary extensions",
              assignee: "Jane Smith",
              due: "2024-11-01",
              priority: "Medium",
              reminder: true,
              files: [],
              type: "subtask",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Team Meeting",
      description: "Weekly team sync meeting",
      assignee: "Mike Johnson",
      due: "2024-10-20",
      priority: "Medium",
      reminder: true,
      files: [],
      type: "event",
      expanded: true,
      todoExpanded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: []
    }
  ];

  // --- Projects & Data with localStorage persistence ---
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('courseDashboardProjects');
    const savedEvents = localStorage.getItem('courseDashboardEvents');

    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      const projectsWithTasks = parsedProjects.map(project => ({
        ...project,
        tasks: project.tasks || []
      }));
      setProjects(projectsWithTasks);
    } else {
      setProjects(dummyProjects);
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

  // --- File Upload Handler ---
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: uid(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString()
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Update form data with uploaded files
    if (activeModal) {
      const currentType = isEvent ? 'event' : itemType;
      setFormData(prev => ({
        ...prev,
        [currentType]: {
          ...prev[currentType],
          files: [...(prev[currentType].files || []), ...newFiles]
        }
      }));
    }
  };

  // --- Remove File ---
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));

    if (activeModal) {
      const currentType = isEvent ? 'event' : itemType;
      setFormData(prev => ({
        ...prev,
        [currentType]: {
          ...prev[currentType],
          files: (prev[currentType].files || []).filter(file => file.id !== fileId)
        }
      }));
    }
  };

  // --- Toggle Edit Mode ---
  const toggleProjectEditMode = (projectId) => {
    setProjectEditMode(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));

    if (projectEditMode[projectId] && editingValues[projectId]) {
      const values = editingValues[projectId];
      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
              ...project,
              name: values.name || project.name,
              assignee: values.assignee || project.assignee,
              priority: values.priority || project.priority,
              due: values.due || project.due,
              updatedAt: new Date().toISOString()
            }
            : project
        )
      );
      setEditingValues(prev => {
        const newValues = { ...prev };
        delete newValues[projectId];
        return newValues;
      });
    }
  };

  // --- Update Editing Values ---
  const updateEditingValue = (projectId, field, value) => {
    setEditingValues(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value
      }
    }));
  };

  // --- Get current value for editing ---
  const getEditingValue = (projectId, field, defaultValue = "") => {
    return editingValues[projectId]?.[field] !== undefined
      ? editingValues[projectId][field]
      : defaultValue;
  };

  // --- Detail View Functions ---
  const openDetailView = (type, data) => {
    setDetailView({ isOpen: true, type, data });
  };

  const closeDetailView = () => {
    setDetailView({ isOpen: false, type: null, data: null });
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
        priority: "Low",
        reminder: false,
        files: []
      }
    }));
    setUploadedFiles([]);
  };

  // --- Modal Management ---
  const openModal = (modalType, parentId = null) => {
    setActiveModal(modalType);
    if (modalType === 'task') {
      setItemType('task');
      setTaskParentId(parentId);
    } else if (modalType === 'subtask') {
      setItemType('subtask');
      setSubtaskParentId(parentId);
    } else {
      setItemType('project');
    }
    setIsEvent(false);

    resetFormData(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTaskParentId(null);
    setSubtaskParentId(null);
    setUploadedFiles([]);
    setIsEvent(false);
    setItemType('project');
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
      reminder: data.reminder,
      files: data.files || [],
      type: type,
      expanded: true,
      todoExpanded: true,
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
        return { ...baseItem, tasks: [] };
      default:
        return baseItem;
    }
  };

  // --- Data Management ---
  const addItem = () => {
    const currentType = isEvent ? 'event' : itemType;
    const currentForm = formData[currentType];

    if (!currentForm?.name?.trim()) {
      alert(`Please enter a name for the ${isEvent ? 'event' : itemType}`);
      return;
    }

    const item = createItem(currentType, currentForm,
      itemType === 'task' ? taskParentId :
        itemType === 'subtask' ? subtaskParentId : null
    );

    if (isEvent) {
      setProjects(s => [item, ...s]);
    } else {
      switch (itemType) {
        case 'project':
          setProjects(s => [item, ...s]);
          break;
        case 'task':
          if (!taskParentId) return;
          setProjects(s => s.map(p =>
            p.id === taskParentId ? {
              ...p,
              tasks: [item, ...(p.tasks || [])],
              updatedAt: new Date().toISOString()
            } : p
          ));
          break;
        case 'subtask':
          if (!subtaskParentId) return;
          setProjects(s => s.map(p => ({
            ...p,
            tasks: (p.tasks || []).map(t =>
              t.id === subtaskParentId ? {
                ...t,
                subtasks: [item, ...(t.subtasks || [])],
                updatedAt: new Date().toISOString()
              } : t
            )
          })));
          break;
        default:
          return;
      }
    }

    resetFormData(currentType);
    closeModal();
  };

  // --- Expand/Collapse ---
  const toggleExpand = (id, type = 'project') => {
    setProjects(s => s.map(item => {
      if (type === 'project' && item.id === id) {
        return { ...item, expanded: !item.expanded };
      }
      if (type === 'todo' && item.id === id) {
        return { ...item, todoExpanded: !item.todoExpanded };
      }
      if (type === 'task') {
        return {
          ...item,
          tasks: (item.tasks || []).map(task =>
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
          tasks: (p.tasks || []).filter(t => t.id !== id)
        })));
        break;
      case 'subtask':
        setProjects(s => s.map(p => ({
          ...p,
          tasks: (p.tasks || []).map(t => ({
            ...t,
            subtasks: (t.subtasks || []).filter(st => st.id !== id)
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

  const FormField = React.memo(function FormField({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    options,
    style = {}
  }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
        <label style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{label}</label>
        {type === "select" ? (
          <select
            value={value ?? ""}
            onChange={onChange}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 16,
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'inherit',
              appearance: 'none',
              background: '#fff',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 16,
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'inherit',
              minHeight: 80,
              resize: 'vertical',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        ) : (
          <input
            type={type}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 16,
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'inherit',
              width: '100%',
              boxSizing: 'border-box'
            }}
            autoComplete="off"
          />
        )}
      </div>
    );
  });

  const FormRow = ({ children }) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>{children}</div>
  );

  // --- Toggle Switch Component ---
  const ToggleSwitch = ({ label, checked, onChange, icon: Icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
      <button
        onClick={() => onChange(!checked)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 24,
          borderRadius: 12,
          border: 'none',
          background: checked ? '#4f46e5' : '#d1d5db',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: checked ? 22 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'white',
            transition: 'left 0.2s'
          }}
        />
      </button>
      {Icon && <Icon size={18} color={checked ? '#4f46e5' : '#6b7280'} />}
      <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{label}</span>
    </div>
  );

  // --- File Upload Component ---
  const FileUploadSection = () => (
    <div style={{ border: '2px dashed #d1d5db', borderRadius: 8, padding: 20, textAlign: 'center' }}>
      <input
        type="file"
        multiple
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          color: '#6b7280'
        }}
      >
        <FolderOpen size={32} />
        <div>
          <div style={{ fontWeight: 500, color: '#374151' }}>Click to upload files</div>
          <div style={{ fontSize: 12 }}>or drag and drop</div>
        </div>
      </label>

      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: 16, textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Uploaded Files:</div>
          {uploadedFiles.map(file => (
            <div
              key={file.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#f8fafc',
                borderRadius: 6,
                marginBottom: 4
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} />
                <span style={{ fontSize: 14 }}>{file.name}</span>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

// --- Common Header ---
const TaskHeader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 12px",
      fontWeight: 600,
      fontSize: 13,
      background: "#f3f4f6",
      borderBottom: "2px solid #e5e7eb",
      borderRadius: 6,
      marginBottom: 4,
    }}
  >
    <div style={{ flex: 1 }}>Name</div>
    <div style={{ display: "flex", gap: 16, minWidth: 220 }}>
      <div>Assignee</div>
      <div>Due</div>
      <div>Priority</div>
    </div>
    <div style={{ minWidth: 100 }}>Actions</div>
  </div>
);
const TaskListItem = ({ tasks }) => (
  <div>
    <TaskHeader /> {/* Displayed once at the top */}
    {tasks.map(task => (
      <TaskItem key={task.id} task={task} />
    ))}
  </div>
);

// --- Reusable action button style ---
const actionButtonStyle = {
  padding: "2px 6px",
  border: "none",
  borderRadius: 4,
  background: "#4f46e5",
  color: "white",
  fontSize: 12,
  cursor: "pointer",
};

// --- TaskItem aligned with header ---
const TaskItem = ({
  task,
  level = 0,
  dummyAssignees = [],
  priorities = [],
  priorityColors = {},
  deleteItem,
  openModal,
  handleUpdateTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  
  const [editValues, setEditValues] = useState({
    name: task.name,
    assignee: task.assignee || "",
    due: task.due || "",
    priority: task.priority || priorities[0] || "",
  });

  const handleSave = () => {
    handleUpdateTask({ 
      ...task, 
      ...editValues, 
      updatedAt: new Date().toISOString() 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      name: task.name,
      assignee: task.assignee || "",
      due: task.due || "",
      priority: task.priority || priorities[0] || "",
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          marginLeft: level * 20,
          borderBottom: "1px solid #e5e7eb",
          background: "#fafafa",
        }}
      >
        {/* Task Name + Expand/Collapse */}
        <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 8 }}>
          {task.subtasks?.length > 0 && !isEditing && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              style={{ 
                cursor: "pointer", 
                border: "none", 
                background: "transparent", 
                fontSize: 12 
              }}
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          )}
          
          {isEditing ? (
            <input
              type="text"
              value={editValues.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              style={{ 
                width: "100%", 
                padding: "4px 8px", 
                border: "1px solid #d1d5db", 
                borderRadius: 4, 
                fontSize: 13 
              }}
              autoFocus
            />
          ) : (
            <div style={{ fontWeight: 600, fontSize: 13 }}>{task.name}</div>
          )}
        </div>

        {/* =========================================== */}
        {/* COMMON ACTION PANEL FOR TASK AND SUBTASK */}
        {/* Edit/Save, Assignee, Priority, Calendar, Delete */}
        {/* =========================================== */}
        
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Edit / Save Button */}
          <button
            title={isEditing ? "Save Changes" : "Edit Task"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              background: isEditing ? "#4f46e5" : "transparent",
              color: isEditing ? "white" : "inherit",
            }}
          >
            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
          </button>

          {/* Cancel Button (only show when editing) */}
          {isEditing && (
            <button
              title="Cancel"
              onClick={handleCancel}
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                background: "#6b7280",
                color: "white",
              }}
            >
              <X size={16} />
            </button>
          )}

          {/* Assignee Button */}
          <div style={{ position: "relative" }}>
            <button
              title="Assignee"
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 14,
                overflow: "hidden",
              }}
              onClick={() => isEditing && setShowAssigneeDropdown(!showAssigneeDropdown)}
            >
              {editValues.assignee ? (
                <span>
                  {editValues.assignee
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              ) : (
                <User size={18} />
              )}
            </button>

            {isEditing && showAssigneeDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  minWidth: "150px",
                  marginTop: "4px",
                }}
              >
                {dummyAssignees.map((assignee) => (
                  <div
                    key={assignee}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      background: editValues.assignee === assignee ? "#f3f4f6" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    onClick={() => {
                      handleInputChange("assignee", assignee);
                      setShowAssigneeDropdown(false);
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = editValues.assignee === assignee ? "#f3f4f6" : "#fff")
                    }
                  >
                    <span>{assignee}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority Button */}
          <div style={{ position: "relative" }}>
            <button
              title="Priority"
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                background: "#fff",
              }}
              onClick={() => isEditing && setShowPriorityDropdown(!showPriorityDropdown)}
            >
              <Flag color={priorityColors[editValues.priority]} />
            </button>

            {isEditing && showPriorityDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  minWidth: "120px",
                  marginTop: "4px",
                }}
              >
                {priorities.map((priority) => (
                  <div
                    key={priority}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: editValues.priority === priority ? "#f3f4f6" : "transparent",
                    }}
                    onClick={() => {
                      handleInputChange("priority", priority);
                      setShowPriorityDropdown(false);
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = editValues.priority === priority ? "#f3f4f6" : "#fff")
                    }
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: priorityColors[priority],
                      }}
                    />
                    {priority}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Button */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
            <button
              title="Due Date"
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                background: "#fff",
              }}
              onClick={() => isEditing && document.getElementById(`calendar-input-${task.id}`)?.showPicker()}
            >
              <CalendarIcon />
            </button>

            <div style={{ fontSize: 14, color: "#333" }}>
              {editValues.due}
            </div>

            {isEditing && (
              <input
                id={`calendar-input-${task.id}`}
                type="date"
                value={editValues.due}
                onChange={(e) => handleInputChange("due", e.target.value)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: 0,
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                }}
              />
            )}
          </div>

          {/* Delete Task */}
          <button
            title="Delete Task"
            onClick={() => deleteItem(task.id, "task")}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              background: "#ef4444",
              color: "white",
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
        {/* =========================================== */}
        {/* END COMMON ACTION PANEL */}
        {/* =========================================== */}
      </div>

      {/* Subtasks */}
      {isExpanded &&
        task.subtasks?.map((subtask) => (
          <TaskItem
            key={subtask.id}
            task={subtask}
            level={level + 1}
            dummyAssignees={dummyAssignees}
            priorities={priorities}
            priorityColors={priorityColors}
            deleteItem={deleteItem}
            openModal={openModal}
            handleUpdateTask={handleUpdateTask}
          />
        ))}

      {/* Add Subtask */}
      {!isEditing && level === 0 && (
        <button
          onClick={() => openModal("subtask", task.id)}
          style={{
            padding: "4px 8px",
            margin: "4px 12px",
            borderRadius: 4,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          + Add Subtask
        </button>
      )}
    </>
  );
};
  // --- Enhanced Project Header Component ---
  const ProjectHeader = ({ project }) => {
    const isEditing = projectEditMode[project.id];
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

    const currentName = getEditingValue(project.id, 'name', project.name);
    const currentAssignee = getEditingValue(project.id, 'assignee', project.assignee);
    const currentPriority = getEditingValue(project.id, 'priority', project.priority);
    const currentDue = getEditingValue(project.id, 'due', project.due);

    const handleInputChange = (field, value) => {
      updateEditingValue(project.id, field, value);
    };

    const handleSave = () => {
      setProjects(prev =>
        prev.map(p =>
          p.id === project.id
            ? {
              ...p,
              name: currentName || p.name,
              assignee: currentAssignee || p.assignee,
              priority: currentPriority || p.priority,
              due: currentDue || p.due,
              updatedAt: new Date().toISOString()
            }
            : p
        )
      );
      setProjectEditMode(prev => ({ ...prev, [project.id]: false }));
      setEditingValues(prev => {
        const newValues = { ...prev };
        delete newValues[project.id];
        return newValues;
      });
    };

    return (
      <div style={{
        display: "flex",
        gap: "10px",
        marginRight: "15px",
        alignItems: "center",
        padding: "12px 15px",
        borderBottom: "1px solid #d1d9e6",
        fontWeight: "bold",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <button
            onClick={() => toggleExpand(project.id, "project")}
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              fontSize: 16,
              transition: "transform 0.3s ease",
            }}
          >
            {project.expanded ? "▼" : "▶"}
          </button>

          {isEditing ? (
            <input
              type="text"
              value={currentName}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: 6,
                padding: '6px 10px',
                outline: 'none',
                fontSize: 16,
                fontWeight: 600,
                width: 200
              }}
              autoFocus
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                {project.name || "Untitled Project"}
              </span>
              {project.type === 'event' && (
                <div style={{
                  background: '#e0f2fe',
                  color: '#0369a1',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Clock size={12} />
                  Event
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Settings Button - Toggle Edit Mode */}
          <button
            title={isEditing ? "Save Changes" : "Edit Project"}
            onClick={isEditing ? handleSave : () => setProjectEditMode(prev => ({ ...prev, [project.id]: true }))}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              background: isEditing ? "#4f46e5" : "transparent",
              color: isEditing ? "white" : "inherit"
            }}
          >
            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
          </button>
          {/* Project Info Display */}
          {/* Symbol Button */}
          <div style={{ position: "relative" }}>
            <button
              title="Assignee"
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 14,
                position: "relative",
                overflow: "hidden"
              }}
              onClick={() => isEditing && setShowAssigneeDropdown(!showAssigneeDropdown)}
            >
              {currentAssignee ? (
                <span>
                  {currentAssignee
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              ) : (
                <User size={18} />
              )}
            </button>
            {isEditing && showAssigneeDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  minWidth: "150px",
                  marginTop: "4px",
                }}
              >
                {dummyAssignees.map((assignee) => (
                  <div
                    key={assignee}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      background: currentAssignee === assignee ? "#f3f4f6" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}
                    onClick={() => {
                      handleInputChange('assignee', assignee);
                      setShowAssigneeDropdown(false);
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = currentAssignee === assignee ? "#f3f4f6" : "#fff")}
                  >
                    <span>{assignee}</span>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Priority Button */}
          <div style={{ position: "relative" }}>
            <button
              title="Priority"
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                background: "#fff",
              }}
              onClick={() => isEditing && setShowPriorityDropdown(!showPriorityDropdown)}
            >
              <Flag color={priorityColors[currentPriority]} />

            </button>
            {isEditing && showPriorityDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  minWidth: "120px",
                  marginTop: "4px",
                  background: "#fff",
                }}
              >
                {priorities.map((priority) => (
                  <div
                    key={priority}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: currentPriority === priority ? "#f3f4f6" : "transparent",
                    }}
                    onClick={() => {
                      handleInputChange('priority', priority);
                      setShowPriorityDropdown(false);
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = currentPriority === priority ? "#f3f4f6" : "#fff")}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: priorityColors[priority]
                      }}
                    />
                    {priority}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Button */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
            {/* Calendar Button */}
            <button
              title="Due Date"
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                background: "#fff",
              }}
              onClick={() =>
                isEditing &&
                document
                  .getElementById(`calendar-input-${project.id}`)
                  ?.showPicker()
              }
            >
              <CalendarIcon />
            </button>

            {/* Display Selected Date */}
            <div style={{ fontSize: 14, color: "#333" }}>
              {currentDue}
            </div>

            {/* Hidden Date Input */}
            {isEditing && (
              <input
                id={`calendar-input-${project.id}`}
                type="date"
                value={currentDue}
                onChange={(e) => handleInputChange("due", e.target.value)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: 0,
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                }}
              />
            )}
          </div>

          {/* View Details Button */}
          {/* <button
            title="View Details"
            onClick={() => openDetailView('project', project)}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              background: "#3b82f6",
              color: "white"
            }}
          >
            <Eye size={16} />
          </button> */}

          {/* Delete Project Button */}
          <button
            title="Delete Project"
            onClick={() => deleteItem(project.id, 'project')}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              background: "#ef4444",
              color: "white"
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  // --- Enhanced Modal Content ---
  const renderModalContent = () => {
    const currentType = isEvent ? 'event' : itemType;
    const currentForm = formData[currentType] || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Main Toggle - Event vs Project/Task/Subtask */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 10,
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: 8
        }}>
          <button
            onClick={() => setIsEvent(false)}
            style={!isEvent ? {
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderBottom: '3px solid #4f46e5',
              background: 'transparent',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#4f46e5',
              fontSize: 16,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            } : {
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderBottom: '3px solid transparent',
              background: 'transparent',
              fontWeight: 400,
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: 16,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <Target size={18} />
            Project/Task
          </button>
          <button
            onClick={() => setIsEvent(true)}
            style={isEvent ? {
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderBottom: '3px solid #4f46e5',
              background: 'transparent',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#4f46e5',
              fontSize: 16,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            } : {
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderBottom: '3px solid transparent',
              background: 'transparent',
              fontWeight: 400,
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: 16,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <Clock size={18} />
            Event
          </button>
        </div>

        {/* Name Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>
            {`${isEvent ? "Event" : itemType.charAt(0).toUpperCase() + itemType.slice(1)} Name`}
          </label>
          <input
            type="text"
            value={currentForm.name || ""}
            onChange={(e) => updateFormData(currentType, "name", e.target.value)}
            placeholder={`Enter ${isEvent ? "event" : itemType} name`}
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        {/* Description Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Description</label>
          <input
            type="text"
            value={currentForm.description || ""}
            onChange={(e) => updateFormData(currentType, "description", e.target.value)}
            placeholder="Enter description"
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>


        {/* Form Row - Assignee, Due Date, Priority */}
        <FormRow>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Assignee"
              type="select"
              value={currentForm.assignee || ""}
              onChange={e => updateFormData(currentType, 'assignee', e.target.value)}
              options={["", ...dummyAssignees]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Due Date"
              type="date"
              value={currentForm.due || ""}
              onChange={e => updateFormData(currentType, 'due', e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Priority"
              type="select"
              value={currentForm.priority || "Low"}
              onChange={e => updateFormData(currentType, 'priority', e.target.value)}
              options={priorities}
            />
          </div>
        </FormRow>

        {/* Toggles Section */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 16,
          background: '#f8fafc'
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>
            Settings
          </div>

          <ToggleSwitch
            label="Set Reminder"
            checked={currentForm.reminder || false}
            onChange={(checked) => updateFormData(currentType, 'reminder', checked)}
            icon={Bell}
          />
        </div>

        {/* File Upload Section */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
            File Upload
          </div>
          <FileUploadSection />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={addItem}
            style={{
              padding: '12px 24px',
              background: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 16,
              flex: 1,
              transition: 'background 0.2s'
            }}
          >
            Create {isEvent ? 'Event' : itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </button>
          <button
            onClick={closeModal}
            style={{
              padding: '12px 24px',
              background: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 16,
              flex: 1,
              transition: 'background 0.2s'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // --- Render Task List Safely ---
  const renderTaskList = (tasks) => {
    const taskList = tasks || [];
    return taskList.length > 0 ? (
      taskList.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))
    ) : (
      <div style={{ color: "#888", fontSize: 13, fontStyle: 'italic', padding: '12px 0' }}>
        No tasks yet. Click "Add Task" to create your first task.
      </div>
    );
  };

  // --- Light Toolbar ---
  const LightToolbar = () => {
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("All");

    const optionsList = ["Settings", "Preferences", "Help", "About"];
    const priorities = ["Low", "Medium", "High"];

    const styles = {
      toolbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#ffffffff",
        padding: "8px 12px",
        borderBottom: "1px solid #ddd",
      },
      leftSection: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      rightSection: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      btn: {
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "14px",
        padding: "6px 10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        height: "32px",
      },
      profileIcon: {
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
      },
      searchBox: {
        display: "flex",
        alignItems: "center",
        // border: "1px solid #ccc",
        border: "none",
        borderRadius: "14px",
        background: "#fff",
        padding: "4px 8px",
        height: "32px",
      },
      input: {
        border: "none",
        outline: "none",
        fontSize: "14px",
        width: "120px",
        background: "transparent",
      },
    };

    return (
      <div style={styles.toolbar}>
        {/* LEFT SECTION */}
        <div style={styles.leftSection}>
          {/* Group Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={styles.btn}
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            >
              Group <span style={{ fontSize: "10px" }}>{showOptionsDropdown ? "▲" : "▼"}</span>
            </button>

            {showOptionsDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
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
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtasks + Columns */}
          {["Subtasks", "Columns"].map((btn) => (
            <button key={btn} style={styles.btn}>
              {btn}
            </button>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div style={styles.rightSection}>
          {/* Filter Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={styles.btn}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter size={18} />
              <p style={{ fontSize: "14px" }}>Filter</p>
            </button>

            {showFilterDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
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
                      borderRadius: "4px",
                    }}
                    onClick={() => {
                      setFilterPriority(p);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Closed Button */}
          <button style={styles.btn}>
            <CheckCircle size={18} />
            <p style={{ fontSize: "14px" }}>Closed</p>
          </button>

          {/* Assignee Button */}
          <button style={styles.btn}>
            <Users size={18} />
            <p style={{ fontSize: "14px" }}>Assignee</p>
          </button>

          {/* Profile Icon */}
          <div style={styles.profileIcon}>B</div>

          {/* Search Box */}
          <div style={styles.searchBox}>
            <Search size={20} />
            {/* <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
          /> */}
          </div>

          {/* Settings Icon */}
          <button style={styles.searchBox}>
            <Settings size={20} />
          </button>
          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <button
              onClick={() => openModal('project')}
              style={{
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
              }}
            >
              <Plus size={16} /> Add Project/Event
            </button>
            <button
              onClick={clearAllData}
              style={{
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
              }}
            >
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#f8fafc'
    }}>
      {/* Light Toolbar */}
      <LightToolbar />

      <div style={{
        margin: '0 auto',
        background: '#fff',
        padding: 20
      }}>

        {/* List View */}
        <div>
          {projects.length > 0 ? (
            projects.map(p => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #d1d9e6",
                  borderRadius: 8,
                  marginBottom: 12,
                  background: "#fff",
                  fontFamily: "Segoe UI, sans-serif",
                }}
              >
                <ProjectHeader project={p} />

                {p.expanded && p.type !== 'event' && (
                  <div style={{ padding: 15 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 15,
                        paddingBottom: 8,
                        borderBottom: "1px solid #eaeaea",
                      }}
                    >
                      <button
                        onClick={() => toggleExpand(p.id, "todo")}
                        style={{
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          fontSize: 16,
                          transition: "transform 0.3s ease",
                        }}
                      >
                        {p.todoExpanded ? "▼" : "▶"}
                      </button>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#000" }}>TO DO</span>
                      <button
                        onClick={() => openModal("task", p.id)}
                        style={{
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: 4,
                          backgroundColor: "#ffffffff",
                          color: "#000000ff",
                          cursor: "pointer",
                          fontSize: 14,
                          transition: "background 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <Plus size={14} /> Add Task
                      </button>
                    </div>

                    {/* Project Info Display */}
                    {/* <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                        <User size={12} />
                        <strong>Assignee:</strong> {p.assignee || "Unassigned"}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                        <Flag size={12} color={priorityColors[p.priority]} />
                        <strong>Priority:</strong> {p.priority}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                        <CalendarIcon size={12} />
                        <strong>Due Date:</strong> {p.due || "No due date"}
                      </div>
                      {p.reminder && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                          <Bell size={12} />
                          <strong>Reminder:</strong> On
                        </div>
                      )}
                    </div> */}

                    {p.description && (
                      <div style={{ fontSize: 13, color: "#666", marginBottom: 8, padding: 8, background: '#f8fafc', borderRadius: 4 }}>
                        {p.description}
                      </div>
                    )}

                    {(p.files && p.files.length > 0) && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Attached Files:</div>
                        {p.files.map(file => (
                          <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
                            <FileText size={12} />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}

                    {p.todoExpanded && (
                      <div style={{ paddingLeft: 16 }}>
                        {renderTaskList(p.tasks)}
                      </div>
                    )}
                  </div>
                )}

                {/* Event Display */}
                {p.expanded && p.type === 'event' && (
                  <div style={{ padding: 15 }}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                        <User size={12} />
                        <strong>Assignee:</strong> {p.assignee || "Unassigned"}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                        <Flag size={12} color={priorityColors[p.priority]} />
                        <strong>Priority:</strong> {p.priority}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                        <CalendarIcon size={12} />
                        <strong>Date:</strong> {p.due || "No date set"}
                      </div>
                      {p.reminder && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                          <Bell size={12} />
                          <strong>Reminder:</strong> On
                        </div>
                      )}
                    </div>

                    {p.description && (
                      <div style={{ fontSize: 13, color: "#666", marginBottom: 8, padding: 8, background: '#f8fafc', borderRadius: 4 }}>
                        {p.description}
                      </div>
                    )}

                    {(p.files && p.files.length > 0) && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Attached Files:</div>
                        {p.files.map(file => (
                          <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
                            <FileText size={12} />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: 40,
              color: '#6b7280',
              fontSize: 16
            }}>
              No projects yet. Click "Add Project/Event" to create your first project.
            </div>
          )}
        </div>

        {/* Create Modal */}
        {activeModal && (
          <div style={{
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
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              width: '90%',
              maxWidth: 600,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{ fontWeight: 600, fontSize: 20, color: '#111827' }}>
                  Create New {isEvent ? 'Event' : itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                </div>
                <button onClick={closeModal} style={{
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
                }}>
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