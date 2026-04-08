import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MdLocationOn, MdEmail, MdPhone,
    MdArrowBack, MdClose, MdZoomIn, MdOpenInNew
} from "react-icons/md";
import {
    FaInstagram, FaTelegramPlane, FaLinkedin,
    FaGithub, FaGlobe, FaUser, FaBriefcase,
    FaCertificate, FaCode, FaExternalLinkAlt
} from "react-icons/fa";
import { FiAward, FiClock } from "react-icons/fi";
import api from "../api";
import { useLang } from "../i18n/useLang";

/* ══════════════════════════════════════════════
   PROFILE DETAIL — full cyberpunk redesign
   Social links, project images, wow effect
══════════════════════════════════════════════ */
function ProfileDetail() {
    const { id }   = useParams();
    const navigate = useNavigate();
    const { lang, changeLang, t } = useLang();

    const [person,   setPerson]   = useState(null);
    const [lightbox, setLightbox] = useState(null);
    const [name,     setName]     = useState("");
    const [phoneNumber,       setPhoneNumber]       = useState("");
    const [telegramUsername,  setTelegramUsername]  = useState("");
    const [message,  setMessage]  = useState("");
    const [sending,  setSending]  = useState(false);
    const [sent,     setSent]     = useState(false);
    const [activeTab, setActiveTab] = useState("projects");
    const [langOpen,  setLangOpen]  = useState(false);
    const canvasRef = useRef(null);

    const achievColors    = ["#3b82f6","#10b981","#f97316","#a855f7","#ef4444"];
    const respColors      = ["#a855f7","#ef4444","#eab308","#06b6d4","#f43f5e"];

    /* ── Matrix rain canvas ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        const cols  = Math.floor(canvas.width / 20);
        const drops = Array(cols).fill(1);
        const chars = "アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const draw = () => {
            ctx.fillStyle = "rgba(10,14,26,0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(0,212,255,0.15)";
            ctx.font = "14px monospace";
            drops.forEach((y, i) => {
                const ch = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(ch, i * 20, y * 20);
                if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        };
        const interval = setInterval(draw, 60);
        const onResize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);
        return () => { clearInterval(interval); window.removeEventListener("resize", onResize); };
    }, []);

    useEffect(() => {
        setPerson(null);
        api.get(`/api/dev/info/${id}/?lang=${lang}`)
            .then(res => setPerson(res.data))
            .catch(console.error);
    }, [id, lang]);

    useEffect(() => {
        const handler = e => { if (e.key === "Escape") setLightbox(null); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    useEffect(() => {
        const fn = e => { if (!e.target.closest(".pd-lang-wrap")) setLangOpen(false); };
        document.addEventListener("click", fn);
        return () => document.removeEventListener("click", fn);
    }, []);

    useEffect(() => {
        document.body.style.overflow = lightbox ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [lightbox]);

    const sendMessage = async e => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post("/contact/create/", {
                dev_id: person.id, name,
                phone_number: phoneNumber,
                telegram_username: telegramUsername, message,
            });
            setSent(true);
            setName(""); setPhoneNumber(""); setTelegramUsername(""); setMessage("");
        } catch (err) {
            console.error(err);
            alert("Xabar yuborishda xato!");
        } finally { setSending(false); }
    };

    /* social icon helper */
    const socials = person ? [
        person.telegram  && { href: person.telegram.startsWith("http") ? person.telegram : `https://t.me/${person.telegram.replace("@","")}`,  icon: <FaTelegramPlane />, label: "Telegram", cls: "tg"  },
        person.instagram && { href: person.instagram.startsWith("http") ? person.instagram : `https://instagram.com/${person.instagram.replace("@","")}`, icon: <FaInstagram />,    label: "Instagram", cls: "ig" },
        person.linkedin  && { href: person.linkedin.startsWith("http")  ? person.linkedin  : `https://linkedin.com/in/${person.linkedin}`,  icon: <FaLinkedin />,     label: "LinkedIn",  cls: "li" },
        person.github    && { href: person.github.startsWith("http")    ? person.github    : `https://github.com/${person.github}`,          icon: <FaGithub />,       label: "GitHub",    cls: "gh" },
        person.website   && { href: person.website, icon: <FaGlobe />, label: "Website", cls: "wb" },
    ].filter(Boolean) : [];

    const tabs = [
        { key: "projects",     icon: <FaCode />,        label: lang === "uz" ? "Loyihalar" : lang === "ru" ? "Проекты" : "Projects" },
        { key: "experience",   icon: <FaBriefcase />,   label: lang === "uz" ? "Tajriba"   : lang === "ru" ? "Опыт"     : "Experience" },
        { key: "certificates", icon: <FaCertificate />, label: lang === "uz" ? "Sertifikatlar" : lang === "ru" ? "Сертификаты" : "Certificates" },
        { key: "contact",      icon: <MdEmail />,       label: lang === "uz" ? "Bog'lanish" : lang === "ru" ? "Контакт" : "Contact" },
    ];

    /* ── LOADING ── */
    if (!person) return (
        <div className="pd-loading">
            <canvas ref={canvasRef} className="pd-canvas" />
            <div className="pd-loading-inner">
                <div className="pd-spinner" />
                <p className="pd-loading-txt">
                    {lang === "uz" ? "Yuklanmoqda..." : lang === "ru" ? "Загрузка..." : "Loading..."}
                </p>
            </div>
            <PdStyles />
        </div>
    );

    /* ── MAIN ── */
    return (
        <div className="pd-root">
            <PdStyles />
            <canvas ref={canvasRef} className="pd-canvas" />

            {/* ── TOP BAR ── */}
            <div className="pd-topbar">
                <button className="pd-back-btn" onClick={() => navigate(-1)}>
                    <MdArrowBack /> {t("back") || "Orqaga"}
                </button>

                <div className="pd-lang-wrap">
                    <button className="pd-lang-btn" onClick={() => setLangOpen(v => !v)}>
                        <span>{lang === "uz" ? "🇺🇿" : lang === "ru" ? "🇷🇺" : "🇬🇧"}</span>
                        <span className="pd-lang-code">{lang.toUpperCase()}</span>
                        <span className={`pd-lang-arrow ${langOpen ? "open" : ""}`}>▾</span>
                    </button>
                    {langOpen && (
                        <div className="pd-lang-menu">
                            {[
                                { code: "uz", flag: "🇺🇿", label: "O'zbek"  },
                                { code: "ru", flag: "🇷🇺", label: "Русский" },
                                { code: "en", flag: "🇬🇧", label: "English" },
                            ].map(l => (
                                <button key={l.code}
                                    className={`pd-lang-item ${lang === l.code ? "active" : ""}`}
                                    onClick={() => { changeLang(l.code); setLangOpen(false); }}>
                                    <span>{l.flag}</span><span>{l.label}</span>
                                    {lang === l.code && <span className="pd-lang-check">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── HERO ── */}
            <div className="pd-hero">
                {/* scanline overlay */}
                <div className="pd-scanlines" aria-hidden />

                <div className="pd-hero-inner">

                    {/* LEFT — avatar + socials */}
                    <div className="pd-hero-left">
                        <div className="pd-avatar-wrap">
                            <div className="pd-avatar-ring pd-avatar-ring-1" />
                            <div className="pd-avatar-ring pd-avatar-ring-2" />
                            <div className="pd-avatar-ring pd-avatar-ring-3" />
                            {person.avatar
                                ? <img src={person.avatar} alt={person.full_name} className="pd-avatar-img" />
                                : <div className="pd-avatar-placeholder">
                                    {(person.full_name || "U")[0].toUpperCase()}
                                  </div>
                            }
                            <div className="pd-avatar-online" />
                        </div>

                        {/* Social links */}
                        {socials.length > 0 && (
                            <div className="pd-socials">
                                {socials.map((s, i) => (
                                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                                       className={`pd-social-btn pd-social-${s.cls}`}
                                       title={s.label}>
                                        {s.icon}
                                        <span className="pd-social-label">{s.label}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — info */}
                    <div className="pd-hero-right">
                        <div className="pd-hero-tag">
                            <span className="pd-tag-dot" />&nbsp;
                            {lang === "uz" ? "Jamoa a'zosi" : lang === "ru" ? "Член команды" : "Team Member"}
                        </div>

                        <h1 className="pd-name">{person.full_name}</h1>

                        <div className="pd-role-wrap">
                            <span className="pd-role-prefix">// </span>
                            <span className="pd-role">{person.stack}</span>
                        </div>

                        {person.about && (
                            <p className="pd-about">{person.about}</p>
                        )}

                        {/* Contact chips */}
                        <div className="pd-contact-chips">
                            <div className="pd-chip">
                                <MdLocationOn className="pd-chip-icon loc" />
                                <span>Tashkent, Uzbekistan</span>
                            </div>
                            {person.phone && (
                                <a href={`tel:${person.phone}`} className="pd-chip pd-chip-link">
                                    <MdPhone className="pd-chip-icon phone" />
                                    <span>{person.phone}</span>
                                </a>
                            )}
                            {person.email && (
                                <a href={`mailto:${person.email}`} className="pd-chip pd-chip-link">
                                    <MdEmail className="pd-chip-icon email" />
                                    <span>{person.email}</span>
                                </a>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="pd-stats">
                            <div className="pd-stat">
                                <span className="pd-stat-val blue">{person.experience}+</span>
                                <span className="pd-stat-lbl">
                                    {lang === "uz" ? "Yil tajriba" : lang === "ru" ? "Лет опыта" : "Yrs exp."}
                                </span>
                            </div>
                            <div className="pd-stat-sep" />
                            <div className="pd-stat">
                                <span className="pd-stat-val green">{person.projects?.length || 0}</span>
                                <span className="pd-stat-lbl">
                                    {lang === "uz" ? "Loyihalar" : lang === "ru" ? "Проекты" : "Projects"}
                                </span>
                            </div>
                            <div className="pd-stat-sep" />
                            <div className="pd-stat">
                                <span className="pd-stat-val yellow">{person.certificates?.length || 0}</span>
                                <span className="pd-stat-lbl">
                                    {lang === "uz" ? "Sertifikat" : lang === "ru" ? "Серт." : "Certs"}
                                </span>
                            </div>
                            <div className="pd-stat-sep" />
                            <div className="pd-stat">
                                <span className="pd-stat-val purple">{person.experiences?.length || 0}</span>
                                <span className="pd-stat-lbl">
                                    {lang === "uz" ? "Tajriba" : lang === "ru" ? "Опыт" : "Exp"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TABS ── */}
            <div className="pd-tabs-wrap">
                <div className="pd-tabs">
                    {tabs.map(tab => (
                        <button key={tab.key}
                            className={`pd-tab ${activeTab === tab.key ? "pd-tab--active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}>
                            {tab.icon}
                            <span>{tab.label}</span>
                            {activeTab === tab.key && <span className="pd-tab-underline" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── TAB CONTENT ── */}
            <div className="pd-content">

                {/* ── PROJECTS ── */}
                {activeTab === "projects" && (
                    <div className="pd-section">
                        {!person.projects?.length ? (
                            <EmptyState lang={lang} icon="{ }" text={lang === "uz" ? "Loyihalar yo'q" : lang === "ru" ? "Нет проектов" : "No projects"} />
                        ) : (
                            <div className="pd-proj-grid">
                                {person.projects.map((proj, idx) => (
                                    <div key={proj.id} className="pd-proj-card"
                                        style={{ animationDelay: `${idx * 0.08}s` }}>

                                        {/* Project image */}
                                        {proj.project_image && (
                                            <div className="pd-proj-img-wrap">
                                                <img src={proj.project_image} alt={proj.title}
                                                    className="pd-proj-img" loading="lazy" />
                                                <div className="pd-proj-img-overlay" />
                                                <span className="pd-proj-num">0{idx + 1}</span>
                                            </div>
                                        )}

                                        <div className={`pd-proj-body ${!proj.project_image ? "pd-proj-body--noimg" : ""}`}>
                                            {!proj.project_image && (
                                                <span className="pd-proj-num-inline">0{idx + 1}</span>
                                            )}
                                            <h3 className="pd-proj-title">{proj.title}</h3>
                                            <p className="pd-proj-desc">{proj.description}</p>

                                            {proj.technologies?.length > 0 && (
                                                <div className="pd-proj-tags">
                                                    {proj.technologies.map((tech, i) => (
                                                        <span key={i} className="pd-proj-tag">{tech}</span>
                                                    ))}
                                                </div>
                                            )}

                                            {proj.project_url && (
                                                <a href={proj.project_url} target="_blank"
                                                   rel="noopener noreferrer" className="pd-proj-link">
                                                    <FaExternalLinkAlt size={12} />
                                                    {lang === "uz" ? "Loyihani ko'rish"
                                                   : lang === "ru" ? "Открыть проект"
                                                   : "View Project"}
                                                </a>
                                            )}
                                        </div>
                                        <div className="pd-proj-accent" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── EXPERIENCE ── */}
                {activeTab === "experience" && (
                    <div className="pd-section">
                        {!person.experiences?.length ? (
                            <EmptyState lang={lang} icon="⚡" text={lang === "uz" ? "Tajriba yo'q" : lang === "ru" ? "Нет опыта" : "No experience"} />
                        ) : (
                            <div className="pd-exp-timeline">
                                {person.experiences.map((exp, idx) => (
                                    <div key={exp.id} className="pd-exp-item"
                                        style={{ animationDelay: `${idx * 0.1}s` }}>
                                        <div className="pd-exp-dot" />
                                        <div className="pd-exp-card">
                                            <div className="pd-exp-top">
                                                <div>
                                                    <h3 className="pd-exp-title">{exp.title}</h3>
                                                    {exp.company && <p className="pd-exp-company">{exp.company}</p>}
                                                </div>
                                                <div className="pd-exp-meta-right">
                                                    {exp.location && (
                                                        <span className="pd-exp-loc">📍 {exp.location}</span>
                                                    )}
                                                    <span className="pd-exp-date">
                                                        <FiClock size={11} />
                                                        {exp.start_date} —{" "}
                                                        {exp.is_current
                                                            ? (lang === "uz" ? "Hozir" : lang === "ru" ? "Сейчас" : "Present")
                                                            : exp.end_date}
                                                    </span>
                                                </div>
                                            </div>

                                            {exp.employment_type && (
                                                <span className="pd-exp-type">{exp.employment_type}</span>
                                            )}

                                            <div className="pd-exp-details">
                                                {exp.achievements && (
                                                    <div className="pd-exp-block">
                                                        <h4 className="pd-exp-block-title achieve">
                                                            <FiAward size={13} />
                                                            {lang === "uz" ? "Yutuqlar" : lang === "ru" ? "Достижения" : "Achievements"}
                                                        </h4>
                                                        {exp.achievements.split("\n").filter(Boolean).map((item, i) => (
                                                            <div key={i} className="pd-bullet">
                                                                <span style={{ color: achievColors[i % achievColors.length] }}>▸</span>
                                                                <span>{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {exp.responsibilities && (
                                                    <div className="pd-exp-block">
                                                        <h4 className="pd-exp-block-title resp">
                                                            <FaBriefcase size={11} />
                                                            {lang === "uz" ? "Vazifalar" : lang === "ru" ? "Обязанности" : "Responsibilities"}
                                                        </h4>
                                                        {exp.responsibilities.split("\n").filter(Boolean).map((item, i) => (
                                                            <div key={i} className="pd-bullet">
                                                                <span style={{ color: respColors[i % respColors.length] }}>▸</span>
                                                                <span>{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {exp.teaching_focus && (
                                                <div className="pd-exp-focus">
                                                    <span className="pd-exp-focus-label">
                                                        {lang === "uz" ? "O'qitish yo'nalishi" : lang === "ru" ? "Фокус" : "Focus"}:
                                                    </span>
                                                    {exp.teaching_focus}
                                                </div>
                                            )}

                                            {(exp.student_count || exp.age_range) && (
                                                <div className="pd-exp-students">
                                                    {exp.student_count && (
                                                        <span>👥 {exp.student_count} {lang === "uz" ? "talaba" : lang === "ru" ? "студентов" : "students"}</span>
                                                    )}
                                                    {exp.age_range && <span>· {exp.age_range}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── CERTIFICATES ── */}
                {activeTab === "certificates" && (
                    <div className="pd-section">
                        {!person.certificates?.length ? (
                            <EmptyState lang={lang} icon="🏆" text={lang === "uz" ? "Sertifikatlar yo'q" : lang === "ru" ? "Нет сертификатов" : "No certificates"} />
                        ) : (
                            <div className="pd-cert-grid">
                                {person.certificates.map((cert, idx) => (
                                    <div key={cert.id} className="pd-cert-card"
                                        style={{ animationDelay: `${idx * 0.07}s` }}
                                        onClick={() => setLightbox(cert)}>
                                        <div className="pd-cert-img-wrap">
                                            <img src={cert.image} alt={cert.title}
                                                className="pd-cert-img" loading="lazy" />
                                            <div className="pd-cert-overlay">
                                                <MdZoomIn className="pd-cert-zoom" />
                                            </div>
                                        </div>
                                        <div className="pd-cert-info">
                                            <p className="pd-cert-title">{cert.title}</p>
                                            {cert.issuer      && <p className="pd-cert-issuer">{cert.issuer}</p>}
                                            {cert.issued_date && <p className="pd-cert-date">{cert.issued_date}</p>}
                                        </div>
                                        <div className="pd-cert-shine" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── CONTACT ── */}
                {activeTab === "contact" && (
                    <div className="pd-section pd-contact-wrap">
                        <div className="pd-contact-card">
                            <div className="pd-contact-head">
                                <h2 className="pd-contact-title">
                                    {lang === "uz" ? `${person.full_name} bilan bog'lanish`
                                   : lang === "ru" ? `Связаться с ${person.full_name}`
                                   : `Contact ${person.full_name}`}
                                </h2>
                                <p className="pd-contact-sub">
                                    {lang === "uz" ? "Xabaringizni qoldiring, tez javob beramiz"
                                   : lang === "ru" ? "Оставьте сообщение, ответим быстро"
                                   : "Leave a message, we'll respond quickly"}
                                </p>
                            </div>

                            {sent ? (
                                <div className="pd-success">
                                    <div className="pd-success-ring"><span>✓</span></div>
                                    <h4>{t("contact_success_title") || "Yuborildi!"}</h4>
                                    <p>{person.full_name} {t("contact_success_text") || "tez orada javob beradi"}</p>
                                    <button className="pd-success-btn" onClick={() => setSent(false)}>
                                        {t("contact_send_another") || "Yana yuborish"}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={sendMessage} className="pd-form">
                                    <div className="pd-form-row">
                                        <div className="pd-form-group">
                                            <label>{t("contact_name_label") || "Ism"}</label>
                                            <input type="text"
                                                placeholder={t("contact_name_ph") || "To'liq ismingiz"}
                                                value={name} onChange={e => setName(e.target.value)} required />
                                        </div>
                                        <div className="pd-form-group">
                                            <label>{t("contact_phone_label") || "Telefon"}</label>
                                            <input type="tel" placeholder="+998 90 123 45 67"
                                                value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="pd-form-group">
                                        <label>{t("contact_tg_label") || "Telegram"}</label>
                                        <div className="pd-tg-wrap">
                                            <span className="pd-tg-at">@</span>
                                            <input type="text" placeholder="username"
                                                value={telegramUsername}
                                                onChange={e => setTelegramUsername(e.target.value)}
                                                style={{ paddingLeft: 28 }} required />
                                        </div>
                                    </div>
                                    <div className="pd-form-group">
                                        <label>{t("contact_msg_label") || "Xabar"}</label>
                                        <textarea rows={5}
                                            placeholder={t("contact_msg_ph") || "Xabaringizni yozing..."}
                                            value={message} onChange={e => setMessage(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="pd-submit" disabled={sending}>
                                        {sending
                                            ? <><span className="pd-spinner-sm" /> {t("contact_sending") || "Yuborilmoqda..."}</>
                                            : <>{t("contact_submit") || "Yuborish"} <span>→</span></>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── BACK BOTTOM ── */}
            <div className="pd-back-bottom">
                <button className="pd-back-btn" onClick={() => navigate(-1)}>
                    <MdArrowBack /> {t("back") || "Orqaga"}
                </button>
            </div>

            {/* ── LIGHTBOX ── */}
            {lightbox && (
                <div className="pd-lb-bg" onClick={() => setLightbox(null)}>
                    <div className="pd-lb-box" onClick={e => e.stopPropagation()}>
                        <button className="pd-lb-close" onClick={() => setLightbox(null)}><MdClose /></button>
                        <img src={lightbox.image} alt={lightbox.title} className="pd-lb-img" />
                        <div className="pd-lb-meta">
                            <p className="pd-lb-title">{lightbox.title}</p>
                            {lightbox.issuer      && <p className="pd-lb-issuer">{lightbox.issuer}</p>}
                            {lightbox.issued_date && <p className="pd-lb-date">{lightbox.issued_date}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── EMPTY STATE ────────────────────────────────── */
function EmptyState({ icon, text }) {
    return (
        <div className="pd-empty">
            <div className="pd-empty-icon">{icon}</div>
            <p className="pd-empty-text">{text}</p>
        </div>
    );
}

/* ══════════════════════════════════════════════════
   CSS — injected once
══════════════════════════════════════════════════ */
function PdStyles() {
    useEffect(() => {
        if (document.getElementById("pd-css")) return;
        const el = document.createElement("style");
        el.id = "pd-css";
        el.textContent = CSS;
        document.head.appendChild(el);
    }, []);
    return null;
}

const CSS = `
/* ── ROOT ── */
.pd-root {
  min-height: 100vh;
  background: #060a14;
  color: #e2e8f0;
  font-family: 'Courier New', monospace;
  position: relative;
  overflow-x: hidden;
}

/* ── MATRIX CANVAS ── */
.pd-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
}

/* ── SCANLINES ── */
.pd-scanlines {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0,212,255,0.015) 3px,
    rgba(0,212,255,0.015) 4px
  );
}

/* ── TOPBAR ── */
.pd-topbar {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 40px;
  background: rgba(6,10,20,0.85);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(0,212,255,0.15);
}

.pd-back-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.25);
  color: #00d4ff; padding: 9px 18px; border-radius: 8px;
  font-size: 14px; font-family: inherit; cursor: pointer;
  transition: all .2s;
}
.pd-back-btn:hover {
  background: rgba(0,212,255,0.18);
  box-shadow: 0 0 16px rgba(0,212,255,0.25);
  transform: translateX(-3px);
}

/* ── LANG ── */
.pd-lang-wrap { position: relative; }
.pd-lang-btn {
  display: flex; align-items: center; gap: 6px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.2);
  border-radius: 8px; padding: 8px 12px;
  color: #e2e8f0; cursor: pointer; font-size: 13px;
}
.pd-lang-code { font-size: 11px; }
.pd-lang-arrow { font-size: 10px; transition: transform .2s; }
.pd-lang-arrow.open { transform: rotate(180deg); }
.pd-lang-menu {
  position: absolute; right: 0; top: calc(100% + 8px);
  background: #0f172a;
  border: 1px solid rgba(0,212,255,0.2);
  border-radius: 10px; overflow: hidden; min-width: 150px; z-index: 200;
}
.pd-lang-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 10px 14px;
  background: none; border: none;
  color: #94a3b8; cursor: pointer;
  font-size: 13px; font-family: inherit;
  transition: background .15s;
}
.pd-lang-item:hover { background: rgba(0,212,255,0.08); }
.pd-lang-item.active { color: #00d4ff; background: rgba(0,212,255,0.1); }
.pd-lang-check { margin-left: auto; color: #00d4ff; }

/* ── HERO ── */
.pd-hero {
  position: relative; z-index: 10;
  padding: 100px 40px 48px;
  background: linear-gradient(180deg,
    rgba(0,212,255,0.04) 0%,
    transparent 100%);
  border-bottom: 1px solid rgba(0,212,255,0.1);
}

.pd-hero-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 300px 1fr;
  gap: 60px; align-items: center;
}

/* ── AVATAR ── */
.pd-hero-left {
  display: flex; flex-direction: column;
  align-items: center; gap: 28px;
}
.pd-avatar-wrap {
  position: relative; width: 220px; height: 260px;
}
.pd-avatar-ring {
  position: absolute; border-radius: 50%; border: 1px solid;
  animation: pdSpin linear infinite;
}
.pd-avatar-ring-1 {
  inset: -14px; border-color: rgba(0,212,255,0.3);
  animation-duration: 8s;
}
.pd-avatar-ring-2 {
  inset: -24px; border-color: rgba(0,212,255,0.15);
  animation-duration: 14s; animation-direction: reverse;
  border-style: dashed;
}
.pd-avatar-ring-3 {
  inset: -36px; border-color: rgba(0,212,255,0.07);
  animation-duration: 20s;
  border-style: dotted;
}
@keyframes pdSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

.pd-avatar-img {
  width: 100%; height: 100%;
  object-fit: cover; border-radius: 16px;
  border: 2px solid rgba(0,212,255,0.4);
  box-shadow:
    0 0 30px rgba(0,212,255,0.2),
    0 0 80px rgba(0,212,255,0.08),
    inset 0 0 30px rgba(0,0,0,0.5);
  position: relative; z-index: 1;
}
.pd-avatar-placeholder {
  width: 100%; height: 100%; border-radius: 16px;
  background: linear-gradient(135deg, #0c1f35 0%, #0a0e1a 100%);
  border: 2px solid rgba(0,212,255,0.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 5rem; font-weight: 800; color: #00d4ff;
  text-shadow: 0 0 30px rgba(0,212,255,0.8);
  position: relative; z-index: 1;
}
.pd-avatar-online {
  position: absolute; bottom: 12px; right: -6px;
  width: 16px; height: 16px; border-radius: 50%;
  background: #10b981;
  border: 3px solid #060a14;
  box-shadow: 0 0 12px rgba(16,185,129,0.8);
  z-index: 2;
  animation: pdBlink 2s ease infinite;
}
@keyframes pdBlink { 0%,100%{opacity:1} 50%{opacity:.4} }

/* ── SOCIAL LINKS ── */
.pd-socials {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;
  width: 100%;
}
.pd-social-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px; border-radius: 999px;
  font-size: 13px; font-family: inherit;
  text-decoration: none; border: 1px solid;
  transition: all .22s; font-weight: 600;
  letter-spacing: 0.3px;
}
.pd-social-tg  { background:rgba(0,136,204,.12); color:#29a8e8; border-color:rgba(0,136,204,.3); }
.pd-social-ig  { background:rgba(225,48,108,.12); color:#e1306c; border-color:rgba(225,48,108,.3); }
.pd-social-li  { background:rgba(0,119,181,.12);  color:#0077b5; border-color:rgba(0,119,181,.3); }
.pd-social-gh  { background:rgba(255,255,255,.06); color:#e2e8f0; border-color:rgba(255,255,255,.2); }
.pd-social-wb  { background:rgba(0,212,255,.10);   color:#00d4ff; border-color:rgba(0,212,255,.3); }
.pd-social-btn:hover {
  transform: translateY(-3px) scale(1.04);
  filter: brightness(1.2);
  box-shadow: 0 6px 22px rgba(0,0,0,0.4);
}
.pd-social-label { font-size: 12px; }

/* ── HERO RIGHT ── */
.pd-hero-right { display: flex; flex-direction: column; gap: 18px; }

.pd-hero-tag {
  display: inline-flex; align-items: center;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.2);
  border-radius: 999px; padding: 5px 14px;
  font-size: 12px; color: #00d4ff;
  letter-spacing: 1px; width: fit-content;
}
.pd-tag-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 8px #00d4ff;
  animation: pdBlink 1.5s ease infinite;
}

.pd-name {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 800; color: #e2e8f0;
  text-shadow: 0 0 40px rgba(0,212,255,0.2);
  margin: 0; letter-spacing: 3px;
  line-height: 1.05;
}

.pd-role-wrap { display: flex; align-items: center; gap: 0; }
.pd-role-prefix { color: #00d4ff; font-size: 18px; font-weight: 700; }
.pd-role { font-size: 18px; color: #94a3b8; letter-spacing: 1px; }

.pd-about {
  color: #cbd5e1; font-size: 15px; line-height: 1.75;
  max-width: 560px;
  padding: 16px; border-radius: 10px;
  background: rgba(255,255,255,0.03);
  border-left: 3px solid rgba(0,212,255,0.4);
}

/* ── CONTACT CHIPS ── */
.pd-contact-chips { display: flex; flex-wrap: wrap; gap: 10px; }
.pd-chip {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px; padding: 8px 14px;
  font-size: 13px; color: #94a3b8;
}
.pd-chip-link {
  text-decoration: none; transition: all .2s; cursor: pointer;
}
.pd-chip-link:hover {
  background: rgba(0,212,255,0.08);
  border-color: rgba(0,212,255,0.25);
  color: #00d4ff;
}
.pd-chip-icon { font-size: 16px; }
.pd-chip-icon.loc   { color: #60a5fa; }
.pd-chip-icon.phone { color: #34d399; }
.pd-chip-icon.email { color: #a78bfa; }

/* ── STATS ── */
.pd-stats {
  display: flex; align-items: center; gap: 0;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 18px 24px;
  width: fit-content;
}
.pd-stat {
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
  padding: 0 24px;
}
.pd-stat-sep {
  width: 1px; height: 40px;
  background: rgba(255,255,255,0.1);
}
.pd-stat-val {
  font-size: 26px; font-weight: 800; letter-spacing: 1px;
}
.pd-stat-val.blue   { color:#3b82f6; text-shadow:0 0 20px rgba(59,130,246,.5); }
.pd-stat-val.green  { color:#10b981; text-shadow:0 0 20px rgba(16,185,129,.5); }
.pd-stat-val.yellow { color:#f59e0b; text-shadow:0 0 20px rgba(245,158,11,.5); }
.pd-stat-val.purple { color:#a855f7; text-shadow:0 0 20px rgba(168,85,247,.5); }
.pd-stat-lbl { font-size: 11px; color: #6b7280; letter-spacing: 1px; text-transform: uppercase; }

/* ── TABS ── */
.pd-tabs-wrap {
  position: sticky; top: 57px; z-index: 90;
  background: rgba(6,10,20,0.92);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.pd-tabs {
  max-width: 1100px; margin: 0 auto;
  display: flex; gap: 0;
  padding: 0 40px;
}
.pd-tab {
  display: flex; align-items: center; gap: 8px;
  padding: 16px 22px; background: none;
  border: none; color: #6b7280;
  font-size: 14px; font-family: inherit;
  cursor: pointer; position: relative;
  transition: color .2s;
}
.pd-tab:hover { color: #e2e8f0; }
.pd-tab--active { color: #00d4ff; }
.pd-tab-underline {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 2px; background: #00d4ff;
  border-radius: 2px 2px 0 0;
  box-shadow: 0 0 10px rgba(0,212,255,0.6);
  animation: pdFadeIn .2s ease;
}

/* ── CONTENT ── */
.pd-content {
  position: relative; z-index: 10;
  max-width: 1100px; margin: 0 auto;
  padding: 40px 40px 60px;
}
.pd-section { animation: pdFadeUp .4s ease; }

/* ── PROJECTS ── */
.pd-proj-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}
.pd-proj-card {
  position: relative;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; overflow: hidden;
  transition: transform .25s, border-color .25s, box-shadow .25s;
  animation: pdFadeUp .4s ease both;
}
.pd-proj-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0,212,255,0.3);
  box-shadow: 0 16px 48px rgba(0,0,0,0.5),
              0 0 40px rgba(0,212,255,0.06);
}
.pd-proj-card:hover .pd-proj-accent { opacity: 1; }
.pd-proj-card:hover .pd-proj-img { transform: scale(1.05); }
.pd-proj-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #00d4ff, #0055ff);
  opacity: 0; transition: opacity .25s;
}
.pd-proj-img-wrap {
  position: relative; height: 200px; overflow: hidden;
  background: #0d1120;
}
.pd-proj-img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .35s;
}
.pd-proj-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(6,10,20,.9));
}
.pd-proj-num {
  position: absolute; bottom: 10px; left: 14px;
  font-size: 11px; color: rgba(0,212,255,.7);
  font-weight: 700; letter-spacing: 2px;
}
.pd-proj-body { padding: 18px 20px 22px; }
.pd-proj-body--noimg { padding-top: 24px; }
.pd-proj-num-inline {
  font-size: 11px; color: rgba(0,212,255,.6);
  letter-spacing: 2px; font-weight: 700;
  display: block; margin-bottom: 8px;
}
.pd-proj-title {
  font-size: 17px; font-weight: 700; color: #e2e8f0;
  margin-bottom: 8px; line-height: 1.3;
}
.pd-proj-desc {
  color: #94a3b8; font-size: 13px; line-height: 1.6;
  margin-bottom: 14px;
  display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
}
.pd-proj-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.pd-proj-tag {
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.2);
  color: #7dd3fc; font-size: 11px;
  padding: 3px 10px; border-radius: 999px;
}
.pd-proj-link {
  display: inline-flex; align-items: center; gap: 6px;
  color: #00d4ff; font-size: 13px; text-decoration: none;
  transition: gap .2s;
}
.pd-proj-link:hover { gap: 10px; }

/* ── EXPERIENCE ── */
.pd-exp-timeline {
  display: flex; flex-direction: column; gap: 0;
  padding-left: 28px;
  border-left: 2px solid rgba(0,212,255,0.15);
}
.pd-exp-item {
  position: relative; padding-bottom: 32px;
  animation: pdFadeUp .4s ease both;
}
.pd-exp-item:last-child { padding-bottom: 0; }
.pd-exp-dot {
  position: absolute; left: -36px; top: 22px;
  width: 12px; height: 12px; border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 16px rgba(0,212,255,0.8);
  border: 2px solid #060a14;
}
.pd-exp-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 24px 28px;
  transition: border-color .2s, box-shadow .2s;
  margin-left: 12px;
}
.pd-exp-card:hover {
  border-color: rgba(0,212,255,0.2);
  box-shadow: 0 8px 32px rgba(0,0,0,.4);
}
.pd-exp-top {
  display: flex; justify-content: space-between;
  align-items: flex-start; gap: 16px;
  margin-bottom: 10px;
}
.pd-exp-title { color: #38bdf8; font-size: 18px; font-weight: 700; margin: 0 0 4px; }
.pd-exp-company { color: #d1d5db; font-size: 14px; margin: 0; }
.pd-exp-meta-right {
  display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
  flex-shrink: 0;
}
.pd-exp-loc { color: #9ca3af; font-size: 12px; }
.pd-exp-date {
  display: flex; align-items: center; gap: 4px;
  color: #6b7280; font-size: 12px;
}
.pd-exp-type {
  display: inline-block; font-size: 11px;
  background: rgba(0,212,255,0.1);
  color: #00d4ff; border: 1px solid rgba(0,212,255,0.2);
  border-radius: 999px; padding: 2px 10px;
  margin-bottom: 16px;
}
.pd-exp-details {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 20px; margin-top: 16px;
}
.pd-exp-block { }
.pd-exp-block-title {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 700;
  margin-bottom: 12px;
}
.pd-exp-block-title.achieve { color: #34d399; }
.pd-exp-block-title.resp    { color: #f59e0b; }
.pd-bullet {
  display: flex; gap: 8px; margin-bottom: 6px;
  font-size: 13px; color: #e5e7eb; line-height: 1.5;
}
.pd-exp-focus {
  margin-top: 14px; padding: 12px 16px;
  background: rgba(0,212,255,0.05);
  border-left: 2px solid rgba(0,212,255,0.3);
  border-radius: 0 8px 8px 0;
  font-size: 13px; color: #cbd5e1; line-height: 1.6;
}
.pd-exp-focus-label { color: #38bdf8; font-weight: 700; margin-right: 6px; }
.pd-exp-students { margin-top: 12px; color: #94a3b8; font-size: 12px; display: flex; gap: 8px; }

/* ── CERTIFICATES ── */
.pd-cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.pd-cert-card {
  position: relative;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; overflow: hidden;
  cursor: pointer; transition: all .25s;
  animation: pdFadeUp .4s ease both;
}
.pd-cert-card:hover {
  border-color: rgba(251,191,36,0.4);
  transform: translateY(-6px);
  box-shadow: 0 14px 40px rgba(251,191,36,0.12);
}
.pd-cert-card:hover .pd-cert-img { transform: scale(1.06); }
.pd-cert-card:hover .pd-cert-overlay { background: rgba(0,0,0,.45); }
.pd-cert-card:hover .pd-cert-zoom { opacity: 1; }
.pd-cert-card:hover .pd-cert-shine { opacity: 1; }
.pd-cert-img-wrap { position: relative; height: 180px; overflow: hidden; }
.pd-cert-img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s; }
.pd-cert-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  transition: background .25s;
}
.pd-cert-zoom {
  font-size: 2.2rem; color: white;
  opacity: 0; transition: opacity .25s;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.8));
}
.pd-cert-info { padding: 14px 16px 18px; }
.pd-cert-title  { color: #fbbf24; font-size: 14px; font-weight: 700; margin: 0 0 5px; }
.pd-cert-issuer { color: #9ca3af; font-size: 12px; margin: 0 0 4px; }
.pd-cert-date   { color: #64748b; font-size: 11px; font-family: monospace; margin: 0; }
.pd-cert-shine {
  position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent);
  transform: skewX(-20deg);
  transition: left .6s ease;
  opacity: 0;
}
.pd-cert-card:hover .pd-cert-shine { left: 150%; opacity: 1; }

/* ── CONTACT ── */
.pd-contact-wrap { max-width: 680px; margin: 0 auto; }
.pd-contact-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(0,212,255,0.15);
  border-radius: 20px; padding: 40px;
}
.pd-contact-head { margin-bottom: 32px; }
.pd-contact-title {
  font-size: 22px; font-weight: 700; color: #00d4ff;
  margin-bottom: 8px;
}
.pd-contact-sub { color: #6b7280; font-size: 14px; }
.pd-form { display: flex; flex-direction: column; gap: 18px; }
.pd-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pd-form-group { display: flex; flex-direction: column; gap: 8px; }
.pd-form-group label { color: #7dd3fc; font-size: 13px; font-weight: 500; }
.pd-form-group input,
.pd-form-group textarea {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; color: #e2e8f0;
  padding: 12px 16px; font-size: 14px;
  font-family: inherit; transition: border-color .2s;
  width: 100%; box-sizing: border-box; resize: vertical;
}
.pd-form-group input:focus,
.pd-form-group textarea:focus {
  outline: none;
  border-color: rgba(0,212,255,0.4);
  box-shadow: 0 0 0 3px rgba(0,212,255,0.08);
}
.pd-form-group input::placeholder,
.pd-form-group textarea::placeholder { color: #374151; }
.pd-tg-wrap { position: relative; }
.pd-tg-at {
  position: absolute; left: 14px; top: 50%;
  transform: translateY(-50%); color: #6b7280;
  font-family: monospace; z-index: 1; pointer-events: none;
}
.pd-submit {
  padding: 14px;
  background: linear-gradient(135deg, #0055ff 0%, #00d4ff 100%);
  color: white; border: none; border-radius: 10px;
  font-size: 15px; font-weight: 700;
  font-family: inherit; cursor: pointer; transition: all .25s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.pd-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,212,255,0.35);
}
.pd-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.pd-spinner-sm {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: white;
  animation: pdSpinAnim .7s linear infinite; display: inline-block;
}
@keyframes pdSpinAnim { to { transform: rotate(360deg); } }

/* ── SUCCESS ── */
.pd-success { text-align: center; padding: 40px 20px; }
.pd-success-ring {
  width: 72px; height: 72px; border-radius: 50%;
  border: 3px solid #10b981;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
  font-size: 28px; color: #10b981;
  box-shadow: 0 0 30px rgba(16,185,129,0.4);
  animation: pdFadeIn .4s ease;
}
.pd-success h4 { color: #00d4ff; font-size: 22px; margin-bottom: 10px; }
.pd-success p  { color: #94a3b8; margin-bottom: 20px; }
.pd-success-btn {
  background: rgba(0,212,255,0.1);
  border: 1px solid rgba(0,212,255,0.3);
  color: #00d4ff; padding: 10px 24px;
  border-radius: 8px; cursor: pointer;
  font-family: inherit; font-size: 14px;
  transition: all .2s;
}
.pd-success-btn:hover { background: rgba(0,212,255,0.2); }

/* ── BACK BOTTOM ── */
.pd-back-bottom {
  position: relative; z-index: 10;
  display: flex; justify-content: center;
  padding: 0 0 60px;
}

/* ── LIGHTBOX ── */
.pd-lb-bg {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: pdFadeIn .2s ease;
}
.pd-lb-box {
  position: relative; display: flex;
  flex-direction: column; align-items: center; gap: 16px;
  max-width: 90vw; max-height: 92vh;
  animation: pdSlideUp .25s ease;
}
.pd-lb-close {
  position: absolute; top: -14px; right: -14px;
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(31,41,55,0.95);
  border: 1px solid #4b5563;
  color: #9ca3af; font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .2s; z-index: 10;
}
.pd-lb-close:hover { color: white; border-color: #f87171; background: rgba(248,113,113,.25); }
.pd-lb-img {
  max-width: 100%; max-height: 78vh;
  border-radius: 12px;
  border: 2px solid rgba(251,191,36,0.35);
  box-shadow: 0 0 60px rgba(0,0,0,.8);
}
.pd-lb-meta { text-align: center; }
.pd-lb-title  { color: #fbbf24; font-size: 17px; font-weight: 700; margin: 0 0 5px; }
.pd-lb-issuer { color: #9ca3af; font-size: 13px; margin: 0 0 4px; }
.pd-lb-date   { color: #64748b; font-size: 12px; font-family: monospace; margin: 0; }

/* ── LOADING ── */
.pd-loading {
  min-height: 100vh; background: #060a14;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 20px; position: relative;
}
.pd-loading-inner { position: relative; z-index: 10; text-align: center; }
.pd-spinner {
  width: 52px; height: 52px; border-radius: 50%;
  border: 3px solid rgba(0,212,255,0.15);
  border-top-color: #00d4ff;
  animation: pdSpinAnim .8s linear infinite;
  margin: 0 auto 16px;
  box-shadow: 0 0 20px rgba(0,212,255,0.3);
}
.pd-loading-txt { color: #00d4ff; font-size: 14px; letter-spacing: 2px; }

/* ── EMPTY ── */
.pd-empty { text-align: center; padding: 80px 20px; }
.pd-empty-icon { font-size: 52px; margin-bottom: 16px; }
.pd-empty-text { color: #6b7280; font-size: 16px; }

/* ── KEYFRAMES ── */
@keyframes pdFadeUp {
  from { opacity:0; transform:translateY(24px) }
  to   { opacity:1; transform:none }
}
@keyframes pdFadeIn {
  from { opacity:0 } to { opacity:1 }
}
@keyframes pdSlideUp {
  from { transform:translateY(28px);opacity:0 }
  to   { transform:none;opacity:1 }
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .pd-hero-inner { grid-template-columns: 1fr; text-align: center; }
  .pd-hero-left  { margin: 0 auto; }
  .pd-contact-chips { justify-content: center; }
  .pd-stats { margin: 0 auto; flex-wrap: wrap; justify-content: center; }
  .pd-exp-details { grid-template-columns: 1fr; }
  .pd-exp-top { flex-direction: column; }
  .pd-exp-meta-right { align-items: flex-start; }
  .pd-form-row { grid-template-columns: 1fr; }
  .pd-proj-grid { grid-template-columns: 1fr; }
  .pd-cert-grid { grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); }
}
@media (max-width: 600px) {
  .pd-topbar  { padding: 12px 20px; }
  .pd-hero    { padding: 90px 20px 40px; }
  .pd-tabs    { padding: 0 20px; overflow-x: auto; }
  .pd-tab     { white-space: nowrap; padding: 14px 16px; }
  .pd-content { padding: 28px 20px 48px; }
  .pd-contact-card { padding: 24px 20px; }
  .pd-stats   { padding: 14px; }
  .pd-stat    { padding: 0 14px; }
  .pd-name    { font-size: 32px; }
}
`;

export default ProfileDetail;