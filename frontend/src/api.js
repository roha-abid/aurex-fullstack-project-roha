const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getToken = () => localStorage.getItem("token");

// One place for every request: adds the JWT, reads errors, reports expired logins.
export async function api(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // A 401 while holding a token means it expired or is invalid: log the user out.
    if (res.status === 401 && getToken()) window.dispatchEvent(new Event("unauthorized"));
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}
