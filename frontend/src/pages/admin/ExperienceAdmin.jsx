// src/components/admin/ExperienceAdmin.jsx
import { useState, useEffect } from 'react';
import api from '../../api';
// import '../../styles/ExperienceAdmin.css';

function ExperienceAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    title: '',
    company: '',
    employment_type: 'full_time',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    achievements: '',
    responsibilities: '',
    teaching_focus: '',
    student_count: '',
    age_range: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get('/api/admin-control/experience/').then((res) => setData(res.data)).catch(console.error);
  };

  const resetForm = () => {
    setForm({
      title: '',
      company: '',
      employment_type: 'full_time',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      achievements: '',
      responsibilities: '',
      teaching_focus: '',
      student_count: '',
      age_range: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || '',
      company: item.company || '',
      employment_type: item.employment_type || 'full_time',
      location: item.location || '',
      start_date: item.start_date ? item.start_date.split('T')[0] : '',
      end_date: item.end_date ? item.end_date.split('T')[0] : '',
      is_current: !!item.is_current,
      achievements: item.achievements || '',
      responsibilities: item.responsibilities || '',
      teaching_focus: item.teaching_focus || '',
      student_count: item.student_count || '',
      age_range: item.age_range || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ish tajribasini o‘chirmoqchimisiz?')) return;
    try {
      await api.delete(`/api/admin-control/experience/${id}/`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        student_count: form.student_count ? Number(form.student_count) : null,
      };

      if (editingId) {
        await api.put(`/api/admin-control/experience/${editingId}/`, payload);
      } else {
        await api.post('/api/admin-control/experience/', payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Saqlashda xato');
    }
  };

  return (
    <div className="experience-admin">
      <h2>Tajriba (Experience)</h2>
      <button className="create-button" onClick={() => setShowForm(true)}>
        + Yangi tajriba qo'shish
      </button>
      <hr className="divider" />

      {data.length === 0 && <p className="no-data">Ma'lumot yo‘q</p>}

      {data.map((item) => (
        <div key={item.id} className="experience-box">
          <h3 className="box-title">
            {item.title} {item.is_current && <span className="current-badge">Hozirgi</span>}
          </h3>
          <p className="box-company">{item.company}</p>
          <p className="box-type-location">
            {item.employment_type} • {item.location || '—'}
          </p>
          <p className="box-dates">
            {item.start_date} — {item.end_date || (item.is_current ? 'Hozirgacha' : '—')}
          </p>

          {item.responsibilities && (
            <p>
              <strong>Vazifalar:</strong> {item.responsibilities}
            </p>
          )}
          {item.achievements && (
            <p>
              <strong>Yutuqlar:</strong> {item.achievements}
            </p>
          )}

          <div className="box-actions">
            <button className="edit-button" onClick={() => handleEdit(item)}>
              O‘zgartirish
            </button>
            <button className="delete-button" onClick={() => handleDelete(item.id)}>
              O‘chirish
            </button>
          </div>
        </div>
      ))}

      {showForm && (
        <form onSubmit={handleSubmit} className="experience-form">
          <h3>{editingId ? 'Tahrirlash' : 'Yangi tajriba'}</h3>

          <input className="form-input" placeholder="Lavozim / Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <input className="form-input" placeholder="Kompaniya / Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />

          <select className="form-input" value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })}>
            <option value="full_time">To'liq stavka</option>
            <option value="part_time">Yarim stavka</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Stajirovka</option>
          </select>

          <input className="form-input" placeholder="Joylashuv (Toshkent, Remote...)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="date" className="form-input" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
            {!form.is_current && (
              <input type="date" className="form-input" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            )}
          </div>

          <label>
            <input type="checkbox" checked={form.is_current} onChange={(e) => setForm({ ...form, is_current: e.target.checked })} />
            Hozirgi ish joyi
          </label>

          <textarea className="form-textarea" placeholder="Asosiy vazifalar / Responsibilities" value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} />

          <textarea className="form-textarea" placeholder="Yutuqlar / Achievements" value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} />

          <input className="form-input" placeholder="O'qitish yo'nalishi (agar mavjud bo'lsa)" value={form.teaching_focus} onChange={(e) => setForm({ ...form, teaching_focus: e.target.value })} />

          <input type="number" className="form-input" placeholder="O'quvchilar soni (agar o'qituvchi bo'lsa)" value={form.student_count} onChange={(e) => setForm({ ...form, student_count: e.target.value })} min="0" />

          <input className="form-input" placeholder="Yosh oralig'i (mas: 12-18)" value={form.age_range} onChange={(e) => setForm({ ...form, age_range: e.target.value })} />

          <div className="form-actions">
            <button className="save-button" type="submit">Saqlash</button>
            <button className="cancel-button" type="button" onClick={resetForm}>Bekor qilish</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ExperienceAdmin;