import { useState } from 'react';
import { API_BASE } from '../services/api';
import '../styles/valkira-contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error enviando el mensaje');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje. Intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vk-contact-page">
      <section className="vk-contact-hero">
        <h1>Contacto</h1>
        <p>¿Tienes preguntas o sugerencias? Nos encantaría escucharte.</p>
      </section>

      <section className="vk-contact-content">
        <div className="contact-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Cuéntanos tu mensaje..."
              ></textarea>
            </div>

            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">✓ Mensaje enviado exitosamente. Pronto nos pondremos en contacto.</div>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>

          <div className="contact-info">
            <h2>Otras formas de contactarnos</h2>
            <div className="info-item">
              <h3>Correo</h3>
              <p><a href="mailto:support@valkira.com">support@valkira.com</a></p>
            </div>
            <div className="info-item">
              <h3>Ubicación</h3>
              <p>Cartagena, Colombia</p>
            </div>
            <div className="info-item">
              <h3>Horario</h3>
              <p>Lunes a Viernes: 9:00 AM - 6:00 PM<br />Sábado: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
