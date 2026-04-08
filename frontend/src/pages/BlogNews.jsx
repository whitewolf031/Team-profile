// pages/BlogNews.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaAlignJustify, FaTimes, FaInstagram,
  FaTelegramPlane, FaLinkedin, FaUser, FaPlay
} from "react-icons/fa";
import { FiClock, FiSearch, FiX } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import api from "../api";
import { useLang } from "../i18n/useLang";
import "../styles/Home.css";
import "../styles/BlogNews.css";

/* ── Constants ─────────────────────────── */
const LANGS = [
  { code: "uz", flag: "🇺🇿", label: "O'zbek" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
  { code: "en", flag: "🇬🇧", label: "English" },
];

const CATEGORIES = [
  { key: "all",                label: { uz: "Barchasi",        ru: "Все",               en: "All"           } },
  { key: "cybersecurity-news", label: { uz: "Kiberhavfsizlik", ru: "Кибербезопасность", en: "Cybersecurity" } },
  { key: "it-news",            label: { uz: "IT Yangiliklar",  ru: "IT Новости",        en: "IT News"       } },
  { key: "world-news",         label: { uz: "Dunyo",          ru: "Мировые",           en: "World"         } },
];

const CAT_META = {
  "all":                { icon: "📰", color: "#94a3b8" },
  "cybersecurity-news": { icon: "🛡️", color: "#ef4444" },
  "it-news":            { icon: "💻", color: "#38bdf8" },
  "world-news":         { icon: "🌍", color: "#22c55e" },
};

function timeAgo(dateStr, lang) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return lang === "uz" ? "Hozir"         : lang === "ru" ? "Только что" : "Just now";
  if (diff < 3600)  { const m = Math.floor(diff/60);  return lang === "uz" ? `${m} daqiqa` : lang === "ru" ? `${m} мин.` : `${m}m`; }
  if (diff < 86400) { const h = Math.floor(diff/3600); return lang === "uz" ? `${h} soat`  : lang === "ru" ? `${h} ч.`   : `${h}h`; }
  const d = Math.floor(diff/86400);
  return lang === "uz" ? `${d} kun` : lang === "ru" ? `${d} дн.` : `${d}d`;
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function BlogNews() {
  const { lang, changeLang } = useLang();
  const navigate = useNavigate();

  const [news,           setNews]           = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search,         setSearch]         = useState("");
  const [isMenuOpen,     setIsMenuOpen]     = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [langOpen,       setLangOpen]       = useState(false);
  const [authors,        setAuthors]        = useState({});

  /* Fetch authors */
  const fetchAuthors = useCallback(async (list, language) => {
    const ids = [...new Set(list.map(n => n.author).filter(Boolean))];
    if (!ids.length) return;
    try {
      const res  = await api.get(`/api/dev/info/?lang=${language}`);
      const devs = Array.isArray(res.data) ? res.data : res.data.results ?? [res.data];
      const map  = {};
      ids.forEach(id => {
        const found = devs.find(d => d.id === id);
        map[id] = found?.full_name ?? found?.name ?? `#${id}`;
      });
      setAuthors(prev => ({ ...prev, ...map }));
    } catch {}
  }, []);

  /* Fetch news */
  const fetchNews = useCallback(async (category, language) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ lang: language });
      if (category !== "all") params.append("news_type", category);
      const res  = await api.get(`/api/news/?${params}`);
      const list = Array.isArray(res.data) ? res.data : res.data.results ?? [];
      setNews(list);
      fetchAuthors(list, language);
    } catch { setNews([]); }
    finally  { setLoading(false); }
  }, [fetchAuthors]);

  useEffect(() => { fetchNews(activeCategory, lang); }, [activeCategory, lang, fetchNews]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = e => { if (!e.target.closest(".lang-dropdown-wrap")) setLangOpen(false); };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  const filtered = news.filter(n =>
    !search ||
    (n.title   || "").toLowerCase().includes(search.toLowerCase()) ||
    (n.content || "").toLowerCase().includes(search.toLowerCase())
  );

  const catLabel = c => c.label[lang] || c.label.en;

  /* ══ NAV sections ══ */
  const NAV_SECTIONS = [
    { label: { uz: "Bosh sahifa",   ru: "Главная",  en: "Home"     }, id: "home"     },
    { label: { uz: "Biz haqimizda", ru: "О нас",    en: "About"    }, id: "about"    },
    { label: { uz: "Loyihalar",     ru: "Проекты",  en: "Projects" }, id: "projects" },
    { label: { uz: "Bog'lanish",    ru: "Контакты", en: "Contact"  }, id: "contact"  },
  ];

  return (
    <div className="portfolio-container blog-page">

      {/* ══ NAVBAR — Home page bilan bir xil ══ */}
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-content">
            <div className="logo" onClick={() => navigate("/")}>
              <span className="logo-bracket">&lt;</span>CYBERNEX<span className="logo-bracket">/&gt;</span>
            </div>

            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FaTimes /> : <FaAlignJustify />}
            </button>

            <div className={`nav-menu ${isMenuOpen ? "mobile-open" : ""}`}>
              {NAV_SECTIONS.map((s, i) => (
                <button key={s.id} className="nav-button"
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }), 150);
                    setIsMenuOpen(false);
                  }}>
                  <span className="nav-num">0{i + 1}.</span>
                  {s.label[lang] || s.label.en}
                </button>
              ))}

              <button className="nav-button nav-active" style={{ animationDelay: "0.32s" }}>
                <span className="nav-num">05.</span>Blog
              </button>

              <div className="lang-dropdown-wrap">
                <button className="lang-dropdown-btn" onClick={() => setLangOpen(!langOpen)}>
                  <span className="lang-flag">{lang === "uz" ? "🇺🇿" : lang === "ru" ? "🇷🇺" : "🇬🇧"}</span>
                  <span className="lang-current">{lang.toUpperCase()}</span>
                  <span className={`lang-arrow ${langOpen ? "open" : ""}`}>▾</span>
                </button>
                {langOpen && (
                  <div className="lang-dropdown-menu">
                    {LANGS.map(l => (
                      <button key={l.code}
                        className={`lang-dropdown-item ${lang === l.code ? "active" : ""}`}
                        onClick={() => { changeLang(l.code); setLangOpen(false); }}>
                        <span>{l.flag}</span><span>{l.label}</span>
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

      {/* ══ HERO ══ */}
      <div className="blog-hero">
        <div className="blog-hero__overlay" />
        <div className="blog-hero__particles" aria-hidden>
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="blog-hero__particle" style={{
              left: `${(i*23+5)%100}%`, top: `${(i*37+10)%100}%`,
              width: `${(i%3)+2}px`, height: `${(i%3)+2}px`,
              animationDelay: `${(i*.4)%4}s`, animationDuration: `${3+(i%4)}s`,
            }} />
          ))}
        </div>
        <div className="blog-hero__content">
          <div className="blog-hero__badge">
            <span className="blog-hero__dot" />
            {lang === "uz" ? "Yangiliklar" : lang === "ru" ? "Новости" : "Latest News"}
          </div>
          <h1 className="blog-hero__title">
            Blog <span className="blog-accent">&amp;</span> News
          </h1>
          <p className="blog-hero__sub">
            {lang === "uz" ? "Kiberhavfsizlik, IT va dunyo yangiliklari"
           : lang === "ru" ? "Новости кибербезопасности, IT и мира"
           :                 "Cybersecurity, IT and world news"}
          </p>
        </div>
      </div>

      {/* ══ FILTER ══ */}
      <div className="blog-filter-wrap">
        <div className="blog-filter">
          <div className="blog-filter__cats">
            {CATEGORIES.map(cat => (
              <button key={cat.key}
                className={`blog-cat ${activeCategory === cat.key ? "blog-cat--active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}>
                <span>{CAT_META[cat.key]?.icon}</span>
                <span>{catLabel(cat)}</span>
              </button>
            ))}
          </div>
          <div className="blog-search">
            <FiSearch className="blog-search__icon" />
            <input className="blog-search__input"
              placeholder={lang === "uz" ? "Qidirish..." : lang === "ru" ? "Поиск..." : "Search..."}
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button className="blog-search__clear" onClick={() => setSearch("")}>
                <FiX size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="blog-content">
        {!loading && (
          <p className="blog-count">
            {filtered.length} {lang === "uz" ? "ta maqola" : lang === "ru" ? "статей" : "articles"}
          </p>
        )}

        {loading ? (
          <div className="blog-feed">
            {[...Array(4)].map((_, i) => <SkeletonArticle key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState search={search} lang={lang} />
        ) : (
          <div className="blog-feed">
            {filtered.map((item, idx) => (
              <ArticleItem
                key={item.id ?? idx}
                item={item}
                lang={lang}
                authorName={authors[item.author]}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══ FOOTER ══ */}
      <footer className="blog-footer">
        <div className="blog-footer__inner">
          <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <span className="logo-bracket">&lt;</span>CYBERNEX<span className="logo-bracket">/&gt;</span>
          </div>
          <div className="blog-footer__social">
            {[
              { href: "https://t.me/cybernex_uz",                                  icon: <FaTelegramPlane /> },
              { href: "https://www.instagram.com/cybernex.official",               icon: <FaInstagram />    },
              { href: "https://www.linkedin.com/in/sardorbek-ergashev-417438330/", icon: <FaLinkedin />     },
              { href: "mailto:cybernexteamuz@gmail.com",                           icon: <MdEmail />        },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="blog-footer__social-btn">
                {s.icon}
              </a>
            ))}
          </div>
          <p className="blog-footer__copy">© {new Date().getFullYear()} CyberNex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ── Article Item — medium.com uslubida ─ */
function ArticleItem({ item, lang, authorName }) {
  const hasMedia = !!(item.image || item.video);
  const meta     = CAT_META[item.news_type] || CAT_META["all"];

  return (
    <article className="blog-article">
      {/* Media: rasm yoki video — katta, toʻla kenlikda */}
      {hasMedia && (
        <div className="blog-article__media">
          {item.video
            ? <VideoBlock src={item.video} poster={item.image} />
            : <img src={item.image} alt={item.title} className="blog-article__img" loading="lazy" />
          }
        </div>
      )}

      {/* Meta qator */}
      <div className="blog-article__meta">
        <span className="blog-article__cat" style={{ color: meta.color }}>
          {meta.icon} {item.news_type?.replace(/-/g," ") || ""}
        </span>
        {item.created_at && (
          <span className="blog-article__time">
            <FiClock size={12} /> {timeAgo(item.created_at, lang)}
          </span>
        )}
        {authorName && (
          <span className="blog-article__author">
            <FaUser size={10} /> {authorName}
          </span>
        )}
      </div>

      {/* Sarlavha */}
      <h2 className="blog-article__title">{item.title}</h2>

      {/* Matn — to'liq, 3-4-rasmdagi kabi */}
      <div className="blog-article__body">
        {(item.content || "").split("\n").map((para, i) =>
          para.trim()
            ? <p key={i}>{para}</p>
            : <br key={i} />
        )}
      </div>

      {/* Divider */}
      <div className="blog-article__divider" />
    </article>
  );
}

/* ── Video block ─────────────────────── */
function VideoBlock({ src, poster }) {
  return (
    <video
      src={src}
      poster={poster || undefined}
      controls
      className="blog-article__video"
    />
  );
}

/* ── Skeleton ────────────────────────── */
function SkeletonArticle() {
  return (
    <div className="blog-skeleton">
      <div className="blog-skeleton__img" />
      <div className="blog-skeleton__body">
        <div className="blog-skeleton__line" style={{ width: "22%" }} />
        <div className="blog-skeleton__line" style={{ width: "75%", height: 28, marginTop: 12 }} />
        <div className="blog-skeleton__line" style={{ width: "95%", marginTop: 14 }} />
        <div className="blog-skeleton__line" style={{ width: "88%", marginTop: 8 }} />
        <div className="blog-skeleton__line" style={{ width: "60%", marginTop: 8 }} />
      </div>
    </div>
  );
}

/* ── Empty ───────────────────────────── */
function EmptyState({ search, lang }) {
  return (
    <div className="blog-empty">
      <div className="blog-empty__icon">{search ? "🔍" : "📭"}</div>
      <h3>{search
        ? (lang === "uz" ? "Natija topilmadi" : lang === "ru" ? "Ничего не найдено" : "No results")
        : (lang === "uz" ? "Yangiliklar yo'q"  : lang === "ru" ? "Нет новостей"      : "No news yet")
      }</h3>
    </div>
  );
}