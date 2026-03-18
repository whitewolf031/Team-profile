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
    image: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
    user:  "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z",
    tg:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.12.56-.46.7-.92.44l-2.56-1.88-1.24 1.18c-.14.14-.26.26-.52.26l.18-2.62 4.72-4.26c.2-.18-.04-.28-.32-.1L7.46 14.5l-2.52-.78c-.56-.16-.56-.54.1-.8l9.86-3.8c.46-.16.86.1.74.68z",
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={icons[name]} /></svg>;
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap');
  .di-wrap { font-family: 'Syne', sans-serif; color: #e2e8f0; }
  .di-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .di-title { font-size: 1.5rem; font-weight: 800; }
  .di-sub { color: #64748b; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .di-btn-primary { background: linear-gradient(135deg, #38bdf8, #0ea5e9); border: none; color: #0a0e1a; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .di-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(56,189,248,0.3); }
  .di-card { background: #111827; border: 1px solid #1e2d45; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; display: flex; gap: 1rem; align-items: flex-start; transition: border-color 0.2s; }
  .di-card:hover { border-color: rgba(56,189,248,0.3); }
  .di-avatar { width: 56px; height: 56px; border-radius: 10px; overflow: hidden; border: 2px solid #1e2d45; flex-shrink: 0; background: #1a2235; display: flex; align-items: center; justify-content: center; color: #64748b; }
  .di-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .di-body { flex: 1; min-width: 0; }
  .di-name { font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
  .di-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
  .di-tag { font-size: 0.7rem; padding: 2px 10px; border-radius: 20px; font-family: 'JetBrains Mono', monospace; }
  .di-tag-blue   { background: rgba(56,189,248,0.08);  border: 1px solid rgba(56,189,248,0.2);  color: #38bdf8; }
  .di-tag-green  { background: rgba(52,211,153,0.08);  border: 1px solid rgba(52,211,153,0.2);  color: #34d399; }
  .di-tag-purple { background: rgba(129,140,248,0.08); border: 1px solid rgba(129,140,248,0.2); color: #818cf8; }
  .di-tag-yellow { background: rgba(251,191,36,0.08);  border: 1px solid rgba(251,191,36,0.2);  color: #fbbf24; }
  .di-tag-tg     { background: rgba(0,136,204,0.1);    border: 1px solid rgba(0,136,204,0.25);  color: #38bdf8; }
  .di-text { color: #64748b; font-size: 0.82rem; line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .di-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .di-btn-icon { background: #1a2235; border: 1px solid #1e2d45; color: #64748b; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .di-btn-icon:hover        { color: #38bdf8; border-color: #38bdf8; background: rgba(56,189,248,0.08); }
  .di-btn-icon.danger:hover { color: #f87171; border-color: #f87171; background: rgba(248,113,113,0.08); }
  .di-empty { text-align: center; padding: 3rem; color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
  .di-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .di-modal { background: #111827; border: 1px solid #1e2d45; border-radius: 16px; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; }
  .di-modal-head { padding: 1.2rem 1.5rem; border-bottom: 1px solid #1e2d45; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #111827; z-index: 1; }
  .di-modal-title { font-size: 1rem; font-weight: 700; }
  .di-modal-close { background: none; border: none; color: #64748b; cursor: pointer; display: flex; transition: color 0.2s; }
  .di-modal-close:hover { color: #e2e8f0; }
  .di-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .di-modal-foot { padding: 1rem 1.5rem; border-top: 1px solid #1e2d45; display: flex; gap: 0.75rem; justify-content: flex-end; }
  .di-field { display: flex; flex-direction: column; gap: 6px; }
  .di-label { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: #64748b; letter-spacing: 0.5px; }
  .di-input, .di-textarea { background: #1a2235; border: 1px solid #1e2d45; color: #e2e8f0; padding: 10px 14px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 0.9rem; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
  .di-input:focus, .di-textarea:focus { outline: none; border-color: #38bdf8; }
  .di-textarea { resize: vertical; min-height: 90px; }
  .di-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .di-upload { border: 2px dashed #1e2d45; border-radius: 10px; padding: 1.2rem; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; }
  .di-upload:hover { border-color: #38bdf8; background: rgba(56,189,248,0.03); }
  .di-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .di-upload-preview { width: 80px; height: 80px; border-radius: 10px; object-fit: cover; margin: 0 auto 8px; display: block; border: 2px solid #1e2d45; }
  .di-upload-hint { color: #64748b; font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; margin-top: 6px; }
  .di-tg-hint { background: rgba(0,136,204,0.06); border: 1px solid rgba(0,136,204,0.2); border-radius: 8px; padding: 8px 12px; font-size: 0.75rem; color: #64748b; font-family: 'JetBrains Mono', monospace; margin-top: 4px; }
  .di-tg-hint span { color: #38bdf8; }
  .di-btn-cancel { background: #1a2235; border: 1px solid #1e2d45; color: #64748b; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 0.85rem; transition: all 0.2s; }
  .di-btn-cancel:hover { color: #e2e8f0; }
  .di-btn-save { background: linear-gradient(135deg, #38bdf8, #0ea5e9); border: none; color: #0a0e1a; padding: 8px 22px; border-radius: 8px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .di-btn-save:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(56,189,248,0.3); }
  .di-btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const EMPTY_FORM = {
  full_name: "", stack: "", experience: "",
  about_uz: "", about_ru: "", about_en: "",
  email: "", phone: "", telegram_chat_id: "",
};

export default function DevInfoAdmin() {
  const [data, setData]                   = useState([]);
  const [modal, setModal]                 = useState(false);
  const [editing, setEditing]             = useState(null);
  const [saving, setSaving]               = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile]       = useState(null);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [formLang, setFormLang]           = useState("uz");

  const load = () =>
    api.get("/api/admin-control/dev/")
      .then((res) => setData(Array.isArray(res.data) ? res.data : [res.data]))
      .catch(console.error);

  useEffect(() => { load(); }, []);

  const open = (item = null) => {
    setFormLang("uz");
    if (item) {
      setForm({
        full_name:        item.full_name        || "",
        stack:            item.stack            || "",
        experience:       item.experience       || "",
        about_uz:         item.about_uz         || "",
        about_ru:         item.about_ru         || "",
        about_en:         item.about_en         || "",
        email:            item.email            || "",
        phone:            item.phone            || "",
        telegram_chat_id: item.telegram_chat_id || "",
      });
      setAvatarPreview(item.avatar || null);
      setEditing(item.id);
    } else {
      setForm(EMPTY_FORM);
      setAvatarPreview(null);
      setEditing(null);
    }
    setAvatarFile(null);
    setModal(true);
  };

  const close = () => { setModal(false); setEditing(null); };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    setSaving(true);
    try {
      let payload, config;
      if (avatarFile) {
        payload = new FormData();
        Object.entries(form).forEach(([k, v]) => v !== "" && payload.append(k, v));
        payload.append("avatar", avatarFile);
        config = { headers: { "Content-Type": "multipart/form-data" } };
      } else {
        payload = { ...form, experience: form.experience ? Number(form.experience) : null };
        config = {};
      }
      if (editing) await api.patch(`/api/admin-control/dev/${editing}/`, payload, config);
      else         await api.post("/api/admin-control/dev/", payload, config);
      close(); load();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/api/admin-control/dev/${id}/`);
    load();
  };

  return (
    <>
      <style>{css}</style>
      <div className="di-wrap">
        <div className="di-topbar">
          <div>
            <div className="di-title">Information</div>
            <div className="di-sub">// shaxsiy ma'lumotlar</div>
          </div>
          <button className="di-btn-primary" onClick={() => open()}>
            <Icon name="plus" /> Yangi qo'shish
          </button>
        </div>

        {data.length === 0 && <div className="di-empty">// ma'lumot topilmadi</div>}

        {data.map((item) => (
          <div key={item.id} className="di-card">
            <div className="di-avatar">
              {item.avatar ? <img src={item.avatar} alt={item.full_name} /> : <Icon name="user" />}
            </div>
            <div className="di-body">
              <div className="di-name">{item.full_name}</div>
              <div className="di-meta">
                {item.stack            && <span className="di-tag di-tag-blue">{item.stack}</span>}
                {item.experience       && <span className="di-tag di-tag-green">{item.experience} yil</span>}
                {item.email            && <span className="di-tag di-tag-purple">{item.email}</span>}
                {item.phone            && <span className="di-tag di-tag-yellow">{item.phone}</span>}
                {item.telegram_chat_id && <span className="di-tag di-tag-tg">TG: {item.telegram_chat_id}</span>}
              </div>
              {item.about_uz && <div className="di-text">{item.about_uz}</div>}
            </div>
            <div className="di-actions">
              <button className="di-btn-icon" onClick={() => open(item)}><Icon name="edit" /></button>
              <button className="di-btn-icon danger" onClick={() => del(item.id)}><Icon name="trash" /></button>
            </div>
          </div>
        ))}

        {modal && (
          <div className="di-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="di-modal">
              <div className="di-modal-head">
                <span className="di-modal-title">{editing ? "Ma'lumotni tahrirlash" : "Yangi ma'lumot"}</span>
                <button className="di-modal-close" onClick={close}><Icon name="close" /></button>
              </div>
              <div className="di-modal-body">

                {/* AVATAR */}
                <div className="di-field">
                  <label className="di-label">AVATAR</label>
                  <div className="di-upload">
                    <input type="file" accept="image/*" onChange={handleAvatar} />
                    {avatarPreview
                      ? <img src={avatarPreview} className="di-upload-preview" alt="preview" />
                      : <Icon name="image" />}
                    <div className="di-upload-hint">
                      {avatarPreview ? "Rasmni o'zgartirish uchun bosing" : "Rasm yuklash uchun bosing"}
                    </div>
                  </div>
                </div>

                {/* FULL NAME */}
                <div className="di-field">
                  <label className="di-label">TO'LIQ ISM *</label>
                  <input className="di-input" placeholder="Sardorbek Ergashev"
                    value={form.full_name} onChange={f("full_name")} />
                </div>

                {/* STACK + EXPERIENCE */}
                <div className="di-row">
                  <div className="di-field">
                    <label className="di-label">STACK</label>
                    <input className="di-input" placeholder="Python, Django, React"
                      value={form.stack} onChange={f("stack")} />
                  </div>
                  <div className="di-field">
                    <label className="di-label">TAJRIBA (yil)</label>
                    <input className="di-input" type="number" placeholder="2" min="0"
                      value={form.experience} onChange={f("experience")} />
                  </div>
                </div>

                {/* ABOUT — 3 tilda */}
                <div className="di-field">
                  <label className="di-label">O'ZINGIZ HAQINGIZDA</label>
                  <LangTabs lang={formLang} setLang={setFormLang} />
                  {formLang === "uz" && <textarea className="di-textarea" placeholder="Men full-stack dasturchiman..." value={form.about_uz} onChange={f("about_uz")} />}
                  {formLang === "ru" && <textarea className="di-textarea" placeholder="Я full-stack разработчик..." value={form.about_ru} onChange={f("about_ru")} />}
                  {formLang === "en" && <textarea className="di-textarea" placeholder="I am a full-stack developer..." value={form.about_en} onChange={f("about_en")} />}
                </div>

                {/* EMAIL + PHONE */}
                <div className="di-row">
                  <div className="di-field">
                    <label className="di-label">EMAIL</label>
                    <input className="di-input" type="email" placeholder="email@example.com"
                      value={form.email} onChange={f("email")} />
                  </div>
                  <div className="di-field">
                    <label className="di-label">TELEFON</label>
                    <input className="di-input" placeholder="+998 90 123 45 67"
                      value={form.phone} onChange={f("phone")} />
                  </div>
                </div>

                {/* TELEGRAM */}
                <div className="di-field">
                  <label className="di-label">TELEGRAM CHAT ID</label>
                  <input className="di-input" placeholder="123456789"
                    value={form.telegram_chat_id} onChange={f("telegram_chat_id")} />
                  <div className="di-tg-hint">
                    Chat ID olish uchun <span>@userinfobot</span> ga /start yuboring
                  </div>
                </div>
              </div>

              <div className="di-modal-foot">
                <button className="di-btn-cancel" onClick={close}>Bekor qilish</button>
                <button className="di-btn-save" onClick={save} disabled={saving || !form.full_name}>
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