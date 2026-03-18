const LANG_LABELS = { uz: "🇺🇿 UZ", ru: "🇷🇺 RU", en: "🇬🇧 EN" };

const tabCss = `
  .lt-tabs { display: flex; gap: 4px; background: #0a0e1a; border: 1px solid #1e2d45; border-radius: 8px; padding: 3px; margin-bottom: 12px; }
  .lt-tab { flex: 1; padding: 6px; border: none; border-radius: 6px; background: none; color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
  .lt-tab.active { background: #1e2d45; color: #38bdf8; font-weight: 600; }
  .lt-tab:hover:not(.active) { color: #e2e8f0; }
`;

export default function LangTabs({ lang, setLang }) {
  return (
    <>
      <style>{tabCss}</style>
      <div className="lt-tabs">
        {["uz", "ru", "en"].map((l) => (
          <button key={l} type="button"
            className={`lt-tab ${lang === l ? "active" : ""}`}
            onClick={() => setLang(l)}
          >
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>
    </>
  );
}