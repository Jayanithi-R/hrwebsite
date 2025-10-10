import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./header";
import Sidebar from "./sidebar";

function Schedule() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "BE-Course Management",
      status: "To Do",
      assignedBy: "HR",
      assignedTo: "",
      priority: "",
      start: "",
      due: "",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by HR on 10/10/2025"],
      subtasks: [],
    },
    {
      id: 2,
      title: "BE-CM User",
      status: "To Do",
      assignedBy: "HR",
      assignedTo: "",
      priority: "",
      start: "",
      due: "",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by HR on 10/10/2025"],
      subtasks: [],
    },
    {
      id: 3,
      title: "BE-CM Admin Draft Database functionality",
      status: "To Do",
      assignedBy: "HR",
      assignedTo: "",
      priority: "",
      start: "",
      due: "",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by HR on 10/10/2025"],
      subtasks: [],
    },
    {
      id: 4,
      title: "CM.Textbox top line in create course",
      status: "In Progress",
      assignedBy: "Admin",
      assignedTo: "HS",
      priority: "High",
      start: "",
      due: "2025-05-20",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by Admin on 10/10/2025"],
      subtasks: [],
    },
    {
      id: 5,
      title: "CM.Last update time based on draft",
      status: "To Do",
      assignedBy: "HR",
      assignedTo: "",
      priority: "Medium",
      start: "",
      due: "",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by HR on 10/10/2025"],
      subtasks: [],
    },
    {
      id: 6,
      title: "CM.Course publish lifetime > Date-PHP",
      status: "In Progress",
      assignedBy: "Admin",
      assignedTo: "HS",
      priority: "High",
      start: "",
      due: "2025-05-20",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by Admin on 10/10/2025"],
      subtasks: [],
    },
    {
      id: 7,
      title: "CM.Shuffle Questions, Shuffle Answers -UI/BE",
      status: "To Do",
      assignedBy: "HR",
      assignedTo: "HS",
      priority: "Medium",
      start: "",
      due: "",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by HR on 10/10/2025"],
      subtasks: [],
    },
    {
      id: 8,
      title: "CM.Validations for every textbox in payment section",
      status: "To Do",
      assignedBy: "HR",
      assignedTo: "",
      priority: "Low",
      start: "",
      due: "",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by HR on 10/10/2025"],
      subtasks: [],
    },
    {
      id: 9,
      title: "CM.On clicking create course, duplicate course -UI/BE",
      status: "To Do",
      assignedBy: "HR",
      assignedTo: "",
      priority: "Low",
      start: "",
      due: "",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by HR on 10/10/2025"],
      subtasks: [],
    },
    {
      id: 10,
      title: "CM.Duplicate course name validation",
      status: "To Do",
      assignedBy: "HR",
      assignedTo: "",
      priority: "Low",
      start: "",
      due: "",
      description: "",
      file: null,
      githubLink: "",
      updates: ["Task created by HR on 10/10/2025"],
      subtasks: [],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    assignedBy: "HR",
    assignedTo: "",
    start: "",
    due: "",
    status: "To Do",
    priority: "Medium",
    description: "",
    file: null,
    githubLink: "",
  });

  // === Utility Classes ===
  const getStatusClasses = (status) => {
    switch (status) {
      case "To Do":
        return "bg-gray-500";
      case "In Progress":
        return "bg-green-500";
      case "Completed":
        return "bg-green-500";
      case "Subtask Completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-orange-500";
      case "Low":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // === Add Task ===
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo || !newTask.due) {
      alert("Please fill all required fields");
      return;
    }
    setEvents([
      ...events,
      {
        ...newTask,
        id: events.length + 1,
        subtasks: [],
        updates: [`Task created by ${newTask.assignedBy} on ${new Date().toLocaleDateString()}`],
      },
    ]);
    setShowForm(false);
    setNewTask({
      title: "",
      assignedBy: "HR",
      assignedTo: "",
      start: "",
      due: "",
      status: "To Do",
      priority: "Medium",
      description: "",
      file: null,
      githubLink: "",
    });
  };

  // === Edit Task ===
  const handleEditTask = (task) => setEditTask(task);

  const handleUpdateTask = (e) => {
    e.preventDefault();
    setEvents(events.map((t) => (t.id === editTask.id ? editTask : t)));
    setEditTask(null);
  };

  // === Subtask Inline Update ===
  const handleSubtaskChange = (taskId, subtaskId, field, value) => {
    setEvents((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((s) => {
                if (s.id === subtaskId) {
                  if (field === "status" && value === "Done") {
                    value = "Subtask Completed";
                  }
                  return { ...s, [field]: value };
                }
                return s;
              }),
            }
          : task
      )
    );

    // Check if all subtasks are completed
    setEvents((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.subtasks.every((s) => s.status === "Subtask Completed") ? "Completed" : task.status,
            }
          : task
      )
    );
  };

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, background: "#1a1a1a", padding: "2rem", color: "#fff" }}>
          <Header />
          <h1 style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "1rem" }}>
            Course Management System Sprint Dashboard
          </h1>

          <div style={{ background: "#2d2d2d", padding: "0.5rem", borderRadius: "0.25rem", marginBottom: "1rem" }}>
            <span style={{ color: "#ccc" }}>Group: Status</span> | <span style={{ color: "#ccc" }}>Subtasks</span> | <span style={{ color: "#ccc" }}>Columns</span>
          </div>

          <div style={{ background: "#2d2d2d", padding: "1rem", borderRadius: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>TO DO</h2>
              <button onClick={() => setShowForm(true)} style={{ background: "#4f46e5", color: "#fff", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>
                Add Task
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 0.5rem", color: "#fff" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#ccc", fontSize: "0.875rem" }}>
                  <th>Name</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <React.Fragment key={event.id}>
                    <tr onClick={() => handleEditTask(event)} style={{ cursor: "pointer" }}>
                      <td>
                        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: getStatusClasses(event.status), marginRight: "0.5rem" }}></span>
                        {event.title}
                      </td>
                      <td>
                        {event.assignedTo ? (
                          <span style={{ display: "inline-block", width: "24px", height: "24px", borderRadius: "50%", background: "#4f46e5", color: "#fff", textAlign: "center", lineHeight: "24px", fontSize: "0.75rem" }}>
                            {event.assignedTo.split("").slice(0, 2).join("").toUpperCase()}
                          </span>
                        ) : (
                          <span style={{ color: "#ccc" }}>-</span>
                        )}
                      </td>
                      <td style={{ color: "#ff6b6b" }}>{event.due}</td>
                      <td>
                        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: getPriorityClasses(event.priority) }}></span>
                      </td>
                    </tr>

                    {/* Subtasks */}
                    <tr>
                      <td colSpan="4" style={{ padding: 0 }}>
                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                          {event.subtasks.map((s) => (
                            <div key={s.id} style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem", borderTop: "1px solid #444" }}>
                              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: getStatusClasses(s.status), marginRight: "0.5rem", flexShrink: 0 }}></span>
                              <input
                                type="text"
                                value={s.title}
                                onChange={(e) => handleSubtaskChange(event.id, s.id, "title", e.target.value)}
                                style={{ flex: 1, background: "transparent", border: "none", color: "#fff", marginRight: "1rem" }}
                                placeholder="Subtask Title"
                              />
                              <input
                                type="text"
                                value={s.assignedTo}
                                onChange={(e) => handleSubtaskChange(event.id, s.id, "assignedTo", e.target.value)}
                                style={{ flex: 0.5, background: "transparent", border: "none", color: "#fff", marginRight: "1rem" }}
                                placeholder="Assignee"
                              />
                              <input
                                type="date"
                                value={s.due}
                                onChange={(e) => handleSubtaskChange(event.id, s.id, "due", e.target.value)}
                                style={{ flex: 0.5, background: "transparent", border: "none", color: "#fff", marginRight: "1rem" }}
                              />
                              <select
                                value={s.priority}
                                onChange={(e) => handleSubtaskChange(event.id, s.id, "priority", e.target.value)}
                                style={{ flex: 0.3, background: "transparent", border: "none", color: "#fff", marginRight: "1rem" }}
                              >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                              <select
                                value={s.status}
                                onChange={(e) => handleSubtaskChange(event.id, s.id, "status", e.target.value)}
                                style={{ flex: 0.3, background: "transparent", border: "none", color: "#fff" }}
                              >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>

                    {/* Add Subtask Button */}
                    <tr>
                      <td colSpan="4">
                        <button
                          onClick={() => {
                            const newSubtask = {
                              id: Date.now(),
                              title: "",
                              description: "",
                              status: "To Do",
                              priority: "Medium",
                              file: null,
                              githubLink: "",
                              due: "",
                              assignedTo: "",
                            };
                            setEvents((prev) =>
                              prev.map((task) =>
                                task.id === event.id ? { ...task, subtasks: [...task.subtasks, newSubtask] } : task
                              )
                            );
                          }}
                          style={{ background: "transparent", color: "#4f46e5", padding: "0.5rem", border: "none", cursor: "pointer" }}
                        >
                          + Add Subtask
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Task Modal */}
          {showForm && (
            <div style={modalStyle}>
              <div style={modalBox}>
                <h2>Add Task</h2>
                <form onSubmit={handleAddTask} style={formStyle}>
                  <label>Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Assigned By</label>
                  <select
                    value={newTask.assignedBy}
                    onChange={(e) => setNewTask({ ...newTask, assignedBy: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  >
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                  </select>

                  <label>Assigned To</label>
                  <input
                    type="text"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    required
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newTask.start}
                    onChange={(e) => setNewTask({ ...newTask, start: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Due Date</label>
                  <input
                    type="date"
                    value={newTask.due}
                    onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                    required
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <label>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  >
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>

                  <label>Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Upload File</label>
                  <input type="file" onChange={(e) => setNewTask({ ...newTask, file: e.target.files[0] })} />

                  <label>GitHub Link</label>
                  <input
                    type="text"
                    value={newTask.githubLink}
                    onChange={(e) => setNewTask({ ...newTask, githubLink: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                    <button type="submit" style={{ background: "#4f46e5", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.25rem" }}>Add</button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ background: "#555", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.25rem" }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Task Modal */}
          {editTask && (
            <div style={modalStyle}>
              <div style={modalBox}>
                <h2>Edit Task</h2>
                <form onSubmit={handleUpdateTask} style={formStyle}>
                  <label>Task Title</label>
                  <input
                    type="text"
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                    required
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Assigned By</label>
                  <select
                    value={editTask.assignedBy}
                    onChange={(e) => setEditTask({ ...editTask, assignedBy: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  >
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                  </select>

                  <label>Assigned To</label>
                  <input
                    type="text"
                    value={editTask.assignedTo}
                    onChange={(e) => setEditTask({ ...editTask, assignedTo: e.target.value })}
                    required
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Start Date</label>
                  <input
                    type="date"
                    value={editTask.start}
                    onChange={(e) => setEditTask({ ...editTask, start: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Due Date</label>
                  <input
                    type="date"
                    value={editTask.due}
                    onChange={(e) => setEditTask({ ...editTask, due: e.target.value })}
                    required
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Status</label>
                  <select
                    value={editTask.status}
                    onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <label>Priority</label>
                  <select
                    value={editTask.priority}
                    onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  >
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>

                  <label>Description</label>
                  <textarea
                    value={editTask.description}
                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <label>Upload File</label>
                  <input type="file" onChange={(e) => setEditTask({ ...editTask, file: e.target.files[0] })} />

                  <label>GitHub Link</label>
                  <input
                    type="text"
                    value={editTask.githubLink}
                    onChange={(e) => setEditTask({ ...editTask, githubLink: e.target.value })}
                    style={{ padding: "0.5rem", background: "#2d2d2d", color: "#fff", border: "1px solid #444", borderRadius: "0.25rem" }}
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                    <button type="submit" style={{ background: "#4f46e5", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.25rem" }}>Update</button>
                    <button type="button" onClick={() => setEditTask(null)} style={{ background: "#555", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.25rem" }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* --- Styles --- */
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalBox = {
  background: "#1a1a1a",
  padding: "2rem",
  borderRadius: "0.5rem",
  width: "500px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const formStyle = { display: "flex", flexDirection: "column", gap: "0.5rem" };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Schedule />);
export default Schedule;