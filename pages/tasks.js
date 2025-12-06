// TasksPage - Full task management with create, edit, delete, and subtasks
import React, { useState, useEffect } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for adding new tasks
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ subject: "", description: "" });
  // Filter state
  const [filter, setFilter] = useState("All");

  // Load tasks from the API on mount
  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Could not load tasks");
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  async function createTask(task) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const created = await res.json();
      setTasks(prev => [created, ...prev]);
    } catch (e) {
      setError(e.message || "Failed to create task");
    }
  }

  async function persistTask(task) {
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
    } catch (e) {
      setError("Failed to save changes");
    }
  }

  async function deleteTask(id) {
    try {
      await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    } catch (e) {
      setError("Failed to delete task");
    }
  }

  // Toggle task completion
  function toggleDone(id) {
    setTasks(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, done: !t.done } : t));
      const updated = next.find(t => t.id === id);
      if (updated) persistTask(updated);
      return next;
    });
  }

  // Add a new task
  function addTask(e) {
    e.preventDefault();
    const subject = newSubject.trim();
    if (!subject) return; // Don't add empty tasks
    const next = {
      id: Date.now(),
      subject,
      description: newDescription.trim(),
      done: false,
      priority: newPriority,
      dueDate: newDueDate || null,
      subtasks: [],
    };
    createTask(next);
    // Reset form
    setNewSubject("");
    setNewDescription("");
    setNewPriority("Medium");
    setNewDueDate("");
  }

  // Remove a task
  function removeTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
    deleteTask(id);
  }

  // Start editing a task
  function startEdit(task) {
    setEditingId(task.id);
    setEditValues({ subject: task.subject, description: task.description || "" });
  }

  // Save edited task
  function saveEdit(id) {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, subject: editValues.subject.trim() || t.subject, description: editValues.description };
      persistTask(updated);
      return updated;
    }));
    setEditingId(null);
    setEditValues({ subject: "", description: "" });
  }

  // Update task properties (priority, due date, etc.)
  function updateTask(id, patch) {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, ...patch };
      persistTask(updated);
      return updated;
    }));
  }

  // Subtasks functions
  function addSubtask(taskId, text) {
    if (!text) return;
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const nextSub = { id: Date.now(), text, done: false };
      const updated = { ...t, subtasks: [...(t.subtasks || []), nextSub] };
      persistTask(updated);
      return updated;
    }));
  }

  // Toggle subtask completion
  function toggleSubtask(taskId, subId) {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const updated = { ...t, subtasks: t.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s) };
      persistTask(updated);
      return updated;
    }));
  }

  // Get today's date for filtering
  const todayISO = new Date().toISOString().slice(0,10);
  
  // Filter tasks based on selected filter
  function matchesFilter(t) {
    if (filter === 'All') return true;
    if (filter === 'Today') return t.dueDate === todayISO;
    return (t.priority || 'Medium') === filter;
  }
