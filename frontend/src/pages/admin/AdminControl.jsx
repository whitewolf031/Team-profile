// src/components/admin/AdminControl.jsx
import React from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import DevInfoAdmin from "./DevInfoAdmin";
import ExperienceAdmin from "./ExperienceAdmin";
import ProjectAdmin from "./ProjectsAdmin";
import "../../styles/AdminControl.css";
import Logout from "../Logout"

function AdminControl() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Logout(navigate);
  };

  const isActive = (path) => location.pathname === `/admin/${path}`;

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="admin-navbar-inner">
          <h1 className="admin-title">Sardorbek Ergashev</h1>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <ul>
            <li>
              <Link
                to="/admin/information"
                className={`admin-link ${isActive("information") ? "active" : ""}`}
              >
                Information
              </Link>
            </li>
            <li>
              <Link
                to="/admin/experience"
                className={`admin-link ${isActive("experience") ? "active" : ""}`}
              >
                Experience
              </Link>
            </li>
            <li>
              <Link
                to="/admin/projects"
                className={`admin-link ${isActive("projects") ? "active" : ""}`}
              >
                Projects
              </Link>
            </li>
          </ul>
        </aside>

        <main className="admin-content">
          <Routes>
            <Route index element={
              <div className="admin-welcome">
                <h2>Admin paneliga xush kelibsiz</h2>
                <p>Chap tarafdagi menyudan bo'limni tanlang</p>
              </div>
            }/>
            <Route path="information" element={<DevInfoAdmin />} />
            <Route path="experience" element={<ExperienceAdmin />} />
            <Route path="projects" element={<ProjectAdmin />} />
            <Route path="*" element={<h2>404 - Sahifa topilmadi</h2>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminControl;