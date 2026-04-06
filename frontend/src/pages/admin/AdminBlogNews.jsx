import React, { useState, useRef, useEffect } from "react";
import api from "../../api";
import "../../styles/AdminBlogNews.css";

const AdminBlogNews = () => {
  const [blogs, setBlogs] = useState([]);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [lang, setLang] = useState("uz");

  const imgInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [authors, setAuthors] = useState([]);
  const [newsTypes, setNewsTypes] = useState([]);

  const [form, setForm] = useState({
    title_uz: "", title_ru: "", title_en: "",
    content_uz: "", content_ru: "", content_en: "",
    news_type: "world-news",
    author: "",
    image: null,
    video: null,
    is_published: true,
    send_to_telegram: false
  });

  // Bloglarni yuklash
  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/admin-control/news/");
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Bloglarni yuklashda xatolik:", error);
    }
  };

  // Authorlarni yuklash
  const fetchAuthors = async () => {
    try {
      const res = await api.get("/api/admin-control/dev/");
      const devInfos = Array.isArray(res.data) ? res.data : [];

      const authorOptions = [
        { value: "", label: "Tanlang..." },
        ...devInfos.map((p) => ({
          value: p.id.toString(),
          label: p.full_name_uz || p.full_name_ru || p.full_name_en || `User ${p.id}`
        }))
      ];
      setAuthors(authorOptions);
    } catch (error) {
      console.error("Authorlarni yuklashda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchAuthors();

    setNewsTypes([
      { value: "world-news", label: "World News" },
      { value: "it-news", label: "IT News" },
      { value: "cybersecurity-news", label: "Cybersecurity News" }
    ]);
  }, []);

  // Modalni ochish (qo‘shish yoki tahrirlash)
  const openModal = (blog = null) => {
    if (blog) {
      setEditingId(blog.id);
      setForm({
        title_uz: blog.title_uz || "",
        title_ru: blog.title_ru || "",
        title_en: blog.title_en || "",
        content_uz: blog.content_uz || "",
        content_ru: blog.content_ru || "",
        content_en: blog.content_en || "",
        news_type: blog.news_type || "world-news",
        author: blog.author ? String(blog.author) : "",
        is_published: !!blog.is_published,
        send_to_telegram: !!blog.send_to_telegram,
        image: null,      // Yangi yuklash uchun bo'sh
        video: null       // Yangi yuklash uchun bo'sh
      });
    } else {
      setEditingId(null);
      setForm({
        title_uz: "", title_ru: "", title_en: "",
        content_uz: "", content_ru: "", content_en: "",
        news_type: "world-news",
        author: "",
        image: null,
        video: null,
        is_published: true,
        send_to_telegram: false
      });
    }
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e, type) => {
    if (e.target.files[0]) {
      setForm(prev => ({ ...prev, [type]: e.target.files[0] }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("title_uz", form.title_uz);
    formData.append("title_ru", form.title_ru);
    formData.append("title_en", form.title_en);
    formData.append("content_uz", form.content_uz);
    formData.append("content_ru", form.content_ru);
    formData.append("content_en", form.content_en);
    formData.append("news_type", form.news_type);

    if (form.author) formData.append("author", form.author);
    if (form.image) formData.append("image", form.image);
    if (form.video) formData.append("video", form.video);
    formData.append("is_published", form.is_published);
    formData.append("send_to_telegram", form.send_to_telegram);

    try {
      if (editingId) {
        await api.patch(`/api/admin-control/news/${editingId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("✅ Blog muvaffaqiyatli yangilandi!");
      } else {
        await api.post("/api/admin-control/news/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("✅ Yangi blog muvaffaqiyatli qo'shildi!");
      }

      closeModal();
      fetchBlogs();
    } catch (error) {
      console.error(error);
      alert(`❌ Xatolik: ${error.response?.data?.detail || "Noma'lum xatolik"}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Rostdan ham ushbu blogni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/api/admin-control/news/${id}/`);
      alert("✅ Blog o'chirildi!");
      fetchBlogs();
    } catch (error) {
      alert("❌ O'chirishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="ac-main-container">
      <div className="blog-header-section">
        <div className="blog-header-top">
          <h2 className="blog-title-white">Blog & News</h2>
          <p className="subtitle">// Ma'lumotlarni tahrirlash paneli</p>
        </div>
        <button onClick={() => openModal()} className="new-add-btn">
          <span>+</span> Yangi qo'shish
        </button>
      </div>

      {/* Bloglar ro'yxati */}
      <div className="blog-list">
        {blogs.length === 0 ? (
          <div className="empty-state-centered">
            <p>// ma'lumot topilmadi</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="di-card blog-card">
              <div className="blog-card-content">
                <h3 className="di-name">{blog.title_uz || "Sarlavhasiz"}</h3>
                <div className="di-meta">
                  <span className="di-tag di-tag-blue">{blog.news_type}</span>
                  <span className="di-tag di-tag-green">
                    {new Date(blog.created_at).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                <p className="di-text">
                  {blog.content_uz ? blog.content_uz.substring(0, 100) + "..." : "Matn yo‘q"}
                </p>
              </div>

              <div className="di-actions">
                <button className="di-btn-icon" onClick={() => openModal(blog)} title="Tahrirlash">✏️</button>
                <button className="di-btn-icon danger" onClick={() => handleDelete(blog.id)} title="O'chirish">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - Tahrirlash / Qo'shish */}
      {modal && (
        <div className="modal-portal">
          <div className="modal-overlay" onClick={closeModal} />
          <div className="modal-card animate-in">
            <div className="modal-header-new">
              <h3 className="modal-title-new">
                {editingId ? "Blogni tahrirlash" : "Yangi blog qo'shish"}
              </h3>
              <button onClick={closeModal} className="close-x-btn-new">&times;</button>
            </div>

            <div className="modal-scroll-area">
              {/* Rasm yuklash */}
              <div className={`upload-zone ${form.image ? 'has-file' : ''}`} onClick={() => imgInputRef.current.click()}>
                <input type="file" ref={imgInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                <div className="upload-content">
                  <span className="icon">🖼️</span>
                  <p>{form.image ? form.image.name : "Rasm yuklash uchun bosing"}</p>
                </div>
              </div>

              {/* Til tanlash */}
              <div className="lang-tabs">
                <button onClick={() => setLang('uz')} className={lang === 'uz' ? "active" : ""}>uz UZ</button>
                <button onClick={() => setLang('ru')} className={lang === 'ru' ? "active" : ""}>RU RU</button>
                <button onClick={() => setLang('en')} className={lang === 'en' ? "active" : ""}>GB EN</button>
              </div>

              {/* Sarlavha */}
              <div className="input-group">
                <label>SARLAVHA * ({lang.toUpperCase()})</label>
                <input 
                  type="text" 
                  name={`title_${lang}`} 
                  value={form[`title_${lang}`]} 
                  onChange={handleChange} 
                  className="di-input" 
                  placeholder="Sarlavhani kiriting..." 
                />
              </div>

              {/* Matn */}
              <div className="input-group">
                <label>BLOG MATNI ({lang.toUpperCase()})</label>
                <textarea 
                  name={`content_${lang}`} 
                  value={form[`content_${lang}`]} 
                  onChange={handleChange} 
                  className="di-input di-area" 
                  placeholder="Matnni kiriting..." 
                />
              </div>

              {/* Muallif va Yangilik turi */}
              <div className="form-grid">
                <div className="input-group">
                  <label>MUALLIF</label>
                  <select name="author" value={form.author} onChange={handleChange} className="di-input">
                    {authors.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>YANGILIK TURI</label>
                  <select name="news_type" value={form.news_type} onChange={handleChange} className="di-input">
                    {newsTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video yuklash */}
              <div className="input-group">
                <label>VIDEO (Ixtiyoriy)</label>
                <div className={`upload-zone ${form.video ? 'has-file' : ''}`} onClick={() => videoInputRef.current.click()}>
                  <input type="file" ref={videoInputRef} hidden accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
                  <div className="upload-content">
                    <span className="icon">🎥</span>
                    <p>{form.video ? form.video.name : "Video faylni tanlang..."}</p>
                  </div>
                </div>
              </div>

              {/* Switches */}
              <div className="settings-panel">
                <label className="switch-item">
                  <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} />
                  <span>Nashr qilish (Published)</span>
                </label>
                <label className="switch-item">
                  <input type="checkbox" name="send_to_telegram" checked={form.send_to_telegram} onChange={handleChange} />
                  <span>Telegramga yuborish</span>
                </label>
              </div>
            </div>

            <div className="modal-footer-new">
              <button onClick={closeModal} className="btn-cancel-new">Bekor qilish</button>
              <button onClick={handleSubmit} className="btn-save-new">
                {editingId ? "Yangilash" : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogNews;