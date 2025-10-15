import React, { useState, useEffect, useRef } from "react";
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
  const [groupBy, setGroupBy] = useState("project");
  const [showClosed, setShowClosed] = useState(false);

  // NEW: State for edit dialog
  const [editDialog, setEditDialog] = useState({
    isOpen: false,
    type: null,
    data: null,
    isEditing: false
  });

  // NEW: State for view dialog
  const [viewDialog, setViewDialog] = useState({
    isOpen: false,
    type: null,
    data: null
  });

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
      status: "To Do",
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
          status: "To Do",
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
              status: "To Do",
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
      status: "To Do",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: []
    }
  ];

  // --- Projects & Data with localStorage persistence ---
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);

  // StatusSelector Component (already defined in your code)
  const StatusSelector = ({ value: propValue = "To Do", onChange, toggleExpand, todoExpanded }) => {
    const statuses = ["To Do", "In Progress", "Completed"];
    const colors = {
      "To Do": "#e5e7eb",
      "In Progress": "#fde68a",
      "Completed": "#bbf7d0"
    };

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(propValue);
    const [dropdownHeight, setDropdownHeight] = useState(0);
    const dropdownRef = useRef();
    const ref = useRef();

    // Calculate dropdown height when opening
    useEffect(() => {
      if (open && dropdownRef.current) {
        const height = dropdownRef.current.scrollHeight;
        setDropdownHeight(height);
      } else {
        setDropdownHeight(0);
      }
    }, [open]);

    // Close dropdown if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) setOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (status) => {
      setValue(status);
      onChange?.(status);
      setOpen(false);
    };

    return (
      <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
        {/* Current status button */}
        <div
          onClick={() => setOpen(!open)}
          style={{
            padding: "4px 10px",
            border: "1px solid rgb(204, 204, 204)",
            borderRadius: 6,
            backgroundColor: colors[value],
            cursor: "pointer",
            fontWeight: 600,
            width: "fit-content",
            height: 30,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {value}
          {/* Arrow button */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
              toggleExpand?.(!todoExpanded);
            }}
            style={{
              width: 16,
              height: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              cursor: "pointer",
            }}
          >
            ▼
          </div>
        </div>

        {/* Dropdown list */}
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            minWidth: "fit-content",
            background: "#fff",
            border: open ? "1px solid #ccc" : "none",
            borderRadius: 6,
            boxShadow: open ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxHeight: dropdownHeight,
            transition: "all 0.3s ease",
            opacity: open ? 1 : 0,
          }}
        >
          {statuses.map((status) => (
            <div
              key={status}
              onClick={() => handleSelect(status)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                cursor: "pointer",
                backgroundColor: value === status ? colors[status] : "#fff",
                fontWeight: value === status ? 600 : 400,
                transition: "background 0.2s",
                minWidth: 120,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = value === status ? colors[status] : "#fff")
              }
            >
              <span>{status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

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

  // --- NEW: Edit Dialog Functions ---
  const openEditDialog = (type, data) => {
    setEditDialog({
      isOpen: true,
      type,
      data: { ...data },
      isEditing: true
    });
  };

  const openViewDialog = (type, data) => {
    setViewDialog({
      isOpen: true,
      type,
      data: { ...data }
    });
  };

  const closeEditDialog = () => {
    setEditDialog({ isOpen: false, type: null, data: null, isEditing: false });
  };

  const closeViewDialog = () => {
    setViewDialog({ isOpen: false, type: null, data: null });
  };

  const handleSaveEdit = () => {
    const { type, data } = editDialog;

    if (type === 'project' || type === 'event') {
      setProjects(prev =>
        prev.map(item =>
          item.id === data.id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
        )
      );
    } else if (type === 'task') {
      setProjects(prev =>
        prev.map(project => ({
          ...project,
          tasks: project.tasks.map(task =>
            task.id === data.id ? { ...task, ...data, updatedAt: new Date().toISOString() } : task
          )
        }))
      );
    } else if (type === 'subtask') {
      setProjects(prev =>
        prev.map(project => ({
          ...project,
          tasks: project.tasks.map(task => ({
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === data.id ? { ...subtask, ...data, updatedAt: new Date().toISOString() } : subtask
            )
          }))
        }))
      );
    }

    closeEditDialog();
  };

  const updateEditDialogData = (field, value) => {
    setEditDialog(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value
      }
    }));
  };

  // --- Search and Filter Functions ---
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterPriority = (priority) => {
    setFilterPriority(priority);
  };

  const handleGroupBy = (group) => {
    setGroupBy(group);
  };

  const handleToggleClosed = () => {
    setShowClosed(!showClosed);
  };

  // --- Filtered and Searched Projects ---
  const getFilteredProjects = () => {
    let filtered = projects;

    // Filter by priority
    if (filterPriority !== "All") {
      filtered = filtered.filter(project => project.priority === filterPriority);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.assignee.toLowerCase().includes(query)
      );
    }

    // Filter by closed status
    if (!showClosed) {
      filtered = filtered.filter(project => project.status !== "Completed");
    }

    return filtered;
  };

  // --- File Download Handler ---
  const handleFileDownload = (file) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- File Preview Handler ---
  const handleFilePreview = (file) => {
    // For image files, open in new tab
    if (file.type.startsWith('image/')) {
      window.open(file.url, '_blank');
    } else {
      // For other files, try to open in new tab (may not work for all file types)
      window.open(file.url, '_blank');
    }
  };

  // --- Bulk Actions ---
  const handleBulkDelete = (selectedIds) => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      setProjects(prev => prev.filter(project => !selectedIds.includes(project.id)));
    }
  };

  const handleBulkStatusChange = (selectedIds, newStatus) => {
    setProjects(prev =>
      prev.map(project =>
        selectedIds.includes(project.id)
          ? { ...project, status: newStatus, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  // --- Export Data Function ---
  const handleExportData = () => {
    const dataToExport = {
      projects: projects,
      events: events,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `course-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Import Data Function ---
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (importedData.projects) {
          setProjects(importedData.projects);
        }
        if (importedData.events) {
          setEvents(importedData.events);
        }

        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = '';
  };

  // --- Duplicate Project Function ---
  const handleDuplicateProject = (projectId) => {
    const projectToDuplicate = projects.find(p => p.id === projectId);
    if (!projectToDuplicate) return;

    const duplicatedProject = {
      ...projectToDuplicate,
      id: uid(),
      name: `${projectToDuplicate.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => [duplicatedProject, ...prev]);
  };

  // --- Sort Projects Function ---
  const handleSortProjects = (sortBy) => {
    const sortedProjects = [...projects].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'dueDate':
          return new Date(a.due) - new Date(b.due);
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
    setProjects(sortedProjects);
  };

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
      status: "To Do",
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

  // --- Task Update Handler ---
  const handleUpdateTask = (updatedTask) => {
    setProjects(prev =>
      prev.map(project => ({
        ...project,
        tasks: (project.tasks || []).map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      }))
    );
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
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => handleFilePreview(file)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4f46e5',
                    cursor: 'pointer',
                    padding: 4
                  }}
                  title="Preview"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleFileDownload(file)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    cursor: 'pointer',
                    padding: 4
                  }}
                  title="Download"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => removeFile(file.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: 4
                  }}
                  title="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- Render Task List Function ---
  const renderTaskList = (tasks) => {
    const taskList = tasks || [];
    return taskList.length > 0 ? (
      taskList.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          level={0}
          dummyAssignees={dummyAssignees}
          priorities={priorities}
          priorityColors={priorityColors}
          deleteItem={deleteItem}
          openModal={openModal}
          handleUpdateTask={handleUpdateTask}
          openEditDialog={openEditDialog}
          openViewDialog={openViewDialog}
        />
      ))
    ) : (
      <div style={{ color: "#888", fontSize: 13, fontStyle: 'italic', padding: '12px 0' }}>
        No tasks yet. Click "Add Task" to create your first task.
      </div>
    );
  };

  // --- TaskItem Component ---
  const TaskItem = ({
    task,
    level = 0,
    dummyAssignees = [],
    priorities = [],
    priorityColors = {},
    deleteItem,
    openModal,
    handleUpdateTask,
    openEditDialog,
    openViewDialog
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

    const [editValues, setEditValues] = useState({
      name: task.name,
      assignee: task.assignee || "",
      priority: task.priority || priorities[0] || "",
      due: task.due || ""
    });

    const handleInputChange = (field, value) =>
      setEditValues(prev => ({ ...prev, [field]: value }));

    const handleSave = () => {
      handleUpdateTask?.({ ...task, ...editValues, updatedAt: new Date().toISOString() });
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditValues({
        name: task.name,
        assignee: task.assignee || "",
        priority: task.priority || priorities[0] || "",
        due: task.due || ""
      });
      setIsEditing(false);
    };

    const toggleExpand = () => setIsExpanded(prev => !prev);

    return (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 0.6fr 0.6fr 0.8fr 0.8fr 0.8fr",
            alignItems: "center",
            padding: "10px 16px",
            backgroundColor: level === 0 ? "#f9fafb" : "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            marginLeft: level * 20,
            borderLeft: level > 0 ? "2px solid #4f46e5" : "none"
          }}
        >
          {/* --- Task Name --- */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {task.subtasks?.length > 0 && (
              <button
                onClick={toggleExpand}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  fontSize: 14,
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease"
                }}
              >
                ▶
              </button>
            )}

            {isEditing ? (
              <input
                type="text"
                value={editValues.name}
                onChange={e => handleInputChange("name", e.target.value)}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  padding: "6px 10px",
                  fontSize: 14,
                  fontWeight: 600,
                  width: "100%"
                }}
                autoFocus
              />
            ) : (
              <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
                {task.name}
              </span>
            )}
          </div>
