import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, Image } from 'lucide-react';

export default function News() {
  const { user } = useAuth();
  const [noticias, setNoticias] = useState([]);
  const [nuevaNoticia, setNuevaNoticia] = useState({ title: '', summary: '', contenido: '', tag: 'General' });
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', summary: '', contenido: '', tag: 'General' });
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const editFileInputRef = useRef(null);

  const tagList = ['Todos', 'General', 'Primaria', 'Secundaria', 'Deportes', 'Eventos', 'Institucional'];

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNoticias(data))
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
    if (!nuevaNoticia.title || !nuevaNoticia.summary || !nuevaNoticia.contenido) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('title', nuevaNoticia.title);
    formData.append('summary', nuevaNoticia.summary);
    formData.append('contenido', nuevaNoticia.contenido);
    formData.append('tag', nuevaNoticia.tag || 'General');
    formData.append('date', new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }));
    if (selectedFile) {
      formData.append('imagen', selectedFile);
    }

    fetch('/api/news', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(savedPost => {
      setNoticias([savedPost, ...noticias]);
      setNuevaNoticia({ title: '', summary: '', contenido: '', tag: 'General' });
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    })
    .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta noticia?')) {
      fetch(`/api/news/${id}`, { method: 'DELETE' })
        .then(() => setNoticias(noticias.filter(item => item.id !== id)));
    }
  };

  const handleEditStart = (item) => {
    setEditingPost(item);
    setEditForm({
      title: item.title,
      summary: item.summary,
      contenido: item.contenido || '',
      tag: item.tag || 'General'
    });
    setEditFile(null);
    setEditPreview(item.imagen ? `${item.imagen}` : null);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editForm.title || !editForm.summary || !editForm.contenido) return;

    setEditLoading(true);

    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('summary', editForm.summary);
    formData.append('contenido', editForm.contenido);
    formData.append('tag', editForm.tag || 'General');
    if (editFile) {
      formData.append('imagen', editFile);
    }

    fetch(`/api/news/${editingPost.id}`, {
      method: 'PUT',
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al guardar los cambios');
      return res.json();
    })
    .then(updatedPost => {
      setNoticias(noticias.map(item => item.id === updatedPost.id ? updatedPost : item));
      setEditingPost(null);
      setEditFile(null);
      setEditPreview(null);
    })
    .catch(err => console.error(err))
    .finally(() => setEditLoading(false));
  };

  const canCreate = user && (user.role === 'autoridad' || user.role === 'docente');

  return (
    <div className="animate-fade-in">
      <section className="section section-news">
        <div className="container">
          <div className="news-header">
            <h1 className="section-title section-title-news">Noticias y Novedades</h1>
          </div>

          {canCreate && (
            <div className="card news-form-card">
              <div className="card-body">
                <h3>Publicar Nueva Noticia</h3>
                <form onSubmit={handleCreate} className="news-form">
                  <div className="grid-2 news-form-grid">
                    <div className="form-group form-group-tight">
                      <label className="form-label">Título</label>
                      <input required type="text" className="form-input" value={nuevaNoticia.title} onChange={e => setNuevaNoticia({ ...nuevaNoticia, title: e.target.value })} />
                    </div>
                    <div className="form-group form-group-tight">
                      <label className="form-label">Tema / Categoría</label>
                      <select className="form-select" value={nuevaNoticia.tag} onChange={e => setNuevaNoticia({ ...nuevaNoticia, tag: e.target.value })}>
                        <option value="General">General</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Deportes">Deportes</option>
                        <option value="Eventos">Eventos</option>
                        <option value="Institucional">Institucional</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Resumen de la Noticia (Texto corto para la tarjeta)</label>
                    <textarea required className="form-textarea" rows="2" placeholder="Escribe un breve resumen de la noticia..." value={nuevaNoticia.summary} onChange={e => setNuevaNoticia({ ...nuevaNoticia, summary: e.target.value })}></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contenido Completo de la Noticia</label>
                    <textarea required className="form-textarea" rows="6" placeholder="Escribe el desarrollo completo de la noticia aquí..." value={nuevaNoticia.contenido} onChange={e => setNuevaNoticia({ ...nuevaNoticia, contenido: e.target.value })}></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Imagen (opcional)</label>
                    <div className="news-upload-zone" onClick={() => fileInputRef.current?.click()}>
                      {preview ? (
                        <img src={preview} alt="preview" className="news-upload-preview" />
                      ) : (
                        <Image size={28} color="#94A3B8" />
                      )}
                      <span className="news-upload-text">
                        {selectedFile ? selectedFile.name : 'Hacer clic para seleccionar una imagen'}
                      </span>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar'}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="news-filter-bar">
            {tagList.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`news-filter-button ${selectedTag === tag ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {noticias.filter(item => selectedTag === 'Todos' || item.tag === selectedTag).length === 0 ? (
              <div className="news-empty-state">
                <h3>No hay noticias</h3>
                <p>No se encontraron novedades publicadas bajo el tema "{selectedTag}".</p>
              </div>
            ) : (
              noticias
                .filter(item => selectedTag === 'Todos' || item.tag === selectedTag)
                .map(item => (
                  <div key={item.id} className="card news-card">
                    <Link to={`/noticias/${item.id}`} className="news-image-link">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.title} className="news-card-image" />
                      ) : (
                        <div className="news-card-placeholder">
                          <Image size={36} color="#94A3B8" />
                        </div>
                      )}
                    </Link>
                    <div className="card-body news-card-body">
                      <div className="news-card-header">
                        <span className="news-card-meta">{item.tag} • {item.date}</span>
                        {canCreate && (
                          <div className="news-action-group">
                            <button onClick={() => handleEditStart(item)} className="news-action-button" title="Editar noticia">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="news-action-button danger" title="Eliminar noticia">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                      <Link to={`/noticias/${item.id}`}>
                        <h3 className="news-card-title">{item.title}</h3>
                      </Link>
                      <p className="news-card-summary">{item.summary}</p>
                      <Link to={`/noticias/${item.id}`} className="news-read-more">Leer más →</Link>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </section>

      {editingPost && (
        <div className="news-edit-modal-overlay">
          <div className="card animate-fade-in news-edit-modal-card">
            <div className="card-body news-edit-modal-body">
              <h2 className="news-edit-title">
                <Edit size={24} color="var(--color-accent-orange)" />
                Editar Noticia
              </h2>

              <form onSubmit={handleEditSave}>
                <div className="grid-2 news-form-grid">
                  <div className="form-group form-group-tight">
                    <label className="form-label">Título</label>
                    <input required type="text" className="form-input" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                  </div>
                  <div className="form-group form-group-tight">
                    <label className="form-label">Tema / Categoría</label>
                    <select className="form-select" value={editForm.tag} onChange={e => setEditForm({ ...editForm, tag: e.target.value })}>
                      <option value="General">General</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Deportes">Deportes</option>
                      <option value="Eventos">Eventos</option>
                      <option value="Institucional">Institucional</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Resumen de la Noticia (Texto corto para la tarjeta)</label>
                  <textarea required className="form-textarea" rows="2" value={editForm.summary} onChange={e => setEditForm({ ...editForm, summary: e.target.value })}></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Contenido Completo de la Noticia</label>
                  <textarea required className="form-textarea" rows="6" value={editForm.contenido} onChange={e => setEditForm({ ...editForm, contenido: e.target.value })}></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Imagen de la Noticia</label>
                  <div className="news-upload-zone edit-upload-zone" onClick={() => editFileInputRef.current?.click()}>
                    {editPreview ? (
                      <img src={editPreview} alt="preview" className="news-upload-preview edit-preview" />
                    ) : (
                      <Image size={32} color="#94A3B8" />
                    )}
                    <div className="news-upload-copy">
                      <span className="news-upload-label">{editFile ? editFile.name : 'Cambiar Imagen'}</span>
                      <span className="news-upload-hint">Haga clic para seleccionar una nueva foto</span>
                    </div>
                  </div>
                  <input ref={editFileInputRef} type="file" accept="image/*" onChange={handleEditFileChange} style={{ display: 'none' }} />
                </div>

                <div className="news-edit-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingPost(null)} disabled={editLoading}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={editLoading}>
                    {editLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
