import { ArrowRight, Star, Heart, BookOpen, Image, Clock, MapPin, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reviews from '../components/Reviews';

const getTagStyles = (tag) => {
  switch (tag?.toLowerCase()) {
    case 'institucional':
      return { color: '#2563EB', backgroundColor: 'rgba(59, 130, 246, 0.1)' };
    case 'deportes':
      return { color: '#16A34A', backgroundColor: 'rgba(22, 163, 74, 0.1)' };
    case 'familias':
      return { color: '#DB2777', backgroundColor: 'rgba(219, 39, 119, 0.1)' };
    default:
      return { color: '#475569', backgroundColor: 'rgba(71, 85, 105, 0.1)' };
  }
};

function HeroSection() {
  return (
    <section className="hero hero-home">
      <div className="container animate-fade-in hero-content">
        <span className="badge badge-orange hero-badge">Admisiones Abiertas</span>
        <h1 className="hero-title">Inspiramos, desafiamos y empoderamos</h1>
        <p className="hero-subtitle">
          Formando a los líderes del mañana con excelencia académica, valores humanos y una visión global.
        </p>
        <div className="hero-actions">
          <Link to="/inscripcion" className="btn btn-accent hero-link">
            Inscribite Hoy <ArrowRight size={18} />
          </Link>
          <Link to="/quienes-somos" className="btn hero-link-secondary">
            Conócenos
          </Link>
        </div>
      </div>
    </section>
  );
}

function NewsSection({ noticias }) {
  return (
    <section className="section bg-light">
      <div className="container">
        <h2 className="section-title">Últimas Noticias</h2>
        <div className="grid-3">
          {noticias.slice(0, 3).map((item) => (
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
                <span className="news-card-meta">{item.tag} • {item.date}</span>
                <Link to={`/noticias/${item.id}`}>
                  <h3 className="news-card-title">{item.title}</h3>
                </Link>
                <p className="news-card-summary">{item.summary}</p>
                <Link to={`/noticias/${item.id}`} className="news-read-more">Leer más →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, onOpen }) {
  return (
    <div
      className="card event-card"
      onClick={() => onOpen(event)}
    >
      <div className="event-date-box">
        <div className="event-date-month">{event.mes}</div>
        <div className="event-date-day">{event.dia}</div>
      </div>

      <div className="event-info">
        <span className="badge event-tag" style={getTagStyles(event.tag)}>
          {event.tag}
        </span>
        <h4 className="event-title">{event.titulo}</h4>
        <div className="event-meta">
          <span className="event-meta-item"><Clock size={14} color="#64748B" /> {event.hora}</span>
          <span className="event-meta-item event-meta-location"><MapPin size={14} color="#64748B" /> {event.lugar}</span>
        </div>
      </div>
    </div>
  );
}

function EventsSection({ eventos, setActiveEvent }) {
  return (
    <section className="section section-events">
      <div className="container animate-fade-in">
        <h2 className="section-title">Próximos Eventos</h2>

        {eventos.length === 0 ? (
          <div className="event-empty-state">
            No hay eventos escolares programados próximamente.
          </div>
        ) : (
          <div className="event-grid">
            {eventos.map(event => (
              <EventCard key={event.id} event={event} onOpen={setActiveEvent} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="section section-values">
      <div className="container">
        <div className="grid-3 value-grid">
          <div className="value-item">
            <Star color="var(--color-accent-orange)" size={48} className="value-icon" />
            <h3>Excelencia</h3>
            <p>Buscamos la máxima calidad en cada paso educativo.</p>
          </div>
          <div className="value-item">
            <Heart color="var(--color-accent-red)" size={48} className="value-icon" />
            <h3>Empatía</h3>
            <p>Formamos ciudadanos conscientes y solidarios.</p>
          </div>
          <div className="value-item">
            <BookOpen color="var(--color-accent-green)" size={48} className="value-icon" />
            <h3>Innovación</h3>
            <p>Preparamos para los desafíos del futuro.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventModal({ activeEvent, setActiveEvent }) {
  if (!activeEvent) return null;

  return (
    <div className="event-modal-overlay" onClick={() => setActiveEvent(null)}>
      <div className="card animate-fade-in event-modal-card" onClick={e => e.stopPropagation()}>
        <div className="event-modal-header">
          <span className="badge event-tag" style={getTagStyles(activeEvent.tag)}>
            {activeEvent.tag}
          </span>
          <button className="event-modal-close" onClick={() => setActiveEvent(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="card-body event-modal-body">
          <div className="event-modal-main">
            <div className="event-modal-date-box">
              <div className="event-modal-date-month">{activeEvent.mes}</div>
              <div className="event-modal-date-day">{activeEvent.dia}</div>
            </div>
            <h3 className="event-modal-title">{activeEvent.titulo}</h3>
          </div>

          <div className="event-modal-details">
            <div className="event-modal-property">
              <Clock size={16} color="var(--color-accent-orange)" />
              <span><strong>Horario:</strong> {activeEvent.hora}</span>
            </div>
            <div className="event-modal-property">
              <MapPin size={16} color="var(--color-accent-orange)" />
              <span><strong>Lugar:</strong> {activeEvent.lugar}</span>
            </div>
          </div>

          <div className="event-modal-description-wrap">
            <h4>Detalles del Evento</h4>
            <p className="event-modal-description">{activeEvent.descripcion}</p>
          </div>

          <button className="btn btn-primary event-modal-button" onClick={() => setActiveEvent(null)}>
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNoticias(data))
      .catch(err => console.error('Error al traer noticias:', err));
  }, []);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error('Error al traer eventos:', err));
  }, []);

  return (
    <div>
      <HeroSection />
      <NewsSection noticias={noticias} />
      <EventsSection eventos={eventos} setActiveEvent={setActiveEvent} />
      <ValuesSection />
      <Reviews />
      <EventModal activeEvent={activeEvent} setActiveEvent={setActiveEvent} />
    </div>
  );
}
