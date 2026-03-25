import { useMemo, useState, useRef, useEffect } from "react";
import "../styles/AboutSection.css";

export default function AboutSection({ profile, navigate, t }) {
  const [page, setPage] = useState(0);
  const trackRef = useRef(null);
  const touchStartX = useRef(null);

  // Screen kengligiga qarab nechta karta ko'rinishini aniqlash
  const [visible, setVisible] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setVisible(1);
      else if (w < 768) setVisible(1);
      else if (w < 1024) setVisible(2);
      else setVisible(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const sorted = useMemo(
    () => [...(profile || [])].sort((a, b) => a.id - b.id),
    [profile]
  );

  const total = sorted.length;
  if (total === 0) return null;

  const totalPages = Math.ceil(total / visible);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  // Touch / swipe support
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  // Karta kengligi: gap 24px (desktop), 12px (mobile)
  const gap = window.innerWidth < 768 ? 12 : 24;
  // translateX hisobi: har bir page = (karta kengligi + gap) * visible * page
  // Lekin biz % ishlatmaymiz — trackRef kengligi asosida hisoblash yaxshiroq
  // Oddiy yondashuv: har bir sahifa viewport kengligi asosida
  const cardWidthPercent = 100 / visible;
  const translateX = page * (cardWidthPercent * visible + (gap * (visible - 1) / (window.innerWidth / 100)));

  return (
    <section
      id="about"
      className="about-section-bg"
      style={{ padding: "80px 24px", minHeight: "100vh" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 className="about-title">{t("about_title")}</h2>

        <div className="about-carousel-outer">
          {/* Prev */}
          <button
            onClick={prev}
            disabled={!canPrev}
            className="about-nav-btn"
            aria-label="Previous"
          >
            ‹
          </button>

          {/* Carousel */}
          <div
            className="about-carousel-viewport"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              ref={trackRef}
              className="about-carousel-track"
              style={{
                transform: `translateX(calc(-${page * 100 / visible * visible}% - ${page * gap}px))`,
              }}
            >
              {sorted.map((person) => (
                <div
                  key={person.id}
                  style={{
                    width: `calc(${100 / visible}% - ${gap * (visible - 1) / visible}px)`,
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
            aria-label="Next"
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

function Card({ person, navigate, t }) {
  return (
    <div
      onClick={() => navigate(`/profile/${person.id}`)}
      className="about-card"
    >
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

      <h3 className="about-card-name">{person.full_name}</h3>
      <p className="about-card-description">{person.stack}</p>

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