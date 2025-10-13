// src/components/Task.jsx
import React from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, User, Calendar as CalendarIcon } from "lucide-react";

export default function Task({ task, priorityColors, deleteTask, openSubtaskModal, editing, setEditing, styles }) {

  // Subtask component inside Task file
  const Subtask = ({ subtask }) => (
    <div key={subtask.id} style={styles.itemBase}>
      <div style={styles.itemHeader}>
        <div style={styles.mainInfo}>
          {editing[subtask.id] ? (
            <input
              type="text"
              value={subtask.name}
              autoFocus
              onChange={(e) => subtask.setName(e.target.value)}
              onBlur={() => setEditing(prev => ({ ...prev, [subtask.id]: false }))}
              onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") e.target.blur(); }}
              style={{ ...styles.editableInput, fontSize: '13px' }}
            />
          ) : (
            <div
              style={{ ...styles.nameBase, fontSize: '13px' }}
              onDoubleClick={() => setEditing(prev => ({ ...prev, [subtask.id]: true }))}
            >
              {subtask.name || "Untitled Subtask"}
            </div>
          )}

          <div style={{ ...styles.metaBase, fontSize: 11 }}>
            <div style={styles.metaItem}>
              <User size={11} /> {subtask.assignee || "Unassigned"}
            </div>
            <div style={styles.metaItem}>
              <CalendarIcon size={11} /> {subtask.due || "No Due Date"}
            </div>
            <div style={{ ...styles.priorityBadge, background: priorityColors[subtask.priority] }}>
              {subtask.priority}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={() => deleteTask(subtask.id, 'subtask')} style={styles.deleteBtn}>
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

  return (
    <div key={task.id} style={styles.itemBase}>
      <div style={styles.itemHeader}>
        <div style={styles.mainInfo}>
          <button onClick={() => task.toggleExpand(task.id)} style={styles.expandBtn}>
            {task.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {editing[task.id] ? (
            <input
              type="text"
              value={task.name}
              autoFocus
              onChange={(e) => task.setName(e.target.value)}
              onBlur={() => setEditing(prev => ({ ...prev, [task.id]: false }))}
              onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") e.target.blur(); }}
              style={{ ...styles.editableInput, fontSize: '14px' }}
            />
          ) : (
            <div
              style={{ ...styles.nameBase, fontSize: '14px' }}
              onDoubleClick={() => setEditing(prev => ({ ...prev, [task.id]: true }))}
            >
              {task.name || "Untitled Task"}
            </div>
          )}

          <div style={{ ...styles.metaBase, fontSize: 12 }}>
            <div style={styles.metaItem}>
              <User size={12} /> {task.assignee || "Unassigned"}
            </div>
            <div style={styles.metaItem}>
              <CalendarIcon size={12} /> {task.due || "No Due Date"}
            </div>
            <div style={{ ...styles.priorityBadge, background: priorityColors[task.priority] }}>
              {task.priority}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={() => openSubtaskModal(task.id)} style={{ ...styles.addTaskBtn, padding: '4px 8px', fontSize: 11 }}>
            <Plus size={12} /> Add Subtask
          </button>
          <button onClick={() => deleteTask(task.id, 'task')} style={styles.deleteBtn}>
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
            task.subtasks.map(st => <Subtask key={st.id} subtask={st} />)
          ) : (
            <div style={styles.emptyState}>No subtasks yet. Add one!</div>
          )}
        </div>
      )}
    </div>
  );
}
