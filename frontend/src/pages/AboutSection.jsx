import { useMemo } from "react";
import "../styles/AboutSection.css";

const STARS = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left:     `${(i * 37 + 11) % 100}%`,
  top:      `${(i * 53 + 7)  % 100}%`,
  size:     ((i * 17) % 2) + 1,
  delay:    `${(i * 0.3) % 3}s`,
  duration: `${2 + (i % 3)}s`,
}));

export default function AboutSection({ profile, navigate, t }) {
  const sorted = useMemo(
    () => [...(profile || [])].sort((a, b) => a.id - b.id),
    [profile]
  );
  const total = sorted.length;

  if (!profile || total === 0) return null;

  return (
    <section id="about" className="section section-dark about-section-bg">

      {/* ── Yulduzlar ── */}
      <div className="about-stars" aria-hidden="true">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="about-star"
            style={{
              left:              s.left,
              top:               s.top,
              width:             s.size + "px",
              height:            s.size + "px",
              animationDelay:    s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>

      {/* ── Nebula ── */}
      <div className="about-nebula about-nebula-1" aria-hidden="true" />
      <div className="about-nebula about-nebula-2" aria-hidden="true" />
      <div className="about-nebula about-nebula-3" aria-hidden="true" />

      <div className="section-container about-content">
        <h2 className="about-title">{t("about_title")}</h2>

        {/* ✅ Qatorga tizilgan — scroll yo'q, wrap bo'ladi */}
        <div className="about-row">
          {sorted.map((person) => (
            <div
              key={person.id}
              className="about-card"
              onClick={() => navigate(`/profile/${person.id}`)}
            >
              {/* Avatar */}
              <div className="about-avatar-wrapper">
                {person.avatar
                  ? <img src={person.avatar} alt={person.full_name} className="about-avatar" />
                  : <div className="about-avatar-placeholder">
                      {person.full_name?.charAt(0)?.toUpperCase()}
                    </div>
                }
              </div>

              {/* Ism */}
              <h3 className="about-card-name">{person.full_name}</h3>

              {/* Stack */}
              <span className="about-card-stack">{person.stack}</span>

              {/* Batafsil tugma */}
              <button
                className="about-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${person.id}`);
                }}
              >
                {t("about_more")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}