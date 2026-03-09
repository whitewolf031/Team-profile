// src/components/admin/ProjectAdmin.jsx
import { useState, useEffect } from 'react';
import api from '../../api';
// import '../../styles/ProjectAdmin.css';

function ProjectAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    project_url: '',
    technologies: '', // frontendda string sifatida kiritiladi, keyin arrayga aylantiramiz
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get('/api/admin-control/projects/').then((res) => setData(res.data)).catch(console.error);
  };

  const resetForm = () => {
    setForm({ title: '', description: '', project_url: '', technologies: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || '',
      description: item.description || '',
      project_url: item.project_url || '',
      technologies: item.technologies ? item.technologies.join(', ') : '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Loyihani o‘chirmoqchimisiz?')) return;
    try {
      await api.delete(`/api/admin-control/projects/${id}/`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const technologiesArray = form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: form.title,
        description: form.description,
        project_url: form.project_url || null,
        technologies: technologiesArray,
      };

      if (editingId) {
        await api.put(`/api/admin-control/projects/${editingId}/`, payload);
      } else {
        await api.post('/api/admin-control/projects/', payload);
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Saqlashda xato');
    }
  };

  return (
    <div className="project-admin">
      <h2>Loyihalar (Projects)</h2>
      <button className="create-button" onClick={() => setShowForm(true)}>
        + Yangi loyiha qo'shish
      </button>
      <hr className="divider" />

      {data.length === 0 && <p className="no-data">Ma'lumot yo‘q</p>}

      {data.map((item) => (
        <div key={item.id} className="project-box">
          <h3 className="box-title">{item.title}</h3>
          <p className="box-description">{item.description}</p>

          {item.project_url && (
            <p>
              <strong>Link:</strong>{' '}
              <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                {item.project_url}
              </a>
            </p>
          )}

          <div className="tech-stack">
            {item.technologies?.length > 0 ? (
              item.technologies.map((tech, i) => (
                <span key={i} className="tech-tag">
                  {tech}
                </span>
              ))
            ) : (
              <span className="no-tech">—</span>
            )}
          </div>

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
        <form onSubmit={handleSubmit} className="project-form">
          <h3>{editingId ? 'Loyihani tahrirlash' : 'Yangi loyiha'}</h3>

          <input className="form-input" placeholder="Loyiha nomi" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <textarea className="form-textarea" placeholder="Tavsif" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />

          <input className="form-input" placeholder="Loyiha havolasi (GitHub, demo...)" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} />

          <input className="form-input" placeholder="Texnologiyalar (vergul bilan ajratilgan)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />

          <div className="form-actions">
            <button className="save-button" type="submit">Saqlash</button>
            <button className="cancel-button" type="button" onClick={resetForm}>Bekor qilish</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProjectAdmin;