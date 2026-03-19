import { useState, useEffect } from "react";
import api from "../../api";
import LangTabs from "../../components/LangTabs";

const Icon = ({ name }) => {
  const icons = {
    plus:  "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    edit:  "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    trash: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    cert:  "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z",
    image: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={icons[name]} /></svg>;
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap');
  .ct-wrap { font-family: 'Syne', sans-serif; color: #e2e8f0; }
  .ct-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .ct-title { font-size: 1.5rem; font-weight: 800; }
  .ct-sub { color: #64748b; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .ct-btn-primary { background: linear-gradient(135deg, #fbbf24, #f59e0b); border: none; color: #0a0e1a; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .ct-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(251,191,36,0.35); }
  .ct-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .ct-card { background: #111827; border: 1px solid #1e2d45; border-radius: 12px; overflow: hidden; transition: all 0.25s; }
  .ct-card:hover { border-color: rgba(251,191,36,0.35); transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
  .ct-img-wrap { position: relative; width: 100%; height: 160px; overflow: hidden; background: #1a2235; cursor: pointer; }
  .ct-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .ct-card:hover .ct-img { transform: scale(1.05); }
  .ct-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #374151; }
  .ct-info { padding: 14px; }
  .ct-cert-title { font-size: 0.92rem; font-weight: 700; color: #fbbf24; margin: 0 0 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ct-issuer { font-size: 0.78rem; color: #9ca3af; margin: 0 0 3px; }
  .ct-date { font-size: 0.72rem; color: #64748b; font-family: 'JetBrains Mono', monospace; margin: 0 0 10px; }
  .ct-dev-badge { font-size: 0.68rem; padding: 2px 8px; border-radius: 6px; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); color: #34d399; font-family: 'JetBrains Mono', monospace; display: inline-block; margin-bottom: 10px; }
  .ct-card-actions { display: flex; gap: 6px; }
  .ct-btn-icon { background: #1a2235; border: 1px solid #1e2d45; color: #64748b; flex: 1; height: 32px; border-radius: 7px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; gap: 5px; }
  .ct-btn-icon:hover        { color: #38bdf8; border-color: #38bdf8; background: rgba(56,189,248,0.08); }
  .ct-btn-icon.danger:hover { color: #f87171; border-color: #f87171; background: rgba(248,113,113,0.08); }
  .ct-empty { text-align: center; padding: 3rem; color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
  .ct-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .ct-modal { background: #111827; border: 1px solid #1e2d45; border-radius: 16px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
  .ct-modal-head { padding: 1.2rem 1.5rem; border-bottom: 1px solid #1e2d45; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #111827; z-index: 1; }
  .ct-modal-title { font-size: 1rem; font-weight: 700; }
  .ct-modal-close { background: none; border: none; color: #64748b; cursor: pointer; display: flex; transition: color 0.2s; }
  .ct-modal-close:hover { color: #e2e8f0; }
  .ct-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .ct-modal-foot { padding: 1rem 1.5rem; border-top: 1px solid #1e2d45; display: flex; gap: 0.75rem; justify-content: flex-end; }
  .ct-field { display: flex; flex-direction: column; gap: 6px; }
  .ct-label { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: #64748b; letter-spacing: 0.5px; }
  .ct-input, .ct-select { background: #1a2235; border: 1px solid #1e2d45; color: #e2e8f0; padding: 10px 14px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 0.9rem; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
  .ct-input:focus, .ct-select:focus { outline: none; border-color: #fbbf24; }
  .ct-select option { background: #1a2235; }
  .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .ct-upload-zone { border: 2px dashed #1e2d45; border-radius: 10px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; }
  .ct-upload-zone:hover, .ct-upload-zone.drag { border-color: #fbbf24; background: rgba(251,191,36,0.04); }
  .ct-upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .ct-upload-icon { font-size: 2rem; margin-bottom: 8px; }
  .ct-upload-text { color: #64748b; font-size: 0.82rem; font-family: 'JetBrains Mono', monospace; }
  .ct-upload-text span { color: #fbbf24; }
  .ct-preview { width: 100%; height: 160px; border-radius: 8px; object-fit: cover; border: 1px solid #1e2d45; }
  .ct-error { background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); color: #f87171; padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; font-family: 'JetBrains Mono', monospace; }
  .ct-btn-cancel { background: #1a2235; border: 1px solid #1e2d45; color: #64748b; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 0.85rem; transition: all 0.2s; }
  .ct-btn-cancel:hover { color: #e2e8f0; }
  .ct-btn-save { background: linear-gradient(135deg, #fbbf24, #f59e0b); border: none; color: #0a0e1a; padding: 8px 22px; border-radius: 8px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .ct-btn-save:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(251,191,36,0.3); }
  .ct-btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .ct-lightbox { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.92); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .ct-lightbox-inner { position: relative; display: flex; flex-direction: column; align-items: center; gap: 12px; max-width: 90vw; }
  .ct-lightbox-img { max-width: 100%; max-height: 80vh; border-radius: 12px; border: 2px solid rgba(251,191,36,0.3); }
  .ct-lightbox-close { position: absolute; top: -14px; right: -14px; width: 36px; height: 36px; border-radius: 50%; background: rgba(31,41,55,0.9); border: 1px solid #374151; color: #9ca3af; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: all 0.2s; }
  .ct-lightbox-close:hover { color: white; border-color: #f87171; }
  .ct-lightbox-title { color: #fbbf24; font-weight: 700; font-size: 1rem; }
`;

const EMPTY_FORM = {
  dev: "",
  title_uz: "", title_ru: "", title_en: "",
  issuer_uz: "", issuer_ru: "", issuer_en: "",
  issued_date: "",
};

export default function CertificateAdmin() {
  const [data, setData]           = useState([]);
  const [devList, setDevList]     = useState([]);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [form, setForm]           = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [lightbox, setLightbox]   = useState(null);
  const [drag, setDrag]           = useState(false);
  const [formLang, setFormLang]   = useState("uz");

  const load     = () => api.get("/api/admin-control/sertificate/").then((r) => setData(Array.isArray(r.data) ? r.data : [])).catch(console.error);
  const loadDevs = () => api.get("/api/admin-control/dev/").then((r) => setDevList(Array.isArray(r.data) ? r.data : [])).catch(console.error);

  useEffect(() => { load(); loadDevs(); }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const onFile = (file) => {
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const open = (item = null) => {
    setError(""); setImageFile(null); setFormLang("uz");
    if (item) {
      setForm({
        dev:       item.dev       || "",
        title_uz:  item.title_uz  || "",
        title_ru:  item.title_ru  || "",
        title_en:  item.title_en  || "",
        issuer_uz: item.issuer_uz || "",
        issuer_ru: item.issuer_ru || "",
        issuer_en: item.issuer_en || "",
        issued_date: item.issued_date || "",
      });
      setPreview(item.image || null);
      setEditing(item.id);
    } else {
      setForm({ ...EMPTY_FORM, dev: devList.length === 1 ? devList[0].id : "" });
      setPreview(null);
      setEditing(null);
    }
    setModal(true);
  };

  const close = () => { setModal(false); setEditing(null); setError(""); setImageFile(null); setPreview(null); };

  const save = async () => {
    setError("");
    if (!form.dev)      { setError("// Dev tanlanmagan!"); return; }
    if (!form.title_uz) { setError("// Sarlavha (UZ) kiritilmagan!"); return; }
    if (!editing && !imageFile) { setError("// Sertifikat rasmi yuklanmagan!"); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("dev",      form.dev);
      fd.append("title_uz", form.title_uz);
      if (form.title_ru)   fd.append("title_ru",  form.title_ru);
      if (form.title_en)   fd.append("title_en",  form.title_en);
      if (form.issuer_uz)  fd.append("issuer_uz", form.issuer_uz);
      if (form.issuer_ru)  fd.append("issuer_ru", form.issuer_ru);
      if (form.issuer_en)  fd.append("issuer_en", form.issuer_en);
      if (form.issued_date) fd.append("issued_date", form.issued_date);
      if (imageFile)        fd.append("image", imageFile);

      if (editing) await api.patch(`/api/admin-control/sertificate/${editing}/`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      else         await api.post("/api/admin-control/sertificate/", fd, { headers: { "Content-Type": "multipart/form-data" } });

      close(); load();
    } catch (e) {
      setError("// Xato: " + (e.response?.data ? JSON.stringify(e.response.data) : e.message));
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/api/admin-control/sertificate/${id}/`);
    load();
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const devName = (id) => devList.find((d) => d.id === id)?.full_name_uz || `Dev #${id}`;

  return (
    <>
      <style>{css}</style>
      <div className="ct-wrap">
        <div className="ct-topbar">
          <div><div className="ct-title">Certificates</div><div className="ct-sub">// sertifikatlar</div></div>
          <button className="ct-btn-primary" onClick={() => open()}><Icon name="plus" /> Yangi qo'shish</button>
        </div>

        {data.length === 0 && <div className="ct-empty">// sertifikat topilmadi</div>}

        <div className="ct-grid">
          {data.map((item) => (
            <div key={item.id} className="ct-card">
              <div className="ct-img-wrap" onClick={() => item.image && setLightbox(item)}>
                {item.image
                  ? <img src={item.image} alt={item.title_uz} className="ct-img" />
                  : <div className="ct-img-placeholder"><Icon name="cert" /></div>}
              </div>
              <div className="ct-info">
                <p className="ct-cert-title">{item.title_uz}</p>
                {item.issuer_uz  && <p className="ct-issuer">🏢 {item.issuer_uz}</p>}
                {item.issued_date && <p className="ct-date">📅 {item.issued_date}</p>}
                {item.dev && <span className="ct-dev-badge">👤 {devName(item.dev)}</span>}
                <div className="ct-card-actions">
                  <button className="ct-btn-icon" onClick={() => open(item)}><Icon name="edit" /> Edit</button>
                  <button className="ct-btn-icon danger" onClick={() => del(item.id)}><Icon name="trash" /> O'chir</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {modal && (
          <div className="ct-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="ct-modal">
              <div className="ct-modal-head">
                <span className="ct-modal-title">{editing ? "Sertifikatni tahrirlash" : "Yangi sertifikat"}</span>
                <button className="ct-modal-close" onClick={close}><Icon name="close" /></button>
              </div>
              <div className="ct-modal-body">

                {/* DEV */}
                <div className="ct-field">
                  <label className="ct-label">DEV *</label>
                  <select className="ct-select" value={form.dev} onChange={f("dev")}>
                    <option value="">— Tanlang —</option>
                    {devList.map((d) => <option key={d.id} value={d.id}>{d.full_name_uz}</option>)}
                  </select>
                </div>

                {error && <div className="ct-error">{error}</div>}

                {/* RASM */}
                <div className="ct-field">
                  <label className="ct-label">SERTIFIKAT RASMI *</label>
                  {preview ? (
                    <div style={{ position: "relative" }}>
                      <img src={preview} alt="preview" className="ct-preview" />
                      <button onClick={() => { setImageFile(null); setPreview(null); }}
                        style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "1px solid #f87171", color: "#f87171", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "0.75rem" }}>
                        O'zgartirish
                      </button>
                    </div>
                  ) : (
                    <div className={`ct-upload-zone ${drag ? "drag" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
                    >
                      <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files[0])} />
                      <div className="ct-upload-icon">🏅</div>
                      <div className="ct-upload-text">Rasm yuklash uchun bosing yoki <span>drag & drop</span></div>
                    </div>
                  )}
                </div>

                <LangTabs lang={formLang} setLang={setFormLang} />

                {/* SARLAVHA */}
                <div className="ct-field">
                  <label className="ct-label">SARLAVHA * ({formLang.toUpperCase()})</label>
                  {formLang === "uz" && <input className="ct-input" placeholder="Django REST Framework" value={form.title_uz} onChange={f("title_uz")} />}
                  {formLang === "ru" && <input className="ct-input" placeholder="Django REST Framework" value={form.title_ru} onChange={f("title_ru")} />}
                  {formLang === "en" && <input className="ct-input" placeholder="Django REST Framework" value={form.title_en} onChange={f("title_en")} />}
                </div>

                <div className="ct-row">
                  <div className="ct-field">
                    <label className="ct-label">TASHKILOT ({formLang.toUpperCase()})</label>
                    {formLang === "uz" && <input className="ct-input" placeholder="Coursera..." value={form.issuer_uz} onChange={f("issuer_uz")} />}
                    {formLang === "ru" && <input className="ct-input" placeholder="Coursera..." value={form.issuer_ru} onChange={f("issuer_ru")} />}
                    {formLang === "en" && <input className="ct-input" placeholder="Coursera..." value={form.issuer_en} onChange={f("issuer_en")} />}
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">BERILGAN SANA</label>
                    <input className="ct-input" type="date" value={form.issued_date} onChange={f("issued_date")} />
                  </div>
                </div>
              </div>

              <div className="ct-modal-foot">
                <button className="ct-btn-cancel" onClick={close}>Bekor qilish</button>
                <button className="ct-btn-save" onClick={save} disabled={saving || !form.title_uz || !form.dev}>
                  <Icon name="check" /> {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="ct-lightbox" onClick={() => setLightbox(null)}>
          <div className="ct-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="ct-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.image} alt={lightbox.title_uz} className="ct-lightbox-img" />
            <p className="ct-lightbox-title">{lightbox.title_uz}</p>
          </div>
        </div>
      )}
    </>
  );
}