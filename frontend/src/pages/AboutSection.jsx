// pages/AboutSection.jsx
// Bu komponent Home.jsx dagi "Jamoamiz" bo'limi
// id="about" — navbardan "Jamoamiz" bosganda shu yerga scroll qiladi

import { useEffect } from "react";
import { FaUser, FaArrowRight } from "react-icons/fa";
import { MdCode } from "react-icons/md";

function AboutSection({ profile, navigate, t, lang }) {

    useEffect(() => {
        if (document.getElementById("about-section-css")) return;
        const el = document.createElement("style");
        el.id = "about-section-css";
        el.textContent = STYLES;
        document.head.appendChild(el);
    }, []);

    const arr = Array.isArray(profile) ? profile : profile ? [profile] : [];

    const headingLabel = {
        uz: "Bizning jamoa",
        ru: "Наша команда",
        en: "Our Team",
    }[lang] || "Bizning jamoa";

    const tagLabel = {
        uz: "// jamoa a'zolari",
        ru: "// члены команды",
        en: "// team members",
    }[lang] || "// jamoa a'zolari";

    const subLabel = {
        uz: "Har bir loyihamizda professional dasturchilar jamoangizdek ishlaydi",
        ru: "Профессиональная команда разработчиков работает над каждым проектом",
        en: "A professional team of developers works on every project like your own",
    }[lang] || "";

    const viewLabel = {
        uz: "Batafsil ko'rish",
        ru: "Подробнее",
        en: "View Profile",
    }[lang] || "Ko'rish";

    const emptyLabel = {
        uz: "Jamoa a'zolari yuklanmoqda...",
        ru: "Загрузка команды...",
        en: "Loading team...",
    }[lang] || "";

    return (
        <section id="about" className="as-section">
            {/* background blobs */}
            <div className="as-bg" aria-hidden="true">
                <div className="as-blob as-blob-1" />
                <div className="as-blob as-blob-2" />
            </div>

            <div className="as-container">
                {/* Header */}
                <div className="as-header">
                    <p className="as-tag">{tagLabel}</p>
                    <h2 className="as-heading">{headingLabel}</h2>
                    <div className="as-heading-line" />
                    <p className="as-sub">{subLabel}</p>
                </div>

                {/* Cards */}
                {arr.length === 0 ? (
                    <div className="as-empty">
                        <div className="as-empty-icon"><FaUser /></div>
                        <p>{emptyLabel}</p>
                    </div>
                ) : (
                    <div className="as-grid">
                        {arr.map((person, idx) => (
                            <div
                                key={person.id ?? idx}
                                className="as-card"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                                onClick={() => navigate(`/profile/${person.id}`)}
                            >
                                {/* Top accent */}
                                <div className="as-card__accent" />

                                {/* Avatar */}
                                <div className="as-card__avatar-wrap">
                                    {person.avatar
                                        ? <img src={person.avatar} alt={person.full_name} className="as-card__avatar-img" />
                                        : <div className="as-card__avatar-ph">
                                            {(person.full_name || "U")[0].toUpperCase()}
                                          </div>
                                    }
                                    <div className="as-card__online" />
                                </div>

                                {/* Info */}
                                <div className="as-card__info">
                                    <h3 className="as-card__name">{person.full_name}</h3>
                                    <p className="as-card__stack">
                                        <MdCode size={14} />
                                        {person.stack}
                                    </p>

                                    {/* Stats */}
                                    <div className="as-card__stats">
                                        <div className="as-card__stat">
                                            <span className="as-card__stat-val">{person.experience}+</span>
                                            <span className="as-card__stat-lbl">
                                                {lang === "uz" ? "Yil" : lang === "ru" ? "Лет" : "Yrs"}
                                            </span>
                                        </div>
                                        <div className="as-card__stat-sep" />
                                        <div className="as-card__stat">
                                            <span className="as-card__stat-val">{person.projects?.length || 0}</span>
                                            <span className="as-card__stat-lbl">
                                                {lang === "uz" ? "Loyiha" : lang === "ru" ? "Проект" : "Projects"}
                                            </span>
                                        </div>
                                        <div className="as-card__stat-sep" />
                                        <div className="as-card__stat">
                                            <span className="as-card__stat-val">{person.certificates?.length || 0}</span>
                                            <span className="as-card__stat-lbl">
                                                {lang === "uz" ? "Sertif." : lang === "ru" ? "Серт." : "Certs"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* About snippet */}
                                    {person.about && (
                                        <p className="as-card__about">{person.about}</p>
                                    )}
                                </div>

                                {/* CTA */}
                                <div className="as-card__footer">
                                    <span className="as-card__cta">
                                        {viewLabel} <FaArrowRight size={11} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ── STYLES ── */
const STYLES = `
/* ── ABOUT SECTION (Jamoamiz) ── */
.as-section {
  position: relative;
  padding: 90px 32px;
  overflow: hidden;
}
.as-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.as-blob {
  position: absolute; border-radius: 50%;
  filter: blur(80px); opacity: 0.06;
}
.as-blob-1 {
  width: 500px; height: 500px;
  background: #00d4ff;
  top: -100px; left: -100px;
}
.as-blob-2 {
  width: 400px; height: 400px;
  background: #0055ff;
  bottom: -80px; right: -80px;
}

.as-container {
  max-width: 1200px; margin: 0 auto;
  position: relative; z-index: 1;
}

/* Header — section-header stilida */
.as-header { text-align: center; margin-bottom: 52px; }
.as-tag {
  color: #00d4ff; font-size: 13px;
  letter-spacing: 2px; margin-bottom: 10px;
  font-family: 'Courier New', monospace;
}
.as-heading {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800; color: #e2e8f0;
  margin: 0 0 14px; letter-spacing: 1px;
  font-family: 'Courier New', monospace;
}
.as-heading-line {
  width: 60px; height: 2px; margin: 0 auto 18px;
  background: linear-gradient(90deg, #00d4ff, #0055ff);
  border-radius: 2px;
}
.as-sub {
  color: #6b7280; font-size: 15px;
  max-width: 560px; margin: 0 auto;
  line-height: 1.7;
  font-family: 'Courier New', monospace;
}

/* Grid */
.as-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Card */
.as-card {
  position: relative;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .25s, border-color .25s, box-shadow .25s;
  animation: asFadeUp .45s ease both;
  display: flex; flex-direction: column;
  padding: 28px 24px 20px;
  gap: 16px;
}
.as-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0,212,255,0.28);
  box-shadow: 0 16px 48px rgba(0,0,0,0.45),
              0 0 32px rgba(0,212,255,0.05);
}
.as-card:hover .as-card__accent { opacity: 1; }
.as-card:hover .as-card__avatar-img,
.as-card:hover .as-card__avatar-ph { box-shadow: 0 0 28px rgba(0,212,255,0.3); }
.as-card:hover .as-card__cta { gap: 8px; color: #00d4ff; }

/* Accent top line */
.as-card__accent {
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #00d4ff, #0055ff);
  opacity: 0; transition: opacity .25s;
}

/* Avatar */
.as-card__avatar-wrap {
  position: relative; width: 80px; height: 80px; flex-shrink: 0;
}
.as-card__avatar-img {
  width: 80px; height: 80px;
  border-radius: 14px; object-fit: cover;
  border: 2px solid rgba(0,212,255,0.3);
  transition: box-shadow .25s;
}
.as-card__avatar-ph {
  width: 80px; height: 80px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0c1a2e, #0a0e1a);
  border: 2px solid rgba(0,212,255,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 800;
  color: #00d4ff;
  text-shadow: 0 0 20px rgba(0,212,255,0.6);
  transition: box-shadow .25s;
}
.as-card__online {
  position: absolute; bottom: 4px; right: -2px;
  width: 12px; height: 12px; border-radius: 50%;
  background: #10b981;
  border: 2px solid #0a0e1a;
  box-shadow: 0 0 8px rgba(16,185,129,0.7);
}

/* Info */
.as-card__info { flex: 1; }
.as-card__name {
  font-size: 18px; font-weight: 700;
  color: #e2e8f0; margin: 0 0 6px;
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
}
.as-card__stack {
  display: flex; align-items: center; gap: 5px;
  color: #00d4ff; font-size: 13px; margin: 0 0 14px;
  font-family: 'Courier New', monospace;
}

/* Stats */
.as-card__stats {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px; padding: 10px 14px;
  margin-bottom: 12px; gap: 0;
}
.as-card__stat {
  display: flex; flex-direction: column;
  align-items: center; gap: 2px; flex: 1;
}
.as-card__stat-sep {
  width: 1px; height: 28px;
  background: rgba(255,255,255,0.08);
}
.as-card__stat-val {
  font-size: 17px; font-weight: 800;
  color: #00d4ff;
  text-shadow: 0 0 14px rgba(0,212,255,0.4);
  font-family: 'Courier New', monospace;
}
.as-card__stat-lbl {
  font-size: 9px; color: #6b7280;
  letter-spacing: 1px; text-transform: uppercase;
}

/* About snippet */
.as-card__about {
  color: #94a3b8; font-size: 12px; line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
  font-family: 'Courier New', monospace;
}

/* Footer CTA */
.as-card__footer {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 14px;
}
.as-card__cta {
  display: flex; align-items: center; gap: 5px;
  color: #6b7280; font-size: 12px;
  transition: color .2s, gap .2s;
  font-family: 'Courier New', monospace;
}

/* Empty */
.as-empty { text-align: center; padding: 60px 20px; }
.as-empty-icon {
  font-size: 42px; color: rgba(0,212,255,0.2);
  margin-bottom: 12px;
}
.as-empty p { color: #6b7280; font-size: 15px; font-family: 'Courier New', monospace; }

/* Keyframes */
@keyframes asFadeUp {
  from { opacity:0; transform:translateY(22px) }
  to   { opacity:1; transform:none }
}

/* Responsive */
@media (max-width: 768px) {
  .as-section { padding: 64px 16px; }
  .as-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
}
@media (max-width: 480px) {
  .as-grid { grid-template-columns: 1fr; }
}
`;

export default AboutSection;