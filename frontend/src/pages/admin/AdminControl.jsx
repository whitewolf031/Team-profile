import { useState } from "react";
import DevInfoAdmin from "./DevInfoAdmin";
import ExperienceAdmin from "./ExperienceAdmin";
import ProjectAdmin from "./ProjectsAdmin";
import CertificateAdmin from "./CertificateAdmin";
import AdminContact from "./AdminContact";
import AdminBlogNews from "./AdminBlogNews";
import Logout from "../Logout";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminControl.css";

const Icon = ({ name }) => {
  const icons = {
    user:      "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z",
    briefcase: "M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-8-2h4v2h-4V5zm8 14H4V9h16v10z",
    code:      "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    cert:      "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z",
    contact:   "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    blog:      "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z", // ← BLOG ICON
    logout:    "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    menu:      "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
  };
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d={icons[name]} />
    </svg>
  );
};

const NAV_ITEMS = [
  { key: "information",  label: "Information",  icon: "user"      },
  { key: "experience",   label: "Experience",   icon: "briefcase" },
  { key: "projects",     label: "Projects",     icon: "code"      },
  { key: "certificates", label: "Certificates", icon: "cert"      },
  { key: "blog",         label: "Blog & News",  icon: "blog"      }, // ← YANGI
  { key: "contacts",     label: "Contacts",     icon: "contact"   },
];

export default function AdminControl() {
  const [active, setActive] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const navigate = useNavigate();

  const selectSection = (key) => {
    setActive(key);
    setSideOpen(false);
  };

  return (
    <div className="ac-layout">
      {/* ... (Navbar kodi o'zgarishsiz qoladi) ... */}
      <nav className="ac-nav">
        <span className="ac-nav-brand">CYBERNEX — ADMIN</span>
        <div className="ac-nav-right">
          <span className="ac-badge">CYBERNEX</span>
          <button className="ac-logout" onClick={() => Logout(navigate)}>
            <Icon name="logout" /> <span>Chiqish</span>
          </button>
          <button className="ac-hamburger" onClick={() => setSideOpen((s) => !s)}>
            <Icon name="menu" />
          </button>
        </div>
      </nav>

      <div className="ac-body">
        <div className={`ac-overlay ${sideOpen ? "visible" : ""}`} onClick={() => setSideOpen(false)} />

        <aside className={`ac-side ${sideOpen ? "open" : ""}`}>
          <div className="ac-side-label">BO'LIMLAR</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`ac-side-btn ${active === item.key ? "active" : ""}`}
              onClick={() => selectSection(item.key)}
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
                  <button key={item.key} className="ac-welcome-btn" onClick={() => selectSection(item.key)}>
                    <Icon name={item.icon} /> {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {active === "information"  && <DevInfoAdmin />}
          {active === "experience"   && <ExperienceAdmin />}
          {active === "projects"     && <ProjectAdmin />}
          {active === "certificates" && <CertificateAdmin />}
          {active === "blog"         && <AdminBlogNews />} {/* ← YANGI */}
          {active === "contacts"     && <AdminContact />}
        </main>
      </div>
    </div>
  );
}