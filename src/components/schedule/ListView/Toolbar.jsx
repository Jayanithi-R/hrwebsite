import React, { useState, useEffect } from 'react';
import { Filter, Users, CheckCircle, Settings, Search, Plus, Trash2 } from 'lucide-react';

const LightToolbar = ({ 
  projects, 
  setProjects,
  groupBy,
  setGroupBy,
  filterPriority,
  setFilterPriority,
  selectedAssignee,
  setSelectedAssignee,
  showClosed,
  setShowClosed,
  searchQuery,
  setSearchQuery 
}) => {
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  
  const [currentSort, setCurrentSort] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc");
  const [originalProjects, setOriginalProjects] = useState([]);

  const optionsList = ["None", "project", "task", "subtask", "priority", "assignee", "status"];
  const priorities = ["All", "High", "Medium", "Low"];
  const sortOptions = [
    { value: "none", label: "None" },
    { value: "name", label: "Name" },
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "created", label: "Recently Created" },
    { value: "updated", label: "Recently Updated" },
    { value: "assignee", label: "Assignee" },
    { value: "status", label: "Status" }
  ];

  const statusOptions = ["All", "Not Started", "In Progress", "Completed", "On Hold"];
  const assigneeOptions = ["All", "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"];

  // Initialize original projects
  useEffect(() => {
    if (projects.length > 0 && originalProjects.length === 0) {
      setOriginalProjects([...projects]);
    }
  }, [projects, originalProjects]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowOptionsDropdown(false);
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
        setShowMoreDropdown(false);
        setShowAssigneeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // GROUP BY FUNCTIONALITY
  const handleGroupBy = (groupType) => {
    setGroupBy(groupType);
    
    if (groupType === "None") {
      // Reset to ungrouped view
      setProjects([...originalProjects]);
      return;
    }

    // Group projects based on the selected criteria
    const grouped = groupProjects([...projects], groupType);
    setProjects(grouped);
  };

  const groupProjects = (projectsToGroup, groupType) => {
    switch (groupType) {
      case "project":
        return groupByProject(projectsToGroup);
      case "task":
        return groupByTask(projectsToGroup);
      case "subtask":
        return groupBySubtask(projectsToGroup);
      case "priority":
        return groupByPriority(projectsToGroup);
      case "assignee":
        return groupByAssignee(projectsToGroup);
      case "status":
        return groupByStatus(projectsToGroup);
      default:
        return projectsToGroup;
    }
  };

  const groupByProject = (projects) => {
    const projectGroups = {};
    
    projects.forEach(project => {
      if (!projectGroups[project.name]) {
        projectGroups[project.name] = {
          ...project,
          type: 'project-group',
          children: []
        };
      }
      
      // Add tasks and subtasks under the project
      if (project.tasks) {
        project.tasks.forEach(task => {
          projectGroups[project.name].children.push({
            ...task,
            type: 'task'
          });
          
          if (task.subtasks) {
            task.subtasks.forEach(subtask => {
              projectGroups[project.name].children.push({
                ...subtask,
                type: 'subtask',
                parentTask: task.name
              });
            });
          }
        });
      }
    });
    
    return Object.values(projectGroups);
  };

  const groupByTask = (projects) => {
    const taskGroups = {};
    
    projects.forEach(project => {
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (!taskGroups[task.name]) {
            taskGroups[task.name] = {
              ...task,
              type: 'task-group',
              children: []
            };
          }
          
          // Add subtasks under the task
          if (task.subtasks) {
            task.subtasks.forEach(subtask => {
              taskGroups[task.name].children.push({
                ...subtask,
                type: 'subtask'
              });
            });
          }
        });
      }
    });
    
    return Object.values(taskGroups);
  };

  const groupBySubtask = (projects) => {
    const subtaskGroups = {};
    
    projects.forEach(project => {
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (task.subtasks) {
            task.subtasks.forEach(subtask => {
              if (!subtaskGroups[subtask.name]) {
                subtaskGroups[subtask.name] = {
                  ...subtask,
                  type: 'subtask-group'
                };
              }
            });
          }
        });
      }
    });
    
    return Object.values(subtaskGroups);
  };

  const groupByPriority = (projects) => {
    const priorityGroups = {
      "High": { name: "High Priority", type: "priority-group", priority: "High", children: [] },
      "Medium": { name: "Medium Priority", type: "priority-group", priority: "Medium", children: [] },
      "Low": { name: "Low Priority", type: "priority-group", priority: "Low", children: [] }
    };
    
    projects.forEach(project => {
      // Add project to priority group
      if (priorityGroups[project.priority]) {
        priorityGroups[project.priority].children.push({
          ...project,
          type: 'project'
        });
      }
      
      // Add tasks and subtasks
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (priorityGroups[task.priority]) {
            priorityGroups[task.priority].children.push({
              ...task,
              type: 'task'
            });
          }
          
          if (task.subtasks) {
            task.subtasks.forEach(subtask => {
              if (priorityGroups[subtask.priority]) {
                priorityGroups[subtask.priority].children.push({
                  ...subtask,
                  type: 'subtask'
                });
              }
            });
          }
        });
      }
    });
    
    return Object.values(priorityGroups).filter(group => group.children.length > 0);
  };

  const groupByAssignee = (projects) => {
    const assigneeGroups = {};
    
    projects.forEach(project => {
      // Group by project assignee
      if (project.assignee) {
        if (!assigneeGroups[project.assignee]) {
          assigneeGroups[project.assignee] = {
            name: `Assigned to ${project.assignee}`,
            type: "assignee-group",
            assignee: project.assignee,
            children: []
          };
        }
        assigneeGroups[project.assignee].children.push({
          ...project,
          type: 'project'
        });
      }
      
      // Group by task assignees
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (task.assignee) {
            if (!assigneeGroups[task.assignee]) {
              assigneeGroups[task.assignee] = {
                name: `Assigned to ${task.assignee}`,
                type: "assignee-group",
                assignee: task.assignee,
                children: []
              };
            }
            assigneeGroups[task.assignee].children.push({
              ...task,
              type: 'task'
            });
          }
          
          // Group by subtask assignees
          if (task.subtasks) {
            task.subtasks.forEach(subtask => {
              if (subtask.assignee) {
                if (!assigneeGroups[subtask.assignee]) {
                  assigneeGroups[subtask.assignee] = {
                    name: `Assigned to ${subtask.assignee}`,
                    type: "assignee-group",
                    assignee: subtask.assignee,
                    children: []
                  };
                }
                assigneeGroups[subtask.assignee].children.push({
                  ...subtask,
                  type: 'subtask'
                });
              }
            });
          }
        });
      }
    });
    
    return Object.values(assigneeGroups).filter(group => group.children.length > 0);
  };

  const groupByStatus = (projects) => {
    const statusGroups = {
      "Not Started": { name: "Not Started", type: "status-group", status: "Not Started", children: [] },
      "In Progress": { name: "In Progress", type: "status-group", status: "In Progress", children: [] },
      "Completed": { name: "Completed", type: "status-group", status: "Completed", children: [] },
      "On Hold": { name: "On Hold", type: "status-group", status: "On Hold", children: [] }
    };
    
    projects.forEach(project => {
      // Add project to status group
      if (statusGroups[project.status]) {
        statusGroups[project.status].children.push({
          ...project,
          type: 'project'
        });
      }
      
      // Add tasks and subtasks
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (statusGroups[task.status]) {
            statusGroups[task.status].children.push({
              ...task,
              type: 'task'
            });
          }
          
          if (task.subtasks) {
            task.subtasks.forEach(subtask => {
              if (statusGroups[subtask.status]) {
                statusGroups[subtask.status].children.push({
                  ...subtask,
                  type: 'subtask'
                });
              }
            });
          }
        });
      }
    });
    
    return Object.values(statusGroups).filter(group => group.children.length > 0);
  };

  // SORT FUNCTIONALITY
  const handleSortProjects = (sortValue) => {
    if (sortValue === "none") {
      // Reset to original order
      setProjects([...originalProjects]);
      setCurrentSort("none");
      setSortDirection("asc");
      return;
    }

    // Toggle direction if clicking the same sort option
    const newDirection = currentSort === sortValue && sortDirection === "asc" ? "desc" : "asc";
    
    setCurrentSort(sortValue);
    setSortDirection(newDirection);

    const sortedProjects = sortProjects([...projects], sortValue, newDirection);
    setProjects(sortedProjects);
  };

  const sortProjects = (projectsToSort, sortBy, direction) => {
    const sortOrder = direction === "asc" ? 1 : -1;

    const compareValues = (a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "dueDate":
          aValue = new Date(a.dueDate || "9999-12-31");
          bValue = new Date(b.dueDate || "9999-12-31");
          break;
        case "priority":
          const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case "created":
          aValue = new Date(a.createdAt || a.dateCreated || "1970-01-01");
          bValue = new Date(b.createdAt || b.dateCreated || "1970-01-01");
          break;
        case "updated":
          aValue = new Date(a.updatedAt || a.lastUpdated || "1970-01-01");
          bValue = new Date(b.updatedAt || b.lastUpdated || "1970-01-01");
          break;
        case "assignee":
          aValue = a.assignee?.toLowerCase() || "zzz";
          bValue = b.assignee?.toLowerCase() || "zzz";
          break;
        case "status":
          const statusOrder = { "Not Started": 1, "In Progress": 2, "Completed": 3, "On Hold": 4 };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return -1 * sortOrder;
      if (aValue > bValue) return 1 * sortOrder;
      return 0;
    };

    // Sort projects and their nested tasks/subtasks
    return projectsToSort.map(project => {
      const sortedProject = { ...project };
      
      if (sortedProject.tasks) {
        sortedProject.tasks = sortedProject.tasks.map(task => {
          const sortedTask = { ...task };
          
          if (sortedTask.subtasks) {
            sortedTask.subtasks = [...sortedTask.subtasks].sort(compareValues);
          }
          
          return sortedTask;
        }).sort(compareValues);
      }
      
      return sortedProject;
    }).sort(compareValues);
  };

  // FILTER FUNCTIONALITY
  const handleFilterPriority = (priority) => {
    setFilterPriority(priority);
    
    if (priority === "All") {
      setProjects([...originalProjects]);
      return;
    }

    const filteredProjects = filterProjectsByPriority([...originalProjects], priority);
    setProjects(filteredProjects);
  };

  const filterProjectsByPriority = (projectsToFilter, priority) => {
    return projectsToFilter.filter(project => {
      // Check if project matches priority
      const projectMatches = project.priority === priority;
      
      // Check if any tasks match priority
      const hasMatchingTasks = project.tasks?.some(task => 
        task.priority === priority || 
        task.subtasks?.some(subtask => subtask.priority === priority)
      );
      
      return projectMatches || hasMatchingTasks;
    }).map(project => {
      // Filter tasks and subtasks within matching projects
      const filteredProject = { ...project };
      
      if (filteredProject.tasks) {
        filteredProject.tasks = filteredProject.tasks.filter(task => {
          const taskMatches = task.priority === priority;
          const hasMatchingSubtasks = task.subtasks?.some(subtask => subtask.priority === priority);
          
          if (taskMatches || hasMatchingSubtasks) {
            const filteredTask = { ...task };
            if (filteredTask.subtasks) {
              filteredTask.subtasks = filteredTask.subtasks.filter(subtask => 
                subtask.priority === priority
              );
            }
            return filteredTask;
          }
          return false;
        });
      }
      
      return filteredProject;
    });
  };

  // ASSIGNEE FILTER FUNCTIONALITY
  const handleAssigneeFilter = (assignee) => {
    setSelectedAssignee(assignee);
    
    if (assignee === "All") {
      setProjects([...originalProjects]);
      return;
    }

    const filteredProjects = filterProjectsByAssignee([...originalProjects], assignee);
    setProjects(filteredProjects);
  };

  const filterProjectsByAssignee = (projectsToFilter, assignee) => {
    return projectsToFilter.filter(project => {
      // Check if project matches assignee
      const projectMatches = project.assignee === assignee;
      
      // Check if any tasks match assignee
      const hasMatchingTasks = project.tasks?.some(task => 
        task.assignee === assignee || 
        task.subtasks?.some(subtask => subtask.assignee === assignee)
      );
      
      return projectMatches || hasMatchingTasks;
    }).map(project => {
      // Filter tasks and subtasks within matching projects
      const filteredProject = { ...project };
      
      if (filteredProject.tasks) {
        filteredProject.tasks = filteredProject.tasks.filter(task => {
          const taskMatches = task.assignee === assignee;
          const hasMatchingSubtasks = task.subtasks?.some(subtask => subtask.assignee === assignee);
          
          if (taskMatches || hasMatchingSubtasks) {
            const filteredTask = { ...task };
            if (filteredTask.subtasks) {
              filteredTask.subtasks = filteredTask.subtasks.filter(subtask => 
                subtask.assignee === assignee
              );
            }
            return filteredTask;
          }
          return false;
        });
      }
      
      return filteredProject;
    });
  };

  // OTHER HANDLERS
  const handleToggleClosed = () => {
    setShowClosed(!showClosed);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleExportData = () => {
    console.log("Exporting data...");
    // Implement export logic
  };

  const handleImportData = (event) => {
    console.log("Importing data...");
    // Implement import logic
  };

  const openModal = (type) => {
    console.log(`Opening ${type} modal`);
    // Implement modal opening logic
  };

  const clearAllData = () => {
    console.log("Clearing all data");
    // Implement clear data logic
  };

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
      fontSize: "14px",
    },
    activeBtn: {
      background: "#4f46e5",
      color: "#fff",
      border: "1px solid #4f46e5",
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
    dropdown: {
      position: "absolute",
      top: "100%",
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: "6px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      zIndex: 100,
      minWidth: "140px",
      marginTop: "4px",
      maxHeight: "300px",
      overflowY: "auto",
    },
    dropdownItem: {
      padding: "8px 12px",
      cursor: "pointer",
      borderBottom: "1px solid #f3f4f6",
      fontSize: "14px",
      transition: "background 0.2s",
    }
  };

  return (
    <div style={styles.toolbar}>
      {/* LEFT SECTION */}
      <div style={styles.leftSection}>
        {/* Group Dropdown */}
        <div className="dropdown-container" style={{ position: "relative" }}>
          <button
            style={{
              ...styles.btn,
              ...(groupBy !== "None" ? styles.activeBtn : {})
            }}
            onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
          >
            Group: {groupBy} <span style={{ fontSize: "10px" }}>{showOptionsDropdown ? "▲" : "▼"}</span>
          </button>

          {showOptionsDropdown && (
            <div style={{ ...styles.dropdown, left: 0, minWidth: "140px" }}>
              {optionsList.map((opt) => (
                <div
                  key={opt}
                  style={{
                    ...styles.dropdownItem,
                    background: groupBy === opt ? "#f3f4f6" : "transparent",
                    fontWeight: groupBy === opt ? "600" : "400",
                  }}
                  onClick={() => {
                    handleGroupBy(opt);
                    setShowOptionsDropdown(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
                  onMouseLeave={(e) => e.currentTarget.style.background = groupBy === opt ? "#f3f4f6" : "transparent"}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="dropdown-container" style={{ position: "relative" }}>
          <button
            style={{
              ...styles.btn,
              ...(currentSort !== "none" ? styles.activeBtn : {})
            }}
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            {currentSort === "none" ? "Sort" : `Sort: ${sortOptions.find(opt => opt.value === currentSort)?.label}`}
            {currentSort !== "none" && (
              <span style={{ fontSize: "10px" }}>{sortDirection === "asc" ? "↑" : "↓"}</span>
            )}
            <span style={{ fontSize: "10px", marginLeft: "4px" }}>
              {showSortDropdown ? "▲" : "▼"}
            </span>
          </button>

          {showSortDropdown && (
            <div style={{ ...styles.dropdown, left: 0, minWidth: "180px" }}>
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  style={{
                    ...styles.dropdownItem,
                    background: currentSort === option.value ? "#f3f4f6" : "transparent",
                    fontWeight: currentSort === option.value ? "600" : "400",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    handleSortProjects(option.value);
                    setShowSortDropdown(false);
                  }}
                  onMouseEnter={(e) => {
                    if (currentSort !== option.value) {
                      e.currentTarget.style.background = "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentSort !== option.value) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {option.label}
                  {currentSort === option.value && (
                    <span style={{ fontSize: "10px" }}>
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div style={styles.rightSection}>
        {/* Filter Dropdown */}
        <div className="dropdown-container" style={{ position: "relative" }}>
          <button
            style={{
              ...styles.btn,
              ...(filterPriority !== "All" ? styles.activeBtn : {})
            }}
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <Filter size={16} />
            Filter {filterPriority !== "All" && `: ${filterPriority}`}
          </button>

          {showFilterDropdown && (
            <div style={{ ...styles.dropdown, right: 0, minWidth: "120px" }}>
              {priorities.map((p) => (
                <div
                  key={p}
                  style={{
                    ...styles.dropdownItem,
                    background: filterPriority === p ? "#f3f4f6" : "transparent",
                    fontWeight: filterPriority === p ? "600" : "400",
                  }}
                  onClick={() => {
                    handleFilterPriority(p);
                    setShowFilterDropdown(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
                  onMouseLeave={(e) => e.currentTarget.style.background = filterPriority === p ? "#f3f4f6" : "transparent"}
                >
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assignee Dropdown */}
        <div className="dropdown-container" style={{ position: "relative" }}>
          <button
            style={{
              ...styles.btn,
              ...(selectedAssignee !== "All" ? styles.activeBtn : {})
            }}
            onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
          >
            <Users size={16} />
            Assignee {selectedAssignee !== "All" && `: ${selectedAssignee.split(' ')[0]}`}
          </button>

          {showAssigneeDropdown && (
            <div style={{ ...styles.dropdown, right: 0, minWidth: "180px" }}>
              <div style={{ ...styles.dropdownItem, fontWeight: "600", background: "#f8fafc" }}>
                SELECT ASSIGNEE
              </div>
              {assigneeOptions.map((assignee) => (
                <div
                  key={assignee}
                  style={{
                    ...styles.dropdownItem,
                    background: selectedAssignee === assignee ? "#f3f4f6" : "transparent",
                    fontWeight: selectedAssignee === assignee ? "600" : "400",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onClick={() => {
                    handleAssigneeFilter(assignee);
                    setShowAssigneeDropdown(false);
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAssignee !== assignee) {
                      e.currentTarget.style.background = "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAssignee !== assignee) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {assignee !== "All" && (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: selectedAssignee === assignee ? "#4f46e5" : "#6b7280",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: "600",
                      }}
                    >
                      {assignee.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  )}
                  {assignee}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Closed Button */}
        <button
          style={{
            ...styles.btn,
            ...(showClosed ? styles.activeBtn : {})
          }}
          onClick={handleToggleClosed}
        >
          <CheckCircle size={16} />
          Closed
        </button>

        {/* Search Box */}
        <div style={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* More Options Dropdown */}
        <div className="dropdown-container" style={{ position: "relative" }}>
          <button
            style={styles.btn}
            onClick={() => setShowMoreDropdown(!showMoreDropdown)}
          >
            <Settings size={16} />
          </button>

          {showMoreDropdown && (
            <div style={{ ...styles.dropdown, right: 0, minWidth: "160px" }}>
              <div
                style={styles.dropdownItem}
                onClick={() => {
                  handleExportData();
                  setShowMoreDropdown(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                Export Data
              </div>
              <div
                style={styles.dropdownItem}
                onClick={() => {
                  document.getElementById('import-data')?.click();
                  setShowMoreDropdown(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
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
          }}
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>
    </div>
  );
};

export default LightToolbar;