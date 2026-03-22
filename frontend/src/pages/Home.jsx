import { useState, useEffect } from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { FaAlignJustify, FaCode, FaInstagram, FaTelegramPlane, FaLinkedin, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";
import AboutSection from "./AboutSection";
import { useLang } from "../i18n/useLang";

// Typing effect hook
function useTyping(words, speed = 100, pause = 1800) {
    const [text, setText]       = useState("");
    const [wordIdx, setWordIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = words[wordIdx];
        const timeout = setTimeout(() => {
            if (!deleting) {
                setText(current.slice(0, charIdx + 1));
                if (charIdx + 1 === current.length) {
                    setTimeout(() => setDeleting(true), pause);
                } else {
                    setCharIdx((c) => c + 1);
                }
            } else {
                setText(current.slice(0, charIdx - 1));
                if (charIdx - 1 === 0) {
                    setDeleting(false);
                    setWordIdx((w) => (w + 1) % words.length);
                    setCharIdx(0);
                } else {
                    setCharIdx((c) => c - 1);
                }
            }
        }, deleting ? speed / 2 : speed);
        return () => clearTimeout(timeout);
    }, [charIdx, deleting, wordIdx, words, speed, pause]);

    return text;
}

function Home() {
    const { lang, changeLang, t } = useLang();
    const [langOpen, setLangOpen] = useState(false);

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isMenuOpen, setIsMenuOpen]       = useState(false);
    const [loading, setLoading]             = useState(false);
    const [profile, setProfile]             = useState(null);
    const [projects, setProjects]           = useState([]);
    const [activeSection, setActiveSection] = useState("home");
    const [scrolled, setScrolled]           = useState(false);
    const [name, setName]       = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [telegramUsername, setTelegramUsername] = useState("");
    const [message, setMessage] = useState("");

    const sections = ["home", "about", "projects", "contact"];
    const navigate = useNavigate();

    const typedText = useTyping([
        "Django & React",
        "Backend Development",
        "REST API",
        "Full-Stack Solutions",
        "Python Experts",
        "Cyber security",
    ]);

    useEffect(() => {
        getProfile();
        getProject();
    }, [lang]); // lang o'zgarganda qayta fetch

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
            const scrollPosition = window.scrollY + 100;
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest(".lang-dropdown-wrap")) {
                setLangOpen(false);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    const getProfile = async () => {
        try {
            const res  = await api.get(`/api/dev/info/?lang=${lang}`);
            const data = res.data;
            setProfile(Array.isArray(data) ? data : data.results ?? [data]);
        } catch (err) { console.error(err); }
    };

    const getProject = async () => {
        try {
            const res  = await api.get(`/api/dev/projects/?lang=${lang}`);
            const data = res.data;
            setProjects(Array.isArray(data) ? data : data.results ?? []);
        } catch (err) { console.error(err); }
    };

    const createContact = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/group/create/", {
                name,
                phone_number: phoneNumber,
                telegram_username: telegramUsername,
                message,
            });
            if (res.status === 201 || res.status === 200) {
                setFormSubmitted(true);
                setName(""); setPhoneNumber(""); 
                setTelegramUsername(""); setMessage("");
            }
        } catch (err) {
            console.error(err);
            alert("Error sending message.");
        } finally {
            setLoading(false);
        }
    };

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
    };

    return (
        <div className="portfolio-container">

            {/* ══════════ NAVBAR ══════════ */}
            <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
                <div className="nav-inner">
                    <div className="nav-content">

                        {/* Logo */}
                        <div className="logo" onClick={() => scrollToSection("home")}>
                            <span className="logo-bracket">&lt;</span>
                            CYBERNEX
                            <span className="logo-bracket">/&gt;</span>
                        </div>

                        {/* Mobile toggle */}
                        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <FaTimes /> : <FaAlignJustify />}
                        </button>

                        {/* Menu */}
                        <div className={`nav-menu ${isMenuOpen ? "mobile-open" : ""}`}>

                            {/* Nav buttons */}
                            {sections.map((section, i) => (
                                <button
                                    key={section}
                                    onClick={() => scrollToSection(section)}
                                    className={`nav-button ${activeSection === section ? "nav-active" : ""}`}
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    <span className="nav-num">0{i + 1}.</span>
                                    {t(`nav_${section}`)}
                                </button>
                            ))}

                            {/* GitHub */}
                            <a
                                href="https://github.com/cybernexteamuz-prog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-github-btn"
                            >
                                GitHub
                            </a>

                            {/* Til tanlash */}
                            <div className="lang-dropdown-wrap">
                                <button
                                    className="lang-dropdown-btn"
                                    onClick={() => setLangOpen(!langOpen)}
                                >
                                    <span className="lang-flag">
                                        {lang === "uz" ? "🇺🇿" : lang === "ru" ? "🇷🇺" : "🇬🇧"}
                                    </span>
                                    <span className="lang-current">{lang.toUpperCase()}</span>
                                    <span className={`lang-arrow ${langOpen ? "open" : ""}`}>▾</span>
                                </button>

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
                    </div>
                </div>
                <div className="nav-glow-line" />
            </nav>

            <div>
                {/* ══════════ HERO ══════════ */}
                <section id="home" className="section hero">

                    <div className="hero-overlay" />

                    <div className="hero-particles" aria-hidden="true">
                        {Array.from({ length: 20 }, (_, i) => (
                            <div key={i} className="hero-particle" style={{
                                left:             `${(i * 23 + 5)  % 100}%`,
                                top:              `${(i * 37 + 10) % 100}%`,
                                width:            `${(i % 3) + 2}px`,
                                height:           `${(i % 3) + 2}px`,
                                animationDelay:   `${(i * 0.4) % 4}s`,
                                animationDuration:`${3 + (i % 4)}s`,
                            }} />
                        ))}
                    </div>

                    <div className="hero-content">

                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            {t("hero_badge")}
                        </div>

                        <h1 className="hero-title">
                            <span className="hero-title-line1">CYBER</span>
                            <span className="hero-title-line2">NEX</span>
                        </h1>

                        <div className="hero-subtitle-wrap">
                            <span className="hero-subtitle-prefix">// </span>
                            <span className="hero-typing">{typedText}</span>
                            <span className="hero-cursor">|</span>
                        </div>

                        <p className="hero-description">{t("hero_description")}</p>

                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="hero-stat-num">3+</span>
                                <span className="hero-stat-lbl">{t("hero_exp")}</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-num">20+</span>
                                <span className="hero-stat-lbl">{t("hero_projects")}</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-num">5+</span>
                                <span className="hero-stat-lbl">{t("hero_devs")}</span>
                            </div>
                        </div>

                        <div className="hero-buttons">
                            <a href="mailto:cybernexteamuz@gmail.com" className="btn-hero-primary">
                                <MdEmail />
                                {t("hero_get_touch")}
                            </a>
                            <button onClick={() => scrollToSection("projects")} className="btn-hero-secondary">
                                <FaCode />
                                {t("hero_view_proj")}
                            </button>
                        </div>

                        <div className="hero-scroll">
                            <div className="hero-scroll-mouse">
                                <div className="hero-scroll-wheel" />
                            </div>
                            <span>{t("hero_scroll")}</span>
                        </div>
                    </div>
                </section>

                {/* ══════════ ABOUT ══════════ */}
                <AboutSection profile={profile} navigate={navigate} t={t} />

                {/* ══════════ PROJECTS ══════════ */}
                <section id="projects" className="section projects-section">

                    <div className="projects-bg" aria-hidden="true">
                        <div className="projects-bg-blob projects-bg-blob-1" />
                        <div className="projects-bg-blob projects-bg-blob-2" />
                    </div>

                    <div className="section-container" style={{ position: "relative", zIndex: 1 }}>

                        <div className="section-header">
                            <p className="section-tag">{t("projects_tag")}</p>
                            <h2 className="section-heading">{t("projects_title")}</h2>
                            <div className="section-heading-line" />
                        </div>

                        {projects.length > 0 ? (
                            <div className="projects-grid">
                                {projects.map((project, idx) => (
                                    <div
                                        key={project.id}
                                        className="project-card"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <div className="project-card-accent" />
                                        <div className="project-content">
                                            <span className="project-num">0{idx + 1}</span>
                                            <h3 className="project-title">
                                                {project.title || t("projects_empty")}
                                            </h3>
                                            <p className="project-description">
                                                {project.description || ""}
                                            </p>
                                            {project.technologies?.length > 0 && (
                                                <div className="project-tags">
                                                    {project.technologies.map((tech, i) => (
                                                        <span key={i} className="project-tag">{tech.trim()}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="projects-empty">
                                <div className="projects-empty-icon">{"{ }"}</div>
                                <h3>{t("projects_empty")}</h3>
                                <p>{t("projects_soon")}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ══════════ CONTACT ══════════ */}
                <section id="contact" className="section contact-section">

                    <div className="contact-bg" aria-hidden="true">
                        <div className="contact-bg-blob contact-bg-blob-1" />
                        <div className="contact-bg-blob contact-bg-blob-2" />
                        <div className="contact-grid-lines" />
                    </div>

                    <div className="section-container contact-wrap">

                        {/* Chap */}
                        <div className="contact-left">
                            <div className="section-header" style={{ textAlign: "left" }}>
                                <p className="section-tag">{t("contact_tag")}</p>
                                <h2 className="section-heading" style={{ textAlign: "left" }}>
                                    {t("contact_title")}<br />
                                    <span className="contact-heading-accent">{t("contact_title_accent")}</span>
                                </h2>
                                <div className="section-heading-line" style={{ margin: "16px 0 28px" }} />
                            </div>

                            <p className="contact-subtitle">{t("contact_subtitle")}</p>

                            <div className="contact-info-list">
                                <a href="mailto:cybernexteamuz@gmail.com" className="contact-info-item">
                                    <div className="contact-info-icon email-icon"><MdEmail /></div>
                                    <div>
                                        <span className="contact-info-label">{t("contact_email")}</span>
                                        <span className="contact-info-value">cybernexteamuz@gmail.com</span>
                                    </div>
                                </a>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon phone-icon"><MdPhone /></div>
                                    <div>
                                        <span className="contact-info-label">{t("contact_phone")}</span>
                                        <span className="contact-info-value">+998 (99) 888-08-81</span>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon loc-icon"><MdLocationOn /></div>
                                    <div>
                                        <span className="contact-info-label">{t("contact_location")}</span>
                                        <span className="contact-info-value">Tashkent, Uzbekistan</span>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-social">
                                <p className="contact-social-label">{t("contact_connect")}</p>
                                <div className="contact-social-btns">
                                    <a href="https://t.me/cybernex_uz" target="_blank" rel="noopener noreferrer" className="contact-social-btn tg-btn">
                                        <FaTelegramPlane /><span>Telegram</span>
                                    </a>
                                    <a href="https://www.instagram.com/cybernex.official?igsh=MXM3NnV2ZGxkajF5Mg==" target="_blank" rel="noopener noreferrer" className="contact-social-btn ig-btn">
                                        <FaInstagram /><span>Instagram</span>
                                    </a>
                                    <a href="https://www.linkedin.com/in/sardorbek-ergashev-417438330/" target="_blank" rel="noopener noreferrer" className="contact-social-btn li-btn">
                                        <FaLinkedin /><span>LinkedIn</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* O'ng — forma */}
                        <div className="contact-right">
                            <div className="contact-form-card">

                                <div className="contact-form-header">
                                    <h3>{t("contact_send")}</h3>
                                    <p>{t("contact_reply")}</p>
                                </div>

                                {formSubmitted ? (
                                    <div className="contact-success">
                                        <div className="contact-success-ring"><span>✓</span></div>
                                        <h4>{t("contact_success_title")}</h4>
                                        <p>{t("contact_success_text")}</p>
                                        <button className="contact-success-btn" onClick={() => setFormSubmitted(false)}>
                                            {t("contact_send_another")}
                                        </button>
                                    </div>
                                ) : (
                                <form onSubmit={createContact} className="contact-form">
                                    <div className="cf-group">
                                        <label>{t("contact_name_label")}</label>
                                        <input
                                            type="text"
                                            placeholder={t("contact_name_ph")}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="cf-group">
                                        <label>{t("contact_phone_label")}</label>
                                        <input
                                            type="tel"
                                            placeholder="+998 90 123 45 67"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="cf-group">
                                        <label>{t("contact_tg_label")}</label>
                                        <div style={{ position: "relative" }}>
                                            <span style={{
                                                position: "absolute", left: "14px", top: "50%",
                                                transform: "translateY(-50%)", color: "#6b7280",
                                                fontFamily: "monospace"
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
                                    <div className="cf-group">
                                        <label>{t("contact_msg_label")}</label>
                                        <textarea
                                            placeholder={t("contact_msg_ph")}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                            rows={5}
                                        />
                                    </div>
                                    <button type="submit" className="cf-submit" disabled={loading}>
                                        {loading ? (
                                            <><span className="cf-spinner" /> {t("contact_sending")}</>
                                        ) : (
                                            <>{t("contact_submit")} <span>→</span></>
                                        )}
                                    </button>
                                </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;