// Render & JSX
  return (
    <>
    <div className="page tasks-page">
      <div className="hero-section tasks-hero">
        <div className="tasks-icon profile-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6h8M8 12h8M8 18h8" />
          </svg>
        </div>
        <h1 className="app-title tasks-title">Tasks</h1>
        <p className="tagline tasks-subtitle">Keep focused — same aesthetic across the app.</p>
      </div>

      <section className="recent-tasks">
        <h2 className="recent-tasks-title">My Tasks</h2>

        {/* Priority filter tabs */}
        <div className="tasks-filter">
          {['All','Today','High','Medium','Low'].map(p => (
            <button key={p} onClick={() => setFilter(p)} className={`control-button ${filter === p ? 'pause-play-button' : ''}`} aria-pressed={filter===p}>{p}</button>
          ))}
        </div>

        <form onSubmit={addTask} className="tasks-form" aria-label="Add task form">
          <input
            className="tasks-input"
            placeholder="Task"
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            aria-label="Task subject"
          />

          <input
            className="tasks-input description"
            placeholder="Short description (optional)"
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            aria-label="Task description"
          />

          <div className="tasks-form-row">
            <div className="tasks-form-field">
              <label className="tasks-field-label">Priority</label>
              <select className="tasks-priority-select" value={newPriority} onChange={e => setNewPriority(e.target.value)} aria-label="Priority">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="tasks-form-field">
              <label className="tasks-field-label">End Date</label>
              <input className="tasks-date-input" type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} aria-label="Due date" />
            </div>
            <div className="tasks-form-actions">
              <button type="submit" className="tasks-add-button" aria-label="Add task">Add</button>
            </div>
          </div>
        </form>

        <div className="tasks-list" aria-live="polite">
          {loading && <p className="tasks-empty-message">Loading tasks…</p>}
          {error && <p className="tasks-empty-message" style={{ color: '#b91c1c' }}>{error}</p>}
          {!loading && tasks.length === 0 && <p className="tasks-empty-message">No tasks yet — add one above.</p>}

          {tasks.filter(matchesFilter).map(task => (
            <div key={task.id} className="task-item">
              <div
                className={`checkbox ${task.done ? "checked" : ""}`}
                onClick={() => toggleDone(task.id)}
                role="button"
                aria-pressed={task.done}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleDone(task.id); }}
                title={task.done ? "Mark as undone" : "Mark as done"}
              >
                {task.done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                )}
              </div>

              <div className="task-content">
                {editingId === task.id ? (
                  <>
                    <input
                      className="task-edit-input-subject"
                      value={editValues.subject}
                      onChange={e => setEditValues(ev => ({ ...ev, subject: e.target.value }))}
                      aria-label="Edit task subject"
                    />
                    <input
                      className="task-edit-input-description"
                      value={editValues.description}
                      onChange={e => setEditValues(ev => ({ ...ev, description: e.target.value }))}
                      aria-label="Edit task description"
                    />
                    <div className="task-edit-row">
                      <select className="tasks-priority-select" value={task.priority || 'Medium'} onChange={e => updateTask(task.id, { priority: e.target.value })} aria-label="Priority">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                      <input className="tasks-date-input" type="date" value={task.dueDate || ''} onChange={e => updateTask(task.id, { dueDate: e.target.value || null })} aria-label="Due date" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="task-header">
                      <p className="task-subject">{task.subject}</p>
                      <div className="task-meta">
                        <span className="task-priority-badge">{task.priority || 'Medium'}</span>
                        <input className="task-due-input" type="date" value={task.dueDate || ''} onChange={e => updateTask(task.id, { dueDate: e.target.value || null })} aria-label="Due date" />
                      </div>
                    </div>

                    <p className={`task-description ${task.done ? "strikethrough" : ""}`}>{task.description || "No description"}</p>

                    <div className="subtasks">
                      {(task.subtasks || []).map(s => (
                        <div key={s.id} className="subtask-item">
                          <div
                            className={`checkbox ${s.done ? 'checked' : ''}`}
                            onClick={() => toggleSubtask(task.id, s.id)}
                            role="button"
                            tabIndex={0}
                          >
                            {s.done ? '✓' : ''}
                          </div>
                          <div className={`subtask-text ${s.done ? 'done' : ''}`}>{s.text}</div>
                        </div>
                      ))}

                      <SubtaskAdder onAdd={(text) => addSubtask(task.id, text)} />
                    </div>

                    <div className="task-actions">
                      {editingId === task.id ? (
                        <>
                          <button className="profile-save-btn" onClick={() => saveEdit(task.id)} aria-label="Save task">Save</button>
                          <button className="profile-cancel-btn" onClick={() => setEditingId(null)} aria-label="Cancel edit">Cancel</button>
                        </>
                      ) : (
                        <>
                          {/* Removed inline Edit button per request. Center the Delete button and reuse tasks-add-button styling for consistent look. */}
                          <button
                            className="profile-action-btn danger task-delete-button tasks-add-button"
                            title="Delete"
                            onClick={() => removeTask(task.id)}
                            aria-label={`Delete ${task.subject}`}
                            style={{ display: 'block', margin: '0.6rem auto' }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>

    {/* Floating Bubbles */}
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    </>
  );
}

// SubtaskAdder component - inline form to add subtasks
function SubtaskAdder({ onAdd }) {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text.trim());
        setText(''); // Clear input after adding
      }}
      className="subtask-form"
    >
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add subtask (press Enter to add)"
        className="subtask-input"
      />
      {/* Removed the visible Add button per request; users can press Enter to submit the subtask. */}
    </form>
  );
}