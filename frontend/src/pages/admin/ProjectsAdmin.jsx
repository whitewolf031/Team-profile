import { useState, useEffect } from "react";
import api from "../../api";
import LangTabs from "../../components/LangTabs";

const TECH_CHOICES = [
  { value: "python",           label: "Python" },
  { value: "php",              label: "PHP" },
  { value: "javaScript",       label: "JavaScript" },
  { value: "pyTelegramBotApi", label: "pyTelegramBotApi" },
  { value: "laravel",          label: "Laravel" },
  { value: "django",           label: "Django" },
  { value: "react",            label: "React" },
  { value: "docker",           label: "Docker" },
  { value: "postgresql",        label: "PostgreSQL" },
  { value: "MySQL",            label: "MySQL" },
  { value: "SQLite",           label: "SQLite" },
];

const Icon = ({ name }) => {
  const icons = {
    plus:  "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    edit:  "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    trash: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    link:  "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={icons[name]} /></svg>;
};

const css = `
  .pr-wrap { font-family: 'Syne', sans-serif; color: #e2e8f0; }
  .pr-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .pr-title { font-size: 1.5rem; font-weight: 800; }
  .pr-sub { color: #64748b; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .pr-btn-primary { background: linear-gradient(135deg, #38bdf8, #0ea5e9); border: none; color: #0a0e1a; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .pr-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(56,189,248,0.3); }
  .pr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
  .pr-card { background: #111827; border: 1px solid #1e2d45; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.2s; position: relative; }
  .pr-card:hover { border-color: rgba(56,189,248,0.3); }
  .pr-card-name { font-size: 1rem; font-weight: 700; padding-right: 80px; }
  .pr-card-desc { color: #64748b; font-size: 0.82rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .pr-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .pr-tag { font-size: 0.7rem; padding: 2px 10px; border-radius: 20px; font-family: 'JetBrains Mono', monospace; }
  .pr-tag-blue { background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2); color: #38bdf8; }
  .pr-card-link { color: #818cf8; font-size: 0.78rem; font-family: 'JetBrains Mono', monospace; text-decoration: none; display: flex; align-items: center; gap: 4px; width: fit-content; }
  .pr-card-link:hover { color: #a5b4fc; text-decoration: underline; }
  .pr-dev-badge { font-size: 0.68rem; padding: 2px 8px; border-radius: 6px; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); color: #34d399; font-family: 'JetBrains Mono', monospace; display: inline-block; }
  .pr-actions { position: absolute; top: 1rem; right: 1rem; display: flex; gap: 6px; }
  .pr-btn-icon { background: #1a2235; border: 1px solid #1e2d45; color: #64748b; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .pr-btn-icon:hover { color: #38bdf8; border-color: #38bdf8; background: rgba(56,189,248,0.08); }
  .pr-btn-icon.danger:hover { color: #f87171; border-color: #f87171; background: rgba(248,113,113,0.08); }
  .pr-empty { text-align: center; padding: 3rem; color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
  .pr-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .pr-modal { background: #111827; border: 1px solid #1e2d45; border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
  .pr-modal-head { padding: 1.2rem 1.5rem; border-bottom: 1px solid #1e2d45; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #111827; z-index: 1; }
  .pr-modal-title { font-size: 1rem; font-weight: 700; }
  .pr-modal-close { background: none; border: none; color: #64748b; cursor: pointer; display: flex; }
  .pr-modal-close:hover { color: #e2e8f0; }
  .pr-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .pr-modal-foot { padding: 1rem 1.5rem; border-top: 1px solid #1e2d45; display: flex; gap: 0.75rem; justify-content: flex-end; }
  .pr-field { display: flex; flex-direction: column; gap: 6px; }
  .pr-label { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: #64748b; letter-spacing: 0.5px; }
  .pr-input, .pr-textarea, .pr-select { background: #1a2235; border: 1px solid #1e2d45; color: #e2e8f0; padding: 10px 14px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 0.9rem; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
  .pr-input:focus, .pr-textarea:focus, .pr-select:focus { outline: none; border-color: #38bdf8; }
  .pr-textarea { resize: vertical; min-height: 100px; }
  .pr-select option { background: #1a2235; }
  .pr-tech-choices { display: flex; flex-wrap: wrap; gap: 6px; }
  .pr-tech-choice { background: #1a2235; border: 1px solid #1e2d45; color: #64748b; padding: 5px 14px; border-radius: 20px; cursor: pointer; font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; transition: all 0.2s; }
  .pr-tech-choice:hover { border-color: #38bdf8; color: #38bdf8; }
  .pr-tech-choice.selected { background: rgba(56,189,248,0.12); border-color: #38bdf8; color: #38bdf8; }
  .pr-tech-preview { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
  .pr-btn-cancel { background: #1a2235; border: 1px solid #1e2d45; color: #64748b; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 0.85rem; transition: all 0.2s; }
  .pr-btn-cancel:hover { color: #e2e8f0; }
  .pr-btn-save { background: linear-gradient(135deg, #38bdf8, #0ea5e9); border: none; color: #0a0e1a; padding: 8px 22px; border-radius: 8px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .pr-btn-save:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(56,189,248,0.3); }
  .pr-btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const EMPTY_FORM = {
  dev: "",
  title_uz: "", title_ru: "", title_en: "",
  description_uz: "", description_ru: "", description_en: "",
  project_url: "", technologies: [],
};

export default function ProjectAdmin() {
  const [data, setData]         = useState([]);
  const [devList, setDevList]   = useState([]);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [formLang, setFormLang] = useState("uz");

  const load     = () => api.get("/api/admin-control/projects/").then((r) => setData(Array.isArray(r.data) ? r.data : [])).catch(console.error);
  const loadDevs = () => api.get("/api/admin-control/dev/").then((r) => setDevList(Array.isArray(r.data) ? r.data : [])).catch(console.error);

  useEffect(() => { load(); loadDevs(); }, []);

  const open = (item = null) => {
    setFormLang("uz");
    if (item) {
      setForm({
        dev:            item.dev            || "",
        title_uz:       item.title_uz       || "",
        title_ru:       item.title_ru       || "",
        title_en:       item.title_en       || "",
        description_uz: item.description_uz || "",
        description_ru: item.description_ru || "",
        description_en: item.description_en || "",
        project_url:    item.project_url    || "",
        technologies:   item.technologies   || [],
      });
      setEditing(item.id);
    } else {
      setForm({ ...EMPTY_FORM, dev: devList.length === 1 ? devList[0].id : "" });
      setEditing(null);
    }
    setModal(true);
  };

  const close = () => { setModal(false); setEditing(null); };

  const toggleTech = (value) => {
    const updated = form.technologies.includes(value)
      ? form.technologies.filter((t) => t !== value)
      : [...form.technologies, value];
    setForm({ ...form, technologies: updated });
  };

  const save = async () => {
      setSaving(true);
      try {
          const fd = new FormData();
          
          if (form.dev) fd.append("dev", form.dev);
          fd.append("title_uz",       form.title_uz       || "");
          fd.append("title_ru",       form.title_ru       || "");
          fd.append("title_en",       form.title_en       || "");
          fd.append("description_uz", form.description_uz || "");
          fd.append("description_ru", form.description_ru || "");
          fd.append("description_en", form.description_en || "");
          fd.append("project_url",    form.project_url    || "");
          
          // technologies array uchun
          form.technologies.forEach((t) => fd.append("technologies", t));

          if (editing) {
              await api.patch(`/api/admin-control/projects/${editing}/`, fd, {
                  headers: { "Content-Type": "multipart/form-data" }
              });
          } else {
              await api.post("/api/admin-control/projects/", fd, {
                  headers: { "Content-Type": "multipart/form-data" }
              });
          }

          close(); load();
      } catch (e) {
          console.error("Xato:", e.response?.data);
      }
      setSaving(false);
  };

  const del = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/api/admin-control/projects/${id}/`);
    load();
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const devName = (id) => devList.find((d) => d.id === id)?.full_name_uz || `Dev #${id}`;

  return (
    <>
      <style>{css}</style>
      <div className="pr-wrap">
        <div className="pr-topbar">
          <div><div className="pr-title">Projects</div><div className="pr-sub">// loyihalar</div></div>
          <button className="pr-btn-primary" onClick={() => open()}><Icon name="plus" /> Yangi qo'shish</button>
        </div>

        {data.length === 0 && <div className="pr-empty">// ma'lumot topilmadi</div>}

        <div className="pr-grid">
          {data.map((item) => (
            <div key={item.id} className="pr-card">
              <div className="pr-actions">
                <button className="pr-btn-icon" onClick={() => open(item)}><Icon name="edit" /></button>
                <button className="pr-btn-icon danger" onClick={() => del(item.id)}><Icon name="trash" /></button>
              </div>
              <div className="pr-card-name">{item.title_uz}</div>
              {item.dev && <span className="pr-dev-badge">👤 {devName(item.dev)}</span>}
              {item.description_uz && <div className="pr-card-desc">{item.description_uz}</div>}
              {item.technologies?.length > 0 && (
                <div className="pr-tags">
                  {item.technologies.map((t, i) => (
                    <span key={i} className="pr-tag pr-tag-blue">
                      {TECH_CHOICES.find((c) => c.value === t)?.label || t}
                    </span>
                  ))}
                </div>
              )}
              {item.project_url && (
                <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="pr-card-link">
                  <Icon name="link" /> {item.project_url.replace(/^https?:\/\//, "").slice(0, 40)}
                </a>
              )}
            </div>
          ))}
        </div>

        {modal && (
          <div className="pr-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="pr-modal">
              <div className="pr-modal-head">
                <span className="pr-modal-title">{editing ? "Loyihani tahrirlash" : "Yangi loyiha"}</span>
                <button className="pr-modal-close" onClick={close}><Icon name="close" /></button>
              </div>
              <div className="pr-modal-body">

                {/* DEV */}
                <div className="pr-field">
                  <label className="pr-label">DEV (kimga bog'lash)</label>
                  <select className="pr-select" value={form.dev} onChange={f("dev")}>
                    <option value="">— Tanlang —</option>
                    {devList.map((d) => <option key={d.id} value={d.id}>{d.full_name_uz}</option>)}
                  </select>
                </div>

                <LangTabs lang={formLang} setLang={setFormLang} />

                {/* NOMI */}
                <div className="pr-field">
                  <label className="pr-label">LOYIHA NOMI * ({formLang.toUpperCase()})</label>
                  {formLang === "uz" && <input className="pr-input" placeholder="Portfolio Website" value={form.title_uz} onChange={f("title_uz")} />}
                  {formLang === "ru" && <input className="pr-input" placeholder="Портфолио сайт"    value={form.title_ru} onChange={f("title_ru")} />}
                  {formLang === "en" && <input className="pr-input" placeholder="Portfolio Website" value={form.title_en} onChange={f("title_en")} />}
                </div>

                {/* TAVSIF */}
                <div className="pr-field">
                  <label className="pr-label">TAVSIF ({formLang.toUpperCase()})</label>
                  {formLang === "uz" && <textarea className="pr-textarea" placeholder="Bu loyiha haqida..." value={form.description_uz} onChange={f("description_uz")} />}
                  {formLang === "ru" && <textarea className="pr-textarea" placeholder="Об этом проекте..."  value={form.description_ru} onChange={f("description_ru")} />}
                  {formLang === "en" && <textarea className="pr-textarea" placeholder="About this project..." value={form.description_en} onChange={f("description_en")} />}
                </div>

                {/* TEXNOLOGIYALAR */}
                <div className="pr-field">
                  <label className="pr-label">TEXNOLOGIYALAR</label>
                  <div className="pr-tech-choices">
                    {TECH_CHOICES.map((tech) => (
                      <button key={tech.value} type="button"
                        className={`pr-tech-choice ${form.technologies.includes(tech.value) ? "selected" : ""}`}
                        onClick={() => toggleTech(tech.value)}
                      >
                        {tech.label}
                      </button>
                    ))}
                  </div>
                  {form.technologies.length > 0 && (
                    <div className="pr-tech-preview">
                      {form.technologies.map((t, i) => (
                        <span key={i} className="pr-tag pr-tag-blue">{TECH_CHOICES.find((c) => c.value === t)?.label || t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* URL */}
                <div className="pr-field">
                  <label className="pr-label">LOYIHA HAVOLASI</label>
                  <input className="pr-input" placeholder="https://github.com/username/repo" value={form.project_url} onChange={f("project_url")} />
                </div>
              </div>

              <div className="pr-modal-foot">
                <button className="pr-btn-cancel" onClick={close}>Bekor qilish</button>
                <button className="pr-btn-save" onClick={save} disabled={saving || !form.title_uz}>
                  <Icon name="check" /> {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}