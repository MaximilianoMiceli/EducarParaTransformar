import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Image } from 'lucide-react';

export default function News() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', summary: '', tag: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/news')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.summary) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('summary', newPost.summary);
    formData.append('tag', newPost.tag || 'General');
    formData.append('date', new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }));
    if (selectedFile) {
      formData.append('imagen', selectedFile);
    }

    fetch('http://localhost:3001/api/news', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(savedPost => {
      setItems([savedPost, ...items]);
      setNewPost({ title: '', summary: '', tag: '' });
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    })
    .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta noticia?')) {
      fetch(`http://localhost:3001/api/news/${id}`, { method: 'DELETE' })
        .then(() => setItems(items.filter(item => item.id !== id)));
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

                  {/* Input de imagen */}
                  <div className="form-group">
                    <label className="form-label">Imagen (opcional)</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed #CBD5E1',
                        borderRadius: '8px',
                        padding: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#fff',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#CBD5E1'}
                    >
                      {preview ? (
                        <img src={preview} alt="preview" style={{ height: '60px', width: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <Image size={28} color="#94A3B8" />
                      )}
                      <span style={{ color: '#64748B', fontSize: '0.9rem' }}>
                        {selectedFile ? selectedFile.name : 'Hacer clic para seleccionar una imagen'}
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar'}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="grid-3">
            {items.map(item => (
              <div key={item.id} className="card">
                {item.imagen ? (
                  <img
                    src={`http://localhost:3001${item.imagen}`}
                    alt={item.title}
                    style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '180px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image size={36} color="#94A3B8" />
                  </div>
                )}
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
