import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, firebaseLogin } from '../services/api';
import { signInWithGooglePopup } from '../services/firebaseAuth';
import '../styles/valkira-auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedPrivacy: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.acceptedPrivacy) {
      setError('Debes aceptar la política de privacidad');
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.acceptedPrivacy
      );
      localStorage.setItem('token', result.token);
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Error al registrarse. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const idToken = await signInWithGooglePopup();
      const result = await firebaseLogin(idToken);
      localStorage.setItem('token', result.token);
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Error al registrarse con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="valkira-auth-page">
      <div className="valkira-hero" aria-hidden>
        <p className="eyebrow">Crea tu cuenta</p>
        <h1>Estilo <em>personalizado</em><br/>para ti.</h1>
        <p>Regístrate y recibe recomendaciones basadas en tu talla y preferencias.</p>
      </div>

      <div className="valkira-auth-card">
        <div className="valkira-auth-header">
          <h2>Crea tu cuenta</h2>
          <p className="valkira-auth-sub">Únete a ModaAI y descubre moda personalizada</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="valkira-form">
          <div className="auth-grid-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group">
              <label htmlFor="firstName">Nombre</label>
              <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Juan" required />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Apellido</label>
              <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Pérez" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@correo.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" minLength={8} required />
            <div className="input-help-text">Mínimo 8 caracteres</div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input id="confirmPassword" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" minLength={8} required />
          </div>

          <div className="form-group">
            <label style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <input type="checkbox" name="acceptedPrivacy" checked={formData.acceptedPrivacy} onChange={handleChange} required />
              <span>Acepto la política de privacidad</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Registrando...' : 'Crear Cuenta'}</button>
        </form>

        <div className="auth-divider">O continúa con</div>

        <button type="button" className="google-button" onClick={handleGoogle} disabled={loading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Continuando...' : 'Continuar con Google'}
        </button>

        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
