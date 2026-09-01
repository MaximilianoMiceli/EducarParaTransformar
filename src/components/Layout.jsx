import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function BrandLogo({ compact = false }) {
  return (
    <Link to="/" className={`logo ${compact ? 'logo-compact' : ''}`}>
      <img src="/favicon.png" alt="Logo" className="logo-image" />
      <span className="brand-text">
        <span className="brand-word brand-word-blue">Educar</span>
        <span className="brand-word brand-word-pink">para</span>
        <span className="brand-word brand-word-yellow">Transformar</span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Quiénes Somos', path: '/quienes-somos' },
    { name: 'Niveles', path: '/niveles' },
    { name: 'Bienestar', path: '/bienestar' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Inscripción', path: '/inscripcion' },
    { name: 'Empleo', path: '/empleo' },
  ];

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container navbar-container">
          <BrandLogo />
          <div className="nav-links">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="nav-actions">
                <Link to="/dashboard" className="btn btn-dashboard">
                  <LayoutDashboard size={18} /> Panel
                </Link>
                <button onClick={handleLogout} className="btn btn-logout">
                  <LogOut size={18} /> Salir
                </button>
              </div>
            ) : (
              <Link to="/acceso" className="btn btn-primary btn-access">
                Acceso
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand">
                <BrandLogo />
              </div>
              <p className="footer-intro">
                Inspiramos, desafiamos y empoderamos a todos nuestros alumnos para que alcancen su máximo potencial.
              </p>
            </div>
            <div className="footer-col">
              <h3>Contacto</h3>
              <ul className="footer-links">
                <li className="footer-item">
                  <MapPin size={18} /> Av. 1234, Resistencia Chaco
                </li>
                <li className="footer-item">
                  <Phone size={18} /> +54 3624 1234-5678
                </li>
                <li className="footer-item">
                  <Mail size={18} /> info@educartransformar.edu
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Enlaces Rápidos</h3>
              <ul className="footer-links">
                <li><Link to="/inscripcion">Solicitud de Inscripción</Link></li>
                <li><Link to="/empleo">Trabaja con Nosotros</Link></li>
                <li><Link to="/acceso">Portal Educativo</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Centro Educativo Educar para Transformar. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
