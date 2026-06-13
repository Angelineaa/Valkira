import { useState, useEffect } from 'react';
import { API_BASE } from '../services/api';
import '../styles/valkira-help.css';

export default function Devoluciones() {
  const [devoluciones, setDevoluciones] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevoluciones = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/help/devoluciones`);
        if (!response.ok) throw new Error('Error fetching devoluciones');
        const data = await response.json();
        setDevoluciones(data);
      } catch (error) {
        console.error('Error:', error);
        // Fallback data
        setDevoluciones({
          title: 'Política de Devoluciones',
          introduction: 'Queremos que estés satisfecho con tu compra. Aquí encontrarás nuestra política de devoluciones.',
          sections: [
            {
              title: 'Plazo de Devolución',
              content: 'Tienes 30 días desde la fecha de entrega para solicitar una devolución o cambio.'
            },
            {
              title: 'Condiciones',
              content: 'El artículo debe estar sin usar, con todas las etiquetas intactas y en su empaque original.'
            },
            {
              title: 'Proceso de Devolución',
              content: 'Contáctanos con tu número de pedido. Te enviaremos una etiqueta de envío prepagada para que retornes el artículo.'
            },
            {
              title: 'Reembolso',
              content: 'Una vez recibido y verificado, procesaremos el reembolso en 5-7 días hábiles a tu cuenta original.'
            },
            {
              title: 'Cambios',
              content: 'Si deseas cambiar por otra talla o color, puedes solicitar el cambio sin costo adicional dentro del plazo.'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDevoluciones();
  }, []);

  if (loading) {
    return <div className="vk-help-page"><p>Cargando política de devoluciones...</p></div>;
  }

  return (
    <div className="vk-help-page">
      <section className="vk-help-hero">
        <h1>{devoluciones?.title || 'Devoluciones'}</h1>
        <p>{devoluciones?.introduction}</p>
      </section>

      <section className="vk-help-content">
        <div className="help-sections">
          {devoluciones?.sections.map((section, idx) => (
            <article key={idx} className="help-card">
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
