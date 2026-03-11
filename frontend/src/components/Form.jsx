import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/admin");
    } catch {
      setError("// login yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-card">

          <div className="login-logo">
            <div className="login-logo-icon">⚡</div>
            <div className="login-title">Admin Panel</div>
            <div className="login-sub">CYBERNEX</div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">USERNAME</label>
              <div className="login-input-wrap">
                <input
                  className="login-input"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">PASSWORD</label>
              <div className="login-input-wrap">
                <input
                  className="login-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? <><div className="login-spinner" /> Kirish...</> : "→ Kirish"}
            </button>
          </form>

          <div className="login-footer">admin access only</div>
        </div>
      </div>
    </>
  );
}