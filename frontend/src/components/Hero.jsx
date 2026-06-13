import { Link } from 'react-router-dom';
import '../styles/hero.css';

export default function Hero() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Moda Inteligente Impulsada por IA</h1>
          <p className="hero-description">
            Recibe recomendaciones personalizadas según tus gustos, preferencias y características
            físicas. Descubre tu estilo único con ModaAI.
          </p>
          <div className="hero-buttons">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="btn btn-primary btn-large">
                  Ver Mi Perfil
                </Link>
                <Link to="/preferences" className="btn btn-outline btn-large">
                  Mis Preferencias
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Comenzar Ahora
                </Link>
                <Link to="/login" className="btn btn-outline btn-large">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
