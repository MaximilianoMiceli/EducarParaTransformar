import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

export default function News() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', summary: '', tag: '' });

  useEffect(() => {
    fetch('http://localhost:3001/api/news')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.summary) {
      const postData = {
        title: newPost.title,
        summary: newPost.summary,
        tag: newPost.tag || 'General',
        date: 'Justo ahora'
      };
      fetch('http://localhost:3001/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })
      .then(res => res.json())
      .then(savedPost => {
        setItems([savedPost, ...items]);
        setNewPost({ title: '', summary: '', tag: '' });
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta noticia?')) {
      fetch(`http://localhost:3001/api/news/${id}`, { method: 'DELETE' })
        .then(() => {
          setItems(items.filter(item => item.id !== id));
        });
    }
  };

  const canCreate = user && (user.role === 'autoridad' || user.role === 'docente');

  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-bg-white)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Noticias y Novedades</h1>
          </div>
          
          {canCreate && (
            <div className="card" style={{ marginBottom: '48px', backgroundColor: '#F8FAFC' }}>
              <div className="card-body">
                <h3>Publicar Nueva Noticia</h3>
                <form onSubmit={handleCreate} style={{ marginTop: '16px' }}>
                  <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Título</label>
                      <input required type="text" className="form-input" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Etiqueta (Ej. Primaria)</label>
                      <input type="text" className="form-input" value={newPost.tag} onChange={e => setNewPost({...newPost, tag: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Resumen de la Noticia</label>
                    <textarea required className="form-textarea" rows="2" value={newPost.summary} onChange={e => setNewPost({...newPost, summary: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Publicar</button>
                </form>
              </div>
            </div>
          )}

          <div className="grid-3">
            {items.map(item => (
              <div key={item.id} className="card">
                <div style={{ height: '180px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#64748B' }}>[Imagen de la noticia]</span>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-accent-orange)', fontWeight: 'bold' }}>{item.tag} • {item.date}</span>
                    {canCreate && (
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent-red)' }} title="Eliminar noticia">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <h3 style={{ margin: '12px 0' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>{item.summary}</p>
                  <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Leer más →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
