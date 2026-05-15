import { ArrowRight, Star, Heart, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reviews from '../components/Reviews';

export default function Home() {
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

      {/* Galería (Simulada con cards temporales) */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Nuestra Vida Escolar</h2>
          <div className="grid-3">
            <div className="card">
              <div style={{ height: '200px', backgroundColor: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#64748B' }}>[Imagen]</span>
              </div>
              <div className="card-body">
                <h3 style={{ marginBottom: '8px' }}>Comunidad Unida</h3>
                <p>Fomentamos el compañerismo y los valores.</p>
              </div>
            </div>
            <div className="card">
              <div style={{ height: '200px', backgroundColor: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#64748B' }}>[Imagen]</span>
              </div>
              <div className="card-body">
                <h3 style={{ marginBottom: '8px' }}>Excelencia Académica</h3>
                <p>Instalaciones de primer nivel para potenciar el aprendizaje.</p>
              </div>
            </div>
            <div className="card">
              <div style={{ height: '200px', backgroundColor: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#64748B' }}>[Imagen]</span>
              </div>
              <div className="card-body">
                <h3 style={{ marginBottom: '8px' }}>Deporte y Bienestar</h3>
                <p>Desarrollo físico e integral de cada estudiante.</p>
              </div>
            </div>
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
