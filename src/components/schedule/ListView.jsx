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
  const [itemType, setItemType] = useState("project");
  const [isEvent, setIsEvent] = useState(false);
  const [detailView, setDetailView] = useState({ isOpen: false, type: null, data: null });
  const [projectEditMode, setProjectEditMode] = useState({});
  const [editingValues, setEditingValues] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [taskEditMode, setTaskEditMode] = useState({});
  const [groupBy, setGroupBy] = useState("project");
  const [showClosed, setShowClosed] = useState(false);
  
  // --- Dialog States ---
  const [projectDialog, setProjectDialog] = useState({ isOpen: false, data: null, mode: 'create' });
  const [eventDialog, setEventDialog] = useState({ isOpen: false, data: null, mode: 'create' });
  const [taskDialog, setTaskDialog] = useState({ isOpen: false, data: null, mode: 'create', parentId: null });
  const [subtaskDialog, setSubtaskDialog] = useState({ isOpen: false, data: null, mode: 'create', parentId: null });
  const [viewDialog, setViewDialog] = useState({ isOpen: false, data: null, type: null });

  // --- Consolidated Form State ---
  const [formData, setFormData] = useState({
    project: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low",
      reminder: false,
      files: [],
      status: "To Do"
    },
    task: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low",
      reminder: false,
      files: [],
      status: "To Do"
    },
    subtask: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low",
      reminder: false,
      files: [],
      status: "To Do"
    },
    event: {
      name: "",
      description: "",
      assignee: "",
      due: "",
      priority: "Low",
      reminder: false,
      files: [],
      status: "To Do"
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

  // StatusSelector Component
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

    useEffect(() => {
      if (open && dropdownRef.current) {
        const height = dropdownRef.current.scrollHeight;
        setDropdownHeight(height);
      } else {
        setDropdownHeight(0);
      }
    }, [open]);

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

  // --- NEW: Task Dialog Functions ---
  const openTaskDialog = (task = null, parentId = null) => {
    if (task) {
      // Edit mode
      setTaskDialog({
        isOpen: true,
        data: task,
        mode: 'edit',
        parentId: parentId
      });
      // Pre-fill form data
      setFormData(prev => ({
        ...prev,
        task: {
          name: task.name || "",
          description: task.description || "",
          assignee: task.assignee || "",
          due: task.due || "",
          priority: task.priority || "Low",
          reminder: task.reminder || false,
          files: task.files || [],
          status: task.status || "To Do"
        }
      }));
    } else {
      // Create mode
      setTaskDialog({
        isOpen: true,
        data: null,
        mode: 'create',
        parentId: parentId
      });
      resetFormData('task');
    }
  };

  const openSubtaskDialog = (subtask = null, parentId = null) => {
    if (subtask) {
      // Edit mode
      setSubtaskDialog({
        isOpen: true,
        data: subtask,
        mode: 'edit',
        parentId: parentId
      });
      // Pre-fill form data
      setFormData(prev => ({
        ...prev,
        subtask: {
          name: subtask.name || "",
          description: subtask.description || "",
          assignee: subtask.assignee || "",
          due: subtask.due || "",
          priority: subtask.priority || "Low",
          reminder: subtask.reminder || false,
          files: subtask.files || [],
          status: subtask.status || "To Do"
        }
      }));
    } else {
      // Create mode
      setSubtaskDialog({
        isOpen: true,
        data: null,
        mode: 'create',
        parentId: parentId
      });
      resetFormData('subtask');
    }
  };

  const closeTaskDialog = () => {
    setTaskDialog({ isOpen: false, data: null, mode: 'create', parentId: null });
    setUploadedFiles([]);
  };

  const closeSubtaskDialog = () => {
    setSubtaskDialog({ isOpen: false, data: null, mode: 'create', parentId: null });
    setUploadedFiles([]);
  };

  // --- Save Task/Subtask Functions ---
  const saveTask = () => {
    const taskForm = formData.task;
    
    if (!taskForm.name?.trim()) {
      alert("Please enter a task name");
      return;
    }

    if (taskDialog.mode === 'create') {
      const newTask = {
        id: uid(),
        ...taskForm,
        type: 'task',
        expanded: true,
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setProjects(prev => prev.map(project => 
        project.id === taskDialog.parentId 
          ? {
              ...project,
              tasks: [newTask, ...(project.tasks || [])],
              updatedAt: new Date().toISOString()
            }
          : project
      ));
    } else {
      // Edit mode
      setProjects(prev => prev.map(project => ({
        ...project,
        tasks: (project.tasks || []).map(task =>
          task.id === taskDialog.data.id
            ? {
                ...task,
                ...taskForm,
                updatedAt: new Date().toISOString()
              }
            : task
        )
      })));
    }

    closeTaskDialog();
  };

  const saveSubtask = () => {
    const subtaskForm = formData.subtask;
    
    if (!subtaskForm.name?.trim()) {
      alert("Please enter a subtask name");
      return;
    }

    if (subtaskDialog.mode === 'create') {
      const newSubtask = {
        id: uid(),
        ...subtaskForm,
        type: 'subtask',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setProjects(prev => prev.map(project => ({
        ...project,
        tasks: (project.tasks || []).map(task =>
          task.id === subtaskDialog.parentId
            ? {
                ...task,
                subtasks: [newSubtask, ...(task.subtasks || [])],
                updatedAt: new Date().toISOString()
              }
            : task
        )
      })));
    } else {
      // Edit mode
      setProjects(prev => prev.map(project => ({
        ...project,
        tasks: (project.tasks || []).map(task => ({
          ...task,
          subtasks: (task.subtasks || []).map(subtask =>
            subtask.id === subtaskDialog.data.id
              ? {
                  ...subtask,
                  ...subtaskForm,
                  updatedAt: new Date().toISOString()
                }
              : subtask
          )
        }))
      })));
    }

    closeSubtaskDialog();
  };

  // --- Project/Event Dialog Functions ---
  const openProjectDialog = (project = null) => {
    if (project) {
      setProjectDialog({
        isOpen: true,
        data: project,
        mode: 'edit'
      });
      setFormData(prev => ({
        ...prev,
        project: {
          name: project.name || "",
          description: project.description || "",
          assignee: project.assignee || "",
          due: project.due || "",
          priority: project.priority || "Low",
          reminder: project.reminder || false,
          files: project.files || [],
          status: project.status || "To Do"
        }
      }));
    } else {
      setProjectDialog({
        isOpen: true,
        data: null,
        mode: 'create'
      });
      resetFormData('project');
    }
  };

  const openEventDialog = (event = null) => {
    if (event) {
      setEventDialog({
        isOpen: true,
        data: event,
        mode: 'edit'
      });
      setFormData(prev => ({
        ...prev,
        event: {
          name: event.name || "",
          description: event.description || "",
          assignee: event.assignee || "",
          due: event.due || "",
          priority: event.priority || "Low",
          reminder: event.reminder || false,
          files: event.files || [],
          status: event.status || "To Do"
        }
      }));
    } else {
      setEventDialog({
        isOpen: true,
        data: null,
        mode: 'create'
      });
      resetFormData('event');
    }
  };

  const openViewDialog = (data, type) => {
    setViewDialog({
      isOpen: true,
      data: data,
      type: type
    });
  };

  const closeProjectDialog = () => {
    setProjectDialog({ isOpen: false, data: null, mode: 'create' });
    setUploadedFiles([]);
  };

  const closeEventDialog = () => {
    setEventDialog({ isOpen: false, data: null, mode: 'create' });
    setUploadedFiles([]);
  };

  const closeViewDialog = () => {
    setViewDialog({ isOpen: false, data: null, type: null });
  };

  // --- Save Project/Event Functions ---
  const saveProject = () => {
    const projectForm = formData.project;
    
    if (!projectForm.name?.trim()) {
      alert("Please enter a project name");
      return;
    }

    if (projectDialog.mode === 'create') {
      const newProject = {
        id: uid(),
        ...projectForm,
        type: 'project',
        expanded: true,
        todoExpanded: true,
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProjects(prev => [newProject, ...prev]);
    } else {
      setProjects(prev => prev.map(p => 
        p.id === projectDialog.data.id 
          ? { 
              ...p, 
              ...projectForm,
              updatedAt: new Date().toISOString()
            } 
          : p
      ));
    }

    closeProjectDialog();
  };

  const saveEvent = () => {
    const eventForm = formData.event;
    
    if (!eventForm.name?.trim()) {
      alert("Please enter an event name");
      return;
    }

    if (eventDialog.mode === 'create') {
      const newEvent = {
        id: uid(),
        ...eventForm,
        type: 'event',
        expanded: true,
        todoExpanded: true,
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProjects(prev => [newEvent, ...prev]);
    } else {
      setProjects(prev => prev.map(p => 
        p.id === eventDialog.data.id 
          ? { 
              ...p, 
              ...eventForm,
              updatedAt: new Date().toISOString()
            } 
          : p
      ));
    }

    closeEventDialog();
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

    if (filterPriority !== "All") {
      filtered = filtered.filter(project => project.priority === filterPriority);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.assignee.toLowerCase().includes(query)
      );
    }

    if (!showClosed) {
      filtered = filtered.filter(project => project.status !== "Completed");
    }

    return filtered;
  };

  // --- File Operations ---
  const handleFileUpload = (event, type) => {
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
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        files: [...(prev[type].files || []), ...newFiles]
      }
    }));
  };

  const removeFile = (fileId, type) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        files: (prev[type].files || []).filter(file => file.id !== fileId)
      }
    }));
  };

  const handleFileDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      window.open(file.url, '_blank');
    } else {
      window.open(file.url, '_blank');
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
        priority: "Low",
        reminder: false,
        files: [],
        status: "To Do"
      }
    }));
    setUploadedFiles([]);
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
  const FileUploadSection = ({ type }) => (
    <div style={{ border: '2px dashed #d1d5db', borderRadius: 8, padding: 20, textAlign: 'center' }}>
      <input
        type="file"
        multiple
        onChange={(e) => handleFileUpload(e, type)}
        style={{ display: 'none' }}
        id={`file-upload-${type}`}
      />
      <label
        htmlFor={`file-upload-${type}`}
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

      {formData[type]?.files?.length > 0 && (
        <div style={{ marginTop: 16, textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Uploaded Files:</div>
          {formData[type].files.map(file => (
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
                  onClick={() => removeFile(file.id, type)}
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

  // --- Task Dialog Content ---
  const renderTaskDialogContent = () => {
    const currentForm = formData.task;
    const isEdit = taskDialog.mode === 'edit';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Task Name</label>
          <input
            type="text"
            value={currentForm.name || ""}
            onChange={(e) => updateFormData("task", "name", e.target.value)}
            placeholder="Enter task name"
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Description</label>
          <textarea
            value={currentForm.description || ""}
            onChange={(e) => updateFormData("task", "description", e.target.value)}
            placeholder="Enter task description"
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
              minHeight: 80,
              resize: 'vertical'
            }}
          />
        </div>

        <FormRow>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Assignee"
              type="select"
              value={currentForm.assignee || ""}
              onChange={e => updateFormData('task', 'assignee', e.target.value)}
              options={["", ...dummyAssignees]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Due Date"
              type="date"
              value={currentForm.due || ""}
              onChange={e => updateFormData('task', 'due', e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Priority"
              type="select"
              value={currentForm.priority || "Low"}
              onChange={e => updateFormData('task', 'priority', e.target.value)}
              options={priorities}
            />
          </div>
        </FormRow>

        <FormRow>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Status"
              type="select"
              value={currentForm.status || "To Do"}
              onChange={e => updateFormData('task', 'status', e.target.value)}
              options={["To Do", "In Progress", "Completed"]}
            />
          </div>
        </FormRow>

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
            onChange={(checked) => updateFormData('task', 'reminder', checked)}
            icon={Bell}
          />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
            File Upload
          </div>
          <FileUploadSection type="task" />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={saveTask}
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
            {isEdit ? 'Update Task' : 'Create Task'}
          </button>
          <button
            onClick={closeTaskDialog}
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

  // --- Subtask Dialog Content ---
  const renderSubtaskDialogContent = () => {
    const currentForm = formData.subtask;
    const isEdit = subtaskDialog.mode === 'edit';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Subtask Name</label>
          <input
            type="text"
            value={currentForm.name || ""}
            onChange={(e) => updateFormData("subtask", "name", e.target.value)}
            placeholder="Enter subtask name"
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Description</label>
          <textarea
            value={currentForm.description || ""}
            onChange={(e) => updateFormData("subtask", "description", e.target.value)}
            placeholder="Enter subtask description"
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
              minHeight: 80,
              resize: 'vertical'
            }}
          />
        </div>

        <FormRow>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Assignee"
              type="select"
              value={currentForm.assignee || ""}
              onChange={e => updateFormData('subtask', 'assignee', e.target.value)}
              options={["", ...dummyAssignees]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Due Date"
              type="date"
              value={currentForm.due || ""}
              onChange={e => updateFormData('subtask', 'due', e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Priority"
              type="select"
              value={currentForm.priority || "Low"}
              onChange={e => updateFormData('subtask', 'priority', e.target.value)}
              options={priorities}
            />
          </div>
        </FormRow>

        <FormRow>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Status"
              type="select"
              value={currentForm.status || "To Do"}
              onChange={e => updateFormData('subtask', 'status', e.target.value)}
              options={["To Do", "In Progress", "Completed"]}
            />
          </div>
        </FormRow>

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
            onChange={(checked) => updateFormData('subtask', 'reminder', checked)}
            icon={Bell}
          />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
            File Upload
          </div>
          <FileUploadSection type="subtask" />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={saveSubtask}
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
            {isEdit ? 'Update Subtask' : 'Create Subtask'}
          </button>
          <button
            onClick={closeSubtaskDialog}
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

  // --- Project/Event Dialog Content (existing) ---
  const renderProjectDialogContent = () => {
    const currentForm = formData.project;
    const isEdit = projectDialog.mode === 'edit';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Project Name</label>
          <input
            type="text"
            value={currentForm.name || ""}
            onChange={(e) => updateFormData("project", "name", e.target.value)}
            placeholder="Enter project name"
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Description</label>
          <textarea
            value={currentForm.description || ""}
            onChange={(e) => updateFormData("project", "description", e.target.value)}
            placeholder="Enter project description"
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
              minHeight: 80,
              resize: 'vertical'
            }}
          />
        </div>

        <FormRow>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Assignee"
              type="select"
              value={currentForm.assignee || ""}
              onChange={e => updateFormData('project', 'assignee', e.target.value)}
              options={["", ...dummyAssignees]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Due Date"
              type="date"
              value={currentForm.due || ""}
              onChange={e => updateFormData('project', 'due', e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Priority"
              type="select"
              value={currentForm.priority || "Low"}
              onChange={e => updateFormData('project', 'priority', e.target.value)}
              options={priorities}
            />
          </div>
        </FormRow>

        <FormRow>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Status"
              type="select"
              value={currentForm.status || "To Do"}
              onChange={e => updateFormData('project', 'status', e.target.value)}
              options={["To Do", "In Progress", "Completed"]}
            />
          </div>
        </FormRow>

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
            onChange={(checked) => updateFormData('project', 'reminder', checked)}
            icon={Bell}
          />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
            File Upload
          </div>
          <FileUploadSection type="project" />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={saveProject}
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
            {isEdit ? 'Update Project' : 'Create Project'}
          </button>
          <button
            onClick={closeProjectDialog}
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

  const renderEventDialogContent = () => {
    const currentForm = formData.event;
    const isEdit = eventDialog.mode === 'edit';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Event Name</label>
          <input
            type="text"
            value={currentForm.name || ""}
            onChange={(e) => updateFormData("event", "name", e.target.value)}
            placeholder="Enter event name"
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Description</label>
          <textarea
            value={currentForm.description || ""}
            onChange={(e) => updateFormData("event", "description", e.target.value)}
            placeholder="Enter event description"
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
              minHeight: 80,
              resize: 'vertical'
            }}
          />
        </div>

        <FormRow>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Assignee"
              type="select"
              value={currentForm.assignee || ""}
              onChange={e => updateFormData('event', 'assignee', e.target.value)}
              options={["", ...dummyAssignees]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Due Date"
              type="date"
              value={currentForm.due || ""}
              onChange={e => updateFormData('event', 'due', e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Priority"
              type="select"
              value={currentForm.priority || "Low"}
              onChange={e => updateFormData('event', 'priority', e.target.value)}
              options={priorities}
            />
          </div>
        </FormRow>

        <FormRow>
          <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column" }}>
            <FormField
              label="Status"
              type="select"
              value={currentForm.status || "To Do"}
              onChange={e => updateFormData('event', 'status', e.target.value)}
              options={["To Do", "In Progress", "Completed"]}
            />
          </div>
        </FormRow>

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
            onChange={(checked) => updateFormData('event', 'reminder', checked)}
            icon={Bell}
          />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
            File Upload
          </div>
          <FileUploadSection type="event" />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={saveEvent}
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
            {isEdit ? 'Update Event' : 'Create Event'}
          </button>
          <button
            onClick={closeEventDialog}
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

  // --- View Dialog Content (existing) ---
  const renderViewDialogContent = () => {
    const { data, type } = viewDialog;
    if (!data) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}>
            {data.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <div style={{
              background: type === 'event' ? '#e0f2fe' : '#f3f4f6',
              color: type === 'event' ? '#0369a1' : '#374151',
              padding: '2px 8px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              {type === 'event' ? <Clock size={12} /> : <Target size={12} />}
              {type === 'event' ? 'Event' : 'Project'}
            </div>
            <div style={{
              background: priorityColors[data.priority] + '20',
              color: priorityColors[data.priority],
              padding: '2px 8px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <Flag size={12} />
              {data.priority}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Description</label>
            <div style={{ 
              padding: '12px', 
              background: '#f8fafc', 
              borderRadius: 6, 
              marginTop: 4,
              fontSize: 14,
              color: '#6b7280'
            }}>
              {data.description || 'No description provided'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Assignee</label>
              <div style={{ marginTop: 4, fontSize: 14, color: '#6b7280' }}>
                {data.assignee || 'Unassigned'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Due Date</label>
              <div style={{ marginTop: 4, fontSize: 14, color: '#6b7280' }}>
                {data.due || 'No due date'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Status</label>
              <div style={{ marginTop: 4 }}>
                <StatusSelector value={data.status || "To Do"} readOnly />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Reminder</label>
              <div style={{ marginTop: 4, fontSize: 14, color: '#6b7280' }}>
                {data.reminder ? 'On' : 'Off'}
              </div>
            </div>
          </div>

          {data.files && data.files.length > 0 && (
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Attached Files</label>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.files.map(file => (
                  <div
                    key={file.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: 6
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={() => {
              closeViewDialog();
              if (type === 'project') {
                openProjectDialog(data);
              } else {
                openEventDialog(data);
              }
            }}
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
            Edit
          </button>
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
              flex: 1,
              transition: 'background 0.2s'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // --- TaskItem Component (Updated with Dialog Integration) ---
  const TaskItem = ({
    task,
    level = 0,
    dummyAssignees = [],
    priorities = [],
    priorityColors = {},
    deleteItem
  }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpand = () => setIsExpanded(prev => !prev);

    return (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 0.6fr 0.6fr 0.8fr 0.8fr",
            alignItems: "center",
            padding: "10px 16px",
            backgroundColor: level === 0 ? "#f9fafb" : "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            marginLeft: level * 20,
            borderLeft: level > 0 ? "2px solid #4f46e5" : "none",
          }}
        >
          {/* --- Task Name & Expand --- */}
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

            <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
              {task.name}
            </span>
          </div>

          {/* --- Status --- */}
          <div>
            <StatusSelector
              value={task.status || "To Do"}
              onChange={(status) => {
                if (level === 0) {
                  // Update task status
                  setProjects(prev => prev.map(project => ({
                    ...project,
                    tasks: (project.tasks || []).map(t =>
                      t.id === task.id ? { ...t, status, updatedAt: new Date().toISOString() } : t
                    )
                  })));
                } else {
                  // Update subtask status
                  setProjects(prev => prev.map(project => ({
                    ...project,
                    tasks: (project.tasks || []).map(t => ({
                      ...t,
                      subtasks: (t.subtasks || []).map(st =>
                        st.id === task.id ? { ...st, status, updatedAt: new Date().toISOString() } : st
                      )
                    }))
                  })));
                }
              }}
            />
          </div>

          {/* --- Assignee --- */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                cursor: "default",
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
              {task.assignee
                ? task.assignee.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                : <User size={16} />}
            </button>
          </div>

          {/* --- Priority --- */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                cursor: "pointer",
                border: "none",
                background: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Flag color={priorityColors[task.priority]} size={18} />
            </button>
          </div>

          {/* --- Due Date --- */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
            <button
              style={{
                border: "none",
                background: "none",
                cursor: "default"
              }}
            >
              <CalendarIcon size={18} />
            </button>

            <span style={{ fontSize: 14, color: "#374151" }}>
              {task.due || "—"}
            </span>
          </div>

          {/* --- Actions --- */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
            {/* View Button */}
            <button
              title="View Details"
              onClick={() => openViewDialog(task, level === 0 ? 'task' : 'subtask')}
              style={{
                border: "none",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                color: "#4f46e5",
                cursor: "pointer"
              }}
            >
              <Eye size={16} />
            </button>

            {/* Edit Button */}
            <button
              title="Edit"
              onClick={() => level === 0 ? openTaskDialog(task) : openSubtaskDialog(task)}
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
              <Edit3 size={14} />
            </button>

            {/* Delete Button */}
            <button
              title={`Delete ${level === 0 ? 'Task' : 'Subtask'}`}
              onClick={() => deleteItem?.(task.id, level === 0 ? "task" : "subtask")}
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

            {/* Add Subtask Button (only for tasks) */}
            {level === 0 && (
              <button
                onClick={() => openSubtaskDialog(null, task.id)}
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
            />
          ))}
      </>
    );
  };

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
        />
      ))
    ) : (
      <div style={{ color: "#888", fontSize: 13, fontStyle: 'italic', padding: '12px 0' }}>
        No tasks yet. Click "Add Task" to create your first task.
      </div>
    );
  };

  // --- Enhanced Project Header Component ---
  const ProjectHeader = ({ project }) => {
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
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "60%" }}>
          <StatusSelector
            value={project.status || "To Do"}
            onChange={(status) => {
              setProjects(prev => 
                prev.map(p => 
                  p.id === project.id 
                    ? { ...p, status, updatedAt: new Date().toISOString() } 
                    : p
                )
              );
            }}
          />

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
                position: "relative",
                overflow: "hidden"
              }}
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
            >
              <Flag color={priorityColors[project.priority]} />
            </button>
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
            >
              <CalendarIcon />
            </button>

            <div style={{ fontSize: 14, color: "#333" }}>
              {project.due}
            </div>
          </div>

          {/* action Button */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
            {/* View Button */}
            <button
              title="View Details"
              onClick={() => openViewDialog(project, project.type)}
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
                background: "transparent",
                color: "#4f46e5"
              }}
            >
              <Eye size={16} />
            </button>

            {/* Edit Button */}
            <button
              title="Edit"
              onClick={() => project.type === 'event' ? openEventDialog(project) : openProjectDialog(project)}
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
                background: "transparent",
                color: "inherit"
              }}
            >
              <Edit3 size={16} />
            </button>

            {/* Add Task Button (only for projects) */}
            {project.type === 'project' && (
              <button
                onClick={() => openTaskDialog(null, project.id)}
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
                  gap: 4
                }}
              >
                <Plus size={14} /> Add Task
              </button>
            )}

            {/* Delete Button */}
            <button
              title="Delete"
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
      searchBox: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
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

          {/* Add Project Button */}
          <button
            onClick={() => openProjectDialog()}
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
            <Plus size={16} /> Add Project
          </button>

          {/* Add Event Button */}
          <button
            onClick={() => openEventDialog()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: '#059669',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 14,
              transition: 'background 0.2s'
            }}
          >
            <Plus size={16} /> Add Event
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
                <ProjectHeader project={p} />

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
                        <strong>Assignee:</strong> {p.assignee || 'Unassigned'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                        <Flag size={12} color={priorityColors[p.priority]} />
                        <strong>Priority:</strong> {p.priority}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                        <CalendarIcon size={12} />
                        <strong>Date:</strong> {p.due || 'No date set'}
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
              No projects found. {searchQuery || filterPriority !== "All" ? "Try adjusting your search or filters." : "Click \"Add Project\" to create your first project."}
            </div>
          )}
        </div>

        {/* Project Dialog */}
        {projectDialog.isOpen && (
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
                  {projectDialog.mode === 'edit' ? 'Edit Project' : 'Create New Project'}
                </div>
                <button onClick={closeProjectDialog} style={{
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
              {renderProjectDialogContent()}
            </div>
          </div>
        )}

        {/* Event Dialog */}
        {eventDialog.isOpen && (
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
                  {eventDialog.mode === 'edit' ? 'Edit Event' : 'Create New Event'}
                </div>
                <button onClick={closeEventDialog} style={{
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
              {renderEventDialogContent()}
            </div>
          </div>
        )}

        {/* Task Dialog */}
        {taskDialog.isOpen && (
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
                  {taskDialog.mode === 'edit' ? 'Edit Task' : 'Create New Task'}
                </div>
                <button onClick={closeTaskDialog} style={{
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
              {renderTaskDialogContent()}
            </div>
          </div>
        )}

        {/* Subtask Dialog */}
        {subtaskDialog.isOpen && (
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
                  {subtaskDialog.mode === 'edit' ? 'Edit Subtask' : 'Create New Subtask'}
                </div>
                <button onClick={closeSubtaskDialog} style={{
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
              {renderSubtaskDialogContent()}
            </div>
          </div>
        )}

        {/* View Dialog */}
        {viewDialog.isOpen && (
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
                  {viewDialog.type === 'event' ? 'Event Details' : 
                   viewDialog.type === 'task' ? 'Task Details' : 
                   viewDialog.type === 'subtask' ? 'Subtask Details' : 'Project Details'}
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
              {renderViewDialogContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}