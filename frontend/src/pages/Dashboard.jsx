import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

const FILTERS = [
  ["", "All"],
  ["pending", "Pending"],
  ["in-progress", "In progress"],
  ["completed", "Completed"],
];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setTasks(await api(`/tasks${filter ? `?status=${filter}` : ""}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const addTask = async (data) => {
    const task = await api("/tasks", { method: "POST", body: data });
    if (!filter || filter === task.status) setTasks((prev) => [task, ...prev]);
  };

  const updateTask = async (id, changes) => {
    const task = await api(`/tasks/${id}`, { method: "PUT", body: changes });
    setTasks((prev) =>
      filter && task.status !== filter
        ? prev.filter((t) => t._id !== id) // no longer matches the active filter
        : prev.map((t) => (t._id === id ? task : t)),
    );
  };

  const deleteTask = async (id) => {
    await api(`/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="dashboard">
      <h1>Your tasks</h1>
      <TaskForm onAdd={addTask} />

      <div className="filters" role="group" aria-label="Filter tasks">
        {FILTERS.map(([value, label]) => (
          <button key={label} className={`chip ${filter === value ? "on" : ""}`} onClick={() => setFilter(value)}>
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="status">Loading tasks…</p>}
      {error && (
        <p className="error" role="alert">
          {error} <button className="link" onClick={load}>Try again</button>
        </p>
      )}
      {!loading && !error && tasks.length === 0 && (
        <p className="status">
          {filter ? "No tasks with this status." : "No tasks yet. Add your first task above."}
        </p>
      )}
      <ul className="tasklist">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
        ))}
      </ul>
    </div>
  );
}
