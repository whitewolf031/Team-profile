npm run dev -- --port 8080


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
