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
    upload: "M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z",
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={icons[name]} /></svg>;
};

const css = `
  .pr-wrap { font-family: 'Syne', sans-serif; color: #e2e8f0; }
  .pr-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .pr-title { font-size: 1.5rem; font-weight: 800; }
  .pr-sub { color: #64748b; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .pr-btn-primary { background: linear-gradient(135deg, #38bdf8, #0ea5e9); border: none; color: #0a0e1a; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .pr-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(56,189,248,0.3); }
  .pr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
  .pr-card { background: #111827; border: 1px solid #1e2d45; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.2s; position: relative; overflow: hidden; }
  .pr-card:hover { border-color: rgba(56,189,248,0.3); }
  .pr-card-img { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 5px; background: #0a0e1a; }
  .pr-card-name { font-size: 1rem; font-weight: 700; padding-right: 80px; }
  .pr-card-desc { color: #64748b; font-size: 0.82rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .pr-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .pr-tag { font-size: 0.7rem; padding: 2px 10px; border-radius: 20px; font-family: 'JetBrains Mono', monospace; }
  .pr-tag-blue { background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2); color: #38bdf8; }
  .pr-card-link { color: #818cf8; font-size: 0.78rem; font-family: 'JetBrains Mono', monospace; text-decoration: none; display: flex; align-items: center; gap: 4px; width: fit-content; }
  .pr-dev-badge { font-size: 0.68rem; padding: 2px 8px; border-radius: 6px; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); color: #34d399; font-family: 'JetBrains Mono', monospace; display: inline-block; }
  .pr-actions { position: absolute; top: 1rem; right: 1rem; display: flex; gap: 6px; z-index: 10; }
  .pr-btn-icon { background: rgba(26, 34, 53, 0.8); border: 1px solid #1e2d45; color: #64748b; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
  
  /* MODAL & BUTTONS DESIGN */
  .pr-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .pr-modal { background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
  .pr-modal-head { padding: 1.25rem 1.5rem; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #0f172a; z-index: 1; }
  .pr-modal-title { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; }
  
  /* X Close Button */
  .pr-modal-close { background: #1e293b; border: 1px solid #334155; color: #94a3b8; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .pr-modal-close:hover { background: #ef4444; color: #fff; border-color: #ef4444; transform: rotate(90deg); }

  .pr-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  
  /* Footer Buttons */
  .pr-modal-foot { padding: 1.25rem 1.5rem; border-top: 1px solid #1e293b; display: flex; gap: 0.75rem; justify-content: flex-end; }
  
  .pr-btn-cancel { background: transparent; border: 1px solid #334155; color: #94a3b8; padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
  .pr-btn-cancel:hover { background: #1e293b; color: #f1f5f9; border-color: #475569; }
  
  .pr-btn-save { background: #38bdf8; border: none; color: #0f172a; padding: 10px 24px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
  .pr-btn-save:hover { background: #0ea5e9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4); }
  .pr-btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .pr-field { display: flex; flex-direction: column; gap: 6px; }
  .pr-label { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }
  .pr-input, .pr-textarea, .pr-select { background: #1e293b; border: 1px solid #334155; color: #f1f5f9; padding: 12px 14px; border-radius: 10px; width: 100%; box-sizing: border-box; transition: border-color 0.2s; }
  .pr-input:focus, .pr-textarea:focus { border-color: #38bdf8; outline: none; }
  
  .pr-upload-area { position: relative; width: 100%; height: 180px; border: 2px dashed #334155; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; background: #0f172a; }
  .pr-upload-area:hover { border-color: #38bdf8; }
  .pr-upload-preview { width: 100%; height: 100%; object-fit: cover; }
  .pr-upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #64748b; font-size: 0.8rem; }
  .pr-file-input { display: none; }
  
  .pr-tech-choices { display: flex; flex-wrap: wrap; gap: 6px; }
  .pr-tech-choice { background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 5px 14px; border-radius: 20px; cursor: pointer; font-size: 0.75rem; transition: all 0.2s; }
  .pr-tech-choice.selected { background: rgba(56,189,248,0.1); border-color: #38bdf8; color: #38bdf8; }
`;

