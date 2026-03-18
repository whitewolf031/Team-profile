import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdLocationOn, MdEmail, MdPhone, MdArrowBack, MdClose, MdZoomIn } from "react-icons/md";
import api from "../api";
import "../styles/Profile.css";
import { useLang } from "../i18n/useLang";

function ProfileDetail() {
    const { id }       = useParams();
    const navigate     = useNavigate();
    const { lang, changeLang, t } = useLang();

    const [person,  setPerson]  = useState(null);
    const [lightbox, setLightbox] = useState(null);
    const [name,    setName]    = useState("");
    const [email,   setEmail]   = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent,    setSent]    = useState(false);

    const achievementColors    = ['#2563eb', '#16a34a', '#f97316'];
    const responsibilityColors = ['#a855f7', '#ef4444', '#eab308'];

    // lang o'zgarganda qayta fetch
    useEffect(() => {
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
            await api.post("/contact/create/", { dev_id: person.id, name, email, message });
            setSent(true);
            setName(""); setEmail(""); setMessage("");
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

            {/* ===== LANG SWITCHER ===== */}
            <div className="profile-lang-bar">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <MdArrowBack /> {t("back") || "Back"}
                </button>
                <div className="lang-switcher">
                    {["uz", "ru", "en"].map((l) => (
                        <button
                            key={l}
                            className={`lang-btn ${lang === l ? "lang-active" : ""}`}
                            onClick={() => changeLang(l)}
                        >
                            {l.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== HERO ===== */}
            <div className="detail-hero">
                <div className="detail-left">
                    {person.avatar ? (
                        <img src={person.avatar} alt={person.full_name} className="detail-avatar-img" />
                    ) : (
                        <div className="detail-avatar-placeholder">
                            {(person.full_name || "U")[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="detail-right">
                    <h1 className="detail-name">{person.full_name}</h1>
                    <p className="detail-role">{person.stack}</p>
                    <p className="detail-about-text">{person.about}</p>
                    <div className="detail-info-list">
                        <div className="detail-info-item">
                            <MdLocationOn className="detail-icon location" />
                            <span>Tashkent, Uzbekistan</span>
                        </div>
                        <div className="detail-info-item">
                            <MdPhone className="detail-icon phone" />
                            <span>{person.phone}</span>
                        </div>
                        <div className="detail-info-item">
                            <MdEmail className="detail-icon email" />
                            <span>{person.email}</span>
                        </div>
                    </div>
                    <div className="detail-stats">
                        <div className="stat-box">
                            <span className="stat-value" style={{ color: "#3b82f6" }}>{person.experience}+</span>
                            <span className="stat-label">{t("hero_exp")}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value" style={{ color: "#4ade80" }}>{person.projects?.length || 0}</span>
                            <span className="stat-label">{t("hero_projects")}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value" style={{ color: "#fbbf24" }}>{person.certificates?.length || 0}</span>
                            <span className="stat-label">Certificates</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-value" style={{ color: "#a855f7" }}>{person.experiences?.length || 0}</span>
                            <span className="stat-label">Experience</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== EXPERIENCE ===== */}
            {person.experiences?.length > 0 && (
                <div className="detail-section-full">
                    <h2 className="detail-section-title">Experience</h2>
                    <div className="detail-exp-grid">
                        {person.experiences.map((exp) => (
                            <div key={exp.id} className="detail-exp-card">
                                <div className="detail-exp-header">
                                    <div>
                                        <h3>{exp.title}</h3>
                                        <p className="exp-company">{exp.company}</p>
                                    </div>
                                    <span className="exp-location">📍 {exp.location}</span>
                                </div>
                                <div className="exp-meta">
                                    <span>⏳ {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}</span>
                                    <span>{exp.employment_type}</span>
                                </div>
                                <div className="exp-details">
                                    {exp.achievements && (
                                        <div>
                                            <h4>Key Achievements</h4>
                                            {exp.achievements.split("\n").filter(Boolean).map((item, i) => (
                                                <div key={i} className="exp-bullet-item">
                                                    <span style={{ color: achievementColors[i % 3] }}>●</span>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {exp.responsibilities && (
                                        <div>
                                            <h4>Responsibilities</h4>
                                            {exp.responsibilities.split("\n").filter(Boolean).map((item, i) => (
                                                <div key={i} className="exp-bullet-item">
                                                    <span style={{ color: responsibilityColors[i % 3] }}>●</span>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== PROJECTS ===== */}
            {person.projects?.length > 0 && (
                <div className="detail-section-full">
                    <h2 className="detail-section-title">{t("projects_title")}</h2>
                    <div className="detail-projects-grid">
                        {person.projects.map((project) => (
                            <div key={project.id} className="detail-project-card">
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
                                    <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="project-link">
                                        <span>↗</span> View Project
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== CERTIFICATES ===== */}
            {person.certificates?.length > 0 && (
                <div className="detail-section-full">
                    <h2 className="detail-section-title">Certificates</h2>
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
                                    <p className="cert-title">{cert.title}</p>
                                    {cert.issuer      && <p className="cert-issuer">{cert.issuer}</p>}
                                    {cert.issued_date && <p className="cert-date">{cert.issued_date}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== CONTACT FORM ===== */}
            <div className="detail-section-full">
                <h2 className="detail-section-title">{t("contact_send")}</h2>
                <div className="detail-contact-card">
                    {sent ? (
                        <div className="detail-success">
                            <div className="detail-success-icon">✓</div>
                            <h4>{t("contact_success_title")}</h4>
                            <p>{person.full_name} {t("contact_success_text")}</p>
                            <button onClick={() => setSent(false)} className="btn-back-bottom" style={{ marginTop: "16px" }}>
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
                                <label>{t("contact_email_label")}</label>
                                <input
                                    type="email"
                                    placeholder={t("contact_email_ph")}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
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
                            <button type="submit" className="detail-submit-btn" disabled={sending}>
                                {sending ? t("contact_sending") : t("contact_submit")}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* ===== BACK BUTTON ===== */}
            <div className="detail-back-bottom">
                <button className="btn-back-bottom" onClick={() => navigate(-1)}>
                    <MdArrowBack /> {t("back") || "Back"}
                </button>
            </div>

            {/* ===== LIGHTBOX ===== */}
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