import { useState, useEffect } from "react";
import api from "../../api";

const Icon = ({ name }) => {
  const icons = {
    plus:  "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    edit:  "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    trash: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={icons[name]} /></svg>;
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap');
  .ex-wrap { font-family: 'Syne', sans-serif; color: #e2e8f0; }
  .ex-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .ex-title { font-size: 1.5rem; font-weight: 800; }
  .ex-sub { color: #64748b; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .ex-btn-primary { background: linear-gradient(135deg, #38bdf8, #0ea5e9); border: none; color: #0a0e1a; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .ex-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(56,189,248,0.3); }
  .ex-card { background: #111827; border: 1px solid #1e2d45; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; display: flex; gap: 1rem; align-items: flex-start; transition: border-color 0.2s; }
  .ex-card:hover { border-color: rgba(56,189,248,0.3); }
  .ex-body { flex: 1; min-width: 0; }
  .ex-name { font-size: 1rem; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .ex-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
  .ex-tag { font-size: 0.7rem; padding: 2px 10px; border-radius: 20px; font-family: 'JetBrains Mono', monospace; }
  .ex-tag-blue   { background: rgba(56,189,248,0.08);  border: 1px solid rgba(56,189,248,0.2);  color: #38bdf8; }
  .ex-tag-green  { background: rgba(52,211,153,0.08);  border: 1px solid rgba(52,211,153,0.2);  color: #34d399; }
  .ex-tag-purple { background: rgba(129,140,248,0.08); border: 1px solid rgba(129,140,248,0.2); color: #818cf8; }
  .ex-tag-yellow { background: rgba(251,191,36,0.08);  border: 1px solid rgba(251,191,36,0.2);  color: #fbbf24; }
  .ex-text { color: #64748b; font-size: 0.82rem; line-height: 1.5; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ex-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .ex-btn-icon { background: #1a2235; border: 1px solid #1e2d45; color: #64748b; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .ex-btn-icon:hover        { color: #38bdf8; border-color: #38bdf8; background: rgba(56,189,248,0.08); }
  .ex-btn-icon.danger:hover { color: #f87171; border-color: #f87171; background: rgba(248,113,113,0.08); }
  .ex-empty { text-align: center; padding: 3rem; color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
  .ex-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .ex-modal { background: #111827; border: 1px solid #1e2d45; border-radius: 16px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
  .ex-modal-head { padding: 1.2rem 1.5rem; border-bottom: 1px solid #1e2d45; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #111827; z-index: 1; }
  .ex-modal-title { font-size: 1rem; font-weight: 700; }
  .ex-modal-close { background: none; border: none; color: #64748b; cursor: pointer; display: flex; transition: color 0.2s; }
  .ex-modal-close:hover { color: #e2e8f0; }
  .ex-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .ex-modal-foot { padding: 1rem 1.5rem; border-top: 1px solid #1e2d45; display: flex; gap: 0.75rem; justify-content: flex-end; }
  .ex-field { display: flex; flex-direction: column; gap: 6px; }
  .ex-label { font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: #64748b; letter-spacing: 0.5px; }
  .ex-input, .ex-textarea, .ex-select { background: #1a2235; border: 1px solid #1e2d45; color: #e2e8f0; padding: 10px 14px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 0.9rem; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
  .ex-input:focus, .ex-textarea:focus, .ex-select:focus { outline: none; border-color: #38bdf8; }
  .ex-textarea { resize: vertical; min-height: 90px; }
  .ex-select option { background: #1a2235; }
  .ex-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .ex-check { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #64748b; cursor: pointer; }
  .ex-check input { accent-color: #38bdf8; width: 16px; height: 16px; }
  .ex-btn-cancel { background: #1a2235; border: 1px solid #1e2d45; color: #64748b; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 0.85rem; transition: all 0.2s; }
  .ex-btn-cancel:hover { color: #e2e8f0; }
  .ex-btn-save { background: linear-gradient(135deg, #38bdf8, #0ea5e9); border: none; color: #0a0e1a; padding: 8px 22px; border-radius: 8px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .ex-btn-save:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(56,189,248,0.3); }
  .ex-btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .ex-error { background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); color: #f87171; padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; font-family: 'JetBrains Mono', monospace; }
  .ex-dev-badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 6px; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); color: #34d399; font-family: 'JetBrains Mono', monospace; }
`;

const TYPE_LABELS = { full_time: "To'liq stavka", part_time: "Yarim stavka", both: "Full & Part-time" };
const TYPE_COLORS = { full_time: "ex-tag-blue", part_time: "ex-tag-yellow", both: "ex-tag-purple" };

const EMPTY_FORM = {
  dev: "", title: "", company: "", employment_type: "full_time", location: "",
  start_date: "", end_date: "", is_current: false,
  achievements: "", responsibilities: "", teaching_focus: "", student_count: "", age_range: "",
};

export default function ExperienceAdmin() {
  const [data, setData]       = useState([]);
  const [devList, setDevList] = useState([]);   // ✅ dev list
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState(EMPTY_FORM);

  const load = () =>
    api.get("/api/admin-control/experience/")
      .then((res) => setData(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);

  // ✅ Dev list ni yuklash
  const loadDevs = () =>
    api.get("/api/admin-control/dev/")
      .then((res) => setDevList(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);

  useEffect(() => { load(); loadDevs(); }, []);

  const open = (item = null) => {
    setError("");
    if (item) {
      setForm({
        dev:             item.dev             || "",
        title:           item.title           || "",
        company:         item.company         || "",
        employment_type: item.employment_type || "full_time",
        location:        item.location        || "",
        start_date:      item.start_date ? item.start_date.split("T")[0] : "",
        end_date:        item.end_date   ? item.end_date.split("T")[0]   : "",
        is_current:      !!item.is_current,
        achievements:    item.achievements    || "",
        responsibilities: item.responsibilities || "",
        teaching_focus:  item.teaching_focus  || "",
        student_count:   item.student_count   || "",
        age_range:       item.age_range       || "",
      });
      setEditing(item.id);
    } else {
      // ✅ Agar bitta dev bo'lsa avtomatik tanlash
      setForm({ ...EMPTY_FORM, dev: devList.length === 1 ? devList[0].id : "" });
      setEditing(null);
    }
    setModal(true);
  };

  const close = () => { setModal(false); setEditing(null); setError(""); };

  const save = async () => {
    setError("");
    if (!form.dev) { setError("// Dev tanlanmagan!"); return; }
    if (!form.title) { setError("// Lavozim kiritilmagan!"); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        dev: Number(form.dev),
        student_count: form.student_count ? Number(form.student_count) : null,
        end_date: form.is_current ? null : (form.end_date || null),
      };
      if (editing) await api.put(`/api/admin-control/experience/${editing}/`, payload);
      else         await api.post("/api/admin-control/experience/", payload);
      close(); load();
    } catch (e) {
      console.error(e);
      setError("// Saqlashda xato: " + (e.response?.data ? JSON.stringify(e.response.data) : e.message));
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/api/admin-control/experience/${id}/`);
    load();
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  // dev nomini topish
  const devName = (id) => devList.find((d) => d.id === id)?.full_name || `Dev #${id}`;

  return (
    <>
      <style>{css}</style>
      <div className="ex-wrap">
        <div className="ex-topbar">
          <div>
            <div className="ex-title">Experience</div>
            <div className="ex-sub">// ish tajribasi</div>
          </div>
          <button className="ex-btn-primary" onClick={() => open()}>
            <Icon name="plus" /> Yangi qo'shish
          </button>
        </div>

        {data.length === 0 && <div className="ex-empty">// ma'lumot topilmadi</div>}

        {data.map((item) => (
          <div key={item.id} className="ex-card">
            <div className="ex-body">
              <div className="ex-name">
                {item.title}
                {item.is_current && <span className="ex-tag ex-tag-green" style={{ fontSize: "0.65rem" }}>Hozirgi</span>}
                {/* ✅ Qaysi devga bog'liqligini ko'rsatish */}
                {item.dev && <span className="ex-dev-badge">👤 {devName(item.dev)}</span>}
              </div>
              <div className="ex-meta">
                {item.company && <span className="ex-tag ex-tag-blue">{item.company}</span>}
                <span className={`ex-tag ${TYPE_COLORS[item.employment_type] || "ex-tag-blue"}`}>
                  {TYPE_LABELS[item.employment_type] || item.employment_type}
                </span>
                {item.location && <span className="ex-tag ex-tag-purple">{item.location}</span>}
                <span className="ex-tag ex-tag-yellow">
                  {item.start_date?.slice(0, 7)} — {item.is_current ? "Hozirgacha" : item.end_date?.slice(0, 7) || "—"}
                </span>
              </div>
              {item.responsibilities && <div className="ex-text">{item.responsibilities}</div>}
              {item.achievements     && <div className="ex-text" style={{ color: "#34d399" }}>{item.achievements}</div>}
            </div>
            <div className="ex-actions">
              <button className="ex-btn-icon" onClick={() => open(item)} title="Tahrirlash"><Icon name="edit" /></button>
              <button className="ex-btn-icon danger" onClick={() => del(item.id)} title="O'chirish"><Icon name="trash" /></button>
            </div>
          </div>
        ))}

        {modal && (
          <div className="ex-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="ex-modal">
              <div className="ex-modal-head">
                <span className="ex-modal-title">{editing ? "Tajribani tahrirlash" : "Yangi tajriba"}</span>
                <button className="ex-modal-close" onClick={close}><Icon name="close" /></button>
              </div>
              <div className="ex-modal-body">

                {/* ✅ DEV TANLASH */}
                <div className="ex-field">
                  <label className="ex-label">DEV (kimga bog'lash) *</label>
                  <select className="ex-select" value={form.dev} onChange={f("dev")}>
                    <option value="">— Tanlang —</option>
                    {devList.map((d) => (
                      <option key={d.id} value={d.id}>{d.full_name}</option>
                    ))}
                  </select>
                </div>

                {error && <div className="ex-error">{error}</div>}

                <div className="ex-row">
                  <div className="ex-field">
                    <label className="ex-label">LAVOZIM *</label>
                    <input className="ex-input" placeholder="Backend Developer" value={form.title} onChange={f("title")} />
                  </div>
                  <div className="ex-field">
                    <label className="ex-label">KOMPANIYA</label>
                    <input className="ex-input" placeholder="Iqro Agency" value={form.company} onChange={f("company")} />
                  </div>
                </div>

                <div className="ex-row">
                  <div className="ex-field">
                    <label className="ex-label">BAND TURI</label>
                    <select className="ex-select" value={form.employment_type} onChange={f("employment_type")}>
                      <option value="full_time">To'liq stavka</option>
                      <option value="part_time">Yarim stavka</option>
                      <option value="both">Full & Part-time</option>
                    </select>
                  </div>
                  <div className="ex-field">
                    <label className="ex-label">JOYLASHUV</label>
                    <input className="ex-input" placeholder="Toshkent, Remote" value={form.location} onChange={f("location")} />
                  </div>
                </div>

                <div className="ex-row">
                  <div className="ex-field">
                    <label className="ex-label">BOSHLANGAN SANA</label>
                    <input className="ex-input" type="date" value={form.start_date} onChange={f("start_date")} />
                  </div>
                  {!form.is_current && (
                    <div className="ex-field">
                      <label className="ex-label">TUGAGAN SANA</label>
                      <input className="ex-input" type="date" value={form.end_date} onChange={f("end_date")} />
                    </div>
                  )}
                </div>

                <label className="ex-check">
                  <input type="checkbox" checked={form.is_current} onChange={f("is_current")} />
                  Hozirgi ish joyi
                </label>

                <div className="ex-field">
                  <label className="ex-label">ASOSIY VAZIFALAR</label>
                  <textarea className="ex-textarea" placeholder="API yaratish, ma'lumotlar bazasini boshqarish..." value={form.responsibilities} onChange={f("responsibilities")} />
                </div>

                <div className="ex-field">
                  <label className="ex-label">YUTUQLAR</label>
                  <textarea className="ex-textarea" placeholder="Loyiha vaqtida 40% tezlikni oshirdim..." value={form.achievements} onChange={f("achievements")} />
                </div>

                <div className="ex-row">
                  <div className="ex-field">
                    <label className="ex-label">O'QITISH YO'NALISHI</label>
                    <input className="ex-input" placeholder="Python, Backend" value={form.teaching_focus} onChange={f("teaching_focus")} />
                  </div>
                  <div className="ex-field">
                    <label className="ex-label">O'QUVCHILAR SONI</label>
                    <input className="ex-input" type="number" placeholder="50" min="0" value={form.student_count} onChange={f("student_count")} />
                  </div>
                </div>

                <div className="ex-field">
                  <label className="ex-label">YOSH ORALIG'I</label>
                  <input className="ex-input" placeholder="12–18" value={form.age_range} onChange={f("age_range")} />
                </div>
              </div>

              <div className="ex-modal-foot">
                <button className="ex-btn-cancel" onClick={close}>Bekor qilish</button>
                <button className="ex-btn-save" onClick={save} disabled={saving || !form.title || !form.dev}>
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