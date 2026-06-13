import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPreferences, updatePreferences } from '../services/api';
import '../styles/pages/preferences.css';

const colorOptions = [
  'Negro',
  'Blanco',
  'Azul',
  'Rojo',
  'Verde',
  'Amarillo',
  'Rosa',
  'Morado',
  'Gris',
  'Marrón',
  'Beige',
  'Naranja',
  'Turquesa',
  'Dorado',
  'Plateado',
];

const styleOptions = [
  'Casual',
  'Formal',
  'Deportivo',
  'Minimalista',
  'Vintage',
  'Streetwear',
  'Elegante',
  'Bohemio',
  'Romántico',
  'Urbano',
  'Retro',
  'Chic',
  'Moderno',
  'Preppy',
  'Artsy',
];

const bodyTypeOptions = [
  'Atlético',
  'Delgado',
  'Robusto',
  'Curvilíneo',
  'Musculoso',
  'Elegante',
  'Deportivo',
  'Clásico',
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

const categoryOptions = [
  'vestidos',
  'blusas',
  'faldas',
  'accesorios',
  'zapatos',
  'pantalones',
  'chaquetas',
];

export default function Preferences() {
  const [preferences, setPreferences] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    favoriteColors: [],
    favoriteStyles: [],
    preferredCategories: [],
    heightCm: null,
    weightKg: null,
    bustCm: null,
    waistCm: null,
    hipsCm: null,
    legLengthCm: null,
    shoulderWidthCm: null,
    shirtSize: '',
    pantsSize: '',
    shoeSize: '',
    bodyType: '',
    preferredGender: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await getPreferences();
      setPreferences(data);
      setFormData({
        favoriteColors: data.favoriteColors || [],
        favoriteStyles: data.favoriteStyles || [],
        preferredCategories: data.preferredCategories || [],
        heightCm: data.heightCm ?? null,
        weightKg: data.weightKg ?? null,
        bustCm: data.bustCm ?? null,
        waistCm: data.waistCm ?? null,
        hipsCm: data.hipsCm ?? null,
        legLengthCm: data.legLengthCm ?? null,
        shoulderWidthCm: data.shoulderWidthCm ?? null,
        shirtSize: data.shirtSize || '',
        pantsSize: data.pantsSize || '',
        shoeSize: data.shoeSize || '',
        bodyType: data.bodyType || '',
        preferredGender: data.preferredGender || '',
      });
    } catch (err) {
      setError(err.message || 'Error al cargar preferencias');
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['heightCm', 'weightKg', 'bustCm', 'waistCm', 'hipsCm', 'legLengthCm', 'shoulderWidthCm'];
    setFormData((current) => ({
      ...current,
      [name]: numericFields.includes(name) ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleToggleOption = (field, option, checked) => {
    setFormData((current) => {
      const list = current[field] || [];
      const nextList = checked
        ? [...new Set([...list, option])]
        : list.filter((item) => item !== option);
      return { ...current, [field]: nextList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const updated = await updatePreferences(formData);
      setPreferences(updated);
      setFormData({
        favoriteColors: updated.favoriteColors || [],
        favoriteStyles: updated.favoriteStyles || [],
        preferredCategories: updated.preferredCategories || [],
        heightCm: updated.heightCm ?? null,
        weightKg: updated.weightKg ?? null,
        bustCm: updated.bustCm ?? null,
        waistCm: updated.waistCm ?? null,
        hipsCm: updated.hipsCm ?? null,
        legLengthCm: updated.legLengthCm ?? null,
        shoulderWidthCm: updated.shoulderWidthCm ?? null,
        shirtSize: updated.shirtSize || '',
        pantsSize: updated.pantsSize || '',
        shoeSize: updated.shoeSize || '',
        bodyType: updated.bodyType || '',
        preferredGender: updated.preferredGender || '',
      });
      setEditing(false);
      setSuccess('¡Preferencias actualizadas correctamente!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar preferencias');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !preferences)
    return (
      <div className="loader-state">
        <p>Cargando preferencias...</p>
      </div>
    );

  return (
    <div className="preferences-page">
      <div className="container">
        <div className="preferences-header">
          <h1>Mis Preferencias</h1>
          <p>Define tu estilo, características y preferencias de compra</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {preferences && !editing && (
          <div className="preferences-view">
            <div className="preferences-grid">
              <div className="preference-section">
                <div className="preference-section-title">
                  <div className="preference-section-icon">📏</div>
                  <span>Colores Favoritos</span>
                </div>
                <div className="preference-display-value">
                  {preferences.favoriteColors && preferences.favoriteColors.length > 0
                    ? preferences.favoriteColors.join(', ')
                    : 'No definido'}
                </div>
              </div>

              <div className="preference-section">
                <div className="preference-section-title">
                  <div className="preference-section-icon">👕</div>
                  <span>Estilos Favoritos</span>
                </div>
                <div className="preference-display-value">
                  {preferences.favoriteStyles && preferences.favoriteStyles.length > 0
                    ? preferences.favoriteStyles.join(', ')
                    : 'No definido'}
                </div>
              </div>

              <div className="preference-section">
                <div className="preference-section-title">
                  <div className="preference-section-icon">🛍️</div>
                  <span>Categorías Preferidas</span>
                </div>
                <div className="preference-display-value">
                  {preferences.preferredCategories && preferences.preferredCategories.length > 0
                    ? preferences.preferredCategories.join(', ')
                    : 'No definido'}
                </div>
              </div>

              <div className="preference-section">
                <div className="preference-section-title">
                  <div className="preference-section-icon">📏</div>
                  <span>Características Físicas</span>
                </div>
                <div className="preference-form">
                  <div>
                    <div className="preference-display-label">Altura</div>
                    <div className="preference-display-value">
                      {preferences.heightCm ? `${preferences.heightCm} cm` : 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Peso</div>
                    <div className="preference-display-value">
                      {preferences.weightKg ? `${preferences.weightKg} kg` : 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Busto</div>
                    <div className="preference-display-value">
                      {preferences.bustCm ? `${preferences.bustCm} cm` : 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Cintura</div>
                    <div className="preference-display-value">
                      {preferences.waistCm ? `${preferences.waistCm} cm` : 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Cadera</div>
                    <div className="preference-display-value">
                      {preferences.hipsCm ? `${preferences.hipsCm} cm` : 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Largo de pierna</div>
                    <div className="preference-display-value">
                      {preferences.legLengthCm ? `${preferences.legLengthCm} cm` : 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Ancho de hombros</div>
                    <div className="preference-display-value">
                      {preferences.shoulderWidthCm ? `${preferences.shoulderWidthCm} cm` : 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Talla superior</div>
                    <div className="preference-display-value">
                      {preferences.shirtSize || 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Talla inferior</div>
                    <div className="preference-display-value">
                      {preferences.pantsSize || 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Talla de calzado</div>
                    <div className="preference-display-value">
                      {preferences.shoeSize || 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Tipo de Cuerpo</div>
                    <div className="preference-display-value">
                      {preferences.bodyType || 'No definido'}
                    </div>
                  </div>
                  <div>
                    <div className="preference-display-label">Género Preferido</div>
                    <div className="preference-display-value">
                      {preferences.preferredGender || 'No definido'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="preferences-actions">
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                Editar Preferencias
              </button>
              <Link to="/profile" className="btn btn-ghost">
                Volver al Perfil
              </Link>
            </div>
          </div>
        )}

        {editing && (
          <div className="preferences-grid">
            <form onSubmit={handleSubmit}>
              <div className="preference-section">
                <div className="preference-section-title">
                  <div className="preference-section-icon">🎨</div>
                  <span>Colores Favoritos</span>
                </div>
                <div className="preference-checkbox-grid">
                  {colorOptions.map((color) => (
                    <label key={color} className="preference-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.favoriteColors.includes(color)}
                        onChange={(e) => handleToggleOption('favoriteColors', color, e.target.checked)}
                      />
                      {color}
                    </label>
                  ))}
                </div>
              </div>

              <div className="preference-section">
                <div className="preference-section-title">
                  <div className="preference-section-icon">👕</div>
                  <span>Estilos Favoritos</span>
                </div>
                <div className="preference-checkbox-grid">
                  {styleOptions.map((style) => (
                    <label key={style} className="preference-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.favoriteStyles.includes(style)}
                        onChange={(e) => handleToggleOption('favoriteStyles', style, e.target.checked)}
                      />
                      {style}
                    </label>
                  ))}
                </div>
              </div>

              <div className="preference-section">
                <div className="preference-section-title">
                  <div className="preference-section-icon">🛍️</div>
                  <span>Categorías Preferidas</span>
                </div>
                <div className="preference-checkbox-grid">
                  {categoryOptions.map((category) => (
                    <label key={category} className="preference-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.preferredCategories.includes(category)}
                        onChange={(e) => handleToggleOption('preferredCategories', category, e.target.checked)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="preference-section">
                <div className="preference-section-title">
                  <div className="preference-section-icon">�📏</div>
                  <span>Características Físicas</span>
                </div>
                <div className="preference-form">
                  <div className="preference-input-group">
                    <label htmlFor="heightCm">Altura (cm)</label>
                    <input
                      id="heightCm"
                      type="number"
                      name="heightCm"
                      value={formData.heightCm || ''}
                      onChange={handleInputChange}
                      min="1"
                      max="300"
                      placeholder="170"
                      required
                    />
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="weightKg">Peso (kg)</label>
                    <input
                      id="weightKg"
                      type="number"
                      name="weightKg"
                      value={formData.weightKg || ''}
                      onChange={handleInputChange}
                      min="1"
                      max="500"
                      step="0.1"
                      placeholder="70"
                      required
                    />
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="bustCm">Busto (cm)</label>
                    <input
                      id="bustCm"
                      type="number"
                      name="bustCm"
                      value={formData.bustCm || ''}
                      onChange={handleInputChange}
                      min="1"
                      max="200"
                      placeholder="90"
                    />
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="waistCm">Cintura (cm)</label>
                    <input
                      id="waistCm"
                      type="number"
                      name="waistCm"
                      value={formData.waistCm || ''}
                      onChange={handleInputChange}
                      min="1"
                      max="200"
                      placeholder="70"
                    />
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="hipsCm">Cadera (cm)</label>
                    <input
                      id="hipsCm"
                      type="number"
                      name="hipsCm"
                      value={formData.hipsCm || ''}
                      onChange={handleInputChange}
                      min="1"
                      max="220"
                      placeholder="100"
                    />
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="legLengthCm">Largo de pierna (cm)</label>
                    <input
                      id="legLengthCm"
                      type="number"
                      name="legLengthCm"
                      value={formData.legLengthCm || ''}
                      onChange={handleInputChange}
                      min="1"
                      max="120"
                      placeholder="78"
                    />
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="shoulderWidthCm">Ancho de hombros (cm)</label>
                    <input
                      id="shoulderWidthCm"
                      type="number"
                      name="shoulderWidthCm"
                      value={formData.shoulderWidthCm || ''}
                      onChange={handleInputChange}
                      min="1"
                      max="120"
                      placeholder="42"
                    />
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="shirtSize">Talla superior</label>
                    <select
                      id="shirtSize"
                      name="shirtSize"
                      value={formData.shirtSize || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar</option>
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="pantsSize">Talla inferior</label>
                    <select
                      id="pantsSize"
                      name="pantsSize"
                      value={formData.pantsSize || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar</option>
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="shoeSize">Talla de calzado</label>
                    <input
                      id="shoeSize"
                      type="text"
                      name="shoeSize"
                      value={formData.shoeSize || ''}
                      onChange={handleInputChange}
                      placeholder="38"
                    />
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="bodyType">Tipo de Cuerpo</label>
                    <select
                      id="bodyType"
                      name="bodyType"
                      value={formData.bodyType || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {bodyTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="preference-input-group">
                    <label htmlFor="preferredGender">Género Preferido</label>
                    <select
                      id="preferredGender"
                      name="preferredGender"
                      value={formData.preferredGender || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="preference-section full-width">
                <div className="form-actions-row">
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Guardando...' : 'Guardar Preferencias'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn btn-ghost"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
