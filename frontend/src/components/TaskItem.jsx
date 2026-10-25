import { useState } from "react";

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Runs an action, shows any error on this task, and reports success
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (title.trim().length < 3) return setError("Title must be at least 3 characters.");
    if (await run(() => onUpdate(task._id, { title, description }))) setEditing(false);
  };

  return (
    <li className={`task ${task.status}`}>
      {editing ? (
        <div className="edit">
          <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} aria-label="Description" />
          <div className="row">
            <button className="btn" onClick={save} disabled={busy}>Save changes</button>
            <button className="btn ghost" onClick={() => { setEditing(false); setError(""); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="info">
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            <small>{task.priority} priority</small>
          </div>
          <div className="actions">
            <select value={task.status} disabled={busy} aria-label="Status"
              onChange={(e) => run(() => onUpdate(task._id, { status: e.target.value }))}>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn ghost" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn danger" disabled={busy} onClick={() => run(() => onDelete(task._id))}>Delete</button>
          </div>
        </>
      )}
      {error && <p className="error" role="alert">{error}</p>}
    </li>
  );
}
