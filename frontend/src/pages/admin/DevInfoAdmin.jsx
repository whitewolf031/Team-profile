// src/components/admin/DevInfoAdmin.jsx
import { useState, useEffect } from 'react';
import api from '../../api';
// import '../../styles/DevInfoAdmin.css';

function DevInfoAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    stack: '',
    experience: '',
    about: '',
    email: '',
    phone: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api
      .get('/api/admin-control/dev/') // yoki /info/ yoki sizning endpoint
      .then((res) => setData(Array.isArray(res.data) ? res.data : [res.data]))
      .catch((err) => console.error(err));
  };

  const resetForm = () => {
    setForm({
      full_name: '',
      stack: '',
      experience: '',
      about: '',
      email: '',
      phone: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({
      full_name: item.full_name || '',
      stack: item.stack || '',
      experience: item.experience || '',
      about: item.about || '',
      email: item.email || '',
      phone: item.phone || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haqiqatan o‘chirmoqchimisiz?')) return;
    try {
      await api.delete(`/api/admin-control/dev/${id}/`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('O‘chirishda xatolik');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        experience: form.experience ? Number(form.experience) : null,
      };

      if (editingId) {
        await api.put(`/api/admin-control/dev/${editingId}/`, payload);
      } else {
        await api.post('/api/admin-control/dev/', payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Saqlashda xatolik yuz berdi');
    }
  };

  return (
    <div className="devinfo-admin">
      <h2>Shaxsiy ma'lumotlar (Info)</h2>
      <button className="create-button" onClick={() => setShowForm(true)}>
        + Yangi ma'lumot qo'shish
      </button>

      <hr className="divider" />

      {data.length === 0 && <p className="no-data">Ma'lumot yo‘q</p>}

      {data.map((item) => (
        <div key={item.id} className="info-box">
          <h3 className="box-title">{item.full_name}</h3>
          <p className="box-stack">
            <strong>Stack:</strong> {item.stack || '—'}
          </p>
          <p>
            <strong>Tajriba:</strong> {item.experience ? `${item.experience} yil` : '—'}
          </p>
          <p className="box-about">{item.about || '—'}</p>
          <p>
            <strong>Email:</strong> {item.email || '—'}
          </p>
          <p>
            <strong>Telefon:</strong> {item.phone || '—'}
          </p>

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
        <form onSubmit={handleSubmit} className="info-form">
          <h3 className="form-title">{editingId ? 'Ma‘lumotni tahrirlash' : 'Yangi ma‘lumot qo‘shish'}</h3>

          <input className="form-input" placeholder="To'liq ism" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />

          <input className="form-input" placeholder="Texnologiya stack (masalan: Python, Django, React)" value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} />

          <input className="form-input" type="number" placeholder="Umumiy tajriba (yil)" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} min="0" />

          <textarea className="form-textarea" placeholder="O'zingiz haqingizda (about)" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} required />

          <input className="form-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

          <input className="form-input" placeholder="Telefon raqami" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <div className="form-actions">
            <button className="save-button" type="submit">
              Saqlash
            </button>
            <button className="cancel-button" type="button" onClick={resetForm}>
              Bekor qilish
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default DevInfoAdmin;