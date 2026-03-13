import { useState } from "react";
import DevInfoAdmin from "./DevInfoAdmin";
import ExperienceAdmin from "./ExperienceAdmin";
import ProjectAdmin from "./ProjectsAdmin";
import CertificateAdmin from "./CertificateAdmin";
import Logout from "../Logout";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminControl.css";

const Icon = ({ name }) => {
  const icons = {
    user:      "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z",
    briefcase: "M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-8-2h4v2h-4V5zm8 14H4V9h16v10z",
    code:      "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    cert:      "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z",
    logout:    "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  };
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d={icons[name]} />
    </svg>
  );
};

const NAV_ITEMS = [
  { key: "information", label: "Information",  icon: "user" },
  { key: "experience",  label: "Experience",   icon: "briefcase" },
  { key: "projects",    label: "Projects",     icon: "code" },
  { key: "certificates",label: "Certificates", icon: "cert" },  // ✅ yangi
];

export default function AdminControl() {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="ac-layout">
      <nav className="ac-nav">
        <span className="ac-nav-brand">CYBERNEX — ADMIN</span>
        <div className="ac-nav-right">
          <span className="ac-badge">CYBERNEX</span>
          <button className="ac-logout" onClick={() => Logout(navigate)}>
            <Icon name="logout" /> Chiqish
          </button>
        </div>
      </nav>

      <div className="ac-body">
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

        <main className="ac-main">
          {!active && (
            <div className="ac-welcome">
              <div className="ac-welcome-icon">⚡</div>
              <h2>Admin paneliga xush kelibsiz</h2>
              <p>// chap tarafdagi menyudan bo'limni tanlang</p>
              <div className="ac-welcome-btns">
                {NAV_ITEMS.map((item) => (
                  <button key={item.key} className="ac-welcome-btn" onClick={() => setActive(item.key)}>
                    <Icon name={item.icon} /> {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {active === "information"  && <DevInfoAdmin />}
          {active === "experience"   && <ExperienceAdmin />}
          {active === "projects"     && <ProjectAdmin />}
          {active === "certificates" && <CertificateAdmin />}  {/* ✅ */}
        </main>
      </div>
    </div>
  );
}