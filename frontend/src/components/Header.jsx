import { useAuth } from "../AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <strong className="brand">Task Manager</strong>
      {user && (
        <div className="who">
          <span>{user.name}</span>
          <button className="btn ghost" onClick={logout}>Log out</button>
        </div>
      )}
    </header>
  );
}
