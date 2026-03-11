import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdLocationOn, MdEmail, MdPhone, MdArrowBack } from "react-icons/md";
import api from "../api";
import "../styles/Profile.css";

function ProfileDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const achievementColors = ['#2563eb', '#16a34a', '#f97316'];
    const responsibilityColors = ['#a855f7', '#ef4444', '#eab308'];

    const sendMessage = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post("/contact/create/", {
                dev_id: person.id,   // ← ayni shu devga bog'laydi
                name,
                email,
                message,
            });
            setSent(true);
            setName(""); setEmail(""); setMessage("");
        } catch (err) {
            console.error(err);
            alert("Xabar yuborishda xato!");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/api/dev/info/${id}/`);
                setPerson(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [id]);

    if (!person) return (
        <div className="detail-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    );

    return (
    <div className="detail-container">

        {/* ===== HERO SECTION ===== */}
        <div className="detail-hero">
            {/* Chap — Rasm */}
            <div className="detail-left">
                {person.avatar ? (
                    <img
                        src={person.avatar}
                        alt={person.full_name}
                        className="detail-avatar-img"
                    />
                ) : (
                    <div className="detail-avatar-placeholder">
                        {(person.full_name || "U")[0].toUpperCase()}
                    </div>
                )}
            </div>

            {/* O'ng — Ma'lumotlar */}
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
                        <span className="stat-label">Years Exp.</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value" style={{ color: "#4ade80" }}>{person.stack}</span>
                        <span className="stat-label">Stack</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value" style={{ color: "#a855f7" }}>Full-Stack</span>
                        <span className="stat-label">Specialization</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value" style={{ color: "#10b981" }}>
                            {person.projects?.length || 0}
                        </span>
                        <span className="stat-label">Projects</span>
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
                <h2 className="detail-section-title">Projects</h2>
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
                                <a
                                    href={project.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-link"
                                >
                                    <span>↗</span> View Project
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* ===== BACK TUGMASI — eng pastda ===== */}
        <div className="detail-back-bottom">
            <button className="btn-back-bottom" onClick={() => navigate(-1)}>
                <MdArrowBack /> Back
            </button>
        </div>

        <div className="detail-section-full">
            <h2 className="detail-section-title">Send a Message</h2>
            <div className="detail-contact-card">
                {sent ? (
                    <div className="detail-success">
                        <div className="detail-success-icon">✓</div>
                        <h4>Xabar yuborildi!</h4>
                        <p>{person.full_name} tez orada javob beradi.</p>
                        <button onClick={() => setSent(false)} className="btn-back-bottom" style={{marginTop: "16px"}}>
                            Yana yuborish
                        </button>
                    </div>
                ) : (
                    <form onSubmit={sendMessage} className="detail-contact-form">
                        <div className="detail-form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="detail-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="detail-form-group">
                            <label>Message</label>
                            <textarea
                                placeholder="How can I help you today?"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={5}
                            />
                        </div>
                        <button type="submit" className="detail-submit-btn" disabled={sending}>
                            {sending ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                )}
            </div>
        </div>

    </div>
);
}

export default ProfileDetail;