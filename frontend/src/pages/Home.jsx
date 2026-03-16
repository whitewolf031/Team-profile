import { useState, useEffect } from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { FaAlignJustify, FaCode, FaInstagram, FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";
import AboutSection from "./AboutSection";

function Home() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isMenuOpen, setIsMenuOpen]       = useState(false);
    const [loading, setLoading]             = useState(false);
    const [profile, setProfile]             = useState(null);
    const [projects, setProjects]           = useState([]);
    const [activeSection, setActiveSection] = useState("home");
    const [name, setName]       = useState("");
    const [email, setEmail]     = useState("");
    const [message, setMessage] = useState("");
    const sections = ["home", "about", "projects", "contact"];
    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
        getProject();

        const handleScroll = () => {
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
        if (element) element.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="portfolio-container">

            {/* ===== NAVBAR ===== */}
            <nav className="navbar">
                <div className="nav-inner">
                    <div className="nav-content">
                        <div className="logo">
                            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>
                                CYBERNEX
                            </a>
                        </div>
                        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <FaAlignJustify />
                        </button>
                        <div className={`nav-menu ${isMenuOpen ? "mobile-open" : ""}`}>
                            {sections.map((section) => (
                                <button
                                    key={section}
                                    onClick={() => scrollToSection(section)}
                                    className={`nav-button ${activeSection === section ? "nav-active" : ""}`}
                                >
                                    {section.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <div>
                {/* ===== HOME ===== */}
                <section id="home" className="section hero">
                    <div className="hero-content">
                        <h1 className="hero-title" style={{ fontSize: "70px" }}>
                            <b>CYBERNEX</b>
                        </h1>
                        <h2 className="hero-subtitle">Dasturchilar jamoasi</h2>
                        <p className="hero-description">
                            Bu texnologiya, kreativlik va jamoaviy kuch birlashgan makon.
                            Biz innovatsiya, raqamli rivoj va kelajak g'oyalarini birga yaratadigan jamoamiz.
                        </p>
                        <div className="box-button">
                            <a href="mailto:cybernexteamuz@gmail.com" className="btn-primary-custom">
                                <MdEmail className="btn-icon" /> Get In Touch
                            </a>
                            <button onClick={() => scrollToSection("projects")} className="btn-secondary-custom">
                                <FaCode className="btn-icon" /> View Projects
                            </button>
                        </div>
                    </div>
                </section>

                {/* ===== ABOUT ===== */}
                <AboutSection profile={profile} navigate={navigate} />

                {/* ===== PROJECTS ===== */}
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
                                            {project.technologies?.length > 0 && (
                                                <div className="project-tags">
                                                    {project.technologies.map((tech, idx) => (
                                                        <span key={idx} className="project-tag">{tech.trim()}</span>
                                                    ))}
                                                </div>
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
                                        Tez orada ular shu yerda paydo bo'ladi!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ===== CONTACT ===== */}
                <section id="contact" className="section section-dark">
                    <div className="section-container contact-grid">

                        {/* Chap — ma'lumotlar */}
                        <div className="contact-left">
                            <h2>Ready to collaborate?</h2>
                            <p className="contact-subtitle">
                                I'm always interested in discussing new opportunities, innovative projects,
                                and ways to contribute to meaningful software solutions. Feel free to reach out!
                            </p>

                            <div className="contact-info">
                                <div className="info-item">
                                    <MdEmail className="info-icon email" />
                                    <div>
                                        <strong>Email</strong>
                                        <a href="mailto:cybernexteamuz@gmail.com">cybernexteamuz@gmail.com</a>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <MdPhone className="info-icon phone" />
                                    <div>
                                        <strong>Phone</strong>
                                        <span style={{ color: "#60a5fa" }}>+998 (99) 888-08-81</span>
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

                            {/* ✅ Social buttons — to'g'ri JSX */}
                            <div className="social-connect">
                                <h4>Connect on Social Media</h4>
                                <div className="social-buttons">

                                    <a
                                        href="https://t.me/cybernex_uz"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-btn telegram"
                                    >
                                        <FaTelegramPlane /> Telegram
                                    </a>

                                    <a
                                        href="https://www.instagram.com/cybernex.official?igsh=MXM3NnV2ZGxkajF5Mg=="
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-btn instagram"
                                    >
                                        <FaInstagram /> Instagram
                                    </a>

                                    <a
                                        href="https://www.linkedin.com/in/sardorbek-ergashev-417438330/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-btn linkedin"
                                    >
                                        <FaLinkedin /> LinkedIn
                                    </a>

                                </div>
                            </div>
                        </div>

                        {/* O'ng — forma */}
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
                                            onClick={() => { setFormSubmitted(false); setName(""); setEmail(""); setMessage(""); }}
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={createContact} className="contact-form">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Message</label>
                                            <textarea placeholder="How can I help you today?" value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} />
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