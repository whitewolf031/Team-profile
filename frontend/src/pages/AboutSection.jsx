import { useMemo, useState } from "react";

const STARS = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: ((i * 17) % 2) + 1,
  delay: `${(i * 0.3) % 3}s`,
  duration: `${2 + (i % 3)}s`,
}));

const VISIBLE = 4;

export default function AboutSection({ profile, navigate, t }) {
  const [page, setPage] = useState(0);

  const sorted = useMemo(
    () => [...(profile || [])].sort((a, b) => a.id - b.id),
    [profile]
  );
  const total = sorted.length;
  if (!profile || total === 0) return null;

  const totalPages = Math.ceil(total / VISIBLE);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <section
      id="about"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.13) 0%, transparent 55%)," +
          "radial-gradient(ellipse at 80% 15%, rgba(139,92,246,0.09) 0%, transparent 50%)," +
          "radial-gradient(ellipse at 60% 85%, rgba(16,185,129,0.07) 0%, transparent 45%)," +
          "#0a0e1a",
        padding: "80px 24px",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* Stars */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {STARS.map((s) => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              width: s.size + "px",
              height: s.size + "px",
              borderRadius: "50%",
              background: "rgba(148,163,184,0.7)",
              animation: `twinkle ${s.duration} ${s.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Nebula blobs */}
      {[
        { w: 500, h: 500, top: -150, left: -100, color: "rgba(59,130,246,0.07)", delay: "0s" },
        { w: 400, h: 400, top: "50%", right: -80, color: "rgba(139,92,246,0.06)", delay: "-3s" },
        { w: 350, h: 350, bottom: -100, left: "40%", color: "rgba(16,185,129,0.05)", delay: "-5s" },
      ].map((n, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: n.w,
            height: n.h,
            top: n.top,
            left: n.left,
            right: n.right,
            bottom: n.bottom,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${n.color} 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
            animation: `nebulaFloat 8s ${n.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: 48,
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "#e2e8f0",
          }}
        >
          {t("about_title")}
        </h2>

        {/* Carousel */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Prev button */}
          <button
            onClick={prev}
            disabled={!canPrev}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)",
              color: "#60a5fa",
              fontSize: "1.8rem",
              cursor: canPrev ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s",
              opacity: canPrev ? 1 : 0,
              pointerEvents: canPrev ? "auto" : "none",
              lineHeight: 1,
              paddingBottom: 2,
            }}
          >
            ‹
          </button>

          {/* Sliding track wrapper */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${total}, calc(25% - 15px))`,
                gap: 20,
                transform: `translateX(calc(-${page} * (100% / ${totalPages}) - ${page} * ${20 / totalPages}px))`,
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "transform",
              }}
            >
              {sorted.map((person) => (
                <Card key={person.id} person={person} navigate={navigate} t={t} />
              ))}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            disabled={!canNext}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)",
              color: "#60a5fa",
              fontSize: "1.8rem",
              cursor: canNext ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s",
              opacity: canNext ? 1 : 0,
              pointerEvents: canNext ? "auto" : "none",
              lineHeight: 1,
              paddingBottom: 2,
            }}
          >
            ›
          </button>
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  width: page === i ? 24 : 8,
                  height: 8,
                  borderRadius: page === i ? 4 : "50%",
                  background: page === i ? "#38bdf8" : "rgba(255,255,255,0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes nebulaFloat {
          0%, 100% { transform: translateY(0px)   scale(1); }
          33%       { transform: translateY(-20px) scale(1.05); }
          66%       { transform: translateY(10px)  scale(0.97); }
        }
      `}</style>
    </section>
  );
}

function Card({ person, navigate, t }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/profile/${person.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(15,20,40,0.85)",
        border: `1px solid ${hovered ? "rgba(56,189,248,0.5)" : "rgba(59,130,246,0.2)"}`,
        borderRadius: 16,
        padding: "28px 20px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        textAlign: "center",
        cursor: "pointer",
        backdropFilter: "blur(6px)",
        boxShadow: hovered
          ? "0 16px 40px rgba(56,189,248,0.18)"
          : "0 4px 24px rgba(59,130,246,0.08)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        transition: "transform 0.35s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.35s ease, border-color 0.35s ease",
        minHeight: 320,
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "100%",
          height: 200,
          borderRadius: 10,
          overflow: "hidden",
          border: "2px solid #3b82f6",
          boxShadow: "0 0 20px rgba(59,130,246,0.2)",
          flexShrink: 0,
        }}
      >
        {person.avatar ? (
          <img
            src={person.avatar}
            alt={person.full_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #2563eb, #16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3.5rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {person.full_name?.charAt(0)?.toUpperCase()}
          </div>
        )}
      </div>

      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#60a5fa", margin: 0 }}>
        {person.full_name}
      </h3>

      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.78rem",
          color: "#38bdf8",
          background: "rgba(56,189,248,0.08)",
          border: "1px solid rgba(56,189,248,0.2)",
          borderRadius: 999,
          padding: "3px 14px",
        }}
      >
        {person.stack}
      </span>

      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/profile/${person.id}`); }}
        style={{
          background: "none",
          border: "none",
          color: "#60a5fa",
          fontWeight: 500,
          fontSize: "0.88rem",
          cursor: "pointer",
          padding: 0,
          fontFamily: "Tahoma, sans-serif",
          transition: "color 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#93c5fd";
          e.currentTarget.style.transform = "translateX(4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#60a5fa";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        {t("about_more")} →
      </button>
    </div>
  );
}