// components/AboutSection.jsx
import { useState } from "react";
import { FaInstagram, FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import "../styles/AboutSection.css";

export default function AboutSection({ profile, navigate, t }) {
  const sorted = [...(profile || [])].sort((a, b) => a.id - b.id);
  if (!sorted.length) return null;

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Sarlavha */}
        <div className="about-header">
          <p className="about-tag">// jamoa</p>
          <h2 className="about-heading">
            Bizning jamoa bilan <span className="about-heading-accent">tanishing</span>
          </h2>
          <div className="about-heading-line" />
        </div>

        {/* Grid — 4 ta ustun */}
        <div className="about-grid">
          {sorted.map((person) => (
            <PersonCard key={person.id} person={person} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonCard({ person, navigate }) {
  return (
    <div className="about-card" onClick={() => navigate(`/profile/${person.id}`)}>
      {/* Rasm */}
      <div className="about-card__img-wrap">
        {person.avatar
          ? <img src={person.avatar} alt={person.full_name} className="about-card__img" />
          : <div className="about-card__img-ph">{person.full_name?.charAt(0)?.toUpperCase() || "?"}</div>
        }
        {/* Hover overlay — 2-rasmdagi kabi */}
        <div className="about-card__overlay">
          <div className="about-card__overlay-socials">
            {person.instagram && (
              <a href={person.instagram} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()} className="about-ov-btn ig">
                <FaInstagram />
              </a>
            )}
            {person.telegram && (
              <a href={person.telegram} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()} className="about-ov-btn tg">
                <FaTelegramPlane />
              </a>
            )}
            {person.linkedin && (
              <a href={person.linkedin} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()} className="about-ov-btn li">
                <FaLinkedin />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="about-card__info">
        <h3 className="about-card__name">{person.full_name}</h3>
        <p className="about-card__role">{person.stack}</p>

        {/* Tagdagi social ikonkalar */}
        <div className="about-card__socials">
          {person.instagram && (
            <a href={person.instagram} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()} className="about-social ig">
              <FaInstagram />
            </a>
          )}
          {person.telegram && (
            <a href={person.telegram} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()} className="about-social tg">
              <FaTelegramPlane />
            </a>
          )}
          {person.linkedin && (
            <a href={person.linkedin} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()} className="about-social li">
              <FaLinkedin />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}