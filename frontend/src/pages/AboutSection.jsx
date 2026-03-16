import { useState, useEffect, useCallback, useMemo } from "react";
import "../styles/AboutSection.css";

// Yulduzlarni bir marta generatsiya qilish (har render da o'zgarmaydi)
const STARS = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left:  `${(i * 37 + 11) % 100}%`,
  top:   `${(i * 53 + 7)  % 100}%`,
  size:  ((i * 17) % 2) + 1,
  delay: `${(i * 0.3) % 3}s`,
  duration: `${2 + (i % 3)}s`,
}));

export default function AboutSection({ profile, navigate }) {
  const sorted = useMemo(
    () => [...(profile || [])].sort((a, b) => a.id - b.id),
    [profile]
  );
  const total = sorted.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const next = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next, total]);

  if (!profile || total === 0) return null;

  const getSlotClass = (index) => {
    if (total === 1) return "about-card-main";
    const diff = (index - activeIndex + total) % total;
    if (diff === 0) return "about-card-main";
    if (diff === 1) return "about-card-left";
    if (diff === 2) return "about-card-right";
    return "about-card-hidden";
  };

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

      {/* ── Nebula bloblari ── */}
      <div className="about-nebula about-nebula-1" aria-hidden="true" />
      <div className="about-nebula about-nebula-2" aria-hidden="true" />
      <div className="about-nebula about-nebula-3" aria-hidden="true" />

      <div className="section-container about-content">
        <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "2.5rem" }}>
          About
        </h2>

        <div className={`about-stack ${total === 1 ? "single" : "multi"}`}>

          {/* Kartalar */}
          {sorted.map((person, index) => {
            const slotClass = getSlotClass(index);
            const isMain    = slotClass === "about-card-main";
            const isHidden  = slotClass === "about-card-hidden";

            if (isHidden) return null;

            return (
              <div
                key={person.id}
                className={`about-card ${slotClass}`}
                onClick={() => {
                  if (isMain) navigate(`/profile/${person.id}`);
                  else setActiveIndex(index);
                }}
              >
                <div className="about-avatar-wrapper">
                  {person.avatar
                    ? <img src={person.avatar} alt={person.full_name} className="about-avatar" />
                    : <div className="about-avatar-placeholder">{person.full_name?.charAt(0)}</div>
                  }
                </div>
                <h3 className="about-card-name">{person.full_name}</h3>
                {isMain && (
                  <button
                    className="about-more-btn"
                    onClick={(e) => { e.stopPropagation(); navigate(`/profile/${person.id}`); }}
                  >
                    ↗ More
                  </button>
                )}
              </div>
            );
          })}

          {/* Dots */}
          {total > 1 && (
            <div className="about-dots">
              {sorted.map((_, i) => (
                <button
                  key={i}
                  className={`about-dot ${i === activeIndex ? "active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}

          {/* Progress bar */}
          {total > 1 && (
            <div className="about-progress">
              <div key={activeIndex} className="about-progress-bar" />
            </div>
          )}

          {/* Prev / Next */}
          {total > 1 && (
            <>
              <button className="about-arrow about-arrow-left"  onClick={prev}>‹</button>
              <button className="about-arrow about-arrow-right" onClick={next}>›</button>
            </>
          )}

        </div>
      </div>
    </section>
  );
}