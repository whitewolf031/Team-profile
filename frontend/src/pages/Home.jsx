import { useState, useEffect } from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md"; // Material Design icons
import { FaAlignJustify, FaCode } from "react-icons/fa";
import api from "../api";
import "../styles/Home.css";

function Home() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [experience, setExperience] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeSection, setActiveSection] = useState("home");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const sections = ["home", "about", "experience", "skills", "projects", "contact", "blog"];

    const achievementColors = ['#2563eb', '#16a34a', '#f97316'];
    const responsibilityColors = ['#a855f7', '#ef4444', '#eab308'];

    useEffect(() => {
        getProfile();
        getExperience();
        getProject();

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
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
            const res = await api.get("/api/dev/info/");
            console.log(res)
            setProfile(res.data[0]); // array ichidan birinchi object
        } catch (err) {
            console.error(err);
        }
    };

    const getExperience = async () => {
        const res = await api.get("/api/dev/experience/");
        console.log(res)
        setExperience(res.data);
    };

    const getProject = async () => {
        const res = await api.get("/api/dev/projects/");
        console.log(res)
        setProjects(res.data);
    };

    const createContact = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/contact/create/", {
            name,
            email,
            message,
            });

            if (res.status === 201 || res.status === 200) {
            setFormSubmitted(true);
            setName("");
            setEmail("");
            setMessage("");
            } else {
            alert("Failed to send message. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Error sending message. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="portfolio-container">
        {/* ===== NAVBAR ===== */}
        <nav className="navbar">
            <div className="nav-inner">
                <div className="nav-content">
                    {/* Logo */}
                    <div className="logo">
                        <a
                            href="#home"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("home");
                            }}
                        >
                            Sardorbek Ergashev
                        </a>
                    </div>
                    <button 
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <FaAlignJustify />
                    </button>
                    {/* Desktop Menu */}
                    <div className={`nav-menu ${isMenuOpen ? "mobile-open" : ""}`}>
                        {sections.map((section) => (
                            <button
                                key={section}
                                onClick={() => scrollToSection(section)}
                                className={`nav-button ${
                                    activeSection === section ? "nav-active" : ""
                                }`}
                            >
                                {section.toUpperCase()}
                            </button>
                            
                        ))}
                    </div>
                </div>
            </div>
        </nav>
        {/* ===== MAIN CONTENT ===== */}
        <div>
            {/* HOME */}
            <section id="home" className="section hero">
                <div className="hero-content">
                    <h1 className="hero-title" style={{ fontSize: "70px" }}>
                        <b>Sardorbek Ergashev</b>
                    </h1>
                    <h2 className="hero-subtitle">
                        Full-Stack Software Engineer
                    </h2>
                    <p className="hero-description">
                        Passionate developer with expertise in Python, Django, and Laravel.
                        Building scalable APIs, Telegram bots, and impactful web applications.
                    </p>
                    <div className="box-button">
                        <a
                            href="mailto:contact@example.com"
                            className="btn-primary-custom"
                        >
                            <MdEmail className="btn-icon" />
                            Get In Touch
                        </a>
                        <button
                            onClick={() => scrollToSection('projects')}
                            className="btn-secondary-custom"
                        >
                            <FaCode className="btn-icon" />
                            View Projects
                        </button>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="section section-dark">
                {profile && (
                    <div className="section-container grid-2">
                        {/* LEFT SIDE */}
                        <div>
                            <h2>About Me</h2>
                            <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
                                {profile.about}
                            </p>
                            <p className="info-row">
                                <MdLocationOn className="info-icon location" />
                                Tashkent, Uzbekistan
                            </p>
                            <p className="info-row">
                                <MdPhone className="info-icon phone" />
                                {profile.phone}
                            </p>
                            <p className="info-row">
                                <MdEmail className="info-icon email" />
                                {profile.email}
                            </p>
                        </div>
                        {/* RIGHT SIDE */}
                        <div className="card">
                            <h3 style={{ textAlign: "center", marginBottom: "24px" }}>
                                Quick Facts
                            </h3>
                            <div style={{ display: "grid", gap: "16px" }}>
                                <div className="flex-between card1">
                                    <span className="card-text">Experience </span>
                                    <span style={{ color: "#3b82f6" }}>
                                        {profile.experience}+ Years
                                    </span>
                                </div>
                                <div className="flex-between card1">
                                    <span className="card-text">Stack Level </span>
                                    <span style={{ color: "#4ade80" }}>
                                        {profile.stack}
                                    </span>
                                </div>
                                <div className="flex-between card1">
                                    <span className="card-text">Specialization </span>
                                    <span style={{ color: "#a855f7" }}>
                                        Full-Stack
                                    </span>
                                </div>
                                <div className="flex-between card1">
                                    <span className="card-text">Projects Completed </span>
                                    <span style={{ color: "#008104" }}>
                                        10+
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="section">
                <div className="section-container">
                    <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
                    Experience
                    </h2>

                    {experience.length > 0 ? (
                    <div className="experiences-grid">
                        {experience.map((exp) => (
                        <div key={exp.id} className="experience-card">
                            {/* Header */}
                            <div className="experience-header">
                            <div>
                                <h3 className="experience-title">{exp.title}</h3>
                                <p className="experience-company">{exp.company}</p>
                            </div>
                            <p className="experience-location">📍 {exp.location}</p>
                            </div>

                            <div className="experience-meta">
                            <span>
                                ⏳ {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                            </span>
                            <span>{exp.employment_type}</span>
                            </div>

                            {/* Details */}
                            <div className="experience-details">
                            <div className="achievements-column">
                                <h4>Key Achievements</h4>
                                {exp.achievements?.split("\n").filter(Boolean).map((item, index) => (
                                <div key={index} className="achievement-item">
                                    <span className="bullet" style={{ color: achievementColors[index % 3] }}>
                                    ●
                                    </span>
                                    <span>{item}</span>
                                </div>
                                ))}
                            </div>

                            <div className="responsibilities-column">
                                <h4>Responsibilities</h4>
                                {exp.responsibilities?.split("\n").filter(Boolean).map((item, index) => (
                                <div key={index} className="responsibility-item">
                                    <span className="bullet" style={{ color: responsibilityColors[index % 3] }}>
                                    ●
                                    </span>
                                    <span>{item}</span>
                                </div>
                                ))}
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="empty-experience">
                        <div className="empty-card">
                        <div className="empty-icon">🚀</div>
                        <h3>Building the future, one line of code at a time</h3>
                        <p>
                            I'm actively working on exciting projects and gaining hands-on experience 
                            in full-stack development. Check back soon — new adventures are being written!
                        </p>
                        <p className="subtitle">
                            Currently crafting scalable solutions with Django, PostgreSQL, React & more...
                        </p>
                        </div>
                    </div>
                    )}
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="section section-dark">
                <div className="section-container">
                    <h2 style={{ textAlign: "center", marginBottom: "50px", fontSize: "2.5rem" }}>
                    Skills
                    </h2>

                    <div className="skills-grid">
                    {/* 1. Languages */}
                    <div className="skill-category-card">
                        <div className="category-header">
                        <span className="category-icon">{"< />"}</span>
                        <h3>Languages</h3>
                        </div>
                        <div className="skill-list">
                        <div className="skill-item">
                            <span className="skill-name">Python</span>
                            <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress python" style={{ width: "95%" }}></div>
                            </div>
                            </div>
                        </div>
                        <div className="skill-item">
                            <span className="skill-name">PHP</span>
                            <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress php" style={{ width: "70%" }}></div>
                            </div>
                            </div>
                        </div>
                        <div className="skill-item">
                            <span className="skill-name">JavaScript</span>
                            <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress javascript" style={{ width: "65%" }}></div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* 2. Frameworks */}
                    <div className="skill-category-card">
                        <div className="category-header">
                        <span className="category-icon">{"{ }"}</span>
                        <h3>Frameworks</h3>
                        </div>
                        <div className="skill-list">
                        <div className="skill-item">
                            <span className="skill-name">Django</span>
                            <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress django" style={{ width: "92%" }}></div>
                            </div>
                            </div>
                        </div>
                        <div className="skill-item">
                            <span className="skill-name">Laravel</span>
                            <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress laravel" style={{ width: "68%" }}></div>
                            </div>
                            </div>
                        </div>
                        <div className="skill-item">
                            <span className="skill-name">FastAPI</span>
                            <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress fastapi" style={{ width: "80%" }}></div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* 3. Databases */}
                    <div className="skill-category-card">
                        <div className="category-header">
                        <span className="category-icon">🗄</span>
                        <h3>Databases</h3>
                        </div>
                        <div className="skill-list">
                        <div className="skill-item">
                            <span className="skill-name">PostgreSQL</span>
                            <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress postgresql" style={{ width: "88%" }}></div>
                            </div>
                            </div>
                        </div>
                        <div className="skill-item">
                            <span className="skill-name">MySQL</span>
                            <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress mysql" style={{ width: "65%" }}></div>
                            </div>
                            </div>
                        </div>
                        <div className="skill-item">
                            <span className="skill-name">SQLite</span>
                            <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress sqlite" style={{ width: "78%" }}></div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* 4. Tools */}
                    <div className="skill-category-card">
                        <div className="category-header">
                        <span className="category-icon">🛠</span>
                        <h3>Tools</h3>
                        </div>
                        <div className="skill-list tools-list">
                        <div className="tool-item">Docker</div>
                        <div className="tool-item">Git & GitHub</div>
                        <div className="tool-item">Linux</div>
                        <div className="tool-item">REST APIs</div>
                        <div className="tool-item">Telegram Bot API</div>
                        <div className="tool-item">Agile & Scrum</div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>

            {/* PROJECTS */}
            <section id="projects" className="section">
                <div className="section-container">
                    <h2 style={{ textAlign: "center", marginBottom: "50px", fontSize: "2.5rem" }}>
                    Projects
                    </h2>

                    {projects.length > 0 ? (
                    <div className="projects-grid">
                        {projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <div className="project-content">
                            <h3 className="project-title">
                                {project.title || "Loyiha nomi kiritilmagan"}
                            </h3>

                            <p className="project-description">
                                {project.description || "Tavsif mavjud emas"}
                            </p>

                            {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                                <div className="project-tags">
                                {project.technologies.map((tech, idx) => (
                                    <span key={idx} className="project-tag">
                                    {tech.trim()}
                                    </span>
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
                                <span className="link-icon">↗</span>
                                View Project
                                </a>
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="empty-projects">
                        <div className="empty-project-card">
                        <div className="empty-icon">🛠️</div>
                        <h3>Hozircha loyihalar yuklanmagan...</h3>
                        <p>
                            Men bir nechta qiziqarli loyihalar ustida ishlayapman.<br />
                            Tez orada ular shu yerda paydo bo'ladi — kuzatib boring!
                        </p>
                        <p className="subtitle">
                            Django, Telegram botlari, REST API va boshqa zamonaviy texnologiyalar bilan ishlayapman...
                        </p>
                        </div>
                    </div>
                    )}
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="section section-dark">
                <div className="section-container contact-grid">
                    {/* Chap taraf — ma'lumotlar va taklif */}
                    <div className="contact-left">
                    <h2>Ready to collaborate?</h2>
                    <p className="contact-subtitle">
                        I'm always interested in discussing new opportunities, innovative projects, 
                        and ways to contribute to meaningful software solutions. 
                        Feel free to reach out!
                    </p>

                    <div className="contact-info">
                        <div className="info-item">
                        <MdEmail className="info-icon email" />
                        <div>
                            <strong>Email</strong>
                            <a href="mailto:contact@sardorbek.dev">contact@sardorbek.dev</a>
                        </div>
                        </div>

                        <div className="info-item">
                        <MdPhone className="info-icon phone" />
                        <div>
                            <strong>Phone</strong>
                            <div>
                                <strong style={{color: "blue"}}>+998 (93) 110-79-13</strong>
                            </div>
                        </div>
                        </div>

                        <div className="info-item">
                        <MdLocationOn className="info-icon location" />
                        <div>
                            <strong>Location</strong>
                            <span>Tashkent, Uzbekistan</span>
                        </div>
                        </div>
                    </div>

                    <div className="social-connect">
                        <h4>Connect on Social Media</h4>
                        <div className="social-buttons">
                        <a
                            href="https://github.com/whitewolf031" // o'zingizning haqiqiy linkingizni qo'ying
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn github"
                        >
                            <i className="fab fa-github"></i> GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/sardorbek-ergashev-417438330/" // o'zingizning LinkedIn linkingizni qo'ying
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn linkedin"
                        >
                            <i className="fab fa-linkedin-in"></i> LinkedIn
                        </a>
                        </div>
                    </div>
                    </div>

                    {/* O'ng taraf — forma */}
                    <div className="contact-right">
                    <div className="contact-form-card">
                        <h3>Send a Message</h3>

                        {formSubmitted ? (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h4>Message Sent Successfully!</h4>
                            <p>Thank you! I'll get back to you as soon as possible.</p>
                            <button 
                            className="btn-new-message"
                            onClick={() => {
                                setFormSubmitted(false);
                                setName("");
                                setEmail("");
                                setMessage("");
                            }}
                            >
                            Send Another Message
                            </button>
                        </div>
                        ) : (
                        <form onSubmit={createContact} className="contact-form">
                            <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            </div>

                            <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            </div>

                            <div className="form-group">
                            <label>Message</label>
                            <textarea
                                placeholder="How can I help you today?"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={5}
                            />
                            </div>

                            <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
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