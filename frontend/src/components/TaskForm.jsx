import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3) return setError("Title must be at least 3 characters.");
    setBusy(true);
    setError("");
    try {
      await onAdd({ title, description, priority });
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="panel taskform" onSubmit={submit} noValidate>
      <input placeholder="What needs doing?" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" />
      <input placeholder="Details (optional)" value={description} onChange={(e) => setDescription(e.target.value)} aria-label="Description" />
      <div className="row">
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <button className="btn" disabled={busy}>{busy ? "Adding…" : "Add task"}</button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}
