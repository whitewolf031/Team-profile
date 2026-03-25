import { useState, useEffect } from "react";
import "../../styles/AdminContact.css";

const API_BASE = "/api/admin-control/contact/";
const ACCESS_TOKEN = "access_token";

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("uz-UZ", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  /* ── Fetch ── */
  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await fetch(API_BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      // 401 / 403 — token muammosi
      if (res.status === 401 || res.status === 403) {
        throw new Error(`Ruxsat yo'q (${res.status}) — token noto'g'ri yoki muddati o'tgan`);
      }

      if (!res.ok) throw new Error(`Server xatosi: ${res.status} ${res.statusText}`);

      const text = await res.text();

      // bo'sh body (304 yoki boshqa)
      if (!text || text.trim() === "") {
        setContacts([]);
        return;
      }

      const data = JSON.parse(text);
      setContacts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Bu kontaktni o'chirishni tasdiqlaysizmi?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_BASE}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      alert("O'chirishda xatolik: " + e.message);
    } finally {
      setDeleting(null);
    }
  };

  /* ── UI ── */
  return (
    <div className="ac-contact">
      <div className="ac-contact-header">
        <div>
          <h3 className="ac-contact-title">
            <span className="ac-contact-title-icon">📬</span> Kontaktlar
          </h3>
          <p className="ac-contact-sub">Foydalanuvchilardan kelgan xabarlar</p>
        </div>
        <button className="ac-contact-refresh" onClick={fetchContacts} title="Yangilash">
          ↻
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="ac-contact-error">
          <span>⚠ {error}</span>
          <button onClick={fetchContacts}>Qayta urinish</button>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="ac-contact-loading">
          <span className="ac-contact-spinner" />
          Yuklanmoqda...
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && contacts.length === 0 && (
        <div className="ac-contact-empty">
          <div className="ac-contact-empty-icon">📭</div>
          <p>Hozircha ma'lumotlar yo'q</p>
        </div>
      )}

      {/* ── Table ── */}
      {!loading && !error && contacts.length > 0 && (
        <div className="ac-contact-table-wrap">
          <table className="ac-contact-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ism</th>
                <th>Telefon</th>
                <th>Telegram</th>
                <th>Xabar</th>
                <th>Sana</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={c.id} className="ac-contact-row">
                  <td className="ac-contact-num">{i + 1}</td>
                  <td className="ac-contact-name">{c.name}</td>
                  <td>
                    <a href={`tel:${c.phone_number}`} className="ac-contact-link">
                      {c.phone_number}
                    </a>
                  </td>
                  <td>
                    {c.telegram_username ? (
                      <a
                        href={`https://t.me/${c.telegram_username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ac-contact-link tg"
                      >
                        @{c.telegram_username}
                      </a>
                    ) : (
                      <span className="ac-contact-none">—</span>
                    )}
                  </td>
                  <td className="ac-contact-msg-preview">
                    {c.message.length > 40 ? c.message.slice(0, 40) + "…" : c.message}
                  </td>
                  <td className="ac-contact-date">{formatDate(c.created_at)}</td>
                  <td>
                    <button
                      className="ac-contact-eye"
                      onClick={() => setSelected(c)}
                      title="Batafsil ko'rish"
                    >
                      ✏
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="ac-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ac-modal-close" onClick={() => setSelected(null)}>✕</button>

            <div className="ac-modal-header">
              <div className="ac-modal-avatar">
                {selected.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="ac-modal-name">{selected.name}</h4>
                <span className="ac-modal-id">ID: {selected.id}</span>
              </div>
            </div>

            <div className="ac-modal-fields">
              <div className="ac-modal-field">
                <span className="ac-modal-label">📞 Telefon</span>
                <a href={`tel:${selected.phone_number}`} className="ac-contact-link">
                  {selected.phone_number}
                </a>
              </div>
              <div className="ac-modal-field">
                <span className="ac-modal-label">✈ Telegram</span>
                {selected.telegram_username ? (
                  <a
                    href={`https://t.me/${selected.telegram_username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ac-contact-link tg"
                  >
                    @{selected.telegram_username}
                  </a>
                ) : (
                  <span className="ac-contact-none">Ko'rsatilmagan</span>
                )}
              </div>
              <div className="ac-modal-field">
                <span className="ac-modal-label">🕐 Yuborilgan vaqt</span>
                <span>{formatDate(selected.created_at)}</span>
              </div>
              <div className="ac-modal-field ac-modal-field--full">
                <span className="ac-modal-label">💬 Xabar</span>
                <p className="ac-modal-message">{selected.message}</p>
              </div>
            </div>

            <div className="ac-modal-footer">
              <button
                className="ac-modal-delete"
                onClick={() => handleDelete(selected.id)}
                disabled={deleting === selected.id}
              >
                {deleting === selected.id ? "O'chirilmoqda…" : "🗑 O'chirish"}
              </button>
              <button className="ac-modal-cancel" onClick={() => setSelected(null)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}