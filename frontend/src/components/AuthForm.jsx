import { useState } from "react";
import { useAuth } from "../AuthContext";
import "./AuthForm.css";

function Form({ mode, active }) {
  const isRegister = mode === "register";
  const { authenticate } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (isRegister && !form.name.trim()) return "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);
    setBusy(true);
    setError("");
    try {
      const payload = isRegister ? form : { email: form.email, password: form.password };
      await authenticate(mode, payload); // on success the router redirects to the dashboard
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form
      className={`form-box ${mode}`}
      onSubmit={submit}
      noValidate
      inert={active ? undefined : ""}
      aria-hidden={!active}
    >
      <h1>{isRegister ? "Create your account" : "Log in"}</h1>
      {isRegister && (
        <label>Name
          <input name="name" value={form.name} onChange={change} autoComplete="name" />
        </label>
      )}
      <label>Email
        <input name="email" type="email" value={form.email} onChange={change} autoComplete="email" />
      </label>
      <label>Password
        <input name="password" type="password" value={form.password} onChange={change}
          autoComplete={isRegister ? "new-password" : "current-password"} />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn" disabled={busy}>
        {busy ? "Please wait…" : isRegister ? "Create account" : "Log in"}
      </button>
    </form>
  );
}

export default function AuthForm({ mode }) {
  const [isRegister, setIsRegister] = useState(mode === "register");

  return (
    <div className={`auth-card ${isRegister ? "show-register" : ""}`}>
      <Form mode="login" active={!isRegister} />
      <Form mode="register" active={isRegister} />

      <div className="overlay">
        <div className="overlay-inner">
          <div className="panel-side">
            <h2>Already registered?</h2>
            <p>Log in to pick up your tasks where you left off.</p>
            <button type="button" className="btn ghost-light" onClick={() => setIsRegister(false)}>
              Log in
            </button>
          </div>
          <div className="panel-side">
            <h2>New here?</h2>
            <p>Create an account to keep your own private task list.</p>
            <button type="button" className="btn ghost-light" onClick={() => setIsRegister(true)}>
              Create account
            </button>
          </div>
        </div>
      </div>

      <p className="mobile-switch">
        {isRegister ? "Already have an account? " : "New here? "}
        <button type="button" className="link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Log in" : "Create an account"}
        </button>
      </p>
    </div>
  );
}
