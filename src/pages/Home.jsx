import { ArrowRight, Star, Heart, BookOpen, Image } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reviews from '../components/Reviews';

export default function Home() {
  const [noticias, setNoticias] = useState([]); //Se crea el estado (useState) para las noticias 
  useEffect(() => { //Se cargan las noticias desde el servidor
    fetch('http://localhost:3001/api/news')
      .then(res => res.json())
      .then(data => setNoticias(data))
      .catch(err => console.error('Error al traer noticias:', err));
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        padding: '120px 0',
        textAlign: 'center'
      }}>
        <div className="container animate-fade-in">
          <span className="badge badge-orange" style={{ marginBottom: '24px' }}>Admisiones Abiertas</span>
          <h1 style={{ color: 'white', fontSize: '4rem', marginBottom: '24px', maxWidth: '800px', margin: '0 auto 24px' }}>
            Inspiramos, desafiamos y empoderamos
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px', color: 'rgba(255,255,255,0.8)' }}>
            Formando a los líderes del mañana con excelencia académica, valores humanos y una visión global.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/inscripcion" className="btn btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Inscribite Hoy <ArrowRight size={18} />
            </Link>
            <Link to="/quienes-somos" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              Conócenos
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de noticias */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Últimas Noticias</h2>
          <div className="grid-3">
            {noticias.slice(0, 3).map((item) => (
              <div key={item.id} className="card">
                {/* Imagen de la noticia o un placeholder si no tiene */}
                {item.imagen ? (
                  <img
                    src={`http://localhost:3001${item.imagen}`}
                    alt={item.title}
                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '200px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image size={36} color="#94A3B8" />
                  </div>
                )}

                <div className="card-body">
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-accent-orange)', fontWeight: 'bold' }}>
                    {item.tag} • {item.date}
                  </span>
                  <h3 style={{ margin: '8px 0' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>{item.summary}</p>
                  <Link to="/noticias" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    Leer más →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Valores */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div>
              <Star color="var(--color-accent-orange)" size={48} style={{ marginBottom: '16px' }} />
              <h3>Excelencia</h3>
              <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>Buscamos la máxima calidad en cada paso educativo.</p>
            </div>
            <div>
              <Heart color="var(--color-accent-red)" size={48} style={{ marginBottom: '16px' }} />
              <h3>Empatía</h3>
              <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>Formamos ciudadanos conscientes y solidarios.</p>
            </div>
            <div>
              <BookOpen color="var(--color-accent-green)" size={48} style={{ marginBottom: '16px' }} />
              <h3>Innovación</h3>
              <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>Preparamos para los desafíos del futuro.</p>
            </div>
          </div>
        </div>
      </section>

      <Reviews />
    </div>
  );
}