<div></div>
          {/* --- Status --- */}
          <div>
            <StatusSelector
              value={task.status || "To Do"}
              onChange={status => handleUpdateTask?.({ ...task, status })}
            />
          </div>
          
          {/* --- Assignee --- */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => isEditing && setShowAssigneeDropdown(!showAssigneeDropdown)}
              style={{
                cursor: isEditing ? "pointer" : "default",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 14
              }}
            >
              {editValues.assignee
                ? editValues.assignee.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                : <User size={16} />}
            </button>

            {isEditing && showAssigneeDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  minWidth: 140,
                  zIndex: 10
                }}
              >
                {dummyAssignees.map(a => (
                  <div
                    key={a}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      background: editValues.assignee === a ? "#f3f4f6" : "transparent"
                    }}
                    onClick={() => {
                      handleInputChange("assignee", a);
                      setShowAssigneeDropdown(false);
                    }}
                  >
                    {a}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Priority --- */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => isEditing && setShowPriorityDropdown(!showPriorityDropdown)}
              style={{
                cursor: "pointer",
                border: "none",
                background: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Flag color={priorityColors[editValues.priority]} size={18} />
            </button>

            {isEditing && showPriorityDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  minWidth: 120
                }}
              >
                {priorities.map(p => (
                  <div
                    key={p}
                    onClick={() => {
                      handleInputChange("priority", p);
                      setShowPriorityDropdown(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      background: editValues.priority === p ? "#f3f4f6" : "transparent"
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: priorityColors[p]
                      }}
                    />
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Due Date --- */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
            <button
              style={{
                border: "none",
                background: "none",
                cursor: isEditing ? "pointer" : "default"
              }}
              onClick={() =>
                isEditing &&
                document.getElementById(`calendar-input-${task.id}`)?.showPicker()
              }
            >
              <CalendarIcon size={18} />
            </button>

            <span style={{ fontSize: 14, color: "#374151" }}>
              {editValues.due || "—"}
            </span>

            {isEditing && (
              <input
                id={`calendar-input-${task.id}`}
                type="date"
                value={editValues.due}
                onChange={e => handleInputChange("due", e.target.value)}
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: 30,
                  height: 30,
                  cursor: "pointer"
                }}
              />
            )}
          </div>


          {/* --- Actions --- */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
            <button
              title="View Details"
              onClick={() => openViewDialog("task", task)}
              style={{
                border: "none",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#3b82f6",
                color: "white",
                cursor: "pointer"
              }}
            >
              <Eye size={14} />
            </button>
            <button
              title="Edit Task"
              onClick={() => openEditDialog("task", task)}
              style={{
                border: "none",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f3f4f6",
                color: "#111827",
                cursor: "pointer"
              }}
            >
              <Edit3 size={16} />
            </button>

            <button
              title="Delete Task"
              onClick={() => deleteItem?.(task.id, "task")}
              style={{
                border: "none",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ef4444",
                color: "white",
                cursor: "pointer"
              }}
            >
              <Trash2 size={16} />
            </button>

            {!isEditing && level === 0 && (
              <button
                onClick={() => openModal?.("subtask", task.id)}
                style={{
                  padding: "6px 10px",
                  border: "none",
                  borderRadius: 4,
                  backgroundColor: "#4f46e5",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13
                }}
              >
                + Subtask
              </button>
            )}
          </div>
        </div>

        {/* --- Subtasks --- */}
        {isExpanded &&
          task.subtasks?.map(subtask => (
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
              openEditDialog={openEditDialog}
              openViewDialog={openViewDialog}
            />
          ))}
      </>
    );
  };

  // --- Enhanced Project Header Component ---
  const ProjectHeader = ({
    project,
    toggleExpand,
    deleteItem,
    openModal,
    setProjects,
    dummyAssignees,
    priorities,
    priorityColors,
    openViewDialog,
    openEditDialog
  }) => {
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

    // Add safe access to priority color
    const getPriorityColor = (priority) => {
      return priorityColors[priority] || priorityColors.Low; // Default to Low if undefined
    };

    return (
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginRight: "15px",
          alignItems: "center",
          padding: "12px 15px",
          borderBottom: "1px solid #d1d9e6",
          fontWeight: "bold",
        }}
      >
        {/* Left: Project Title + Expand Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "50%" }}>
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

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>
              {project.name || "Untitled Project"}
            </span>

            {project.type === "event" && (
              <div
                style={{
                  background: "#e0f2fe",
                  color: "#0369a1",
                  padding: "2px 8px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Clock size={12} />
                Event
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "60%",
          }}
        >
          {/* ✅ Status Selector */}
          <StatusSelector
            value={project.status || "To Do"}
            onChange={(status) => {
              setProjects((prev) =>
                prev.map((p) =>
                  p.id === project.id
                    ? { ...p, status, updatedAt: new Date().toISOString() }
                    : p
                )
              );
            }}
          />

          {/* 🧍 Assignee */}
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
              }}
              onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
            >
              {project.assignee ? (
                <span>
                  {project.assignee
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

            {showAssigneeDropdown && (
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
                      background:
                        project.assignee === assignee ? "#f3f4f6" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    onClick={() => {
                      setProjects((prev) =>
                        prev.map((p) =>
                          p.id === project.id ? { ...p, assignee } : p
                        )
                      );
                      setShowAssigneeDropdown(false);
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f2f2f2")
                    }
                    onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      project.assignee === assignee ? "#f3f4f6" : "#fff")
                    }
                  >
                    <span>{assignee}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🚩 Priority */}
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
                background: "#fff",
              }}
              onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
            >
              <Flag color={getPriorityColor(project.priority)} />
            </button>

            {showPriorityDropdown && (
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
                      background:
                        project.priority === priority ? "#f3f4f6" : "transparent",
                    }}
                    onClick={() => {
                      setProjects((prev) =>
                        prev.map((p) =>
                          p.id === project.id ? { ...p, priority } : p
                        )
                      );
                      setShowPriorityDropdown(false);
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f2f2f2")
                    }
                    onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      project.priority === priority ? "#f3f4f6" : "#fff")
                    }
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: getPriorityColor(priority),
                      }}
                    />
                    {priority}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 📅 Due Date */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarIcon />
            <span style={{ fontSize: 14, color: "#333" }}>
              {project.due || "No Date"}
            </span>
          </div>

          {/* 👁️ View */}
          <button
            title="View Details"
            onClick={() => openViewDialog(project.type, project)}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#3b82f6",
              color: "white",
              transition: "background 0.2s",
            }}
          >
            <Eye size={16} />
          </button>

          {/* ✏️ Edit — Opens Modal */}
          <button
            title="Edit Project"
            onClick={() => openEditDialog("project", project)}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f3f4f6",
              color: "#111827",
            }}
          >
            <Edit3 size={16} />
          </button>

          {/* ➕ Add Task */}
          <button
            onClick={() => openModal("task", project.id)}
            style={{
              padding: "6px 12px",
              border: "none",
              borderRadius: 4,
              backgroundColor: "#4f46e5",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Plus size={14} /> Add Task
          </button>

          {/* 🗑️ Delete */}
          <button
            title="Delete Project"
            onClick={() => deleteItem(project.id, "project")}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ef4444",
              color: "white",
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  // --- NEW: Edit Dialog Component ---
  const EditDialog = () => {
    const { isOpen, type, data, isEditing } = editDialog;

    if (!isOpen) return null;

    const renderFormField = (label, field, inputType = "text") => (
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, color: '#374151' }}>
          {label}
        </label>
        {inputType === "select" ? (
          <select
            value={data[field] || ""}
            onChange={(e) => updateEditDialogData(field, e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14
            }}
          >
            {field === 'priority' ? (
              priorities.map(p => <option key={p} value={p}>{p}</option>)
            ) : field === 'assignee' ? (
              [<option key="" value="">Select Assignee</option>,
              ...dummyAssignees.map(a => <option key={a} value={a}>{a}</option>)]
            ) : field === 'status' ? (
              ["To Do", "In Progress", "Completed"].map(s => <option key={s} value={s}>{s}</option>)
            ) : null}
          </select>
        ) : inputType === "textarea" ? (
          <textarea
            value={data[field] || ""}
            onChange={(e) => updateEditDialogData(field, e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14,
              minHeight: 80,
              resize: 'vertical'
            }}
          />
        ) : (
          <input
            type={inputType}
            value={data[field] || ""}
            onChange={(e) => updateEditDialogData(field, e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14
            }}
          />
        )}
      </div>
    );

    return (
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
        zIndex: 1001
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          width: '90%',
          maxWidth: 500,
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
              Edit {type?.charAt(0).toUpperCase() + type?.slice(1)}
            </div>
            <button onClick={closeEditDialog} style={{
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderFormField("Name", "name", "text")}
            {renderFormField("Description", "description", "textarea")}
            {renderFormField("Assignee", "assignee", "select")}
            {renderFormField("Due Date", "due", "date")}
            {renderFormField("Priority", "priority", "select")}
            {renderFormField("Status", "status", "select")}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="checkbox"
                id="reminder"
                checked={data.reminder || false}
                onChange={(e) => updateEditDialogData("reminder", e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <label htmlFor="reminder" style={{ fontSize: 14, fontWeight: 500 }}>
                Set Reminder
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              onClick={handleSaveEdit}
              style={{
                padding: '12px 24px',
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 16,
                flex: 1
              }}
            >
              Save Changes
            </button>
            <button
              onClick={closeEditDialog}
              style={{
                padding: '12px 24px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 16,
                flex: 1
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- NEW: View Dialog Component ---
  const ViewDialog = () => {
    const { isOpen, type, data } = viewDialog;

    if (!isOpen) return null;

    const renderDetailRow = (label, value, IconComponent) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
        {IconComponent && <IconComponent size={16} color="#6b7280" />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 14, color: '#374151' }}>{value || "—"}</div>
        </div>
      </div>
    );

    return (
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
        zIndex: 1001
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          width: '90%',
          maxWidth: 500,
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
              {data?.name || "Untitled"}
            </div>
            <button onClick={closeViewDialog} style={{
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

          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: type === 'event' ? '#e0f2fe' : '#f3f4f6',
              color: type === 'event' ? '#0369a1' : '#374151',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 500
            }}>
              {type?.charAt(0).toUpperCase() + type?.slice(1)}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            {renderDetailRow("Description", data?.description, FileText)}
            {renderDetailRow("Assignee", data?.assignee, User)}
            {renderDetailRow("Due Date", data?.due, CalendarIcon)}
            {renderDetailRow("Priority", data?.priority, Flag)}
            {renderDetailRow("Status", data?.status, CheckCircle)}
            {renderDetailRow("Reminder", data?.reminder ? "Yes" : "No", Bell)}
            {renderDetailRow("Created", data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "—", Clock)}
            {renderDetailRow("Last Updated", data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "—", Save)}
          </div>

          {data?.files && data.files.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>
                Attached Files ({data.files.length})
              </div>
              {data.files.map(file => (
                <div key={file.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#f8fafc',
                  borderRadius: 6,
                  marginBottom: 4
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={16} />
                    <span style={{ fontSize: 14 }}>{file.name}</span>
                  </div>
                  <button
                    onClick={() => handleFilePreview(file)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      cursor: 'pointer',
                      padding: 4
                    }}
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>

            <button
              onClick={closeViewDialog}
              style={{
                padding: '12px 24px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 16,
                flex: 1
              }}
            >
              Close
            </button>
          </div>
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

  // --- Light Toolbar ---
  const LightToolbar = () => {
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);

    const optionsList = ["project", "task", "subtask"];
    const priorities = ["All", "High", "Medium", "Low"];
    const sortOptions = [
      { value: "name", label: "Name" },
      { value: "dueDate", label: "Due Date" },
      { value: "priority", label: "Priority" },
      { value: "created", label: "Recently Created" }
    ];

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
                      handleGroupBy(opt);
                      setShowOptionsDropdown(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={styles.btn}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              Sort <span style={{ fontSize: "10px" }}>{showSortDropdown ? "▲" : "▼"}</span>
            </button>

            {showSortDropdown && (
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
                  minWidth: "160px",
                  marginTop: "4px",
                }}
              >
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    style={{
                      padding: "6px 10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => {
                      handleSortProjects(option.value);
                      setShowSortDropdown(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
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
                  right: 0,
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
                      handleFilterPriority(p);
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
          <button
            style={{
              ...styles.btn,
              background: showClosed ? "#4f46e5" : "#fff",
              color: showClosed ? "#fff" : "#000"
            }}
            onClick={handleToggleClosed}
          >
            <CheckCircle size={18} />
            <p style={{ fontSize: "14px" }}>Closed</p>
          </button>

          {/* Search Box */}
          <div style={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* More Options Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={styles.btn}
              onClick={() => setShowMoreDropdown(!showMoreDropdown)}
            >
              <Settings size={18} />
            </button>

            {showMoreDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  minWidth: "160px",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                  onClick={() => {
                    handleExportData();
                    setShowMoreDropdown(false);
                  }}
                >
                  Export Data
                </div>
                <div
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    document.getElementById('import-data')?.click();
                    setShowMoreDropdown(false);
                  }}
                >
                  Import Data
                </div>
              </div>
            )}
          </div>

          {/* Hidden import input */}
          <input
            type="file"
            id="import-data"
            accept=".json"
            onChange={handleImportData}
            style={{ display: 'none' }}
          />

          {/* Add Project/Event Button */}
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

          {/* Clear All Button */}
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
    );
  };

  // Get filtered projects
  const filteredProjects = getFilteredProjects();

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
          {filteredProjects.length > 0 ? (
            filteredProjects.map(p => (
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
                <ProjectHeader
                  project={p}
                  toggleExpand={toggleExpand}
                  deleteItem={deleteItem}
                  openModal={openModal}
                  setProjects={setProjects}
                  dummyAssignees={dummyAssignees}
                  priorities={priorities}
                  priorityColors={priorityColors} // Add this line
                  openViewDialog={openViewDialog}
                  openEditDialog={openEditDialog}
                />

                {p.expanded && p.type !== 'event' && (
                  <div style={{ padding: 15 }}>

                    {p.description && (
                      <div style={{ fontSize: 13, color: "#666", marginBottom: 8, padding: 8, background: '#f8fafc', borderRadius: 4 }}>
                        {p.description}
                      </div>
                    )}

                    {(p.files && p.files.length > 0) && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Attached Files:</div>
                        {p.files.map(file => (
                          <div
                            key={file.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              color: '#666',
                              cursor: 'pointer',
                              padding: '4px 8px',
                              borderRadius: 4,
                              transition: 'background 0.2s'
                            }}
                            onClick={() => handleFilePreview(file)}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
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
                          <div
                            key={file.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              color: '#666',
                              cursor: 'pointer',
                              padding: '4px 8px',
                              borderRadius: 4,
                              transition: 'background 0.2s'
                            }}
                            onClick={() => handleFilePreview(file)}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
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
              No projects found. {searchQuery || filterPriority !== "All" ? "Try adjusting your search or filters." : "Click \"Add Project/Event\" to create your first project."}
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

        {/* Edit Dialog */}
        <EditDialog
          editDialog={editDialog}
          closeEditDialog={closeEditDialog}
          updateEditDialogData={updateEditDialogData}
          handleSaveEdit={handleSaveEdit}
          dummyAssignees={dummyAssignees}
          priorities={priorities}
          priorityColors={priorityColors}
        />


        {/* View Dialog */}
        <ViewDialog />
      </div>
    </div>
  );
}