const EMPTY_FORM = {
  dev: "",
  title_uz: "", title_ru: "", title_en: "",
  description_uz: "", description_ru: "", description_en: "",
  project_url: "", technologies: [],
  project_image: null,
};

export default function ProjectAdmin() {
  const [data, setData]         = useState([]);
  const [devList, setDevList]   = useState([]);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [formLang, setFormLang] = useState("uz");
  const [preview, setPreview]   = useState(null);

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
        project_image:  null, 
      });
      setPreview(item.project_image); 
      setEditing(item.id);
    } else {
      setForm({ ...EMPTY_FORM, dev: devList.length === 1 ? devList[0].id : "" });
      setPreview(null);
      setEditing(null);
    }
    setModal(true);
  };

  const close = () => { setModal(false); setEditing(null); setPreview(null); };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, project_image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

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
          form.technologies.forEach((t) => fd.append("technologies", t));
          
          if (form.project_image) {
            fd.append("project_image", form.project_image);
          }

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

        <div className="pr-grid">
          {data.map((item) => (
            <div key={item.id} className="pr-card">
              <div className="pr-actions">
                <button className="pr-btn-icon" onClick={() => open(item)}><Icon name="edit" /></button>
                <button className="pr-btn-icon danger" onClick={() => del(item.id)}><Icon name="trash" /></button>
              </div>
              {item.project_image && <img src={item.project_image} alt="" className="pr-card-img" />}
              <div className="pr-card-name">{item.title_uz}</div>
              {item.dev && <span className="pr-dev-badge">👤 {devName(item.dev)}</span>}
              {item.description_uz && <div className="pr-card-desc">{item.description_uz}</div>}
              <div className="pr-tags">
                {item.technologies?.map((t, i) => (
                  <span key={i} className="pr-tag pr-tag-blue">
                    {TECH_CHOICES.find((c) => c.value === t)?.label || t}
                  </span>
                ))}
              </div>
              {item.project_url && (
                <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="pr-card-link">
                  <Icon name="link" /> {item.project_url.replace(/^https?:\/\//, "").slice(0, 35)}...
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
                <button className="pr-modal-close" onClick={close} title="Yopish">
                  <Icon name="close" />
                </button>
              </div>
              <div className="pr-modal-body">
                
                {/* IMAGE UPLOAD */}
                <div className="pr-field">
                  <label className="pr-label">LOYIHA RASMI</label>
                  <label className="pr-upload-area">
                    <input type="file" className="pr-file-input" accept="image/*" onChange={handleFile} />
                    {preview ? (
                      <img src={preview} alt="Preview" className="pr-upload-preview" />
                    ) : (
                      <div className="pr-upload-placeholder">
                        <Icon name="upload" />
                        <span>Rasm tanlash uchun bosing</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="pr-field">
                  <label className="pr-label">DEV (kimga bog'lash)</label>
                  <select className="pr-select" value={form.dev} onChange={f("dev")}>
                    <option value="">— Tanlang —</option>
                    {devList.map((d) => <option key={d.id} value={d.id}>{d.full_name_uz}</option>)}
                  </select>
                </div>

                <LangTabs lang={formLang} setLang={setFormLang} />

                <div className="pr-field">
                  <label className="pr-label">LOYIHA NOMI * ({formLang.toUpperCase()})</label>
                  <input className="pr-input" value={form[`title_${formLang}`]} onChange={f(`title_${formLang}`)} />
                </div>

                <div className="pr-field">
                  <label className="pr-label">TAVSIF ({formLang.toUpperCase()})</label>
                  <textarea className="pr-textarea" value={form[`description_${formLang}`]} onChange={f(`description_${formLang}`)} />
                </div>

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
                </div>

                <div className="pr-field">
                  <label className="pr-label">LOYIHA HAVOLASI</label>
                  <input className="pr-input" value={form.project_url} onChange={f("project_url")} />
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