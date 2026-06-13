import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';
import '../styles/valkira-auth.css';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess('Se envió un token de recuperación a tu correo. Revisa tu bandeja de entrada.');
      setStep(2);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al solicitar recuperación de contraseña');
      } else {
        setError('Error al solicitar recuperación de contraseña');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, newPassword);
      setSuccess('¡Contraseña restablecida exitosamente! Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="valkira-auth-page">
      <div className="valkira-hero" aria-hidden>
        <p className="eyebrow">Soporte</p>
        <h1>{step === 1 ? 'Recuperar Contraseña' : 'Restablecer Contraseña'}</h1>
        <p>{step === 1 ? 'Ingresa tu correo para recibir un token de recuperación' : 'Ingresa el token y tu nueva contraseña'}</p>
      </div>

      <div className="valkira-auth-card">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestToken} className="valkira-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Enviando...' : 'Solicitar Token'}</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="valkira-form">
            <div className="form-group">
              <label htmlFor="token">Token (del correo)</label>
              <input id="token" type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Pega el token aquí" required />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" minLength={8} required />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" minLength={8} required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Restableciendo...' : 'Restablecer Contraseña'}</button>
          </form>
        )}

        <div className="auth-footer"><Link to="/login">Volver a Iniciar Sesión</Link></div>
      </div>
    </div>
  );
}
