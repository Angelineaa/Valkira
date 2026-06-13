import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMe, updateProfile } from '../services/api';
import '../styles/pages/profile.css';
import '../styles/valkira-auth.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await getMe();
      setUser(data);
      setFormData(data);
    } catch (err) {
      setError(err.message || 'Error al cargar perfil');
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const updated = await updateProfile(formData);
      setUser(updated);
      setEditing(false);
      setSuccess('¡Perfil actualizado correctamente!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user)
    return (
      <div className="loader-state">
        <p>Cargando perfil...</p>
      </div>
    );

  return (
    <div className="valkira-profile-page profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {user && !editing && (
          <>
            <div className="profile-grid">
              <div className="profile-card">
                <div className="profile-avatar-section">
                  <div className="profile-avatar">👤</div>
                  <h2>{user.firstName} {user.lastName}</h2>
                </div>
              </div>

              <div className="profile-card">
                <div className="profile-info-section">
                  <div className="profile-field">
                    <span className="profile-field-label">Correo Electrónico</span>
                    <span className="profile-field-value">{user.email}</span>
                  </div>

                  <div className="profile-field">
                    <span className="profile-field-label">Rol</span>
                    <span className="profile-field-value">{user.role}</span>
                  </div>

                  <div className="profile-field">
                    <span className="profile-field-label">Fecha de Nacimiento</span>
                    <span className="profile-field-value">{user.dob || 'No definido'}</span>
                  </div>

                  <div className="profile-field">
                    <span className="profile-field-label">Género</span>
                    <span className="profile-field-value">{user.gender || 'No definido'}</span>
                  </div>
                </div>

                <div className="profile-actions">
                  <button onClick={() => setEditing(true)} className="btn btn-primary">
                    Editar Perfil
                  </button>
                  <Link to="/preferences" className="btn btn-secondary">
                    Mis Preferencias
                  </Link>
                  <Link to="/orders" className="btn btn-secondary">
                    Mis Pedidos
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {editing && (
          <div className="profile-card">
            <h2 className="section-heading">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dob">Fecha de Nacimiento</label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Género</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>

              <div className="form-buttons">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn btn-ghost"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
