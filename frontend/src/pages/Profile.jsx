import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdLocationOn, MdEmail, MdPhone, MdArrowBack, MdClose, MdZoomIn } from "react-icons/md";
import api from "../api";
import "../styles/Profile.css";
import { useLang } from "../i18n/useLang";

function ProfileDetail() {
    const { id }     = useParams();
    const navigate   = useNavigate();
    const { lang, changeLang, t } = useLang();

    const [person,   setPerson]   = useState(null);
    const [lightbox, setLightbox] = useState(null);
    const [name,     setName]     = useState("");
    const [phoneNumber, setPhoneNumber]           = useState("");
    const [telegramUsername, setTelegramUsername] = useState("");
    const [message, setMessage]                   = useState("");
    const [sending,  setSending]  = useState(false);
    const [sent,     setSent]     = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    const achievementColors    = ['#2563eb', '#16a34a', '#f97316'];
    const responsibilityColors = ['#a855f7', '#ef4444', '#eab308'];

    useEffect(() => {
        setPerson(null); // loading ko'rsatish uchun
        api.get(`/api/dev/info/${id}/?lang=${lang}`)
            .then(res => setPerson(res.data))
            .catch(console.error);
    }, [id, lang]);

    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") setLightbox(null); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post("/contact/create/", {
                dev_id: person.id,
                name,
                phone_number: phoneNumber,
                telegram_username: telegramUsername,
                message,
            });
            setSent(true);
            setName(""); setPhoneNumber(""); 
            setTelegramUsername(""); setMessage("");
        } catch (err) {
            console.error(err);
            alert("Xabar yuborishda xato!");
        } finally {
            setSending(false);
        }
    };

    if (!person) return (
        <div className="detail-loading">
            <div className="loading-spinner" />
            <p>Loading...</p>
        </div>
    );

    return (
        <div className="detail-container">

            {/* ── Lang + Back bar ── */}
            <div className="profile-lang-bar">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <MdArrowBack /> {t("back")}
                </button>

                {/* ✅ Home page dagi dropdown */}
                <div className="lang-dropdown-wrap">

                    {langOpen && (
                        <div className="lang-dropdown-menu">
                            {[
                                { code: "uz", flag: "🇺🇿", label: "O'zbek" },
                                { code: "ru", flag: "🇷🇺", label: "Русский" },
                                { code: "en", flag: "🇬🇧", label: "English" },
                            ].map((l) => (
                                <button
                                    key={l.code}
                                    className={`lang-dropdown-item ${lang === l.code ? "active" : ""}`}
                                    onClick={() => {
                                        changeLang(l.code);
                                        setLangOpen(false);
                                    }}
                                >
                                    <span>{l.flag}</span>
                                    <span>{l.label}</span>
                                    {lang === l.code && <span className="lang-check">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Hero ── */}
            <div className="detail-hero">
                <div className="detail-left">
                    {person.avatar
                        ? <img src={person.avatar} alt={person.full_name} className="detail-avatar-img" />
                        : <div className="detail-avatar-placeholder">
                            {(person.full_name || "U")[0].toUpperCase()}
                          </div>
                    }
                </div>

                <div className="detail-right">
                    <h1 className="detail-name">{person.full_name}</h1>
                    <p className="detail-role">{person.stack}</p>

                    {/* ✅ about — SerializerMethodField, til qarab keladi */}
                    {person.about && (
                        <p className="detail-about-text">{person.about}</p>
                    )}

                    <div className="detail-info-list">
                        <div className="detail-info-item">
                            <MdLocationOn className="detail-icon location" />
                            <span>Tashkent, Uzbekistan</span>
                        </div>
                        {person.phone && (
                            <div className="detail-info-item">
                                <MdPhone className="detail-icon phone" />
                                <span>{person.phone}</span>
                            </div>
                        )}
                        {person.email && (
                            <div className="detail-info-item">
                                <MdEmail className="detail-icon email" />
                                <span>{person.email}</span>
                            </div>
                        )}
                    </div>

                    <div className="detail-stats">
                        <div className="stat-box">
                            <span className="stat-value" style={{ color: "#3b82f6" }}>
                                {person.experience}+
                            </span>
                            <span className="stat-label">{t("hero_exp")}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value" style={{ color: "#4ade80" }}>
                                {person.projects?.length || 0}
                            </span>
                            <span className="stat-label">{t("hero_projects")}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value" style={{ color: "#fbbf24" }}>
                                {person.certificates?.length || 0}
                            </span>
                            <span className="stat-label">Certificates</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value" style={{ color: "#a855f7" }}>
                                {person.experiences?.length || 0}
                            </span>
                            <span className="stat-label">Experience</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Experience ── */}
            {person.experiences?.length > 0 && (
                <div className="detail-section-full">
                    <h2 className="detail-section-title">Experience</h2>
                    <div className="detail-exp-grid">
                        {person.experiences.map((exp) => (
                            <div key={exp.id} className="detail-exp-card">
                                <div className="detail-exp-header">
                                    <div>
                                        {/* ✅ title — til qarab keladi (SerializerMethodField) */}
                                        <h3>{exp.title}</h3>
                                        {exp.company && (
                                            <p className="exp-company">{exp.company}</p>
                                        )}
                                    </div>
                                    {exp.location && (
                                        <span className="exp-location">📍 {exp.location}</span>
                                    )}
                                </div>

                                <div className="exp-meta">
                                    <span>
                                        ⏳ {exp.start_date} —{" "}
                                        {exp.is_current ? (
                                            lang === "ru" ? "По настоящее время"
                                            : lang === "en" ? "Present"
                                            : "Hozirgi kunga")
                                        : exp.end_date}
                                    </span>
                                    <span>{exp.employment_type}</span>
                                </div>

                                <div className="exp-details">
                                    {/* ✅ achievements — til qarab keladi */}
                                    {exp.achievements && (
                                        <div>
                                            <h4>
                                                {lang === "ru" ? "Достижения"
                                                : lang === "en" ? "Key Achievements"
                                                : "Yutuqlar"}
                                            </h4>
                                            {exp.achievements
                                                .split("\n")
                                                .filter(Boolean)
                                                .map((item, i) => (
                                                    <div key={i} className="exp-bullet-item">
                                                        <span style={{ color: achievementColors[i % 3] }}>●</span>
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}

                                    {/* ✅ responsibilities — til qarab keladi */}
                                    {exp.responsibilities && (
                                        <div>
                                            <h4>
                                                {lang === "ru" ? "Обязанности"
                                                : lang === "en" ? "Responsibilities"
                                                : "Vazifalar"}
                                            </h4>
                                            {exp.responsibilities
                                                .split("\n")
                                                .filter(Boolean)
                                                .map((item, i) => (
                                                    <div key={i} className="exp-bullet-item">
                                                        <span style={{ color: responsibilityColors[i % 3] }}>●</span>
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>

                                {/* ✅ teaching_focus */}
                                {exp.teaching_focus && (
                                    <div style={{ marginTop: "16px" }}>
                                        <h4 style={{ color: "#38bdf8", marginBottom: "8px" }}>
                                            {lang === "ru" ? "Фокус обучения"
                                            : lang === "en" ? "Teaching Focus"
                                            : "O'qitish yo'nalishi"}
                                        </h4>
                                        <p style={{ color: "#e5e7eb", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                            {exp.teaching_focus}
                                        </p>
                                    </div>
                                )}

                                {/* Student info */}
                                {exp.student_count && (
                                    <div style={{ marginTop: "12px", color: "#94a3b8", fontSize: "0.85rem" }}>
                                        👥 {exp.student_count} {lang === "ru" ? "студентов" : lang === "en" ? "students" : "talaba"}
                                        {exp.age_range && ` · ${exp.age_range}`}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Projects ── */}
            {person.projects?.length > 0 && (
                <div className="detail-section-full">
                    <h2 className="detail-section-title">{t("projects_title")}</h2>
                    <div className="detail-projects-grid">
                        {person.projects.map((project) => (
                            <div key={project.id} className="detail-project-card">
                                {/* ✅ title va description — til qarab keladi */}
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>
                                {project.technologies?.length > 0 && (
                                    <div className="project-tags">
                                        {project.technologies.map((tech, idx) => (
                                            <span key={idx} className="project-tag">{tech}</span>
                                        ))}
                                    </div>
                                )}
                                {project.project_url && (
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-link"
                                    >
                                        <span>↗</span>{" "}
                                        {lang === "ru" ? "Открыть проект"
                                        : lang === "en" ? "View Project"
                                        : "Loyihani ko'rish"}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Certificates ── */}
            {person.certificates?.length > 0 && (
                <div className="detail-section-full">
                    <h2 className="detail-section-title">
                        {lang === "ru" ? "Сертификаты"
                        : lang === "en" ? "Certificates"
                        : "Sertifikatlar"}
                    </h2>
                    <div className="cert-grid">
                        {person.certificates.map((cert) => (
                            <div key={cert.id} className="cert-card" onClick={() => setLightbox(cert)}>
                                <div className="cert-img-wrap">
                                    <img src={cert.image} alt={cert.title} className="cert-img" />
                                    <div className="cert-overlay">
                                        <MdZoomIn className="cert-zoom-icon" />
                                    </div>
                                </div>
                                <div className="cert-info">
                                    {/* ✅ title va issuer — til qarab keladi */}
                                    <p className="cert-title">{cert.title}</p>
                                    {cert.issuer      && <p className="cert-issuer">{cert.issuer}</p>}
                                    {cert.issued_date && <p className="cert-date">{cert.issued_date}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Contact form ── */}
            <div className="detail-section-full">
                <h2 className="detail-section-title">{t("contact_send")}</h2>
                <div className="detail-contact-card">
                    {sent ? (
                        <div className="detail-success">
                            <div className="detail-success-icon">✓</div>
                            <h4>{t("contact_success_title")}</h4>
                            <p>{person.full_name} {t("contact_success_text")}</p>
                            <button
                                onClick={() => setSent(false)}
                                className="btn-back-bottom"
                                style={{ marginTop: "16px" }}
                            >
                                {t("contact_send_another")}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={sendMessage} className="detail-contact-form">
                            <div className="detail-form-group">
                                <label>{t("contact_name_label")}</label>
                                <input
                                    type="text"
                                    placeholder={t("contact_name_ph")}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="detail-form-group">
                                <label>{t("contact_phone_label")}</label>
                                <input
                                    type="tel"
                                    placeholder="+998 90 123 45 67"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="detail-form-group">
                                <label>{t("contact_tg_label")}</label>
                                <div style={{ position: "relative" }}>
                                    <span style={{
                                        position: "absolute", left: "14px", top: "50%",
                                        transform: "translateY(-50%)", color: "#6b7280",
                                        fontFamily: "monospace", zIndex: 1
                                    }}>@</span>
                                    <input
                                        type="text"
                                        placeholder="username"
                                        value={telegramUsername}
                                        onChange={(e) => setTelegramUsername(e.target.value)}
                                        style={{ paddingLeft: "28px" }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="detail-form-group">
                                <label>{t("contact_msg_label")}</label>
                                <textarea
                                    placeholder={t("contact_msg_ph")}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={5}
                                />
                            </div>
                            <button
                                type="submit"
                                className="detail-submit-btn"
                                disabled={sending}
                            >
                                {sending ? t("contact_sending") : t("contact_submit")}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            {/* ── Back button ── */}
            <div className="detail-back-bottom">
                <button className="btn-back-bottom" onClick={() => navigate(-1)}>
                    <MdArrowBack /> {t("back")}
                </button>
            </div>

            {/* ── Lightbox ── */}
            {lightbox && (
                <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
                    <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setLightbox(null)}>
                            <MdClose />
                        </button>
                        <img src={lightbox.image} alt={lightbox.title} className="lightbox-img" />
                        <div className="lightbox-meta">
                            <p className="lightbox-title">{lightbox.title}</p>
                            {lightbox.issuer      && <p className="lightbox-issuer">{lightbox.issuer}</p>}
                            {lightbox.issued_date && <p className="lightbox-date">{lightbox.issued_date}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileDetail;