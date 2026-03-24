import { useMemo, useState } from "react";
import "../styles/AboutSection.css";

const VISIBLE = 4;

export default function AboutSection({ profile, navigate, t }) {
  const [page, setPage] = useState(0);

  const sorted = useMemo(
    () => [...(profile || [])].sort((a, b) => a.id - b.id),
    [profile]
  );

  const total = sorted.length;
  if (total === 0) return null;

  const totalPages = Math.ceil(total / VISIBLE);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <section
      id="about"
      className="about-section-bg"
      style={{ padding: "80px 24px", minHeight: "100vh" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 className="about-title">{t("about_title")}</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Prev */}
          <button
            onClick={prev}
            disabled={!canPrev}
            className="about-nav-btn"
            style={{ opacity: canPrev ? 1 : 0.3 }}
          >
            ‹
          </button>

          {/* Carousel Container */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              borderRadius: "24px",
              padding: "10px",
              background: "transparent",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "24px",
                transform: `translateX(-${page * 100}%)`,
                transition: "transform 0.8s cubic-bezier(0.32, 0.72, 0, 1)",
                willChange: "transform",
              }}
            >
              {sorted.map((person) => (
                <div
                  key={person.id}
                  style={{
                    minWidth: `calc(${100 / VISIBLE}% - ${24 * (VISIBLE - 1) / VISIBLE}px)`,
                    flexShrink: 0,
                  }}
                >
                  <Card person={person} navigate={navigate} t={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={next}
            disabled={!canNext}
            className="about-nav-btn"
            style={{ opacity: canNext ? 1 : 0.3 }}
          >
            ›
          </button>
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="about-dots" style={{ marginTop: "36px" }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`about-dot ${page === i ? "about-dot-active" : ""}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ==================== CARD KOMPONENTI ====================
function Card({ person, navigate, t }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/profile/${person.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="about-card"
    >
      {/* Avatar */}
      <div className="about-avatar-wrapper">
        {person.avatar ? (
          <img
            src={person.avatar}
            alt={person.full_name}
            className="about-avatar"
          />
        ) : (
          <div className="about-avatar-placeholder">
            {person.full_name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* Ism */}
      <h3 className="about-card-name">{person.full_name}</h3>

      {/* Stack / Lavozim */}
      <p className="about-card-description">
        {person.stack}
      </p>

      {/* Batafsil tugmasi */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${person.id}`);
        }}
        className="about-more-btn"
      >
        {t("about_more")}
      </button>
    </div>
  );
}