import { useState } from "react";
import DevInfoAdmin from "./DevInfoAdmin";
import ExperienceAdmin from "./ExperienceAdmin";
import ProjectAdmin from "./ProjectsAdmin";
import Logout from "../Logout";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminControl.css";

const Icon = ({ name }) => {
  const icons = {
    user:      "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z",
    briefcase: "M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-8-2h4v2h-4V5zm8 14H4V9h16v10z",
    code:      "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    logout:    "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  };
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d={icons[name]} />
    </svg>
  );
};

const NAV_ITEMS = [
  { key: "information", label: "Information", icon: "user" },
  { key: "experience",  label: "Experience",  icon: "briefcase" },
  { key: "projects",    label: "Projects",    icon: "code" },
];

export default function AdminControl() {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => Logout(navigate);

  return (
    <div className="ac-layout">

      {/* NAVBAR */}
      <nav className="ac-nav">
        <span className="ac-nav-brand">CYBERNEX — ADMIN</span>
        <div className="ac-nav-right">
          <span className="ac-badge">CYBERNEX</span>
          <button className="ac-logout" onClick={handleLogout}>
            <Icon name="logout" /> Chiqish
          </button>
        </div>
      </nav>

      <div className="ac-body">

        {/* SIDEBAR */}
        <aside className="ac-side">
          <div className="ac-side-label">BO'LIMLAR</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`ac-side-btn ${active === item.key ? "active" : ""}`}
              onClick={() => setActive(item.key)}
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="ac-main">
          {!active && (
            <div className="ac-welcome">
              <div className="ac-welcome-icon">⚡</div>
              <h2>Admin paneliga xush kelibsiz</h2>
              <p>// chap tarafdagi menyudan bo'limni tanlang</p>
              <div className="ac-welcome-btns">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    className="ac-welcome-btn"
                    onClick={() => setActive(item.key)}
                  >
                    <Icon name={item.icon} /> {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {active === "information" && <DevInfoAdmin />}
          {active === "experience"  && <ExperienceAdmin />}
          {active === "projects"    && <ProjectAdmin />}
        </main>
      </div>
    </div>
  );
}