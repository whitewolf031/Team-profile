import { useState, useEffect } from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { FaAlignJustify, FaCode, FaInstagram, FaTelegramPlane, FaLinkedin, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";
import AboutSection from "./AboutSection";

// Typing effect hook
function useTyping(words, speed = 100, pause = 1800) {
    const [text, setText] = useState("");
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
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isMenuOpen, setIsMenuOpen]       = useState(false);
    const [loading, setLoading]             = useState(false);
    const [profile, setProfile]             = useState(null);
    const [projects, setProjects]           = useState([]);
    const [activeSection, setActiveSection] = useState("home");
    const [scrolled, setScrolled]           = useState(false);
    const [name, setName]       = useState("");
    const [email, setEmail]     = useState("");
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

    const getProfile = async () => {
        try {
            const res  = await api.get("/api/dev/info/");
            const data = res.data;
            setProfile(Array.isArray(data) ? data : [data]);
        } catch (err) { console.error(err); }
    };

    const getProject = async () => {
        try {
            const res  = await api.get("/api/dev/projects/");
            const data = res.data;
            setProjects(Array.isArray(data) ? data : data.results ?? []);
        } catch (err) { console.error(err); }
    };

    const createContact = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/group/create/", { name, email, message });
            if (res.status === 201 || res.status === 200) {
                setFormSubmitted(true);
                setName(""); setEmail(""); setMessage("");
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
                            {sections.map((section, i) => (
                                <button
                                    key={section}
                                    onClick={() => scrollToSection(section)}
                                    className={`nav-button ${activeSection === section ? "nav-active" : ""}`}
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    <span className="nav-num">0{i + 1}.</span>
                                    {section.toUpperCase()}
                                </button>
                            ))}
                            <a href="https://github.com/cybernexteamuz-prog" target="_blank" rel="noopener noreferrer" className="nav-github-btn">
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>

                {/* Navbar bottom glowing line */}
                <div className="nav-glow-line" />
            </nav>

            <div>
                {/* ══════════ HERO ══════════ */}
                <section id="home" className="section hero">

                    {/* Overlay */}
                    <div className="hero-overlay" />

                    {/* Floating particles */}
                    <div className="hero-particles" aria-hidden="true">
                        {Array.from({ length: 20 }, (_, i) => (
                            <div key={i} className="hero-particle" style={{
                                left:            `${(i * 23 + 5)  % 100}%`,
                                top:             `${(i * 37 + 10) % 100}%`,
                                width:           `${(i % 3) + 2}px`,
                                height:          `${(i % 3) + 2}px`,
                                animationDelay:  `${(i * 0.4) % 4}s`,
                                animationDuration:`${3 + (i % 4)}s`,
                            }} />
                        ))}
                    </div>

                    {/* Content */}
                    <div className="hero-content">

                        {/* Badge */}
                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            Available for projects
                        </div>

                        {/* Title */}
                        <h1 className="hero-title">
                            <span className="hero-title-line1">CYBER</span>
                            <span className="hero-title-line2">NEX</span>
                        </h1>

                        {/* Subtitle */}
                        <div className="hero-subtitle-wrap">
                            <span className="hero-subtitle-prefix">// </span>
                            <span className="hero-typing">{typedText}</span>
                            <span className="hero-cursor">|</span>
                        </div>

                        {/* Description */}
                        <p className="hero-description">
                            Texnologiya, kreativlik va jamoaviy kuch birlashgan makon.
                            Biz innovatsiya, raqamli rivoj va kelajak g'oyalarini birga yaratadigan jamoamiz.
                        </p>

                        {/* Stats */}
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="hero-stat-num">3+</span>
                                <span className="hero-stat-lbl">Yil tajriba</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-num">20+</span>
                                <span className="hero-stat-lbl">Loyihalar</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="hero-stat-num">5+</span>
                                <span className="hero-stat-lbl">Dasturchilar</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="hero-buttons">
                            <a href="mailto:cybernexteamuz@gmail.com" className="btn-hero-primary">
                                <MdEmail />
                                Get In Touch
                            </a>
                            <button onClick={() => scrollToSection("projects")} className="btn-hero-secondary">
                                <FaCode />
                                View Projects
                            </button>
                        </div>

                        {/* Scroll indicator */}
                        <div className="hero-scroll">
                            <div className="hero-scroll-mouse">
                                <div className="hero-scroll-wheel" />
                            </div>
                            <span>Scroll down</span>
                        </div>
                    </div>
                </section>

                {/* ══════════ ABOUT ══════════ */}
            <AboutSection profile={profile} navigate={navigate} />

            {/* ══════════ PROJECTS ══════════ */}
                <section id="projects" className="section projects-section">

                    {/* Orqa fon */}
                    <div className="projects-bg" aria-hidden="true">
                        <div className="projects-bg-blob projects-bg-blob-1" />
                        <div className="projects-bg-blob projects-bg-blob-2" />
                    </div>

                    <div className="section-container" style={{ position: "relative", zIndex: 1 }}>

                        {/* Section header */}
                        <div className="section-header">
                            <p className="section-tag">// my work</p>
                            <h2 className="section-heading">Projects</h2>
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
                                        {/* Card top accent */}
                                        <div className="project-card-accent" />

                                        <div className="project-content">
                                            {/* Number */}
                                            <span className="project-num">0{idx + 1}</span>

                                            <h3 className="project-title">{project.title || "Loyiha nomi"}</h3>
                                            <p className="project-description">{project.description || "Tavsif mavjud emas"}</p>

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
                                <h3>Hozircha loyihalar yuklanmagan...</h3>
                                <p>Tez orada ular shu yerda paydo bo'ladi!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ══════════ CONTACT ══════════ */}
                <section id="contact" className="section contact-section">

                    <div className="contact-bg" aria-hidden="true">
                        <div className="contact-bg-blob contact-bg-blob-1" />
                        <div className="contact-bg-blob contact-bg-blob-2" />
                        {/* Grid lines */}
                        <div className="contact-grid-lines" />
                    </div>

                    <div className="section-container contact-wrap">

                        {/* Chap */}
                        <div className="contact-left">

                            <div className="section-header" style={{ textAlign: "left" }}>
                                <p className="section-tag">// get in touch</p>
                                <h2 className="section-heading" style={{ textAlign: "left" }}>Ready to<br /><span className="contact-heading-accent">collaborate?</span></h2>
                                <div className="section-heading-line" style={{ margin: "16px 0 28px" }} />
                            </div>

                            <p className="contact-subtitle">
                                I'm always interested in discussing new opportunities, innovative projects,
                                and ways to contribute to meaningful software solutions.
                            </p>

                            {/* Info items */}
                            <div className="contact-info-list">
                                <a href="mailto:cybernexteamuz@gmail.com" className="contact-info-item">
                                    <div className="contact-info-icon email-icon">
                                        <MdEmail />
                                    </div>
                                    <div>
                                        <span className="contact-info-label">Email</span>
                                        <span className="contact-info-value">cybernexteamuz@gmail.com</span>
                                    </div>
                                </a>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon phone-icon">
                                        <MdPhone />
                                    </div>
                                    <div>
                                        <span className="contact-info-label">Phone</span>
                                        <span className="contact-info-value">+998 (99) 888-08-81</span>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon loc-icon">
                                        <MdLocationOn />
                                    </div>
                                    <div>
                                        <span className="contact-info-label">Location</span>
                                        <span className="contact-info-value">Tashkent, Uzbekistan</span>
                                    </div>
                                </div>
                            </div>

                            {/* Social */}
                            <div className="contact-social">
                                <p className="contact-social-label">// connect</p>
                                <div className="contact-social-btns">
                                    <a href="https://t.me/cybernex_uz" target="_blank" rel="noopener noreferrer" className="contact-social-btn tg-btn">
                                        <FaTelegramPlane />
                                        <span>Telegram</span>
                                    </a>
                                    <a href="https://www.instagram.com/cybernex.official?igsh=MXM3NnV2ZGxkajF5Mg==" target="_blank" rel="noopener noreferrer" className="contact-social-btn ig-btn">
                                        <FaInstagram />
                                        <span>Instagram</span>
                                    </a>
                                    <a href="https://www.linkedin.com/in/sardorbek-ergashev-417438330/" target="_blank" rel="noopener noreferrer" className="contact-social-btn li-btn">
                                        <FaLinkedin />
                                        <span>LinkedIn</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* O'ng — forma */}
                        <div className="contact-right">
                            <div className="contact-form-card">

                                <div className="contact-form-header">
                                    <h3>Send a Message</h3>
                                    <p>// javob 24 soat ichida</p>
                                </div>

                                {formSubmitted ? (
                                    <div className="contact-success">
                                        <div className="contact-success-ring">
                                            <span>✓</span>
                                        </div>
                                        <h4>Xabar yuborildi!</h4>
                                        <p>Tez orada javob beramiz.</p>
                                        <button className="contact-success-btn" onClick={() => setFormSubmitted(false)}>
                                            Yana yuborish
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={createContact} className="contact-form">
                                        <div className="cf-group">
                                            <label>Ismingiz</label>
                                            <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                        <div className="cf-group">
                                            <label>Email</label>
                                            <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="cf-group">
                                            <label>Xabar</label>
                                            <textarea placeholder="Loyiha haqida yozing..." value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} />
                                        </div>
                                        <button type="submit" className="cf-submit" disabled={loading}>
                                            {loading ? (
                                                <><span className="cf-spinner" /> Yuborilmoqda...</>
                                            ) : (
                                                <>Yuborish <span>→</span></>
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