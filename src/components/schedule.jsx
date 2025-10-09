import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function Schedule() {
  const [events, setEvents] = useState([
    { id: 1, title: "Fix bug in login page", status: "To Do", assigned: "HR", start: "2025-10-05", due: "2025-10-10", description: "", subtasks: [], links: [], files: [], updates: [] },
    { id: 2, title: "Write documentation", status: "In Progress", assigned: "HR", start: "2025-10-06", due: "2025-10-12", description: "", subtasks: [], links: [], files: [], updates: [] },
    { id: 3, title: "Deploy to production", status: "Done", assigned: "HR", start: "2025-10-01", due: "2025-10-07", description: "", subtasks: [], links: [], files: [], updates: [] },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    assigned: "HR",
    start: "",
    due: "",
    status: "To Do",
    priority: "Medium",
    description: "",
    links: [],
    files: [],
    updates: [],
  });

  const [newSubtask, setNewSubtask] = useState({ title: "", status: "To Do" });

  // === Utility Classes ===
  const getStatusClasses = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800 border border-indigo-300";
      case "Done":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "High":
        return "bg-red-100 text-red-800 border border-red-300";
      case "Low":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // === Input Handlers ===
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "links") {
      setNewTask((prev) => ({ ...prev, links: value.split("\n") }));
    } else if (name === "files") {
      setNewTask((prev) => ({
        ...prev,
        files: files.length ? [...prev.files, ...Array.from(files)] : prev.files,
      }));
    } else {
      setNewTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubtaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubtask((prev) => ({ ...prev, [name]: value }));
  };

  // === Add Task ===
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assigned || !newTask.start || !newTask.due) {
      alert("Please fill all required fields");
      return;
    }

    const task = {
      ...newTask,
      id: events.length + 1,
      subtasks: [],
      updates: [`Task created by ${newTask.assigned} on ${new Date().toLocaleDateString()}`],
    };

    setEvents([...events, task]);
    setShowForm(false);
    setNewTask({
      title: "",
      assigned: "HR",
      start: "",
      due: "",
      status: "To Do",
      priority: "Medium",
      description: "",
      links: [],
      files: [],
      updates: [],
    });
  };

  // === Add Subtask ===
  const handleAddSubtask = (taskId) => {
    if (!newSubtask.title) {
      alert("Please enter subtask title");
      return;
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === taskId
          ? {
              ...event,
              subtasks: [
                ...event.subtasks,
                { ...newSubtask, id: event.subtasks.length + 1, updates: [`Subtask created on ${new Date().toLocaleDateString()}`] },
              ],
            }
          : event
      )
    );
    setNewSubtask({ title: "", status: "To Do" });
    setShowSubtaskForm(null);
  };

  // === Update Description / Assign ===
  const handleAssignTask = (taskId, newAssignee) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === taskId
          ? {
              ...event,
              assigned: newAssignee,
              updates: [...event.updates, `Task assigned to ${newAssignee} on ${new Date().toLocaleDateString()}`],
            }
          : event
      )
    );
    setSelectedTask(null);
  };

  const handleUpdateDescription = (taskId, newDescription) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === taskId
          ? { ...event, description: newDescription, updates: [...event.updates, `Description updated on ${new Date().toLocaleDateString()}`] }
          : event
      )
    );
  };

  return (
    <div style={{ background: "#1a1a1a", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
      <style>
        {`
          .task-card { background: #2d2d2d; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; }
          .task-header { display: flex; justify-content: space-between; }
          .task-title { font-size: 1.125rem; font-weight: 600; }
          .task-status { margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }
          .status-badge, .priority-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; }
          .assigned-to, .due-date { font-size: 0.875rem; }
          .add-task-btn { padding: 1rem; border: 2px dashed #555; border-radius: 0.5rem; background: #333; color: #ccc; cursor: pointer; width: 100%; }
          .add-task-btn:hover { background: #444; border-color: #777; }
          .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
          .modal-content { background: #2d2d2d; padding: 2rem; border-radius: 0.5rem; width: 400px; color: #fff; }
          .subtask-card { background: #3d3d3d; padding: 0.5rem; border-radius: 0.25rem; margin-top: 0.5rem; }
        `}
      </style>

      <h1 style={{ textAlign: "center", fontSize: "1.875rem", fontWeight: 700, marginBottom: "2rem" }}>
        📅 Course Management System Sprint Dashboard
      </h1>

      {/* === Task Grid === */}
      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {events.map((event) => (
          <div key={event.id} className="task-card" onClick={() => setSelectedTask(event.id)}>
            <div className="task-header">
              <h2 className="task-title">{event.title}</h2>
              <button style={{ color: "#4f46e5", cursor: "pointer" }}>✏️ Edit</button>
            </div>

            <div className="task-status">
              <span className={`status-badge ${getStatusClasses(event.status)}`}>{event.status}</span>
              <span className={`priority-badge ${getPriorityClasses(event.priority)}`}>{event.priority}</span>
              <span className="due-date">Due: {event.due}</span>
            </div>

            <p className="assigned-to">👤 Assigned by: {event.assigned}</p>
            <p>🗓️ Start: {event.start}</p>

            {event.description && <p>Description: {event.description}</p>}

            {event.subtasks.length > 0 && (
              <div>
                <h3>Subtasks:</h3>
                {event.subtasks.map((s) => (
                  <div key={s.id} className="subtask-card">
                    {s.title} - {s.status}
                  </div>
                ))}
              </div>
            )}

            {event.links.length > 0 && (
              <div>
                <h3>Links:</h3>
                {event.links.map((l, i) => (
                  <a key={i} href={l} target="_blank" style={{ color: "#4f46e5", marginRight: "0.5rem" }}>
                    {l}
                  </a>
                ))}
              </div>
            )}

            {event.files.length > 0 && (
              <div>
                <h3>Files:</h3>
                {event.files.map((f, i) => (
                  <p key={i}>📎 {f.name}</p>
                ))}
              </div>
            )}

            {event.updates.length > 0 && (
              <div>
                <h3>Updates:</h3>
                {event.updates.map((u, i) => (
                  <p key={i}>{u}</p>
                ))}
              </div>
            )}
          </div>
        ))}

        <button className="add-task-btn" onClick={() => setShowForm(true)}>➕ Add Task</button>
      </div>

      {/* === Add Task Modal === */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Add New Task</h2>
            <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="text" name="title" value={newTask.title} onChange={handleInputChange} placeholder="Task Title" required />
              <select name="assigned" value={newTask.assigned} onChange={handleInputChange} required>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
                <option value="Employee1">Employee1</option>
                <option value="Employee2">Employee2</option>
              </select>
              <input type="date" name="start" value={newTask.start} onChange={handleInputChange} required />
              <input type="date" name="due" value={newTask.due} onChange={handleInputChange} required />
              <select name="status" value={newTask.status} onChange={handleInputChange}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <select name="priority" value={newTask.priority} onChange={handleInputChange}>
                <option>Medium</option>
                <option>High</option>
                <option>Low</option>
              </select>
              <textarea name="description" value={newTask.description} onChange={handleInputChange} placeholder="Description" />
              <textarea name="links" value={newTask.links.join("\n")} onChange={handleInputChange} placeholder="Enter links (one per line)" />
              <input type="file" name="files" onChange={handleInputChange} multiple />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" style={{ background: "#4f46e5", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>Add Task</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === Add Subtask Modal === */}
      {showSubtaskForm && (
        <div className="modal">
          <div className="modal-content">
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Add Subtask</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddSubtask(showSubtaskForm); }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="text" name="title" value={newSubtask.title} onChange={handleSubtaskInputChange} placeholder="Subtask Title" required />
              <select name="status" value={newSubtask.status} onChange={handleSubtaskInputChange}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" style={{ background: "#4f46e5", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>Add Subtask</button>
                <button type="button" onClick={() => setShowSubtaskForm(null)} style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === Task Details Modal === */}
      {selectedTask && (
        <div className="modal">
          <div className="modal-content" style={{ width: "500px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Task Details</h2>
            {events.find((e) => e.id === selectedTask) && (
              <>
                {(() => {
                  const task = events.find((e) => e.id === selectedTask);
                  return (
                    <>
                      <p><strong>Title:</strong> {task.title}</p>
                      <p><strong>Assigned by:</strong> {task.assigned}</p>
                      <p><strong>Status:</strong> {task.status}</p>
                      <p><strong>Priority:</strong> {task.priority}</p>
                      <p><strong>Start:</strong> {task.start}</p>
                      <p><strong>Due:</strong> {task.due}</p>

                      <textarea
                        value={task.description}
                        onChange={(e) => handleUpdateDescription(task.id, e.target.value)}
                        placeholder="Update description"
                        style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem", borderRadius: "0.25rem" }}
                      />

                      <select
                        value={task.assigned}
                        onChange={(e) => handleAssignTask(task.id, e.target.value)}
                        style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem", borderRadius: "0.25rem" }}
                      >
                        <option value="HR">HR</option>
                        <option value="Admin">Admin</option>
                        <option value="Employee1">Employee1</option>
                        <option value="Employee2">Employee2</option>
                      </select>

                      <button
                        onClick={() => setShowSubtaskForm(task.id)}
                        style={{ background: "#4f46e5", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.5rem", marginTop: "0.5rem" }}
                      >
                        Add Subtask
                      </button>

                      <div style={{ marginTop: "1rem" }}>
                        <h3>Subtasks:</h3>
                        {task.subtasks.map((s) => (
                          <div key={s.id} className="subtask-card">
                            {s.title} - {s.status}
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: "1rem" }}>
                        <h3>Updates:</h3>
                        {task.updates.map((u, i) => (
                          <p key={i}>{u}</p>
                        ))}
                      </div>
                    </>
                  );
                })()}
                <button onClick={() => setSelectedTask(null)} style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", marginTop: "1rem" }}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Schedule />);
export default Schedule;
